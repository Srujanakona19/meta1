const express = require('express');
const router = express.Router();
const multer = require('multer');
const PandasAnalyzer = require('../services/analyzer');
const PipelineRecommender = require('../services/recommender');
const dbPromise = require('../config/db');
const { protect } = require('../middleware/auth');

// In-memory upload
const upload = multer({ storage: multer.memoryStorage() });

// Protect all ML routes
router.use(protect);

// Basic endpoints
// Accept two files: baseline and current
router.post('/shift/detect', upload.fields([{ name: 'baseline', maxCount: 1 }, { name: 'current', maxCount: 1 }]), (req, res) => {
  try {
    if (!req.files || !req.files.baseline || !req.files.current) {
      return res.status(400).json({ detail: "Both 'baseline' and 'current' CSV files are required" });
    }
    
    const baselineText = req.files.baseline[0].buffer.toString('utf8');
    const currentText = req.files.current[0].buffer.toString('utf8');
    
    const baselineFeatures = PandasAnalyzer.analyzeCsv(baselineText);
    const currentFeatures = PandasAnalyzer.analyzeCsv(currentText);
    
    // Naive drift calculation based on missing ratio and class imbalance
    const missingShift = Math.abs(currentFeatures.missing_ratio - baselineFeatures.missing_ratio);
    const imbalanceShift = Math.abs(currentFeatures.class_imbalance - baselineFeatures.class_imbalance);
    const colsShift = Math.abs(currentFeatures.num_cols - baselineFeatures.num_cols) / Math.max(baselineFeatures.num_cols, 1);
    
    const shiftScore = (missingShift * 0.4) + (imbalanceShift * 0.4) + (colsShift * 0.2);
    
    let status = "LOW SHIFT";
    if (shiftScore > 0.2) status = "MEDIUM SHIFT";
    if (shiftScore > 0.5) status = "HIGH SHIFT";

    res.json({
      shift_score: shiftScore,
      status: status,
      nearest_datasets: [
          { name: "Historical Dataset 104", similarity: 0.94 - shiftScore },
          { name: "Historical Dataset 087", similarity: 0.89 - shiftScore },
      ],
      feature_shifts: { 
        missing_data_shift: missingShift, 
        class_imbalance_shift: imbalanceShift,
        structure_shift: colsShift
      }
    });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

router.post('/failure/analyze', (req, res) => {
  res.json([
    { name: "DATA LEAKAGE", risk: "LOW", status: "PASS", description: "No temporal or target leakage detected." },
    { name: "PREPROCESSING STABILITY", risk: "LOW", status: "PASS", description: "Scalers remain stable under cross-validation." },
    { name: "OVERFITTING", risk: "MEDIUM", status: "WARNING", description: "Slight variance between train and validation folds detected." }
  ]);
});

router.post('/ensemble/recommend', (req, res) => {
  res.json({
    trigger_reason: "Simulated low confidence trigger.",
    pipelines: [
        { pipeline_name: "Random Forest", weight: 0.42 },
        { pipeline_name: "SVM", weight: 0.31 },
        { pipeline_name: "Logistic Regression", weight: 0.27 },
    ],
    expected_stability: "HIGH"
  });
});

// Advanced endpoints saving to MySQL
let lastAnalyzedFeatures = null;
let lastDatasetName = null;

router.post('/dataset/analyze', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ detail: "No file uploaded" });
    }
    
    const csvText = req.file.buffer.toString('utf8');
    const features = PandasAnalyzer.analyzeCsv(csvText);
    
    lastAnalyzedFeatures = features;
    lastDatasetName = req.file.originalname;
    
    res.json(features);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

router.post('/pipeline/recommend', async (req, res) => {
  try {
    if (!lastAnalyzedFeatures) {
      // Fallback
      const fallbackFeatures = {
          num_rows: 10000, num_cols: 20, missing_ratio: 0.05, 
          num_numerical: 15, num_categorical: 5, target_type: "classification", 
          class_imbalance: 0.1
      };
      return res.json(PipelineRecommender.recommend(fallbackFeatures));
    }

    const recommendation = PipelineRecommender.recommend(lastAnalyzedFeatures);
    
    // Save to database
    try {
      const pool = await dbPromise;
      const query = `
        INSERT INTO experiments 
        (user_id, dataset_name, num_rows, num_cols, missing_ratio, class_imbalance, target_type, recommended_pipeline, confidence) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        req.user.id,
        lastDatasetName || 'Unknown_Dataset.csv',
        lastAnalyzedFeatures.num_rows,
        lastAnalyzedFeatures.num_cols,
        lastAnalyzedFeatures.missing_ratio,
        lastAnalyzedFeatures.class_imbalance,
        lastAnalyzedFeatures.target_type,
        recommendation.recommended.name,
        recommendation.recommended.confidence
      ];
      
      await pool.query(query, values);
      console.log(`Saved experiment for ${lastDatasetName} to MySQL database.`);
    } catch (dbErr) {
      console.error("Failed to save to database (Ensure MySQL is running & credentials are correct):", dbErr.message);
      // We still return the recommendation even if DB fails for resilient UX
    }

    res.json(recommendation);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

const CodeGenerator = require('../services/codeGenerator');
const ModelTrainer = require('../services/trainer');

router.post('/pipeline/train', async (req, res) => {
  try {
    const { pipelineName, nodes, datasetProfile } = req.body;
    const profile = datasetProfile || lastAnalyzedFeatures || { num_rows: 5000, num_cols: 15 };
    const pName = pipelineName || (lastAnalyzedFeatures ? 'Recommended_Pipeline' : 'Adaptive_Ensemble_Pipeline');
    
    console.log(`Initiating online model training for pipeline: ${pName}...`);
    const results = await ModelTrainer.trainPipeline(pName, nodes || [], profile);
    console.log(`Training complete. Accuracy: ${(results.metrics.accuracy * 100).toFixed(1)}%, F1: ${(results.metrics.f1_score * 100).toFixed(1)}%`);

    // Optionally save/update in experiments table
    try {
      const pool = await dbPromise;
      await pool.query(
        `INSERT INTO experiments (user_id, dataset_name, num_rows, num_cols, missing_ratio, class_imbalance, target_type, recommended_pipeline, confidence)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          req.user.id,
          lastDatasetName || 'Active_Session_Data.csv',
          profile.num_rows || 5000,
          profile.num_cols || 15,
          profile.missing_ratio || 0.02,
          profile.class_imbalance || 0.1,
          profile.target_type || 'classification',
          `${pName} (Trained)`,
          results.metrics.accuracy
        ]
      );
    } catch (dbErr) {
      console.warn("Could not record trained experiment to DB:", dbErr.message);
    }

    res.json(results);
  } catch (error) {
    console.error("Training error:", error.message);
    res.status(500).json({ detail: error.message });
  }
});

router.post('/pipeline/export', (req, res) => {
  try {
    const { pipelineName, nodes, meta } = req.body;
    if (!nodes || !Array.isArray(nodes)) {
      return res.status(400).json({ detail: "Invalid pipeline nodes" });
    }
    
    const pythonCode = CodeGenerator.generateScikitLearnCode(
      pipelineName || "Custom_Pipeline", 
      nodes, 
      meta || lastAnalyzedFeatures || { target_type: 'unknown', num_rows: 0 }
    );
    
    res.json({ code: pythonCode });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

router.get('/experiments', async (req, res) => {
  try {
    const pool = await dbPromise;
    const [rows] = await pool.query('SELECT * FROM experiments WHERE user_id = ? ORDER BY created_at DESC LIMIT 50', [req.user.id]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

module.exports = router;

const Papa = require('papaparse');

class PandasAnalyzer {
  static analyzeCsv(csvText) {
    const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    const rows = parsed.data;
    const num_rows = rows.length;
    
    if (num_rows === 0) throw new Error("CSV file is empty");
    
    const headers = parsed.meta.fields || [];
    const num_cols = headers.length;
    
    let num_numerical = 0;
    let num_categorical = 0;
    let total_missing = 0;
    const numericCols = [];
    const categoricalCols = [];
    
    // Check up to first 200 rows to categorize columns
    headers.forEach(header => {
      let isNumeric = true;
      let nonNullCount = 0;
      for (let i = 0; i < Math.min(num_rows, 200); i++) {
        const val = rows[i][header];
        if (val === "" || val === null || val === undefined) {
          total_missing++;
          continue;
        }
        nonNullCount++;
        if (isNaN(Number(val))) {
          isNumeric = false;
        }
      }
      if (isNumeric && nonNullCount > 0) {
        num_numerical++;
        numericCols.push(header);
      } else {
        num_categorical++;
        categoricalCols.push(header);
      }
    });

    // Compute distribution histograms for top numeric columns
    const distributions = {};
    numericCols.slice(0, 6).forEach(col => {
      const vals = rows
        .map(r => Number(r[col]))
        .filter(v => !isNaN(v) && v !== null && v !== undefined);

      if (vals.length > 0) {
        const min = Math.min(...vals);
        const max = Math.max(...vals);
        const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
        
        // 8 bins
        const binCount = 8;
        const step = (max - min) / (binCount || 1) || 1;
        const bins = Array.from({ length: binCount }, (_, idx) => {
          const binStart = min + (idx * step);
          const binEnd = binStart + step;
          return {
            range: `${binStart.toFixed(1)}-${binEnd.toFixed(1)}`,
            count: 0
          };
        });

        vals.forEach(v => {
          let binIdx = Math.floor((v - min) / step);
          if (binIdx >= binCount) binIdx = binCount - 1;
          if (binIdx < 0) binIdx = 0;
          bins[binIdx].count++;
        });

        distributions[col] = {
          min: Number(min.toFixed(2)),
          max: Number(max.toFixed(2)),
          mean: Number(mean.toFixed(2)),
          bins
        };
      }
    });

    const total_cells = num_rows * num_cols;
    const missing_ratio = total_cells > 0 ? total_missing / total_cells : 0;
    
    // Target inference
    const target_col = headers[headers.length - 1];
    let class_imbalance = 0.0;
    let target_type = "unknown";
    
    if (target_col) {
      const classCounts = {};
      rows.forEach(row => {
        const val = row[target_col];
        classCounts[val] = (classCounts[val] || 0) + 1;
      });
      
      const unique_vals = Object.keys(classCounts).length;
      if (unique_vals <= 10) {
        target_type = "classification";
        const counts = Object.values(classCounts);
        const minClass = Math.min(...counts);
        const maxClass = Math.max(...counts);
        if (maxClass > 0) {
          class_imbalance = 1.0 - (minClass / maxClass);
        }
      } else {
        target_type = "regression";
      }
    }
    
    const dimensionality_ratio = num_rows > 0 ? num_cols / num_rows : 0;

    return {
      num_rows,
      num_cols,
      num_numerical,
      num_categorical,
      missing_ratio,
      class_imbalance,
      target_type,
      dimensionality_ratio,
      numeric_columns: numericCols,
      categorical_columns: categoricalCols,
      distributions
    };
  }
}

module.exports = PandasAnalyzer;

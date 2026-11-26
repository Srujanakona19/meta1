import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { Navbar } from './components/layout/Navbar';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { Toaster } from 'sonner';
import { 
  Landing, 
  DatasetAnalysis, 
  PipelineRecommendation, 
  ShiftDetection, 
  FailureAnalysis, 
  Ensembles, 
  Experiments, 
  Research, 
  SystemDashboard,
  Login,
  Register,
  Settings
} from './pages';

function App() {
  return (
    <StoreProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/analyze" element={<DatasetAnalysis />} />
              <Route path="/recommendations" element={<PipelineRecommendation />} />
              <Route path="/shift" element={<ShiftDetection />} />
              <Route path="/failures" element={<FailureAnalysis />} />
              <Route path="/ensembles" element={<Ensembles />} />
              <Route path="/experiments" element={<Experiments />} />
              <Route path="/research" element={<Research />} />
              <Route path="/system" element={<SystemDashboard />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
          <Toaster theme="dark" position="bottom-right" />
        </Layout>
      </Router>
    </StoreProvider>
  );
}

export default App;

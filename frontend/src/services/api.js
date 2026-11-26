const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Login failed');
  }
  return await response.json();
}

export async function registerUser(email, password, firstName, lastName) {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, firstName, lastName })
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Registration failed');
  }
  return await response.json();
}

export async function analyzeDataset(file) {
  if (file && file instanceof File) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/api/dataset/analyze`, {
      method: 'POST',
      headers: { ...getAuthHeaders() },
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to analyze dataset');
    }
    return await response.json();
  }
  
  // Fallback
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ num_rows: 12450, num_cols: 42, num_numerical: 35, num_categorical: 7, missing_ratio: 0.02, class_imbalance: 0.27, target_type: "classification", dimensionality_ratio: 42/12450 });
    }, 1500);
  });
}

export async function detectShift(baselineFile, currentFile) {
  if (baselineFile && currentFile) {
    const formData = new FormData();
    formData.append('baseline', baselineFile);
    formData.append('current', currentFile);

    const response = await fetch(`${API_BASE_URL}/api/shift/detect`, { 
      method: 'POST', 
      headers: { ...getAuthHeaders() }, // omit Content-Type for FormData
      body: formData
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Shift detection failed');
    }
    return await response.json();
  }

  // Fallback for demo
  return {
    shift_score: 0.18,
    status: "LOW SHIFT",
    nearest_datasets: [
        { name: "Historical Dataset 104", similarity: 0.94 },
    ],
    feature_shifts: { missing_data_shift: 0.05, class_imbalance_shift: 0.22, structure_shift: 0.01 }
  };
}

export async function analyzeFailures() {
  const response = await fetch(`${API_BASE_URL}/api/failure/analyze`, { 
    method: 'POST', 
    headers: { ...getAuthHeaders() } 
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to analyze failures');
  }
  return await response.json();
}

export async function recommendPipeline() {
  const response = await fetch(`${API_BASE_URL}/api/pipeline/recommend`, { 
    method: 'POST',
    headers: { ...getAuthHeaders() } 
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to get recommendation');
  }
  return await response.json();
}

export async function recommendEnsemble() {
  const response = await fetch(`${API_BASE_URL}/api/ensemble/recommend`, { 
    method: 'POST',
    headers: { ...getAuthHeaders() } 
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to get ensemble');
  }
  return await response.json();
}

export async function getExperiments() {
  const response = await fetch(`${API_BASE_URL}/api/experiments`, { 
    method: 'GET',
    headers: { ...getAuthHeaders() } 
  });
  if (!response.ok) return [];
  return await response.json();
}

export async function getSystemLogs() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/system/logs`);
    if (!response.ok) return [];
    return await response.json();
  } catch (err) {
    return [];
  }
}

export async function exportPipelineCode(pipelineName, nodes, meta) {
  const response = await fetch(`${API_BASE_URL}/api/pipeline/export`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ pipelineName, nodes, meta })
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to export code');
  }
  return await response.json();
}

export async function trainPipelineOnline(pipelineName, nodes, datasetProfile) {
  const response = await fetch(`${API_BASE_URL}/api/pipeline/train`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ pipelineName, nodes, datasetProfile })
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Online training failed');
  }
  return await response.json();
}

export async function updateUserProfile(firstName, lastName) {
  const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ firstName, lastName })
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update profile');
  }
  return await response.json();
}

export async function updateUserPassword(currentPassword, newPassword) {
  const response = await fetch(`${API_BASE_URL}/api/auth/password`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ currentPassword, newPassword })
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update password');
  }
  return await response.json();
}

export async function getUserProfile() {
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    method: 'GET',
    headers: { ...getAuthHeaders() }
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch user profile');
  }
  return await response.json();
}

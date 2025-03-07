import axios from 'axios';

const API_URL = 'http://localhost:8000/api/organization';

// Department API calls
export const getDepartments = async () => {
  try {
    const response = await axios.get(`${API_URL}/departments/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
};

export const getDepartment = async (departmentId) => {
  try {
    const response = await axios.get(`${API_URL}/departments/${departmentId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching department ${departmentId}:`, error);
    throw error;
  }
};

export const createDepartment = async (department) => {
  try {
    const response = await axios.post(`${API_URL}/departments/`, department);
    return response.data;
  } catch (error) {
    console.error('Error creating department:', error);
    throw error;
  }
};

export const updateDepartment = async (departmentId, department) => {
  try {
    const response = await axios.put(`${API_URL}/departments/${departmentId}`, department);
    return response.data;
  } catch (error) {
    console.error(`Error updating department ${departmentId}:`, error);
    throw error;
  }
};

export const deleteDepartment = async (departmentId) => {
  try {
    const response = await axios.delete(`${API_URL}/departments/${departmentId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting department ${departmentId}:`, error);
    throw error;
  }
};

// Role API calls
export const getRoles = async () => {
  try {
    const response = await axios.get(`${API_URL}/roles/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

export const getRolesByDepartment = async (departmentId) => {
  try {
    const response = await axios.get(`${API_URL}/departments/${departmentId}/roles/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching roles for department ${departmentId}:`, error);
    throw error;
  }
};

export const getRole = async (roleId) => {
  try {
    const response = await axios.get(`${API_URL}/roles/${roleId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching role ${roleId}:`, error);
    throw error;
  }
};

export const createRole = async (role) => {
  try {
    const response = await axios.post(`${API_URL}/roles/`, role);
    return response.data;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
};

export const updateRole = async (roleId, role) => {
  try {
    const response = await axios.put(`${API_URL}/roles/${roleId}`, role);
    return response.data;
  } catch (error) {
    console.error(`Error updating role ${roleId}:`, error);
    throw error;
  }
};

export const deleteRole = async (roleId) => {
  try {
    const response = await axios.delete(`${API_URL}/roles/${roleId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting role ${roleId}:`, error);
    throw error;
  }
};

// Function API calls
export const getFunctions = async () => {
  try {
    const response = await axios.get(`${API_URL}/functions/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching functions:', error);
    throw error;
  }
};

export const getFunctionsByRole = async (roleId) => {
  try {
    const response = await axios.get(`${API_URL}/roles/${roleId}/functions/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching functions for role ${roleId}:`, error);
    throw error;
  }
};

export const getFunction = async (functionId) => {
  try {
    const response = await axios.get(`${API_URL}/functions/${functionId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching function ${functionId}:`, error);
    throw error;
  }
};

export const createFunction = async (functionData) => {
  try {
    const response = await axios.post(`${API_URL}/functions/`, functionData);
    return response.data;
  } catch (error) {
    console.error('Error creating function:', error);
    throw error;
  }
};

export const updateFunction = async (functionId, functionData) => {
  try {
    const response = await axios.put(`${API_URL}/functions/${functionId}`, functionData);
    return response.data;
  } catch (error) {
    console.error(`Error updating function ${functionId}:`, error);
    throw error;
  }
};

export const deleteFunction = async (functionId) => {
  try {
    const response = await axios.delete(`${API_URL}/functions/${functionId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting function ${functionId}:`, error);
    throw error;
  }
}; 
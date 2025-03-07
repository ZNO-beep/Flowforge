import { getDepartments, createDepartment, getRoles, getFunctions } from '../api/organization';

/**
 * Fetches all departments from the API
 * @param {Object} params - Parameters for fetching data
 * @returns {Promise<Array>} Departments data
 */
export const fetchDepartments = async ({
  setLoading,
  setError,
  setDepartments,
}) => {
  try {
    setLoading(true);
    setError(null);
    const data = await getDepartments();
    setDepartments(data);
    return data;
  } catch (err) {
    console.error('Error fetching departments:', err);
    setError('Failed to load organization structure. Please try again.');
    throw err;
  } finally {
    setLoading(false);
  }
};

/**
 * Fetches statistics for departments, roles, and functions
 * @param {Object} params - Parameters for fetching statistics
 * @returns {Promise<Object>} Statistics data
 */
export const fetchStats = async ({
  setStats
}) => {
  try {
    const [departments, roles, functions] = await Promise.all([
      getDepartments(),
      getRoles(),
      getFunctions()
    ]);
    
    // Calculate average roles per department
    const averageRolesPerDepartment = departments.length > 0 
      ? roles.length / departments.length 
      : 0;
    
    // Updated stats structure to match the Statistics component
    const statsData = {
      totalDepartments: departments.length,
      totalRoles: roles.length,
      totalFunctions: functions.length,
      averageRolesPerDepartment
    };
    
    setStats(statsData);
    return statsData;
  } catch (err) {
    console.error('Error fetching statistics:', err);
    throw err;
  }
};

/**
 * Fetches all items (departments, roles, functions) for search
 * @param {Object} params - Parameters for fetching all items
 * @returns {Promise<Array>} All items data
 */
export const fetchAllItems = async ({
  setAllItems
}) => {
  try {
    const [departments, roles, functions] = await Promise.all([
      getDepartments(),
      getRoles(),
      getFunctions()
    ]);
    
    const items = [
      ...departments.map(dept => ({ ...dept, type: 'department' })),
      ...roles.map(role => ({ ...role, type: 'role' })),
      ...functions.map(func => ({ ...func, type: 'function' }))
    ];
    
    setAllItems(items);
    return items;
  } catch (err) {
    console.error('Error fetching all items:', err);
    throw err;
  }
};

/**
 * Fetches all data (departments, statistics, and all items)
 * @param {Object} params - Parameters for fetching all data
 * @returns {Promise<void>}
 */
export const fetchAllData = async ({
  setLoading,
  setError,
  setDepartments,
  setStats,
  setAllItems
}) => {
  try {
    setLoading(true);
    setError(null);
    
    await Promise.all([
      fetchDepartments({ setLoading: () => {}, setError, setDepartments }),
      fetchStats({ setStats }),
      fetchAllItems({ setAllItems })
    ]);
  } catch (err) {
    console.error('Error fetching all data:', err);
    setError('Failed to load organization structure. Please try again.');
  } finally {
    setLoading(false);
  }
};

/**
 * Adds a new department
 * @param {Object} params - Parameters for adding a department
 * @returns {Promise<Object>} Created department data
 */
export const addDepartment = async ({
  newDepartment,
  setIsSubmitting,
  setError,
  setIsAddDeptDialogOpen,
  setNewDepartment,
  fetchData
}) => {
  if (!newDepartment.name.trim()) return null;
  
  try {
    setIsSubmitting(true);
    const createdDept = await createDepartment({
      name: newDepartment.name,
      description: newDepartment.description
    });
    
    if (createdDept) {
      // Refresh the departments list
      await fetchData();
      setIsAddDeptDialogOpen(false);
      setNewDepartment({ name: '', description: '' });
    }
    
    return createdDept;
  } catch (err) {
    console.error('Error creating department:', err);
    setError('Failed to create department. Please try again.');
    throw err;
  } finally {
    setIsSubmitting(false);
  }
}; 
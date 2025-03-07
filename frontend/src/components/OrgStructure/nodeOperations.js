import {
  createDepartment,
  createRole,
  createFunction,
  deleteDepartment,
  deleteRole,
  deleteFunction,
  updateDepartment,
  updateRole,
  updateFunction
} from '../../api/organization';

/**
 * Handles adding a new node (department, role, or function)
 * @param {Object} params - Parameters for adding a node
 * @returns {Promise<Object>} The created node data
 */
export const handleAddNode = async ({
  newNodeData,
  selectedParentId,
  setIsLoading,
  setIsAddDialogOpen,
  setNewNodeData,
  setSelectedParentId,
  nodes
}) => {
  try {
    setIsLoading(true);
    
    let result;
    
    // If no parent is selected, create a department
    if (!selectedParentId) {
      result = await createDepartment({
        name: newNodeData.label,
        description: newNodeData.description
      });
    } 
    // If parent is selected and type is role, create a role
    else if (newNodeData.type === 'role') {
      const parentNode = nodes.find(n => n.id === selectedParentId);
      const departmentId = parentNode.data.apiId;
      
      result = await createRole({
        name: newNodeData.label,
        description: newNodeData.description,
        department_id: departmentId
      });
    } 
    // If parent is selected and type is function, create a function
    else if (newNodeData.type === 'function') {
      const parentNode = nodes.find(n => n.id === selectedParentId);
      const roleId = parentNode.data.apiId;
      
      result = await createFunction({
        name: newNodeData.label,
        description: newNodeData.description,
        role_id: roleId
      });
    }
    
    // Reset state
    setIsAddDialogOpen(false);
    setNewNodeData({ label: '', description: '', type: 'department' });
    setSelectedParentId(null);
    
    return result;
  } catch (error) {
    console.error('Error adding node:', error);
    throw error;
  } finally {
    setIsLoading(false);
  }
};

/**
 * Handles deleting a node (department, role, or function)
 * @param {Object} params - Parameters for deleting a node
 * @returns {Promise<void>}
 */
export const confirmDeleteNode = async ({
  nodeToDelete,
  setIsLoading,
  setIsDeleteDialogOpen,
  setNodeToDelete,
  setNodes,
  setEdges
}) => {
  try {
    setIsLoading(true);
    
    const nodeId = nodeToDelete.id;
    const nodeType = nodeToDelete.data.type;
    const apiId = nodeToDelete.data.apiId;
    
    // Delete the node based on its type
    if (nodeType === 'department') {
      await deleteDepartment(apiId);
    } else if (nodeType === 'role') {
      await deleteRole(apiId);
    } else if (nodeType === 'function') {
      await deleteFunction(apiId);
    }
    
    // Remove the node and its children from the state
    setNodes(nodes => {
      // For departments, remove all roles and functions
      if (nodeType === 'department') {
        // Find all roles connected to this department
        const roleIds = nodes
          .filter(n => n.data.type === 'role')
          .filter(n => {
            // Check if there's an edge from department to role
            return nodes.some(edge => 
              edge.source === nodeId && edge.target === n.id
            );
          })
          .map(n => n.id);
        
        // Find all functions connected to these roles
        const functionIds = nodes
          .filter(n => n.data.type === 'function')
          .filter(n => {
            // Check if there's an edge from any role to function
            return roleIds.some(roleId => 
              nodes.some(edge => 
                edge.source === roleId && edge.target === n.id
              )
            );
          })
          .map(n => n.id);
        
        // Remove department, roles, and functions
        return nodes.filter(n => 
          n.id !== nodeId && 
          !roleIds.includes(n.id) && 
          !functionIds.includes(n.id)
        );
      }
      
      // For roles, remove all functions
      else if (nodeType === 'role') {
        // Find all functions connected to this role
        const functionIds = nodes
          .filter(n => n.data.type === 'function')
          .filter(n => {
            // Check if there's an edge from role to function
            return nodes.some(edge => 
              edge.source === nodeId && edge.target === n.id
            );
          })
          .map(n => n.id);
        
        // Remove role and functions
        return nodes.filter(n => 
          n.id !== nodeId && 
          !functionIds.includes(n.id)
        );
      }
      
      // For functions, just remove the function
      else {
        return nodes.filter(n => n.id !== nodeId);
      }
    });
    
    // Remove related edges
    setEdges(edges => {
      return edges.filter(e => 
        e.source !== nodeId && e.target !== nodeId
      );
    });
    
    // Reset state
    setIsDeleteDialogOpen(false);
    setNodeToDelete(null);
  } catch (error) {
    console.error('Error deleting node:', error);
    throw error;
  } finally {
    setIsLoading(false);
  }
};

/**
 * Handles editing a node (department, role, or function)
 * @param {Object} params - Parameters for editing a node
 * @returns {Promise<Object>} The updated node data
 */
export const handleSaveEdit = async ({
  editNodeData,
  setIsLoading,
  setIsEditDialogOpen,
  setEditNodeData,
  setNodeToEdit,
  setNodes
}) => {
  try {
    setIsLoading(true);
    
    const { id, label, description, type, apiId } = editNodeData;
    
    let result;
    
    // Update the node based on its type
    if (type === 'department') {
      result = await updateDepartment(apiId, {
        name: label,
        description
      });
    } else if (type === 'role') {
      result = await updateRole(apiId, {
        name: label,
        description
      });
    } else if (type === 'function') {
      result = await updateFunction(apiId, {
        name: label,
        description
      });
    }
    
    // Update the node in the state
    setNodes(nodes => 
      nodes.map(node => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              label,
              description
            }
          };
        }
        return node;
      })
    );
    
    // Reset state
    setIsEditDialogOpen(false);
    setEditNodeData({ id: '', label: '', description: '', type: '' });
    setNodeToEdit(null);
    
    return result;
  } catch (error) {
    console.error('Error updating node:', error);
    throw error;
  } finally {
    setIsLoading(false);
  }
};

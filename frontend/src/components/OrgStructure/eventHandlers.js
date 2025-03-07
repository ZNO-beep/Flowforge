import { toggleNodeExpanded, fetchAndCreateRoleNodes, fetchAndCreateFunctionNodes } from '../../utils/orgStructureUtils';
import { handleAddNode, confirmDeleteNode, handleSaveEdit } from './nodeOperations';

/**
 * Creates event handlers for the OrgStructureFlow component
 * @param {Object} params - Parameters for creating event handlers
 * @returns {Object} Event handlers
 */
export const createEventHandlers = ({
  nodes,
  setNodes,
  setEdges,
  expandedNodes,
  setExpandedNodes,
  isLoading,
  setIsLoading,
  isAddDialogOpen,
  setIsAddDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  newNodeData,
  setNewNodeData,
  editNodeData,
  setEditNodeData,
  selectedParentId,
  setSelectedParentId,
  nodeToDelete,
  setNodeToDelete,
  nodeToEdit,
  setNodeToEdit
}) => {
  /**
   * Handles toggling node expansion
   * @param {string} nodeId - ID of the node to toggle
   * @returns {Promise<void>}
   */
  const handleToggleExpand = async (nodeId) => {
    setIsLoading(true);
    
    try {
      // Toggle node expanded state
      const isExpanding = toggleNodeExpanded(nodeId, expandedNodes, setExpandedNodes, setNodes);
      
      if (isExpanding) {
        const node = nodes.find(n => n.id === nodeId);
        
        if (node) {
          const nodeType = node.data.type;
          
          // Create event handler object for child nodes
          const handlers = {
            handleToggleExpand,
            handleAddChild,
            handleDeleteNode,
            handleEditNode
          };
          
          if (nodeType === 'department') {
            await fetchAndCreateRoleNodes(node, setNodes, setEdges, setExpandedNodes, handlers);
          } else if (nodeType === 'role') {
            await fetchAndCreateFunctionNodes(node, setNodes, setEdges, setExpandedNodes, handlers);
          }
        }
      }
    } catch (error) {
      console.error('Error toggling node expansion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles adding a child node
   * @param {string} parentId - ID of the parent node
   * @returns {void}
   */
  const handleAddChild = (parentId) => {
    const parentNode = nodes.find(n => n.id === parentId);
    
    if (parentNode) {
      const parentType = parentNode.data.type;
      
      // Set the appropriate child type based on parent type
      let childType = 'department';
      if (parentType === 'department') {
        childType = 'role';
      } else if (parentType === 'role') {
        childType = 'function';
      }
      
      // Open the add dialog with the appropriate settings
      setNewNodeData({ label: '', description: '', type: childType });
      setSelectedParentId(parentId);
      setIsAddDialogOpen(true);
    }
  };

  /**
   * Handles adding a new node
   * @returns {Promise<void>}
   */
  const onAddNode = async () => {
    try {
      const result = await handleAddNode({
        newNodeData,
        selectedParentId,
        setIsLoading,
        setIsAddDialogOpen,
        setNewNodeData,
        setSelectedParentId,
        nodes
      });
      
      // If a node was successfully added, refresh the view
      if (result) {
        // If a parent was selected, toggle its expansion to show the new child
        if (selectedParentId) {
          await handleToggleExpand(selectedParentId);
        } else {
          // Refresh the entire view for a new department
          window.location.reload();
        }
      }
    } catch (error) {
      console.error('Error in onAddNode:', error);
    }
  };

  /**
   * Handles deleting a node
   * @param {string} nodeId - ID of the node to delete
   * @returns {void}
   */
  const handleDeleteNode = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    
    if (node) {
      setNodeToDelete(node);
      setIsDeleteDialogOpen(true);
    }
  };

  /**
   * Handles confirming node deletion
   * @returns {Promise<void>}
   */
  const onConfirmDelete = async () => {
    try {
      await confirmDeleteNode({
        nodeToDelete,
        setIsLoading,
        setIsDeleteDialogOpen,
        setNodeToDelete,
        setNodes,
        setEdges
      });
    } catch (error) {
      console.error('Error in onConfirmDelete:', error);
    }
  };

  /**
   * Handles editing a node
   * @param {string} nodeId - ID of the node to edit
   * @returns {void}
   */
  const handleEditNode = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    
    if (node) {
      setNodeToEdit(node);
      setEditNodeData({
        id: node.id,
        label: node.data.label,
        description: node.data.description || '',
        type: node.data.type,
        apiId: node.data.apiId
      });
      setIsEditDialogOpen(true);
    }
  };

  /**
   * Handles saving node edits
   * @returns {Promise<void>}
   */
  const onSaveEdit = async () => {
    try {
      await handleSaveEdit({
        editNodeData,
        setIsLoading,
        setIsEditDialogOpen,
        setEditNodeData,
        setNodeToEdit,
        setNodes
      });
    } catch (error) {
      console.error('Error in onSaveEdit:', error);
    }
  };

  return {
    handleToggleExpand,
    handleAddChild,
    onAddNode,
    handleDeleteNode,
    onConfirmDelete,
    handleEditNode,
    onSaveEdit
  };
};

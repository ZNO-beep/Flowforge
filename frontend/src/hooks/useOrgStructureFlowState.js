import { useState, useCallback, useEffect } from 'react';
import { useReactFlow } from 'reactflow';
import { getLayoutedDepartments } from '../utils/dagreLayoutUtils';

/**
 * Custom hook to manage the state for the OrgStructureFlow component
 * @param {Object} props - Hook props
 * @param {Array} props.initialDepartments - Initial departments data
 * @param {string} props.layoutDirection - Direction of the layout ('TB' for top-to-bottom, 'LR' for left-to-right)
 * @param {Object} props.highlightedNode - Node to highlight from search results
 * @returns {Object} State and state management functions
 */
export const useOrgStructureFlowState = ({
  initialDepartments = [],
  layoutDirection = 'TB',
  highlightedNode = null
}) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [expandedNodes, setExpandedNodes] = useState({});
  const [selectedNode, setSelectedNode] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [addDialogType, setAddDialogType] = useState('');
  const [addDialogParentId, setAddDialogParentId] = useState('');
  const [nodeToEdit, setNodeToEdit] = useState(null);
  const [nodeToDelete, setNodeToDelete] = useState(null);
  const [allNodes, setAllNodes] = useState([]); // Store all nodes, including hidden ones
  
  const reactFlowInstance = useReactFlow();
  
  /**
   * Initializes the flow with departments data
   */
  const initializeFlow = useCallback(() => {
    if (!initialDepartments || initialDepartments.length === 0) {
      setNodes([]);
      setEdges([]);
      setAllNodes([]);
      return;
    }
    
    // Apply Dagre layout to departments
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedDepartments(
      initialDepartments,
      layoutDirection
    );
    
    // Add event handlers to nodes
    const nodesWithHandlers = layoutedNodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        isExpanded: !!expandedNodes[node.id],
        onToggleExpand: () => handleToggleExpand(node.id),
        onAddChild: () => handleAddChild(node.id, node.data.type),
        onEdit: () => handleEditNode(node),
        onDelete: () => handleDeleteNode(node)
      },
      // Add highlighted style if this node matches the highlighted node
      style: highlightedNode && 
             (node.id === highlightedNode.id || 
              (node.data.item && highlightedNode.item && 
               node.data.item.id === highlightedNode.item.id && 
               node.data.type === highlightedNode.type)) 
        ? { 
            boxShadow: '0 0 0 2px #3b82f6', 
            zIndex: 1000,
            transform: 'scale(1.05)'
          } 
        : {}
    }));
    
    // Store all nodes for reference
    setAllNodes(nodesWithHandlers);
    
    // Filter nodes based on expanded state
    const visibleNodes = filterVisibleNodes(nodesWithHandlers, expandedNodes);
    const visibleEdges = filterVisibleEdges(layoutedEdges, visibleNodes);
    
    setNodes(visibleNodes);
    setEdges(visibleEdges);
  }, [initialDepartments, layoutDirection, expandedNodes, highlightedNode]);
  
  /**
   * Filters nodes to show only those that should be visible based on expanded state
   * @param {Array} allNodes - All nodes
   * @param {Object} expandedState - Object mapping node IDs to expanded state
   * @returns {Array} Visible nodes
   */
  const filterVisibleNodes = useCallback((allNodes, expandedState) => {
    // Always show department nodes
    const departmentNodes = allNodes.filter(node => 
      node.data.type === 'department'
    );
    
    // Get IDs of all department nodes
    const departmentIds = departmentNodes.map(node => node.id);
    
    // Start with department nodes
    let visibleNodes = [...departmentNodes];
    
    // For each expanded department, add its child role nodes
    departmentIds.forEach(deptId => {
      if (expandedState[deptId]) {
        // Find role nodes that belong to this department
        const roleNodes = allNodes.filter(node => 
          node.data.type === 'role' && 
          node.data.departmentId === deptId.replace('dept-', '')
        );
        
        visibleNodes = [...visibleNodes, ...roleNodes];
        
        // For each expanded role, add its child function nodes
        roleNodes.forEach(roleNode => {
          if (expandedState[roleNode.id]) {
            // Find function nodes that belong to this role
            const functionNodes = allNodes.filter(node => 
              node.data.type === 'function' && 
              node.data.roleId === roleNode.id.replace('role-', '')
            );
            
            visibleNodes = [...visibleNodes, ...functionNodes];
          }
        });
      }
    });
    
    return visibleNodes;
  }, []);
  
  /**
   * Filters edges to show only those connecting visible nodes
   * @param {Array} allEdges - All edges
   * @param {Array} visibleNodes - Visible nodes
   * @returns {Array} Visible edges
   */
  const filterVisibleEdges = useCallback((allEdges, visibleNodes) => {
    const visibleNodeIds = visibleNodes.map(node => node.id);
    
    return allEdges.filter(edge => 
      visibleNodeIds.includes(edge.source) && 
      visibleNodeIds.includes(edge.target)
    );
  }, []);
  
  /**
   * Handles toggling the expanded state of a node
   * @param {string} nodeId - ID of the node to toggle
   */
  const handleToggleExpand = useCallback((nodeId) => {
    setExpandedNodes(prev => {
      const newExpandedNodes = {
        ...prev,
        [nodeId]: !prev[nodeId]
      };
      
      return newExpandedNodes;
    });
  }, []);
  
  /**
   * Handles opening the add dialog for a specific node
   * @param {string} parentId - ID of the parent node
   * @param {string} parentType - Type of the parent node
   */
  const handleAddChild = useCallback((parentId, parentType) => {
    let dialogType = '';
    
    // Determine what type of node can be added based on parent type
    if (parentType === 'department') {
      dialogType = 'role';
    } else if (parentType === 'role') {
      dialogType = 'function';
    } else if (parentType === 'root' || !parentType) {
      dialogType = 'department';
    }
    
    if (dialogType) {
      setAddDialogType(dialogType);
      setAddDialogParentId(parentId);
      setIsAddDialogOpen(true);
    }
  }, []);
  
  /**
   * Handles node selection
   * @param {Object} node - Selected node
   */
  const handleNodeSelect = useCallback((node) => {
    setSelectedNode(node);
  }, []);
  
  /**
   * Handles node deselection
   */
  const handleNodeDeselect = useCallback(() => {
    setSelectedNode(null);
  }, []);
  
  /**
   * Handles adding a new node
   * @param {Object} nodeData - Data for the new node
   */
  const handleAddNode = useCallback((nodeData) => {
    // Implementation would depend on your API and data structure
    console.log('Adding new node:', nodeData);
    setIsAddDialogOpen(false);
    
    // After adding the node, you would typically refetch the data
    // or update the local state and then reinitialize the flow
  }, []);
  
  /**
   * Handles opening the edit dialog for a node
   * @param {Object} node - Node to edit
   */
  const handleEditNode = useCallback((node) => {
    setNodeToEdit(node);
    setIsEditDialogOpen(true);
  }, []);
  
  /**
   * Handles saving edits to a node
   * @param {Object} editedData - Edited node data
   */
  const handleSaveEdit = useCallback((editedData) => {
    // Implementation would depend on your API and data structure
    console.log('Saving edits:', editedData);
    setIsEditDialogOpen(false);
    setNodeToEdit(null);
    
    // After editing the node, you would typically refetch the data
    // or update the local state and then reinitialize the flow
  }, []);
  
  /**
   * Handles opening the delete dialog for a node
   * @param {Object} node - Node to delete
   */
  const handleDeleteNode = useCallback((node) => {
    setNodeToDelete(node);
    setIsDeleteDialogOpen(true);
  }, []);
  
  /**
   * Handles confirming node deletion
   */
  const handleConfirmDelete = useCallback(() => {
    // Implementation would depend on your API and data structure
    console.log('Deleting node:', nodeToDelete);
    setIsDeleteDialogOpen(false);
    setNodeToDelete(null);
    
    // After deleting the node, you would typically refetch the data
    // or update the local state and then reinitialize the flow
  }, [nodeToDelete]);
  
  /**
   * Handles canceling the add dialog
   */
  const handleCancelAdd = useCallback(() => {
    setIsAddDialogOpen(false);
    setAddDialogType('');
    setAddDialogParentId('');
  }, []);
  
  /**
   * Handles canceling the edit dialog
   */
  const handleCancelEdit = useCallback(() => {
    setIsEditDialogOpen(false);
    setNodeToEdit(null);
  }, []);
  
  /**
   * Handles canceling the delete dialog
   */
  const handleCancelDelete = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setNodeToDelete(null);
  }, []);
  
  /**
   * Fits the flow view to show all nodes
   */
  const fitView = useCallback(() => {
    if (reactFlowInstance) {
      reactFlowInstance.fitView({ padding: 0.2 });
    }
  }, [reactFlowInstance]);
  
  /**
   * Ensures that parent nodes are expanded when a child node is highlighted
   */
  useEffect(() => {
    if (highlightedNode) {
      const newExpandedNodes = { ...expandedNodes };
      
      // If the highlighted node is a function, expand its parent role
      if (highlightedNode.type === 'function' && highlightedNode.item && highlightedNode.item.roleId) {
        const roleId = `role-${highlightedNode.item.roleId}`;
        newExpandedNodes[roleId] = true;
        
        // Also find and expand the department that contains this role
        const roleNode = allNodes.find(node => node.id === roleId);
        if (roleNode && roleNode.data.departmentId) {
          const deptId = `dept-${roleNode.data.departmentId}`;
          newExpandedNodes[deptId] = true;
        }
      }
      
      // If the highlighted node is a role, expand its parent department
      if (highlightedNode.type === 'role' && highlightedNode.item && highlightedNode.item.departmentId) {
        const deptId = `dept-${highlightedNode.item.departmentId}`;
        newExpandedNodes[deptId] = true;
      }
      
      // Update expanded nodes if changes were made
      if (Object.keys(newExpandedNodes).length !== Object.keys(expandedNodes).length) {
        setExpandedNodes(newExpandedNodes);
      }
      
      // Scroll to the highlighted node
      setTimeout(() => {
        if (reactFlowInstance) {
          const node = nodes.find(n => 
            n.id === highlightedNode.id || 
            (n.data.item && highlightedNode.item && 
             n.data.item.id === highlightedNode.item.id && 
             n.data.type === highlightedNode.type)
          );
          
          if (node) {
            reactFlowInstance.setCenter(node.position.x, node.position.y, { zoom: 1.2, duration: 800 });
          }
        }
      }, 100);
    }
  }, [highlightedNode, expandedNodes, allNodes, nodes, reactFlowInstance]);
  
  // Initialize flow when departments or layout direction changes
  useEffect(() => {
    initializeFlow();
  }, [initializeFlow]);
  
  // Fit view when nodes change
  useEffect(() => {
    if (nodes.length > 0 && !highlightedNode) {
      setTimeout(fitView, 100);
    }
  }, [nodes, fitView, highlightedNode]);
  
  return {
    // Flow state
    nodes,
    edges,
    setNodes,
    setEdges,
    allNodes,
    
    // Node state
    expandedNodes,
    selectedNode,
    
    // Dialog state
    isAddDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    addDialogType,
    addDialogParentId,
    nodeToEdit,
    nodeToDelete,
    
    // Event handlers
    handleToggleExpand,
    handleAddChild,
    handleNodeSelect,
    handleNodeDeselect,
    handleAddNode,
    handleEditNode,
    handleSaveEdit,
    handleDeleteNode,
    handleConfirmDelete,
    handleCancelAdd,
    handleCancelEdit,
    handleCancelDelete,
    
    // Flow operations
    initializeFlow,
    fitView
  };
}; 
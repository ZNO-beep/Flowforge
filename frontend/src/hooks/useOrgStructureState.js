import { useState, useCallback, useEffect, useRef } from 'react';
import { useNodesState, useEdgesState } from 'reactflow';
import { 
  addNodeToHierarchy, 
  updateNodeInHierarchy, 
  removeNodeFromHierarchy,
  findNodeInHierarchy,
  convertHierarchyToFlow,
  createSampleOrgStructure
} from '../utils/orgStructureUtils';

/**
 * Custom hook for managing organizational structure state
 * @param {Object} options - Hook options
 * @param {Object} options.initialStructure - Initial organizational structure
 * @param {string} options.businessName - Business name for sample structure
 * @param {string} options.layoutDirection - Direction of the layout ('TB' for top-to-bottom, 'LR' for left-to-right)
 * @param {Function} options.onStructureChange - Callback when structure changes
 * @param {Object} options.layoutService - Layout service (ELK) for calculating node positions
 * @returns {Object} State and state management functions
 */
const useOrgStructureState = ({ 
  initialStructure = null,
  businessName = 'My Company',
  layoutDirection = 'TB',
  onStructureChange,
  layoutService
}) => {
  // State for the organizational structure
  const [orgStructure, setOrgStructure] = useState(null);
  
  // State for React Flow nodes and edges using React Flow's built-in state management
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  // State for selected node
  const [selectedNode, setSelectedNode] = useState(null);
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Layout mode: 'automatic' (ELK calculates layout) or 'manual' (user positions nodes)
  const [layoutMode, setLayoutMode] = useState('automatic');
  
  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogParentId, setAddDialogParentId] = useState(null);
  const [addDialogParentType, setAddDialogParentType] = useState(null);
  
  // Ref to track initialization
  const isInitializedRef = useRef(false);
  
  // Ref to track layout calculation in progress
  const isCalculatingRef = useRef(false);
  
  // Ref to store the last structure that was laid out
  const lastStructureRef = useRef(null);
  
  /**
   * Apply layout to the organizational structure using ELK
   * 
   * This function calculates the layout of the organizational structure using ELK.
   * It supports both automatic and manual layout modes. In manual mode, layout
   * calculations are skipped unless forced.
   * 
   * @param {Object} structure - Organizational structure to layout
   * @param {string} direction - Layout direction ('TB' or 'LR')
   * @param {boolean} force - Whether to force layout calculation even in manual mode
   */
  const applyLayout = useCallback(async (structure, direction, force = false) => {
    // Skip layout calculation if:
    // 1. No structure or layout service
    // 2. In manual mode and not forced
    // 3. Already calculating layout
    if (!structure || !layoutService || (layoutMode === 'manual' && !force) || isCalculatingRef.current) {
      console.log('Skipping layout calculation', { 
        hasStructure: !!structure, 
        hasLayoutService: !!layoutService, 
        layoutMode, 
        force, 
        isCalculating: isCalculatingRef.current 
      });
      return;
    }
    
    // Prevent multiple layout calculations at the same time
    isCalculatingRef.current = true;
    
    // Create a deep copy of the structure to avoid modifying the original
    const structureCopy = JSON.parse(JSON.stringify(structure));
    
    // Store the structure being laid out
    lastStructureRef.current = structureCopy;
    
    console.log('Starting layout calculation', { direction });
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Calculate layout using ELK with debugging enabled
      const layoutResult = await layoutService.calculateLayout(structureCopy, direction, true);
      
      // Skip updating if another layout calculation has been started
      if (lastStructureRef.current !== structureCopy) {
        console.log('Layout calculation was superseded by another calculation, skipping update');
        return;
      }
      
      // Convert to React Flow format
      const { nodes: flowNodes, edges: flowEdges } = layoutService.convertToReactFlow(layoutResult);
      
      // Update state
      setNodes(flowNodes);
      setEdges(flowEdges);
      setOrgStructure(layoutResult.structure);
      
      // Call onStructureChange if provided
      if (onStructureChange) {
        onStructureChange(layoutResult.structure);
      }
    } catch (err) {
      console.error('Error applying layout:', err);
      setError('Failed to apply layout. Please try again.');
    } finally {
      setIsLoading(false);
      isCalculatingRef.current = false;
    }
  }, [layoutService, onStructureChange, layoutMode, setNodes, setEdges]);
  
  /**
   * Initialize the organizational structure
   */
  const initializeStructure = useCallback(async () => {
    // Prevent multiple initializations
    if (isInitializedRef.current) {
      console.log('Already initialized, skipping');
      return;
    }
    
    console.log('Initializing organizational structure');
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Use provided structure or create a sample one
      const structure = initialStructure || createSampleOrgStructure(businessName);
      
      // Apply layout
      await applyLayout(structure, layoutDirection, true);
      
      // Mark as initialized
      isInitializedRef.current = true;
    } catch (err) {
      console.error('Error initializing structure:', err);
      setError('Failed to initialize organizational structure.');
    } finally {
      setIsLoading(false);
    }
  }, [initialStructure, businessName, layoutDirection, applyLayout]);
  
  // Initialize on mount
  useEffect(() => {
    initializeStructure();
    
    // Cleanup function
    return () => {
      isInitializedRef.current = false;
      isCalculatingRef.current = false;
    };
  }, [initializeStructure]);
  
  /**
   * Handle node selection
   * @param {Object} node - Selected node
   */
  const handleNodeSelect = useCallback((node) => {
    setSelectedNode(node);
  }, []);
  
  /**
   * Open add node dialog
   * @param {string} parentId - Parent node ID
   * @param {string} parentType - Parent node type
   */
  const handleOpenAddDialog = useCallback((parentId, parentType) => {
    setAddDialogParentId(parentId);
    setAddDialogParentType(parentType);
    setAddDialogOpen(true);
  }, []);
  
  /**
   * Open edit node dialog
   * @param {Object} node - Node to edit
   */
  const handleOpenEditDialog = useCallback((node) => {
    setSelectedNode(node);
    setEditDialogOpen(true);
  }, []);
  
  /**
   * Open delete node dialog
   * @param {Object} node - Node to delete
   */
  const handleOpenDeleteDialog = useCallback((node) => {
    setSelectedNode(node);
    setDeleteDialogOpen(true);
  }, []);
  
  /**
   * Add a new node to the structure
   * @param {Object} newNode - Node to add
   */
  const handleAddNode = useCallback(async (newNode) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Add node to hierarchy
      const updatedStructure = addNodeToHierarchy(
        orgStructure,
        addDialogParentId,
        newNode
      );
      
      // Apply layout to updated structure
      await applyLayout(updatedStructure, layoutDirection, true);
      
      // Close dialog
      setAddDialogOpen(false);
    } catch (err) {
      console.error('Error adding node:', err);
      setError('Failed to add node. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [orgStructure, addDialogParentId, layoutDirection, applyLayout]);
  
  /**
   * Update an existing node
   * @param {Object} updatedNode - Updated node data
   */
  const handleUpdateNode = useCallback(async (updatedNode) => {
    if (!selectedNode) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Update node in hierarchy
      const updatedStructure = updateNodeInHierarchy(
        orgStructure,
        selectedNode.id,
        updatedNode
      );
      
      // Apply layout to updated structure
      await applyLayout(updatedStructure, layoutDirection, true);
      
      // Close dialog
      setEditDialogOpen(false);
    } catch (err) {
      console.error('Error updating node:', err);
      setError('Failed to update node. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [orgStructure, selectedNode, layoutDirection, applyLayout]);
  
  /**
   * Remove a node from the structure
   */
  const handleRemoveNode = useCallback(async () => {
    if (!selectedNode) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Remove node from hierarchy
      const updatedStructure = removeNodeFromHierarchy(
        orgStructure,
        selectedNode.id
      );
      
      // Apply layout to updated structure
      await applyLayout(updatedStructure, layoutDirection, true);
      
      // Close dialog and clear selection
      setDeleteDialogOpen(false);
      setSelectedNode(null);
    } catch (err) {
      console.error('Error removing node:', err);
      setError('Failed to remove node. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [orgStructure, selectedNode, layoutDirection, applyLayout]);
  
  /**
   * Toggle node expansion
   * @param {string} nodeId - ID of node to toggle
   */
  const handleToggleNodeExpand = useCallback(async (nodeId) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Find node in hierarchy
      const node = findNodeInHierarchy(orgStructure, nodeId);
      
      if (node) {
        // Toggle expansion
        const updatedStructure = JSON.parse(JSON.stringify(orgStructure));
        const nodeToUpdate = findNodeInHierarchy(updatedStructure, nodeId);
        
        if (nodeToUpdate) {
          nodeToUpdate.isExpanded = !nodeToUpdate.isExpanded;
          
          // Apply layout to updated structure
          await applyLayout(updatedStructure, layoutDirection, true);
        }
      }
    } catch (err) {
      console.error('Error toggling node expansion:', err);
      setError('Failed to toggle node expansion. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [orgStructure, layoutDirection, applyLayout]);
  
  /**
   * Handle node drag start
   * 
   * Switches to manual layout mode when a node is dragged, which prevents
   * automatic layout recalculation and preserves user-defined node positions.
   */
  const handleNodeDragStart = useCallback(() => {
    setLayoutMode('manual');
    console.log('Switched to manual layout mode');
  }, []);
  
  /**
   * Handle node position change after dragging
   * 
   * Updates the node position in both the React Flow state and the organizational structure.
   * Also sets the layout mode to manual to prevent automatic layout from overriding user positioning.
   * 
   * @param {Object} node - The node that was dragged
   */
  const handleNodePositionChange = useCallback((node) => {
    if (!orgStructure || !node || !node.id || !node.position) {
      return;
    }
    
    console.log('Updating node position:', node.id, node.position);
    
    // Set layout mode to manual when a node is dragged
    setLayoutMode('manual');
    
    // First, directly update the node in the React Flow nodes array
    // This ensures the node stays where it was dragged
    setNodes(nds => 
      nds.map(n => n.id === node.id ? { 
        ...n, 
        position: { 
          x: Math.round(node.position.x), 
          y: Math.round(node.position.y) 
        },
        draggable: true // Ensure the node remains draggable
      } : n)
    );
    
    // Then update the node position in the structure
    const updateNodePosition = (structure) => {
      if (!structure) return structure;
      
      if (structure.id === node.id) {
        return {
          ...structure,
          position: { 
            x: Math.round(node.position.x), 
            y: Math.round(node.position.y) 
          }
        };
      }
      
      if (structure.children) {
        return {
          ...structure,
          children: structure.children.map(updateNodePosition)
        };
      }
      
      return structure;
    };
    
    // Create a deep copy of the structure
    const updatedStructure = updateNodePosition(JSON.parse(JSON.stringify(orgStructure)));
    
    // Update the structure
    setOrgStructure(updatedStructure);
    
    // Call onStructureChange if provided
    if (onStructureChange) {
      onStructureChange(updatedStructure);
    }
  }, [orgStructure, onStructureChange, setNodes, setLayoutMode]);
  
  /**
   * Reset layout to automatic mode and recalculate layout
   * 
   * Switches back to automatic layout mode and forces a layout recalculation
   * to reset all node positions according to the layout algorithm.
   */
  const resetLayout = useCallback(() => {
    setLayoutMode('automatic');
    console.log('Switched to automatic layout mode');
    
    if (orgStructure) {
      applyLayout(orgStructure, layoutDirection, true);
    }
  }, [orgStructure, layoutDirection, applyLayout]);
  
  return {
    // State
    orgStructure,
    nodes,
    edges,
    selectedNode,
    isLoading,
    error,
    layoutMode,
    
    // React Flow state handlers
    onNodesChange,
    onEdgesChange,
    
    // Dialog states
    addDialogOpen,
    editDialogOpen,
    deleteDialogOpen,
    addDialogParentId,
    addDialogParentType,
    
    // Dialog actions
    setAddDialogOpen,
    setEditDialogOpen,
    setDeleteDialogOpen,
    
    // Node operations
    handleNodeSelect,
    handleOpenAddDialog,
    handleOpenEditDialog,
    handleOpenDeleteDialog,
    handleAddNode,
    handleUpdateNode,
    handleRemoveNode,
    handleToggleNodeExpand,
    handleNodeDragStart,
    handleNodePositionChange,
    
    // Layout operations
    applyLayout,
    resetLayout
  };
};

export default useOrgStructureState;

/**
 * Custom hook to manage dialog state
 * @returns {Object} Dialog state and management functions
 */
export const useDialogState = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newNodeData, setNewNodeData] = useState({ label: '', description: '', type: 'department' });
  const [editNodeData, setEditNodeData] = useState({ id: '', label: '', description: '', type: '' });
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [nodeToDelete, setNodeToDelete] = useState(null);
  const [nodeToEdit, setNodeToEdit] = useState(null);
  
  return {
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
  };
};

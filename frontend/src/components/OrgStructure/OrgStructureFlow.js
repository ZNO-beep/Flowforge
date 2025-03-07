import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  ReactFlowProvider,
  Panel,
  useReactFlow
} from 'reactflow';
import 'reactflow/dist/style.css';

import { nodeTypes } from './OrgStructureNodes';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Plus,
  RotateCcw,
  ArrowLeftRight
} from 'lucide-react';
import useOrgStructureState from '../../hooks/useOrgStructureState';
import { 
  AddNodeDialog, 
  EditNodeDialog, 
  DeleteNodeDialog 
} from './OrgStructureDialogs';
import ErrorBoundary from '../ErrorBoundary';

// Import the ELK layout service
import elkLayoutService from '../../services/elkLayoutService';

/**
 * Organizational Structure Flow component
 * Displays and manages the organizational structure using React Flow with ELK layout
 * @param {Object} props - Component props
 * @param {Object} props.initialStructure - Initial organizational structure
 * @param {string} props.businessName - Business name for sample structure
 * @param {string} props.layoutDirection - Direction of the layout ('TB' for top-to-bottom, 'LR' for left-to-right)
 * @param {Function} props.onStructureChange - Callback when structure changes
 * @returns {JSX.Element} Component JSX
 */
const OrgStructureFlowContent = ({ 
  initialStructure,
  businessName,
  layoutDirection = 'TB',
  onStructureChange
}) => {
  const {
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
  } = useOrgStructureState({
    initialStructure,
    businessName,
    layoutDirection,
    onStructureChange,
    layoutService: elkLayoutService // Pass the ELK layout service
  });
  
  // Handle node click
  const onNodeClick = useCallback((_, node) => {
    handleNodeSelect(node);
  }, [handleNodeSelect]);
  
  // Handle node double click to toggle expansion
  const onNodeDoubleClick = useCallback((_, node) => {
    handleToggleNodeExpand(node.id);
  }, [handleToggleNodeExpand]);
  
  // Handle node drag start
  const onNodeDragStart = useCallback((event, node) => {
    console.log('Node drag start:', node.id);
    handleNodeDragStart();
  }, [handleNodeDragStart]);
  
  // Handle node drag
  const onNodeDrag = useCallback((event, node) => {
    // Just log the position during dragging
    console.log('Node dragging:', node.id, node.position);
  }, []);
  
  // Handle node drag stop
  const onNodeDragStop = useCallback((event, node) => {
    console.log('Node drag stop:', node.id, node.position);
    
    // Ensure the node position is updated in both the React Flow state and the organizational structure
    // This is critical for maintaining the dragged position
    if (node && node.position) {
      handleNodePositionChange(node);
    }
  }, [handleNodePositionChange]);
  
  // Handle adding a node to the root
  const handleAddRootNode = useCallback(() => {
    handleOpenAddDialog('org-root', 'organization');
  }, [handleOpenAddDialog]);
  
  // Handle layout direction toggle
  const handleLayoutDirectionToggle = useCallback(() => {
    // Force layout recalculation with new direction
    const newDirection = layoutDirection === 'TB' ? 'LR' : 'TB';
    applyLayout(orgStructure, newDirection, true);
  }, [orgStructure, layoutDirection, applyLayout]);
  
  return (
    <div className="h-[700px] w-full border rounded-lg bg-background relative">
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      )}
      
      <ErrorBoundary>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onNodeDoubleClick={onNodeDoubleClick}
          onNodeDragStart={onNodeDragStart}
          onNodeDrag={onNodeDrag}
          onNodeDragStop={onNodeDragStop}
          fitView
          minZoom={0.1}
          maxZoom={2.0}
          defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
          nodesDraggable={true}
          draggable={true}
          nodesConnectable={false}
          elementsSelectable={true}
          selectNodesOnDrag={false}
          panOnDrag={[1, 2]} // Allow panning with middle mouse and right mouse buttons
          panOnScroll={true}
          proOptions={{ hideAttribution: true }}
          fitViewOptions={{ 
            padding: 0.5,
            includeHiddenNodes: false
          }}
          zoomOnDoubleClick={false}
          defaultEdgeOptions={{
            type: 'smoothstep',
            style: { strokeWidth: 2 }
          }}
        >
          <Controls />
          <MiniMap 
            nodeStrokeWidth={3}
            zoomable
            pannable
            nodeColor={(node) => {
              switch (node.data?.type) {
                case 'organization':
                  return '#3b82f6'; // blue-500
                case 'department':
                  return '#10b981'; // emerald-500
                case 'role':
                  return '#f59e0b'; // amber-500
                case 'task':
                  return '#6366f1'; // indigo-500
                default:
                  return '#94a3b8'; // slate-400
              }
            }}
            nodeBorderRadius={8}
          />
          <Background variant="dots" gap={12} size={1} />
          
          <Panel position="top-right" className="flex flex-col gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="h-8 w-8 p-0"
              onClick={handleAddRootNode}
              title="Add Department"
            >
              <Plus className="h-4 w-4" />
            </Button>
            
            {selectedNode && (
              <>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8 w-8 p-0"
                  onClick={() => handleOpenAddDialog(selectedNode.id, selectedNode.data?.type)}
                  title={`Add to ${selectedNode.data?.label}`}
                >
                  <Plus className="h-4 w-4" />
                  <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center">
                    +
                  </Badge>
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8 w-8 p-0"
                  onClick={() => handleOpenEditDialog(selectedNode)}
                  title={`Edit ${selectedNode.data?.label}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    <path d="m15 5 4 4" />
                  </svg>
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                  onClick={() => handleOpenDeleteDialog(selectedNode)}
                  title={`Delete ${selectedNode.data?.label}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    <line x1="10" x2="10" y1="11" y2="17" />
                    <line x1="14" x2="14" y1="11" y2="17" />
                  </svg>
                </Button>
              </>
            )}
            
            {/* Layout direction toggle button */}
            <Button 
              size="sm" 
              variant="outline" 
              className="h-8 w-8 p-0"
              onClick={handleLayoutDirectionToggle}
              title={`Switch to ${layoutDirection === 'TB' ? 'Horizontal' : 'Vertical'} Layout`}
            >
              {layoutDirection === 'TB' ? (
                <ArrowLeftRight className="h-4 w-4" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M8 3v18M16 3v18" />
                  <path d="M3 8h18M3 16h18" />
                </svg>
              )}
            </Button>
            
            {/* Refresh layout button */}
            <Button 
              size="sm" 
              variant="outline" 
              className="h-8 w-8 p-0"
              onClick={() => applyLayout(orgStructure, layoutDirection, true)}
              title="Refresh Layout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M21 2v6h-6"></path>
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                <path d="M3 22v-6h6"></path>
                <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
              </svg>
            </Button>
            
            {/* Reset to automatic layout button */}
            {layoutMode === 'manual' && (
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 w-8 p-0"
                onClick={resetLayout}
                title="Reset to Automatic Layout"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
            
            {/* Layout mode indicator */}
            <div className="absolute top-2 right-12 bg-background/80 px-2 py-1 rounded text-xs">
              {layoutMode === 'automatic' ? 'Auto Layout' : 'Manual Layout'}
            </div>
          </Panel>
        </ReactFlow>
      </ErrorBoundary>
      
      {error && (
        <div className="absolute bottom-4 left-4 right-4 p-3 bg-destructive/10 border border-destructive text-destructive rounded-md">
          {error}
        </div>
      )}
      
      {/* Dialogs */}
      <AddNodeDialog 
        isOpen={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSubmit={handleAddNode}
        parentId={addDialogParentId}
        parentType={addDialogParentType}
      />
      
      <EditNodeDialog 
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSubmit={handleUpdateNode}
        node={selectedNode}
      />
      
      <DeleteNodeDialog 
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleRemoveNode}
        node={selectedNode}
      />
    </div>
  );
};

OrgStructureFlowContent.propTypes = {
  initialStructure: PropTypes.object,
  businessName: PropTypes.string,
  layoutDirection: PropTypes.oneOf(['TB', 'LR']),
  onStructureChange: PropTypes.func
};

/**
 * Organizational Structure Flow component with ReactFlowProvider
 * @param {Object} props - Component props
 * @returns {JSX.Element} Component JSX
 */
const OrgStructureFlow = (props) => {
  return (
    <ReactFlowProvider>
      <ErrorBoundary>
        <OrgStructureFlowContent {...props} />
      </ErrorBoundary>
    </ReactFlowProvider>
  );
};

OrgStructureFlow.propTypes = {
  initialStructure: PropTypes.object,
  businessName: PropTypes.string,
  layoutDirection: PropTypes.oneOf(['TB', 'LR']),
  onStructureChange: PropTypes.func
};

export default OrgStructureFlow; 
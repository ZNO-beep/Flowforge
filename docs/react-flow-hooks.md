# React Flow Hooks and Event Handling

## Core Hooks

### 1. useReactFlow

```typescript
import { useReactFlow, ReactFlowInstance } from 'reactflow';

const FlowComponent = () => {
  const {
    getNodes,
    getEdges,
    setNodes,
    setEdges,
    getNode,
    getEdge,
    addNodes,
    addEdges,
    deleteElements,
    getViewport,
    setViewport,
    fitView,
    zoomIn,
    zoomOut,
    getIntersectingNodes,
    project,
    viewportInitialized,
  } = useReactFlow();

  // Example: Add a new node
  const addNewNode = () => {
    const newNode = {
      id: `node-${Date.now()}`,
      position: { x: 100, y: 100 },
      data: { label: 'New Node' },
    };
    addNodes(newNode);
  };

  // Example: Zoom to fit
  const zoomToFit = () => {
    fitView({ padding: 0.2, duration: 800 });
  };

  return (
    <div>
      <button onClick={addNewNode}>Add Node</button>
      <button onClick={zoomToFit}>Fit View</button>
    </div>
  );
};
```

### 2. useNodes and useEdges

```typescript
import { useNodes, useEdges, Node, Edge } from 'reactflow';

const FlowStats = () => {
  const nodes = useNodes();
  const edges = useEdges();

  const stats = {
    nodeCount: nodes.length,
    edgeCount: edges.length,
    selectedNodes: nodes.filter(node => node.selected).length,
    selectedEdges: edges.filter(edge => edge.selected).length,
  };

  return (
    <div className="flow-stats">
      <h3>Flow Statistics</h3>
      <ul>
        <li>Nodes: {stats.nodeCount}</li>
        <li>Edges: {stats.edgeCount}</li>
        <li>Selected Nodes: {stats.selectedNodes}</li>
        <li>Selected Edges: {stats.selectedEdges}</li>
      </ul>
    </div>
  );
};
```

### 3. useNodesState and useEdgesState

```typescript
import { useNodesState, useEdgesState } from 'reactflow';

const FlowManager = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

  const onNodeDragStop = useCallback((event, node) => {
    console.log('Node dragged:', node);
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeDragStop={onNodeDragStop}
    />
  );
};
```

## Event Handling

### 1. Node Events

```typescript
import { Node } from 'reactflow';

const FlowWithNodeEvents = () => {
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    console.log('Node clicked:', node);
  }, []);

  const onNodeDoubleClick = useCallback((event: React.MouseEvent, node: Node) => {
    console.log('Node double clicked:', node);
  }, []);

  const onNodeMouseEnter = useCallback((event: React.MouseEvent, node: Node) => {
    console.log('Mouse enter:', node);
  }, []);

  const onNodeMouseMove = useCallback((event: React.MouseEvent, node: Node) => {
    console.log('Mouse move:', node);
  }, []);

  const onNodeMouseLeave = useCallback((event: React.MouseEvent, node: Node) => {
    console.log('Mouse leave:', node);
  }, []);

  const onNodeContextMenu = useCallback((event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    console.log('Context menu:', node);
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodeClick={onNodeClick}
      onNodeDoubleClick={onNodeDoubleClick}
      onNodeMouseEnter={onNodeMouseEnter}
      onNodeMouseMove={onNodeMouseMove}
      onNodeMouseLeave={onNodeMouseLeave}
      onNodeContextMenu={onNodeContextMenu}
    />
  );
};
```

### 2. Edge Events

```typescript
import { Edge } from 'reactflow';

const FlowWithEdgeEvents = () => {
  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    console.log('Edge clicked:', edge);
  }, []);

  const onEdgeUpdate = useCallback((oldEdge: Edge, newConnection: Connection) => {
    setEdges((els) => updateEdge(oldEdge, newConnection, els));
  }, []);

  const onEdgeMouseEnter = useCallback((event: React.MouseEvent, edge: Edge) => {
    console.log('Mouse enter:', edge);
  }, []);

  const onEdgeMouseMove = useCallback((event: React.MouseEvent, edge: Edge) => {
    console.log('Mouse move:', edge);
  }, []);

  const onEdgeMouseLeave = useCallback((event: React.MouseEvent, edge: Edge) => {
    console.log('Mouse leave:', edge);
  }, []);

  const onEdgeContextMenu = useCallback((event: React.MouseEvent, edge: Edge) => {
    event.preventDefault();
    console.log('Context menu:', edge);
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onEdgeClick={onEdgeClick}
      onEdgeUpdate={onEdgeUpdate}
      onEdgeMouseEnter={onEdgeMouseEnter}
      onEdgeMouseMove={onEdgeMouseMove}
      onEdgeMouseLeave={onEdgeMouseLeave}
      onEdgeContextMenu={onEdgeContextMenu}
    />
  );
};
```

### 3. Viewport Events

```typescript
const FlowWithViewportEvents = () => {
  const onMoveStart = useCallback((event: React.MouseEvent, viewport: Viewport) => {
    console.log('Move start:', viewport);
  }, []);

  const onMove = useCallback((event: React.MouseEvent, viewport: Viewport) => {
    console.log('Moving:', viewport);
  }, []);

  const onMoveEnd = useCallback((event: React.MouseEvent, viewport: Viewport) => {
    console.log('Move end:', viewport);
  }, []);

  const onViewportChange = useCallback((viewport: Viewport) => {
    console.log('Viewport changed:', viewport);
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onMoveStart={onMoveStart}
      onMove={onMove}
      onMoveEnd={onMoveEnd}
      onViewportChange={onViewportChange}
    />
  );
};
```

## Custom Hooks

### 1. useUpdateNodeInternals

```typescript
import { useUpdateNodeInternals } from 'reactflow';

const NodeWithDynamicHandles = ({ id }) => {
  const updateNodeInternals = useUpdateNodeInternals();
  
  useEffect(() => {
    // Call this when handles change dynamically
    updateNodeInternals(id);
  }, [id, updateNodeInternals]);

  return (
    <div>
      <Handle type="target" position={Position.Top} />
      {/* Dynamic handles */}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};
```

### 2. useStoreApi

```typescript
import { useStoreApi } from 'reactflow';

const FlowControls = () => {
  const store = useStoreApi();

  const logStoreState = () => {
    const {
      nodeInternals,
      edges,
      transform,
      snapToGrid,
      nodesDraggable,
    } = store.getState();

    console.log('Current store state:', {
      nodes: Array.from(nodeInternals.values()),
      edges,
      transform,
      snapToGrid,
      nodesDraggable,
    });
  };

  return <button onClick={logStoreState}>Log Store State</button>;
};
```

### 3. Custom Flow Hook

```typescript
import { useCallback } from 'react';
import { useReactFlow, Node, Edge } from 'reactflow';

const useFlowOperations = () => {
  const { getNodes, getEdges, setNodes, setEdges } = useReactFlow();

  const duplicateNode = useCallback((nodeId: string) => {
    const node = getNodes().find((n) => n.id === nodeId);
    if (!node) return;

    const newNode: Node = {
      ...node,
      id: `${node.id}-copy`,
      position: {
        x: node.position.x + 50,
        y: node.position.y + 50,
      },
    };

    setNodes((nodes) => [...nodes, newNode]);
  }, [getNodes, setNodes]);

  const deleteConnectedEdges = useCallback((nodeId: string) => {
    setEdges((edges) =>
      edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    );
  }, [setEdges]);

  const centerNode = useCallback((nodeId: string) => {
    const node = getNodes().find((n) => n.id === nodeId);
    if (!node) return;

    const { x, y } = node.position;
    const centerX = window.innerWidth / 2 - x;
    const centerY = window.innerHeight / 2 - y;

    setNodes((nodes) =>
      nodes.map((n) => ({
        ...n,
        position: {
          x: n.position.x + centerX,
          y: n.position.y + centerY,
        },
      }))
    );
  }, [getNodes, setNodes]);

  return {
    duplicateNode,
    deleteConnectedEdges,
    centerNode,
  };
};

// Usage
const FlowComponent = () => {
  const { duplicateNode, deleteConnectedEdges, centerNode } = useFlowOperations();

  return (
    <div>
      <button onClick={() => duplicateNode('node-1')}>Duplicate Node</button>
      <button onClick={() => deleteConnectedEdges('node-1')}>Delete Connections</button>
      <button onClick={() => centerNode('node-1')}>Center Node</button>
    </div>
  );
};
``` 
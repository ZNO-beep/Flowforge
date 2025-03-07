# React Flow Utilities and Helper Functions

## Node Utilities

### 1. Node Position Helpers

```typescript
// Calculate center position for a new node
const getNewNodePosition = (nodes: Node[], offset = { x: 0, y: 0 }) => {
  if (!nodes.length) {
    return { x: 0 + offset.x, y: 0 + offset.y };
  }

  const centerX = nodes.reduce((sum, node) => sum + node.position.x, 0) / nodes.length;
  const centerY = nodes.reduce((sum, node) => sum + node.position.y, 0) / nodes.length;

  return {
    x: centerX + offset.x,
    y: centerY + offset.y,
  };
};

// Arrange nodes in a grid layout
const arrangeNodesInGrid = (nodes: Node[], cols = 3, spacing = 200) => {
  return nodes.map((node, index) => ({
    ...node,
    position: {
      x: (index % cols) * spacing,
      y: Math.floor(index / cols) * spacing,
    },
  }));
};

// Arrange nodes in a circle
const arrangeNodesInCircle = (nodes: Node[], radius = 200) => {
  const angleStep = (2 * Math.PI) / nodes.length;
  return nodes.map((node, index) => ({
    ...node,
    position: {
      x: radius * Math.cos(index * angleStep),
      y: radius * Math.sin(index * angleStep),
    },
  }));
};
```

### 2. Node Data Management

```typescript
// Add or update node data
const updateNodeData = (nodes: Node[], nodeId: string, newData: any) => {
  return nodes.map((node) =>
    node.id === nodeId
      ? { ...node, data: { ...node.data, ...newData } }
      : node
  );
};

// Filter nodes by type
const filterNodesByType = (nodes: Node[], type: string) => {
  return nodes.filter((node) => node.type === type);
};

// Get connected nodes
const getConnectedNodes = (nodes: Node[], edges: Edge[], nodeId: string) => {
  const connectedEdges = edges.filter(
    (edge) => edge.source === nodeId || edge.target === nodeId
  );
  
  const connectedNodeIds = new Set(
    connectedEdges.flatMap((edge) => [edge.source, edge.target])
  );
  
  return nodes.filter((node) => connectedNodeIds.has(node.id));
};
```

## Edge Utilities

### 1. Edge Management

```typescript
// Create edge between nodes
const createEdge = (sourceId: string, targetId: string, options = {}) => {
  return {
    id: `${sourceId}-${targetId}`,
    source: sourceId,
    target: targetId,
    type: 'default',
    ...options,
  };
};

// Get all edges connected to a node
const getNodeEdges = (edges: Edge[], nodeId: string) => {
  return edges.filter(
    (edge) => edge.source === nodeId || edge.target === nodeId
  );
};

// Remove edges connected to a node
const removeNodeEdges = (edges: Edge[], nodeId: string) => {
  return edges.filter(
    (edge) => edge.source !== nodeId && edge.target !== nodeId
  );
};
```

### 2. Edge Validation

```typescript
// Check if connection creates a cycle
const wouldCreateCycle = (edges: Edge[], sourceId: string, targetId: string) => {
  const visited = new Set<string>();
  const stack = new Set<string>();

  const dfs = (currentId: string): boolean => {
    if (stack.has(currentId)) return true;
    if (visited.has(currentId)) return false;

    visited.add(currentId);
    stack.add(currentId);

    const outgoingEdges = edges.filter((edge) => edge.source === currentId);
    for (const edge of outgoingEdges) {
      if (dfs(edge.target)) return true;
    }

    stack.delete(currentId);
    return false;
  };

  // Add temporary edge
  const tempEdges = [...edges, { source: sourceId, target: targetId }];
  return dfs(sourceId);
};

// Validate maximum connections
const validateMaxConnections = (edges: Edge[], nodeId: string, maxConnections: number) => {
  const connectionCount = edges.filter(
    (edge) => edge.source === nodeId || edge.target === nodeId
  ).length;
  
  return connectionCount < maxConnections;
};
```

## Flow Utilities

### 1. Flow State Management

```typescript
// Save flow to localStorage
const saveFlow = (nodes: Node[], edges: Edge[], key = 'flow-state') => {
  const flow = {
    nodes,
    edges,
    timestamp: Date.now(),
  };
  localStorage.setItem(key, JSON.stringify(flow));
};

// Load flow from localStorage
const loadFlow = (key = 'flow-state') => {
  const flowString = localStorage.getItem(key);
  if (!flowString) return null;
  
  return JSON.parse(flowString);
};

// Export flow as JSON file
const exportFlow = (nodes: Node[], edges: Edge[], filename = 'flow.json') => {
  const flow = {
    nodes,
    edges,
    metadata: {
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
    },
  };
  
  const blob = new Blob([JSON.stringify(flow, null, 2)], {
    type: 'application/json',
  });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
```

### 2. Viewport Utilities

```typescript
// Get viewport center
const getViewportCenter = (reactFlowInstance: ReactFlowInstance) => {
  const { x, y, zoom } = reactFlowInstance.getViewport();
  const { width, height } = reactFlowInstance.getNodes()[0]?.getBoundingClientRect() || { width: 0, height: 0 };
  
  return {
    x: -x / zoom + width / 2,
    y: -y / zoom + height / 2,
  };
};

// Fit view to selected nodes
const fitViewToNodes = (reactFlowInstance: ReactFlowInstance, nodeIds: string[]) => {
  const nodes = reactFlowInstance.getNodes().filter((node) => nodeIds.includes(node.id));
  if (!nodes.length) return;

  reactFlowInstance.fitView({
    nodes,
    padding: 0.2,
    duration: 800,
  });
};
```

## Selection Utilities

### 1. Selection Management

```typescript
// Get selected nodes and edges
const getSelection = (nodes: Node[], edges: Edge[]) => {
  return {
    nodes: nodes.filter((node) => node.selected),
    edges: edges.filter((edge) => edge.selected),
  };
};

// Select connected components
const selectConnectedComponents = (nodes: Node[], edges: Edge[], startNodeId: string) => {
  const visited = new Set<string>();
  const selectedNodes = new Set<string>();
  const selectedEdges = new Set<string>();

  const traverse = (nodeId: string) => {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    selectedNodes.add(nodeId);

    const connectedEdges = edges.filter(
      (edge) => edge.source === nodeId || edge.target === nodeId
    );

    for (const edge of connectedEdges) {
      selectedEdges.add(edge.id);
      const nextNodeId = edge.source === nodeId ? edge.target : edge.source;
      traverse(nextNodeId);
    }
  };

  traverse(startNodeId);

  return {
    nodes: nodes.map((node) => ({
      ...node,
      selected: selectedNodes.has(node.id),
    })),
    edges: edges.map((edge) => ({
      ...edge,
      selected: selectedEdges.has(edge.id),
    })),
  };
};
```

### 2. Clipboard Operations

```typescript
// Copy selected elements
const copySelectedElements = (nodes: Node[], edges: Edge[]) => {
  const selectedNodes = nodes.filter((node) => node.selected);
  const selectedEdges = edges.filter((edge) => edge.selected);

  const clipboard = {
    nodes: selectedNodes,
    edges: selectedEdges.filter(
      (edge) =>
        selectedNodes.some((node) => node.id === edge.source) &&
        selectedNodes.some((node) => node.id === edge.target)
    ),
  };

  localStorage.setItem('flow-clipboard', JSON.stringify(clipboard));
};

// Paste copied elements
const pasteElements = (
  existingNodes: Node[],
  existingEdges: Edge[],
  offset = { x: 50, y: 50 }
) => {
  const clipboardString = localStorage.getItem('flow-clipboard');
  if (!clipboardString) return { nodes: existingNodes, edges: existingEdges };

  const { nodes: copiedNodes, edges: copiedEdges } = JSON.parse(clipboardString);
  
  // Create new IDs for pasted elements
  const idMap = new Map<string, string>();
  const newNodes = copiedNodes.map((node) => {
    const newId = `${node.id}-copy-${Date.now()}`;
    idMap.set(node.id, newId);
    return {
      ...node,
      id: newId,
      position: {
        x: node.position.x + offset.x,
        y: node.position.y + offset.y,
      },
      selected: true,
    };
  });

  const newEdges = copiedEdges.map((edge) => ({
    ...edge,
    id: `${edge.id}-copy-${Date.now()}`,
    source: idMap.get(edge.source)!,
    target: idMap.get(edge.target)!,
    selected: true,
  }));

  return {
    nodes: [...existingNodes, ...newNodes],
    edges: [...existingEdges, ...newEdges],
  };
};
``` 
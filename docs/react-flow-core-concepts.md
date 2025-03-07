# React Flow Core Concepts

## Key Components

### 1. ReactFlow Component
The main component that renders the flow diagram:

```jsx
import ReactFlow from 'reactflow';

function Flow() {
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
    />
  );
}
```

### 2. ReactFlowProvider
Wrapper component that provides the React Flow context:

```jsx
import { ReactFlowProvider } from 'reactflow';

function App() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
```

## Node Types

1. **Default Node**: Standard node with input/output handles
2. **Input Node**: Node with only output handles
3. **Output Node**: Node with only input handles
4. **Group Node**: Node that can contain other nodes

```jsx
const node = {
  id: 'node-1',
  type: 'default', // or 'input', 'output', 'group'
  position: { x: 100, y: 100 },
  data: { label: 'Node Label' }
};
```

## Edge Types

1. **Default**: Standard bezier curve
2. **Straight**: Direct line
3. **Step**: Right-angled line
4. **Smoothstep**: Smoothed right-angled line
5. **Floating**: Edge that connects to the closest point

```jsx
const edge = {
  id: 'edge-1',
  source: 'node-1',
  target: 'node-2',
  type: 'default', // or 'straight', 'step', 'smoothstep', 'floating'
  animated: false,
  label: 'Edge Label'
};
```

## Handles

Connection points on nodes:

```jsx
import { Handle, Position } from 'reactflow';

function CustomNode() {
  return (
    <div>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#555' }}
        onConnect={(params) => console.log('handle onConnect', params)}
      />
      <div>Custom Node</div>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#555' }}
      />
    </div>
  );
}
```

## Viewport

The visible area of the flow:

```jsx
const viewport = {
  x: 0,
  y: 0,
  zoom: 1
};

// Viewport controls
const { setViewport, fitView, zoomIn, zoomOut } = useReactFlow();
```

## Built-in Components

1. **Background**:
```jsx
import { Background } from 'reactflow';

<Background
  variant="dots" // or 'lines', 'cross'
  gap={12}
  size={1}
/>
```

2. **MiniMap**:
```jsx
import { MiniMap } from 'reactflow';

<MiniMap
  nodeColor={(node) => {
    switch (node.type) {
      case 'input': return '#ff0072';
      case 'output': return '#00ff72';
      default: return '#eee';
    }
  }}
/>
```

3. **Controls**:
```jsx
import { Controls } from 'reactflow';

<Controls
  showZoom={true}
  showFitView={true}
  showInteractive={true}
/>
```

4. **Panel**:
```jsx
import { Panel } from 'reactflow';

<Panel position="top-left">
  <div>Custom Controls</div>
</Panel>
```

## Event Handling

Key events that can be handled:

```jsx
<ReactFlow
  // Node events
  onNodeClick={(event, node) => {}}
  onNodeDragStart={(event, node) => {}}
  onNodeDrag={(event, node) => {}}
  onNodeDragStop={(event, node) => {}}
  onNodeDoubleClick={(event, node) => {}}
  onNodeMouseEnter={(event, node) => {}}
  onNodeMouseMove={(event, node) => {}}
  onNodeMouseLeave={(event, node) => {}}
  onNodesDelete={(nodes) => {}}
  onNodesChange={(changes) => {}}

  // Edge events
  onEdgeClick={(event, edge) => {}}
  onEdgeUpdate={(oldEdge, newConnection) => {}}
  onEdgeMouseEnter={(event, edge) => {}}
  onEdgeMouseMove={(event, edge) => {}}
  onEdgeMouseLeave={(event, edge) => {}}
  onEdgesDelete={(edges) => {}}
  onEdgesChange={(changes) => {}}

  // Connection events
  onConnect={(params) => {}}
  onConnectStart={(event, params) => {}}
  onConnectEnd={(event) => {}}

  // Pane events
  onPaneClick={(event) => {}}
  onPaneScroll={(event) => {}}
  onPaneContextMenu={(event) => {}}

  // Other events
  onSelectionChange={(elements) => {}}
  onSelectionDragStart={(event, nodes) => {}}
  onSelectionDrag={(event, nodes) => {}}
  onSelectionDragStop={(event, nodes) => {}}
  onSelectionContextMenu={(event, nodes) => {}}
/>
```

## Key Hooks

1. **useReactFlow**: Access instance methods
```jsx
const { getNode, getEdge, setNodes, setEdges, addNodes, addEdges } = useReactFlow();
```

2. **useNodes/useEdges**: Access nodes and edges
```jsx
const nodes = useNodes();
const edges = useEdges();
```

3. **useNodesState/useEdgesState**: Manage state
```jsx
const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
```

4. **useViewport**: Access viewport information
```jsx
const { x, y, zoom } = useViewport();
```

## Common Patterns

1. **Node Updates**:
```jsx
const onNodesChange = useCallback(
  (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
  [setNodes]
);
```

2. **Edge Updates**:
```jsx
const onEdgesChange = useCallback(
  (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
  [setEdges]
);
```

3. **Connection Handling**:
```jsx
const onConnect = useCallback(
  (params) => setEdges((eds) => addEdge(params, eds)),
  [setEdges]
);
``` 
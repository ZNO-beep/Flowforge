# React Flow Overview

## Introduction

React Flow is a highly customizable library for building interactive node-based editors, flow charts, and diagrams. It provides a seamless way to create directed graphs with nodes and edges that can be interacted with through a user interface.

## Key Features

- **Interactive**: Drag and drop nodes, connect edges
- **Customizable**: Custom node and edge types
- **Responsive**: Works on different screen sizes
- **Controls**: Zoom, pan, background
- **Selection**: Select and interact with multiple elements
- **Event Handling**: Comprehensive event system
- **Minimap**: Overview of the entire graph
- **Styling**: Extensive styling options

## Installation

```bash
npm install reactflow
```

## Basic Usage

```jsx
import React, { useState, useCallback } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
} from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Input Node' },
    position: { x: 250, y: 25 },
  },
  {
    id: '2',
    data: { label: 'Default Node' },
    position: { x: 100, y: 125 },
  },
  {
    id: '3',
    type: 'output',
    data: { label: 'Output Node' },
    position: { x: 250, y: 250 },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
];

function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}

export default Flow;
```

## Custom Nodes

```jsx
import { Handle, Position } from 'reactflow';

const CustomNode = ({ data }) => {
  return (
    <div className="custom-node">
      <Handle type="target" position={Position.Top} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

// Register the custom node
const nodeTypes = {
  custom: CustomNode,
};

// Use in ReactFlow
<ReactFlow nodeTypes={nodeTypes} ... />
```

## Custom Edges

```jsx
import { getBezierPath, EdgeText } from 'reactflow';

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <path id={id} className="react-flow__edge-path" d={edgePath} />
      {data?.text && (
        <EdgeText
          x={(sourceX + targetX) / 2}
          y={(sourceY + targetY) / 2}
          label={data.text}
        />
      )}
    </>
  );
};

// Register the custom edge
const edgeTypes = {
  custom: CustomEdge,
};

// Use in ReactFlow
<ReactFlow edgeTypes={edgeTypes} ... />
```

## Event Handling

React Flow provides various event handlers:

```jsx
<ReactFlow
  onNodeClick={(event, node) => console.log('Node clicked:', node)}
  onNodeDragStart={(event, node) => console.log('Node drag started:', node)}
  onNodeDragStop={(event, node) => console.log('Node drag stopped:', node)}
  onEdgeClick={(event, edge) => console.log('Edge clicked:', edge)}
  onConnect={(params) => console.log('Connection made:', params)}
  onPaneClick={(event) => console.log('Pane clicked')}
  onSelectionChange={(elements) => console.log('Selection changed:', elements)}
/>
```

## Resources

- [Official Documentation](https://reactflow.dev/docs/introduction/)
- [Examples](https://reactflow.dev/examples/)
- [API Reference](https://reactflow.dev/docs/api/react-flow-props/)
- [GitHub Repository](https://github.com/wbkd/react-flow) 
import React, { useState, useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';

// Initial nodes and edges
const initialNodes = [
  {
    id: '1',
    type: 'default',
    data: { label: 'Node 1' },
    position: { x: 250, y: 5 },
    draggable: true,
    style: { cursor: 'move' }
  },
  {
    id: '2',
    type: 'default',
    data: { label: 'Node 2' },
    position: { x: 100, y: 100 },
    draggable: true,
    style: { cursor: 'move' }
  },
  {
    id: '3',
    type: 'default',
    data: { label: 'Node 3' },
    position: { x: 400, y: 100 },
    draggable: true,
    style: { cursor: 'move' }
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
];

const DraggableTest = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeDrag = useCallback((event, node) => {
    console.log('Node dragging:', node.id, node.position);
  }, []);

  const onNodeDragStop = useCallback((event, node) => {
    console.log('Node drag stop:', node.id, node.position);
  }, []);

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        nodesDraggable={true}
        draggable={true}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
        <Panel position="top-left">
          <h3>Drag Test</h3>
          <p>Try dragging these nodes</p>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default DraggableTest; 
# React Flow Best Practices and Performance Optimization

## State Management

### 1. Efficient Node and Edge Updates

```typescript
import { useCallback } from 'react';
import { useNodesState, useEdgesState } from 'reactflow';

// Good: Use callback functions for state updates
const FlowComponent = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const updateNodeData = useCallback((nodeId: string, data: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...data } };
        }
        return node;
      })
    );
  }, [setNodes]);

  // Bad: Don't mutate state directly
  const badUpdateNode = (nodeId: string, data: any) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      node.data = { ...node.data, ...data }; // ❌ Direct mutation
      setNodes([...nodes]);
    }
  };
};
```

### 2. Memoization of Callbacks and Components

```typescript
import { memo, useCallback } from 'react';
import { Handle, Position } from 'reactflow';

// Good: Memoize custom node components
const CustomNode = memo(({ data, isConnectable }) => {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="custom-node">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div>
        <input onChange={onChange} value={data.label} />
      </div>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
});

// Good: Memoize event handlers
const FlowWithEvents = () => {
  const onNodeDragStop = useCallback((event, node) => {
    console.log('drag stop', node);
  }, []);

  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodeDragStop={onNodeDragStop}
      onConnect={onConnect}
    />
  );
};
```

## Performance Optimization

### 1. Node Virtualization

```typescript
// Good: Enable node virtualization for large graphs
const LargeGraphFlow = () => {
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodesDraggable={false} // Disable if not needed
      nodesConnectable={false} // Disable if not needed
      elementsSelectable={false} // Disable if not needed
      maxZoom={1.5}
      minZoom={0.5}
      defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
    />
  );
};

// Bad: Don't render all nodes at once for large graphs
const IneffientLargeGraphFlow = () => {
  return (
    <div style={{ height: '100vh' }}>
      {nodes.map((node) => (
        <CustomNode key={node.id} {...node} />
      ))}
    </div>
  );
};
```

### 2. Edge Optimization

```typescript
// Good: Optimize edge rendering
const OptimizedFlow = () => {
  const edges = useMemo(
    () => generateEdges(nodes).map(edge => ({
      ...edge,
      style: { strokeWidth: 2 },
      animated: false, // Disable animation for better performance
      type: 'straight', // Use simpler edge types for large graphs
    })),
    [nodes]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      defaultEdgeOptions={{
        type: 'straight',
        style: { strokeWidth: 2 },
      }}
    />
  );
};
```

### 3. Lazy Loading

```typescript
import { Suspense, lazy } from 'react';

// Good: Lazy load custom nodes
const CustomNode = lazy(() => import('./CustomNode'));

const FlowWithLazyNodes = () => {
  const nodeTypes = useMemo(() => ({
    custom: CustomNode,
  }), []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
      />
    </Suspense>
  );
};
```

## Component Organization

### 1. Custom Node Structure

```typescript
// Good: Organize custom node components
const CustomNode = memo(({ data, isConnectable }) => {
  // Extract node-specific logic into custom hooks
  const { handleChange, handleSubmit } = useNodeActions(data);
  
  // Separate UI components
  return (
    <div className="custom-node">
      <NodeHeader title={data.label} />
      <NodeContent
        data={data}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
      <NodeHandles isConnectable={isConnectable} />
    </div>
  );
});

// Separate components for better maintainability
const NodeHeader = memo(({ title }) => (
  <div className="node-header">{title}</div>
));

const NodeContent = memo(({ data, onChange, onSubmit }) => (
  <div className="node-content">
    <input value={data.value} onChange={onChange} />
    <button onClick={onSubmit}>Submit</button>
  </div>
));

const NodeHandles = memo(({ isConnectable }) => (
  <>
    <Handle
      type="target"
      position={Position.Top}
      isConnectable={isConnectable}
    />
    <Handle
      type="source"
      position={Position.Bottom}
      isConnectable={isConnectable}
    />
  </>
));
```

### 2. Flow Container Organization

```typescript
// Good: Separate concerns in flow container
const FlowContainer = () => {
  // State management
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Custom hooks for flow logic
  const { addNode, removeNode, updateNode } = useFlowOperations();
  const { saveFlow, loadFlow } = useFlowPersistence();
  const { undo, redo } = useFlowHistory();

  // Event handlers
  const eventHandlers = useFlowEventHandlers();

  return (
    <div className="flow-container">
      <FlowControls
        onSave={saveFlow}
        onLoad={loadFlow}
        onUndo={undo}
        onRedo={redo}
      />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        {...eventHandlers}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};
```

## Error Handling and Validation

### 1. Connection Validation

```typescript
// Good: Implement connection validation
const FlowWithValidation = () => {
  const isValidConnection = useCallback((connection) => {
    const sourceNode = getNode(connection.source);
    const targetNode = getNode(connection.target);

    // Prevent self-connections
    if (connection.source === connection.target) {
      return false;
    }

    // Validate node types
    if (sourceNode.type !== 'output' && targetNode.type !== 'input') {
      return false;
    }

    // Check maximum connections
    const sourceEdges = getConnectedEdges([sourceNode], edges);
    if (sourceEdges.length >= sourceNode.data.maxConnections) {
      return false;
    }

    return true;
  }, [getNode, edges]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      isValidConnection={isValidConnection}
    />
  );
};
```

### 2. Error Boundaries

```typescript
import { Component, ErrorInfo, ReactNode } from 'react';

// Good: Implement error boundaries
class FlowErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Flow error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flow-error">
          <h3>Something went wrong with the flow</h3>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage
const SafeFlow = () => {
  return (
    <FlowErrorBoundary>
      <ReactFlow nodes={nodes} edges={edges} />
    </FlowErrorBoundary>
  );
};
```

## Testing

### 1. Component Testing

```typescript
import { render, fireEvent, screen } from '@testing-library/react';
import { vi } from 'vitest';

// Good: Test custom node components
describe('CustomNode', () => {
  const mockData = {
    label: 'Test Node',
    value: 'test',
  };

  it('renders node content correctly', () => {
    render(<CustomNode data={mockData} isConnectable={true} />);
    expect(screen.getByText('Test Node')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test')).toBeInTheDocument();
  });

  it('handles user interactions', () => {
    const onChange = vi.fn();
    render(
      <CustomNode
        data={{ ...mockData, onChange }}
        isConnectable={true}
      />
    );

    fireEvent.change(screen.getByDisplayValue('test'), {
      target: { value: 'new value' },
    });
    expect(onChange).toHaveBeenCalledWith('new value');
  });
});
```

### 2. Flow Testing

```typescript
// Good: Test flow operations
describe('FlowOperations', () => {
  const initialNodes = [
    { id: '1', type: 'input', position: { x: 0, y: 0 } },
    { id: '2', type: 'output', position: { x: 100, y: 0 } },
  ];

  const initialEdges = [
    { id: 'e1-2', source: '1', target: '2' },
  ];

  it('adds node correctly', () => {
    const { result } = renderHook(() => useFlowOperations());
    act(() => {
      result.current.addNode({
        id: '3',
        type: 'default',
        position: { x: 50, y: 50 },
      });
    });

    expect(result.current.getNodes()).toHaveLength(3);
  });

  it('validates connections correctly', () => {
    const { result } = renderHook(() => useFlowOperations());
    const isValid = result.current.isValidConnection({
      source: '1',
      target: '2',
    });

    expect(isValid).toBe(true);
  });
});
``` 
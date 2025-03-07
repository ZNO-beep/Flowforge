# React Flow Advanced Features & Customization

## Custom Nodes

### 1. Creating Custom Nodes

```jsx
import { Handle, Position } from 'reactflow';

const CustomNode = ({ data, isConnectable }) => {
  return (
    <div className="custom-node">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div className="custom-node__content">
        <div className="custom-node__header">
          {data.icon && <span className="custom-node__icon">{data.icon}</span>}
          <span className="custom-node__title">{data.label}</span>
        </div>
        {data.content && (
          <div className="custom-node__body">{data.content}</div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
};

// Register custom node
const nodeTypes = {
  custom: CustomNode
};

// Use in ReactFlow
<ReactFlow nodeTypes={nodeTypes} />
```

### 2. Node Styling

```css
.custom-node {
  padding: 10px;
  border-radius: 5px;
  background: white;
  border: 1px solid #ddd;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.custom-node__header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.custom-node__icon {
  font-size: 20px;
}

.custom-node__title {
  font-weight: bold;
}

.custom-node__body {
  margin-top: 8px;
  font-size: 12px;
}
```

## Custom Edges

### 1. Creating Custom Edges

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
  style = {},
  data,
  markerEnd,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      {data?.label && (
        <EdgeText
          x={labelX}
          y={labelY}
          label={data.label}
          labelStyle={data.labelStyle}
          labelShowBg
          labelBgStyle={data.labelBgStyle}
          labelBgPadding={[2, 4]}
          labelBgBorderRadius={2}
        />
      )}
    </>
  );
};

// Register custom edge
const edgeTypes = {
  custom: CustomEdge
};

// Use in ReactFlow
<ReactFlow edgeTypes={edgeTypes} />
```

## Advanced Interactions

### 1. Node Validation

```jsx
const onConnectStart = useCallback((event, { nodeId, handleType }) => {
  console.log('Connection started:', nodeId, handleType);
});

const onConnectEnd = useCallback((event) => {
  console.log('Connection ended');
});

const isValidConnection = useCallback((connection) => {
  const sourceNode = getNode(connection.source);
  const targetNode = getNode(connection.target);
  
  // Add your validation logic
  return sourceNode.type !== targetNode.type;
});

<ReactFlow
  onConnectStart={onConnectStart}
  onConnectEnd={onConnectEnd}
  isValidConnection={isValidConnection}
/>
```

### 2. Custom Connection Line

```jsx
import { ConnectionLineComponent } from 'reactflow';

const CustomConnectionLine: ConnectionLineComponent = ({
  fromX,
  fromY,
  toX,
  toY,
  connectionLineStyle,
}) => {
  return (
    <g>
      <path
        fill="none"
        stroke="#222"
        strokeWidth={1.5}
        className="animated"
        d={`M${fromX},${fromY} C ${fromX} ${toY} ${fromX} ${toY} ${toX},${toY}`}
      />
      <circle cx={toX} cy={toY} fill="#fff" r={3} stroke="#222" strokeWidth={1.5} />
    </g>
  );
};

<ReactFlow connectionLineComponent={CustomConnectionLine} />
```

## Advanced State Management

### 1. Flow State Persistence

```jsx
const Flow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Save flow
  const onSave = useCallback(() => {
    const flow = {
      nodes,
      edges,
      viewport: {
        x: 0,
        y: 0,
        zoom: 1,
      },
    };
    localStorage.setItem('flow', JSON.stringify(flow));
  }, [nodes, edges]);

  // Restore flow
  const onRestore = useCallback(() => {
    const flow = JSON.parse(localStorage.getItem('flow'));
    if (flow) {
      setNodes(flow.nodes);
      setEdges(flow.edges);
    }
  }, [setNodes, setEdges]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
    >
      <Panel position="top-right">
        <button onClick={onSave}>save</button>
        <button onClick={onRestore}>restore</button>
      </Panel>
    </ReactFlow>
  );
};
```

### 2. Undo/Redo Functionality

```jsx
const Flow = () => {
  const [history, setHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onSaveState = useCallback(() => {
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push({ nodes, edges });
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  }, [history, currentIndex, nodes, edges]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      const prevState = history[currentIndex - 1];
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex, history, setNodes, setEdges]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      const nextState = history[currentIndex + 1];
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, history, setNodes, setEdges]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
    >
      <Panel position="top-right">
        <button onClick={undo} disabled={currentIndex <= 0}>undo</button>
        <button onClick={redo} disabled={currentIndex >= history.length - 1}>redo</button>
      </Panel>
    </ReactFlow>
  );
};
```

## Performance Optimization

### 1. Node Virtualization

```jsx
<ReactFlow
  nodes={nodes}
  edges={edges}
  nodesDraggable={false}
  nodesConnectable={false}
  elementsSelectable={false}
  maxZoom={1}
  minZoom={0.1}
  defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
/>
```

### 2. Edge Rendering Optimization

```jsx
const edges = useMemo(
  () => generateEdges(nodes).map(edge => ({
    ...edge,
    style: { strokeWidth: 2 },
    animated: false,
  })),
  [nodes]
);
```

## Theming and Styling

### 1. Global Styles

```css
.react-flow {
  --bg-color: #fff;
  --text-color: #333;
  --node-border-radius: 4px;
  --node-box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  
  background-color: var(--bg-color);
  color: var(--text-color);
}

.react-flow__node {
  border-radius: var(--node-border-radius);
  box-shadow: var(--node-box-shadow);
}
```

### 2. Dark Mode Support

```jsx
const Flow = ({ isDarkMode }) => {
  return (
    <div className={`flow-container ${isDarkMode ? 'dark' : 'light'}`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        className={isDarkMode ? 'dark' : 'light'}
      >
        <Background
          color={isDarkMode ? '#444' : '#aaa'}
          gap={16}
        />
      </ReactFlow>
    </div>
  );
};

// CSS
.flow-container.dark {
  --bg-color: #1a1a1a;
  --text-color: #fff;
  --node-bg-color: #333;
  --node-border-color: #444;
}

.flow-container.light {
  --bg-color: #fff;
  --text-color: #333;
  --node-bg-color: #fff;
  --node-border-color: #ddd;
}
```

## Integration with Other Libraries

### 1. With Data Visualization Libraries

```jsx
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const ChartNode = ({ data }) => {
  return (
    <div className="chart-node">
      <Handle type="target" position={Position.Top} />
      <BarChart width={200} height={100} data={data.chartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};
```

### 2. With Form Libraries

```jsx
import { useForm } from 'react-hook-form';

const FormNode = ({ data }) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (formData) => {
    data.onFormSubmit(formData);
  };

  return (
    <div className="form-node">
      <Handle type="target" position={Position.Top} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('name')} placeholder="Name" />
        <button type="submit">Submit</button>
      </form>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};
``` 
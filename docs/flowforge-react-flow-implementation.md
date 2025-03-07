# FlowForge React Flow Implementation

## Overview
FlowForge uses React Flow to create an intuitive, visual workflow builder that enables users to design business processes through a drag-and-drop interface. Additionally, React Flow is used to visualize and manage the organizational structure with expandable/collapsible departments, roles, and functions. This document outlines how React Flow is integrated into our application.

## Core Implementation Areas

### 1. Organizational Structure Visualization

#### Node Types
1. **Department Nodes**
   ```jsx
   // Using the shared OrgStructureNode component with department type
   const departmentNode = {
     id: 'dept-1',
     position: { x: 0, y: 0 },
     type: 'orgNode',
     data: {
       label: 'Sales',
       type: 'department',
       expanded: true,
       hasChildren: true,
       onToggle: () => handleToggle('dept-1'),
       onAdd: () => handleAdd('dept-1', 'role')
     }
   };
   ```

2. **Role Nodes**
   ```jsx
   // Using the shared OrgStructureNode component with role type
   const roleNode = {
     id: 'role-1',
     position: { x: 100, y: 100 },
     type: 'orgNode',
     data: {
       label: 'Sales Manager',
       type: 'role',
       expanded: false,
       hasChildren: true,
       onToggle: () => handleToggle('role-1'),
       onAdd: () => handleAdd('role-1', 'function')
     }
   };
   ```

3. **Function Nodes**
   ```jsx
   // Using the shared OrgStructureNode component with function type
   const functionNode = {
     id: 'func-1',
     position: { x: 200, y: 200 },
     type: 'orgNode',
     data: {
       label: 'Lead Qualification',
       type: 'function',
       hasChildren: false,
       onAdd: () => handleAddWorkflow('func-1')
     }
   };
   ```

#### Expansion/Collapse Logic
```jsx
const OrgStructureFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  // Toggle expansion state of a node
  const handleToggle = useCallback((nodeId) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          // Toggle expanded state
          const newExpanded = !node.data.expanded;
          
          return {
            ...node,
            data: {
              ...node.data,
              expanded: newExpanded
            }
          };
        }
        return node;
      })
    );
    
    // Update visible nodes based on expansion state
    updateVisibleNodes();
  }, [setNodes]);
  
  // Update which nodes are visible based on expansion state
  const updateVisibleNodes = useCallback(() => {
    const visibleNodeIds = new Set();
    const nodeMap = new Map(nodes.map(node => [node.id, node]));
    
    // Function to recursively collect visible nodes
    const collectVisibleNodes = (nodeId) => {
      visibleNodeIds.add(nodeId);
      const node = nodeMap.get(nodeId);
      
      if (node && node.data.expanded) {
        // Find child edges
        const childEdges = edges.filter(edge => edge.source === nodeId);
        // Add children to visible nodes
        childEdges.forEach(edge => collectVisibleNodes(edge.target));
      }
    };
    
    // Start with root nodes (nodes without parents)
    const rootNodes = nodes.filter(node => !edges.some(edge => edge.target === node.id));
    rootNodes.forEach(node => collectVisibleNodes(node.id));
    
    // Update nodes visibility
    setNodes(nodes.map(node => ({
      ...node,
      hidden: !visibleNodeIds.has(node.id)
    })));
  }, [nodes, edges, setNodes]);
  
  // Add new node (department, role, or function)
  const handleAdd = useCallback((parentId, type) => {
    const newId = `${type}-${Date.now()}`;
    const parentNode = nodes.find(node => node.id === parentId);
    
    if (!parentNode) return;
    
    // Create new node
    const newNode = {
      id: newId,
      type: 'orgNode',
      position: {
        x: parentNode.position.x + 50,
        y: parentNode.position.y + 100
      },
      data: {
        label: `New ${type}`,
        type,
        expanded: false,
        hasChildren: type !== 'function',
        onToggle: type !== 'function' ? () => handleToggle(newId) : undefined,
        onAdd: type === 'department' 
          ? () => handleAdd(newId, 'role')
          : type === 'role' 
            ? () => handleAdd(newId, 'function')
            : () => handleAddWorkflow(newId)
      }
    };
    
    // Create edge from parent to new node
    const newEdge = {
      id: `e-${parentId}-${newId}`,
      source: parentId,
      target: newId
    };
    
    setNodes(nds => [...nds, newNode]);
    setEdges(eds => [...eds, newEdge]);
    
    // Update parent to show it has children
    setNodes(nds => nds.map(node => {
      if (node.id === parentId) {
        return {
          ...node,
          data: {
            ...node.data,
            hasChildren: true,
            expanded: true
          }
        };
      }
      return node;
    }));
    
    // Update visible nodes
    updateVisibleNodes();
  }, [nodes, setNodes, setEdges, handleToggle, updateVisibleNodes]);
  
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={{ orgNode: OrgStructureNode }}
      fitView
    >
      <Background />
      <Controls />
    </ReactFlow>
  );
};
```

### 2. Workflow Builder Interface

#### Node Types
1. **Business Function Nodes**
   ```jsx
   const BusinessFunctionNode = memo(({ data, isConnectable }) => {
     return (
       <div className="business-function-node">
         <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
         <div className="node-content">
           <h3>{data.label}</h3>
           <p>{data.description}</p>
           {data.aiSuggestions && <AISuggestionsPanel suggestions={data.aiSuggestions} />}
         </div>
         <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
       </div>
     );
   });
   ```

2. **AI Processing Nodes**
   ```jsx
   const AIProcessingNode = memo(({ data, isConnectable }) => {
     return (
       <div className="ai-processing-node">
         <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
         <div className="node-content">
           <AIConfigPanel config={data.aiConfig} />
           <ProcessingOptions options={data.options} />
         </div>
         <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
       </div>
     );
   });
   ```

3. **Integration Nodes**
   ```jsx
   const IntegrationNode = memo(({ data, isConnectable }) => {
     return (
       <div className="integration-node">
         <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
         <div className="node-content">
           <IntegrationConfig service={data.service} />
           <ConnectionStatus status={data.status} />
         </div>
         <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
       </div>
     );
   });
   ```

### 3. Edge Customization

```jsx
const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style = {},
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
      <path
        id={id}
        style={{
          ...style,
          strokeWidth: data.isActive ? 2 : 1,
          stroke: data.hasError ? 'var(--destructive)' : 'var(--primary)',
        }}
        className="react-flow__edge-path"
        d={edgePath}
      />
      {data?.label && (
        <EdgeLabel
          x={(sourceX + targetX) / 2}
          y={(sourceY + targetY) / 2}
          label={data.label}
        />
      )}
    </>
  );
};
```

### 4. Workflow Controls

```jsx
const WorkflowControls = () => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  
  return (
    <div className="workflow-controls">
      <Button onClick={() => zoomIn()}>Zoom In</Button>
      <Button onClick={() => zoomOut()}>Zoom Out</Button>
      <Button onClick={() => fitView()}>Fit View</Button>
      <WorkflowValidationButton />
      <AIAssistantButton />
    </div>
  );
};
```

### 5. State Management

```jsx
const WorkflowBuilder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeDragStop = useCallback((event, node) => {
    saveNodePosition(node);
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeDragStop={onNodeDragStop}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
    >
      <Background />
      <Controls />
      <MiniMap />
      <WorkflowControls />
    </ReactFlow>
  );
};
```

### 6. AI Integration

```jsx
const useAIAssistant = () => {
  const { getNodes, getEdges, addNodes } = useReactFlow();

  const suggestNextNode = async (currentNodeId) => {
    const nodes = getNodes();
    const edges = getEdges();
    const currentNode = nodes.find(n => n.id === currentNodeId);

    const suggestion = await getAISuggestion({
      currentNode,
      workflow: { nodes, edges },
    });

    if (suggestion) {
      addNodes(createNodeFromSuggestion(suggestion));
    }
  };

  return { suggestNextNode };
};
```

### 7. Integration Between Org Structure and Workflows

```jsx
// Link a function node to a workflow
const handleAddWorkflow = useCallback((functionId) => {
  // Get the function node
  const functionNode = nodes.find(node => node.id === functionId);
  
  if (!functionNode) return;
  
  // Create a new workflow or link to existing one
  const workflowId = createNewWorkflow({
    name: `${functionNode.data.label} Workflow`,
    functionId
  });
  
  // Navigate to workflow builder
  navigate(`/workflow-builder/${workflowId}`);
}, [nodes, navigate]);

// Get workflows for a specific function
const getFunctionWorkflows = (functionId) => {
  return workflows.filter(workflow => workflow.functionId === functionId);
};
```

## Styling Integration

### 1. Tailwind CSS Integration

```css
/* styles/react-flow.css */
.react-flow__node {
  @apply rounded-lg border bg-card text-card-foreground shadow-sm;
}

.react-flow__node-businessFunction {
  @apply bg-primary text-primary-foreground;
}

.react-flow__node-aiProcessing {
  @apply bg-secondary text-secondary-foreground;
}

.react-flow__node-integration {
  @apply bg-accent text-accent-foreground;
}

.react-flow__handle {
  @apply bg-primary border-2 border-background;
}
```

### 2. Dark Mode Support

```jsx
const WorkflowBuilder = ({ theme }) => {
  return (
    <div className={theme}>
      <ReactFlow
        className={cn(
          "workflow-builder",
          theme === "dark" ? "dark-theme" : "light-theme"
        )}
        // ... other props
      >
        {/* ... children */}
      </ReactFlow>
    </div>
  );
};
```

## Performance Optimizations

### 1. Node Virtualization

```jsx
const WorkflowBuilder = () => {
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={true}
      maxZoom={2}
      minZoom={0.5}
      defaultViewport={{ x: 0, y: 0, zoom: 1 }}
    />
  );
};
```

### 2. Lazy Loading

```jsx
const nodeTypes = {
  businessFunction: lazy(() => import('./nodes/BusinessFunctionNode')),
  aiProcessing: lazy(() => import('./nodes/AIProcessingNode')),
  integration: lazy(() => import('./nodes/IntegrationNode')),
};
```

## Testing Considerations

```jsx
describe('WorkflowBuilder', () => {
  it('allows connecting compatible nodes', () => {
    const { getByTestId } = render(<WorkflowBuilder />);
    // Test node connections
  });

  it('validates workflow before saving', () => {
    // Test workflow validation
  });

  it('integrates with AI suggestions', () => {
    // Test AI integration
  });
});
```

## Best Practices

1. **Node Management**
   - Use consistent node sizing
   - Implement clear node categories
   - Maintain node state efficiently

2. **Edge Handling**
   - Validate connections
   - Provide visual feedback
   - Handle edge updates gracefully

3. **Performance**
   - Implement virtualization
   - Use lazy loading
   - Optimize re-renders

4. **AI Integration**
   - Asynchronous suggestions
   - Graceful error handling
   - Clear feedback mechanisms 
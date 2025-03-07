# Code Organization Patterns

## Overview

This document outlines the code organization patterns and best practices for the FlowForge project. Following these patterns will ensure that our codebase remains maintainable, testable, and scalable as it grows.

The patterns described here are designed to address the ESLint rules we've established, particularly:
- `max-lines-per-function`: 15 lines
- `max-lines`: 500 lines
- `complexity`: 5
- `max-depth`: 2
- `max-nested-callbacks`: 2

## Core Principles

1. **Separation of Concerns**: Separate UI components, state management, business logic, and data fetching
2. **Single Responsibility**: Each function and component should have a single responsibility
3. **Small Functions**: Keep functions small and focused (under 15 lines)
4. **Clear Naming**: Use descriptive names for files, functions, and variables
5. **Consistent Documentation**: Document all functions, components, and modules

## Directory Structure

```
frontend/
├── src/
│   ├── components/         # UI components
│   │   ├── ComponentName/  # Complex components with multiple files
│   │   │   ├── ComponentName.js           # Main component
│   │   │   ├── ComponentNameDialogs.js    # Dialog components
│   │   │   ├── eventHandlers.js           # Event handler functions
│   │   │   └── nodeOperations.js          # Business logic operations
│   ├── hooks/              # Custom React hooks
│   │   ├── useComponentNameState.js       # State management hooks
│   ├── utils/              # Utility functions
│   │   ├── componentNameUtils.js          # Component-specific utilities
│   ├── pages/              # Page components
│   │   ├── PageName.js                    # Main page component
│   │   ├── PageNameComponents.js          # Page-specific UI components
│   │   ├── pageNameOperations.js          # Page-specific operations
│   ├── services/           # Service modules
│   │   ├── apiService.js                  # API service
│   │   ├── elkLayoutService.js            # ELK layout service
```

## Component Organization Pattern

For large components (over 100 lines), follow this organization pattern:

### 1. State Management with Custom Hooks

Create a custom hook to manage all state for the component:

```javascript
// hooks/useComponentNameState.js
import { useState } from 'react';

export const useComponentNameState = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  // ... other state variables
  
  return {
    data,
    setData,
    loading,
    setLoading,
    // ... other state variables and setters
  };
};
```

### 2. Data Fetching and Business Logic

Extract data fetching and business logic into separate files:

```javascript
// components/ComponentName/componentNameOperations.js
import { apiFunction } from '../../api/apiModule';

export const fetchData = async ({
  setLoading,
  setError,
  setData
}) => {
  try {
    setLoading(true);
    const data = await apiFunction();
    setData(data);
    return data;
  } catch (err) {
    setError('Error message');
    throw err;
  } finally {
    setLoading(false);
  }
};
```

### 3. Event Handlers

Extract event handlers into a separate file:

```javascript
// components/ComponentName/eventHandlers.js
import { fetchData } from './componentNameOperations';

export const createEventHandlers = ({
  setLoading,
  setError,
  setData
  // ... other state setters
}) => {
  const handleFetchData = async () => {
    await fetchData({
      setLoading,
      setError,
      setData
    });
  };
  
  // ... other event handlers
  
  return {
    handleFetchData,
    // ... other handlers
  };
};
```

### 4. UI Components

Extract UI components into a separate file:

```javascript
// components/ComponentName/ComponentNameComponents.js
import React from 'react';

export const SubComponent = ({
  data,
  onAction
}) => {
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};
```

### 5. Main Component

The main component should be thin and primarily compose the extracted pieces:

```javascript
// components/ComponentName/ComponentName.js
import React, { useEffect } from 'react';
import { useComponentNameState } from '../../hooks/useComponentNameState';
import { createEventHandlers } from './eventHandlers';
import { SubComponent } from './ComponentNameComponents';

const ComponentName = () => {
  const {
    data,
    setData,
    loading,
    setLoading,
    // ... other state
  } = useComponentNameState();
  
  const {
    handleFetchData,
    // ... other handlers
  } = createEventHandlers({
    setData,
    setLoading,
    // ... other state setters
  });
  
  useEffect(() => {
    handleFetchData();
  }, []);
  
  return (
    <div>
      <SubComponent
        data={data}
        onAction={handleAction}
      />
      {/* Other components */}
    </div>
  );
};

export default ComponentName;
```

## Function Organization

1. **Keep functions small**: Each function should do one thing and do it well
2. **Use descriptive names**: Function names should clearly describe what they do
3. **Use JSDoc comments**: Document all functions with JSDoc comments
4. **Use parameter objects**: For functions with many parameters, use a single object parameter
5. **Return early**: Use early returns to reduce nesting

Example:

```javascript
/**
 * Fetches data from the API and updates state
 * @param {Object} params - Parameters for fetching data
 * @param {Function} params.setLoading - Function to update loading state
 * @param {Function} params.setError - Function to update error state
 * @param {Function} params.setData - Function to update data state
 * @returns {Promise<Array>} The fetched data
 */
export const fetchData = async ({
  setLoading,
  setError,
  setData
}) => {
  try {
    setLoading(true);
    setError(null);
    const data = await apiFunction();
    setData(data);
    return data;
  } catch (err) {
    console.error('Error fetching data:', err);
    setError('Failed to load data. Please try again.');
    throw err;
  } finally {
    setLoading(false);
  }
};
```

## Component Props

1. **Use destructuring**: Destructure props in the function parameters
2. **Use default values**: Provide default values for optional props
3. **Document props**: Use JSDoc to document component props
4. **Use prop types**: Consider using PropTypes or TypeScript for type checking

Example:

```javascript
/**
 * Component description
 * @param {Object} props - Component props
 * @param {Array} props.data - Data to display
 * @param {boolean} [props.loading=false] - Whether data is loading
 * @param {Function} props.onAction - Function to call when action is performed
 * @returns {JSX.Element} Component JSX
 */
export const Component = ({
  data,
  loading = false,
  onAction
}) => {
  // Component implementation
};
```

## State Management

1. **Use custom hooks**: Extract state management into custom hooks
2. **Group related state**: Group related state variables together
3. **Use reducers for complex state**: Consider using useReducer for complex state
4. **Minimize state**: Only keep necessary data in state

Example:

```javascript
export const useFormState = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };
  
  // ... other form handling functions
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    // ... other functions
  };
};
```

## Examples from Our Codebase

### OrgStructureFlow Component

We've successfully refactored the `OrgStructureFlow` component by breaking it down into:

1. **Custom hooks** in `hooks/useOrgStructureState.js`
2. **Utility functions** in `utils/orgStructureUtils.js`
3. **Dialog components** in `components/OrgStructure/OrgStructureDialogs.js`
4. **Node operations** in `components/OrgStructure/nodeOperations.js`
5. **Event handlers** in `components/OrgStructure/eventHandlers.js`

### OrgStructurePage Component

Similarly, we've refactored the `OrgStructurePage` component into:

1. **Custom hook** in `hooks/useOrgStructurePageState.js`
2. **Data fetching operations** in `pages/orgStructurePageOperations.js`
3. **Search operations** in `pages/searchOperations.js`
4. **UI components** in `pages/OrgStructurePageComponents.js`

## ELK.js for Organizational Hierarchy Visualization

We've integrated ELK.js (Eclipse Layout Kernel for JavaScript) to improve the visualization of complex organizational hierarchies. This integration follows our code organization patterns:

### 1. Service-Based Approach

We've created a dedicated service for ELK layout calculations:

```javascript
// services/elkLayoutService.js
import ELK from 'elkjs/lib/elk.bundled.js';

class ElkLayoutService {
  constructor() {
    this.elk = new ELK();
  }
  
  // Methods for layout calculations
}

// Export singleton instance
const elkLayoutServiceInstance = new ElkLayoutService();
export default elkLayoutServiceInstance;
```

### 2. Breaking Down Complex Functions

To comply with our ESLint rules, we've broken down complex layout functions into smaller, focused functions:

```javascript
// Instead of one large function
processNode(node, elkGraph, parentId) {
  // 30+ lines of code
}

// We use multiple smaller functions
createElkNode(node) {
  // 10 lines of code
}

createElkEdge(parentId, childId) {
  // 5 lines of code
}

processNode(node, elkGraph, parentId) {
  const elkNode = this.createElkNode(node);
  elkGraph.children.push(elkNode);
  
  if (parentId) {
    elkGraph.edges.push(this.createElkEdge(parentId, node.id));
  }
  
  this.processNodeChildren(node, elkGraph);
}

processNodeChildren(node, elkGraph) {
  // 10 lines of code
}
```

### 3. Dual-Mode Layout Approach

We've implemented a dual-mode approach to layout:

```javascript
// In useOrgStructureState.js
const [layoutMode, setLayoutMode] = useState('automatic');

// Apply layout based on mode
const applyLayout = useCallback(async (structure, direction, force = false) => {
  // Skip layout calculation if in manual mode and not forced
  if (layoutMode === 'manual' && !force) {
    return;
  }
  
  // Calculate layout using ELK
  const layoutResult = await layoutService.calculateLayout(structure, direction);
  
  // Update state
  setNodes(flowNodes);
  setEdges(flowEdges);
}, [layoutMode, layoutService]);

// Switch to manual mode when dragging starts
const handleNodeDragStart = useCallback(() => {
  setLayoutMode('manual');
}, []);

// Reset to automatic mode
const resetLayout = useCallback(() => {
  setLayoutMode('automatic');
  applyLayout(orgStructure, layoutDirection, true);
}, [orgStructure, layoutDirection, applyLayout]);
```

### 4. Debugging Capabilities

We've added debugging capabilities to help diagnose layout issues:

```javascript
// In elkLayoutService.js
async calculateLayout(orgStructure, direction = 'TB', debug = false) {
  // Enable debugging if requested
  if (debug) {
    elkGraph.layoutOptions['elk.logging'] = 'true';
    elkGraph.layoutOptions['elk.measureExecutionTime'] = 'true';
  }
  
  // Calculate layout
  const layoutedGraph = await this.elk.layout(elkGraph);
  
  // Log debugging information
  if (debug && layoutedGraph.logging) {
    console.log('ELK layout logging:', layoutedGraph.logging);
  }
}
```

### 5. Preventing Loading Loops

We've implemented several mechanisms to prevent loading loops:

```javascript
// In useOrgStructureState.js
// Ref to track layout calculation in progress
const isCalculatingRef = useRef(false);

// Ref to store the last structure that was laid out
const lastStructureRef = useRef(null);

const applyLayout = useCallback(async (structure, direction, force = false) => {
  // Skip if already calculating
  if (isCalculatingRef.current) {
    return;
  }
  
  // Set flag to prevent multiple calculations
  isCalculatingRef.current = true;
  
  // Store the structure being laid out
  lastStructureRef.current = structureCopy;
  
  try {
    // Calculate layout
    const layoutResult = await layoutService.calculateLayout(structureCopy, direction);
    
    // Skip updating if another calculation has started
    if (lastStructureRef.current !== structureCopy) {
      return;
    }
    
    // Update state
    setNodes(flowNodes);
    setEdges(flowEdges);
  } finally {
    // Reset flag
    isCalculatingRef.current = false;
  }
}, [layoutService]);
```

### 6. Integration with React Flow

We've integrated ELK with React Flow to provide a seamless user experience:

```javascript
// In OrgStructureFlow.js
<ReactFlow
  nodes={nodes}
  edges={edges}
  nodeTypes={nodeTypes}
  onNodesChange={onNodesChange}
  onEdgesChange={onEdgesChange}
  onNodeDragStart={onNodeDragStart}
  onNodeDrag={onNodeDrag}
  onNodeDragStop={onNodeDragStop}
  nodesDraggable={true}
  panOnDrag={[1, 2]}
  panOnScroll={true}
  selectNodesOnDrag={false}
>
  {/* UI controls for layout modes */}
  <Panel position="top-right">
    {layoutMode === 'manual' && (
      <Button onClick={resetLayout} title="Reset to Automatic Layout">
        <RotateCcw />
      </Button>
    )}
    <div className="layout-mode-indicator">
      {layoutMode === 'automatic' ? 'Auto Layout' : 'Manual Layout'}
    </div>
  </Panel>
</ReactFlow>
```

By following these patterns, we've created a robust and maintainable integration of ELK.js with React Flow that provides excellent visualization capabilities for complex organizational hierarchies.

## Conclusion

Following these patterns will help ensure that our codebase remains maintainable, testable, and scalable. It will also help us meet our ESLint requirements for function size and complexity.

Remember:
- Small, focused functions
- Clear separation of concerns
- Consistent documentation
- Descriptive naming

By adhering to these patterns, we can create a codebase that is easy to understand, modify, and extend. 

## Dagre and React Flow

### Dagre

[Dagre](https://github.com/dagrejs/dagre) is not a replacement for React Flow, but rather a complementary library that can work with it. Here's the distinction:

- **Dagre**: A JavaScript library for directed graph layout. It's focused on calculating positions for nodes and edges in a graph, but doesn't provide the actual rendering components. It's essentially a layout algorithm.

- **React Flow**: A complete React component library for building node-based editors and interactive diagrams. It provides the UI components, interactions, and state management for your graph.

### How They Can Work Together

React Flow can use Dagre as a layout engine. In fact, this is a common pattern:

1. You use React Flow for the interactive UI components, drag-and-drop functionality, and state management
2. You use Dagre as the automatic layout algorithm to position your nodes and edges in an organized way

This combination is perfect for your organizational chart because:

1. React Flow gives you the interactive UI elements you need
2. Dagre can automatically arrange your departments, roles, and functions in a hierarchical layout

### Implementation Approach

Rather than replacing your current code, I'd recommend enhancing it by adding Dagre as a layout engine for React Flow. Here's how you might approach it:

1. Install both libraries:
```bash
npm install reactflow dagre
```

2. Use Dagre to calculate the layout, and React Flow to render it:

```javascript
import ReactFlow from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';

// This function uses dagre to calculate node positions
const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction });

  // Add nodes to dagre
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 172, height: 36 });
  });

  // Add edges to dagre
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Calculate layout
  dagre.layout(dagreGraph);

  // Apply calculated positions to nodes
  return {
    nodes: nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      return {
        ...node,
        position: {
          x: nodeWithPosition.x - 86,
          y: nodeWithPosition.y - 18,
        }
      };
    }),
    edges
  };
};

// Your component
const OrgStructureFlow = ({ initialDepartments }) => {
  // Convert your department data to nodes and edges
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    // Convert initialDepartments to nodes and edges
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      // Your nodes derived from initialDepartments
      // Your edges derived from initialDepartments
    );
    
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [initialDepartments]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      fitView
    />
  );
};
```

### Benefits of This Approach

1. **Automatic Layout**: Dagre will automatically position your nodes in a hierarchical structure
2. **Interactive UI**: React Flow provides all the interactive elements (drag, zoom, click)
3. **Customizable**: You can still use your custom node components for departments, roles, and functions
4. **Maintainable**: The separation of layout (Dagre) and rendering (React Flow) makes the code more maintainable

### Conclusion

Using Dagre with React Flow is an excellent approach for your organizational chart visualization. Rather than replacing your current code, it would enhance it by providing automatic layout capabilities while maintaining all the interactive features you've already implemented.

This approach aligns perfectly with your specification that mentions:
- "The organizational chart will be implemented using React Flow"
- "Expandable/collapsible nodes for departments"
- "Visual hierarchy showing departments, roles, and functions"
- "Interactive elements for adding new departments, roles, or functions"
- "Drag-and-drop capabilities for reorganizing the structure"

Would you like me to help you integrate Dagre with your existing React Flow implementation? 
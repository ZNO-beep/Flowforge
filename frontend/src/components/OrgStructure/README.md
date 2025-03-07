# Organizational Structure Components

This directory contains components for visualizing and managing organizational hierarchies using React Flow and ELK.js.

## Components

### OrgStructureFlow

`OrgStructureFlow.js` is the main component for visualizing organizational hierarchies. It uses React Flow for rendering and ELK.js for layout calculations. Key features:

- **Dual-mode layout**: Supports both automatic (ELK-calculated) and manual (user-defined) layout modes
- **Interactive visualization**: Allows dragging nodes, zooming, and panning
- **Node operations**: Add, edit, and delete nodes in the hierarchy
- **Expandable/collapsible nodes**: Toggle visibility of child nodes

### OrgStructureNodes

`OrgStructureNodes.js` defines custom node components for different types of organizational entities:

- **OrganizationNode**: Root node for the organization
- **DepartmentNode**: Department nodes with badges showing child count
- **RoleNode**: Role nodes with responsibility badges
- **TaskNode**: Task nodes for specific responsibilities
- **OrgNode**: Generic node that renders the appropriate node type based on data

### OrgStructureDialogs

`OrgStructureDialogs.js` contains dialog components for node operations:

- **AddNodeDialog**: Dialog for adding new nodes
- **EditNodeDialog**: Dialog for editing existing nodes
- **DeleteNodeDialog**: Dialog for confirming node deletion

## Layout Modes

The OrgStructureFlow component supports two layout modes:

### Automatic Layout Mode

In automatic layout mode:
- ELK.js calculates the optimal layout for the organizational hierarchy
- Nodes are positioned according to the layout algorithm
- Layout is recalculated when the structure changes (add, edit, delete nodes)
- Layout is recalculated when nodes are expanded or collapsed

### Manual Layout Mode

In manual layout mode:
- User can drag nodes to custom positions
- Node positions are preserved during structure changes
- Layout is not automatically recalculated
- User can reset to automatic layout using the reset button

The system automatically switches to manual layout mode when a user drags a node, and displays a "Manual Layout" indicator in the UI. The user can switch back to automatic layout by clicking the reset button.

## Integration with ELK.js

The components use ELK.js for layout calculations through the `elkLayoutService`:

```javascript
// In OrgStructureFlow.js
import elkLayoutService from '../../services/elkLayoutService';

// Pass the service to the hook
const {
  // ... state and handlers
} = useOrgStructureState({
  initialStructure,
  businessName,
  layoutDirection,
  onStructureChange,
  layoutService: elkLayoutService
});
```

The `useOrgStructureState` hook uses the service to calculate layouts:

```javascript
// In useOrgStructureState.js
const applyLayout = useCallback(async (structure, direction, force = false) => {
  // Skip if in manual mode and not forced
  if (layoutMode === 'manual' && !force) return;
  
  // Calculate layout using ELK
  const layoutResult = await layoutService.calculateLayout(structure, direction);
  
  // Update state with the calculated layout
  setNodes(flowNodes);
  setEdges(flowEdges);
}, [layoutMode, layoutService]);
```

## Node Dragging

Node dragging is implemented using React Flow's built-in dragging capabilities, with custom handlers to update the organizational structure:

```javascript
// In OrgStructureFlow.js
const onNodeDragStart = useCallback((event, node) => {
  handleNodeDragStart();
}, [handleNodeDragStart]);

const onNodeDrag = useCallback((event, node) => {
  console.log('Node dragging:', node.id, node.position);
}, []);

const onNodeDragStop = useCallback((event, node) => {
  handleNodePositionChange(node);
}, [handleNodePositionChange]);
```

The `handleNodePositionChange` function updates the node position in the organizational structure:

```javascript
// In useOrgStructureState.js
const handleNodePositionChange = useCallback((node) => {
  // Update the node position in the structure
  const updateNodePosition = (structure) => {
    if (structure.id === node.id) {
      return { ...structure, position: node.position };
    }
    
    if (structure.children) {
      return {
        ...structure,
        children: structure.children.map(updateNodePosition)
      };
    }
    
    return structure;
  };
  
  // Create a deep copy of the structure
  const updatedStructure = updateNodePosition(orgStructure);
  
  // Update the structure
  setOrgStructure(updatedStructure);
}, [orgStructure]);
```

## Usage

```jsx
import OrgStructureFlow from '../components/OrgStructure/OrgStructureFlow';

// In your component
<OrgStructureFlow
  initialStructure={orgStructure}
  businessName="My Company"
  layoutDirection="TB"
  onStructureChange={handleStructureChange}
/>
```

## Props

### OrgStructureFlow

- `initialStructure`: Initial organizational structure
- `businessName`: Business name for sample structure
- `layoutDirection`: Direction of the layout ('TB' for top-to-bottom, 'LR' for left-to-right)
- `onStructureChange`: Callback when structure changes

## References

- [ELK.js Documentation](https://www.eclipse.dev/elk/documentation.html)
- [React Flow Documentation](https://reactflow.dev/docs/) 
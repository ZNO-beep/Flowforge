# ELK.js Integration for Organizational Hierarchy Visualization

## Overview

This document describes the integration of ELK.js (Eclipse Layout Kernel for JavaScript) into our application for visualizing complex organizational hierarchies. ELK.js provides advanced layout algorithms that significantly improve the visualization of hierarchical structures compared to other layout engines like Dagre.

## Why ELK.js?

### Limitations of Previous Approach

Our previous implementation using React Flow with Dagre had several limitations:

1. **Limited Layout Algorithms**: Dagre is primarily designed for directed acyclic graphs and struggled with deep hierarchical structures.
2. **Spacing Issues**: Even with adjustments to spacing parameters, the layout appeared compressed.
3. **Performance Concerns**: For larger organizational charts, Dagre did not scale well.

### Benefits of ELK.js

1. **Specialized Layout Algorithms**: ELK includes the "layered" algorithm that's particularly suited for hierarchical structures with an inherent direction and explicit attachment points.
2. **Better Handling of Complex Hierarchies**: ELK was designed to handle complex node-link diagrams with deep hierarchies.
3. **Configurable Layout Options**: ELK provides extensive configuration options for fine-tuning layouts.
4. **Web Worker Support**: ELK can run layouts in a web worker to avoid blocking the main thread.
5. **Wide Industry Adoption**: Used by many projects including Sprotty, reactflow, and Eclipse tools.

## Implementation Details

### Architecture

The ELK.js integration follows a service-based architecture:

```
frontend/
├── src/
│   ├── services/
│   │   ├── elkLayoutService.js    # ELK layout service
│   ├── hooks/
│   │   ├── useOrgStructureState.js # State management with ELK integration
│   ├── components/
│   │   ├── OrgStructure/
│   │   │   ├── OrgStructureFlow.js # React Flow component with ELK
│   │   │   ├── OrgStructureNodes.js # Node components
```

### Key Components

1. **ElkLayoutService**: A singleton service that handles:
   - Converting organizational structure to ELK graph format
   - Applying ELK's layout algorithms to calculate optimal positions
   - Converting the results back to React Flow format
   - Debugging and performance monitoring

2. **useOrgStructureState Hook**: Enhanced to:
   - Support both automatic and manual layout modes
   - Use async/await for layout calculations
   - Apply ELK layout to the organizational structure
   - Provide functions for node dragging and position updates
   - Prevent loading loops and unnecessary recalculations

3. **OrgStructureFlow Component**: Modified to:
   - Use the ELK layout service
   - Support both automatic and manual layout modes
   - Handle node dragging properly
   - Provide UI controls for switching between layout modes
   - Display the current layout mode

4. **OrgStructureNodes Component**: Adapted to:
   - Work with the new data structure from ELK
   - Support proper node dragging
   - Prevent event propagation issues

### Layout Modes

Our implementation supports two layout modes:

1. **Automatic Layout Mode**: 
   - ELK calculates the layout automatically
   - Nodes are positioned according to the layout algorithm
   - Used for initial layout and after structural changes

2. **Manual Layout Mode**:
   - Activated when a user drags a node
   - Preserves user-defined node positions
   - Prevents automatic recalculation of layout
   - Can be reset back to automatic mode

### Data Flow

1. **Initialization**:
   - The organizational structure is loaded from the service or created as a sample
   - The structure is passed to the ELK layout service for initial layout calculation
   - The calculated layout is converted to React Flow format and rendered

2. **User Interactions**:
   - When a user adds, edits, or removes a node, the structure is updated
   - The updated structure is passed to the ELK layout service for recalculation
   - The new layout is applied to the React Flow component

3. **Node Dragging**:
   - When a user drags a node, the system switches to manual layout mode
   - The node position is updated directly in the structure
   - The layout is not recalculated, preserving user-defined positions
   - The user can reset to automatic layout mode if desired

## ELK Configuration

### Layout Options

ELK provides extensive layout options that can be configured to achieve the desired visual appearance. Here are the key options we use:

```javascript
getDefaultLayoutOptions() {
  return {
    'algorithm': 'layered',
    'elk.direction': 'DOWN',
    // Spacing options
    'elk.layered.spacing.nodeNodeBetweenLayers': '100',
    'elk.spacing.nodeNode': '80',
    'elk.padding': '[top=50,left=50,bottom=50,right=50]',
    
    // Layering strategy - determines how nodes are assigned to layers
    'elk.layered.layering.strategy': 'NETWORK_SIMPLEX', // Better for hierarchical structures
    
    // Node placement strategy - determines how nodes are positioned within layers
    'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF', // Better for hierarchical layouts
    'elk.layered.nodePlacement.favorStraightEdges': 'true', // Favor straight edges
    
    // Crossing minimization - reduces edge crossings
    'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
    
    // Edge routing - determines how edges are routed
    'elk.edgeRouting': 'ORTHOGONAL', // Use orthogonal edge routing
    'elk.layered.unnecessaryBendpoints': 'true', // Remove unnecessary bendpoints
    
    // Spacing fine-tuning
    'elk.layered.spacing.edgeNodeBetweenLayers': '40', // Space between edges and nodes
    'elk.layered.spacing.edgeEdgeBetweenLayers': '20', // Space between edges
    
    // Component handling
    'elk.separateConnectedComponents': 'false', // Keep connected components together
    'elk.layered.compaction.connectedComponents': 'true', // Compact connected components
    
    // Aspect ratio
    'elk.aspectRatio': '1.6', // Control the aspect ratio
    
    // Stability - helps maintain mental map when layout changes
    'elk.randomSeed': '1' // Use consistent seed for deterministic layouts
  };
}
```

### Debugging Capabilities

Our implementation includes debugging capabilities to help diagnose layout issues:

```javascript
async calculateLayout(orgStructure, direction = 'TB', debug = false) {
  // Enable debugging if requested
  if (debug) {
    elkGraph.layoutOptions['elk.logging'] = 'true';
    elkGraph.layoutOptions['elk.measureExecutionTime'] = 'true';
  }
  
  // Calculate layout
  const layoutedGraph = await this.elk.layout(elkGraph);
  
  // Log debugging information if available
  if (debug && layoutedGraph.logging) {
    console.log('ELK layout logging:', layoutedGraph.logging);
    
    if (layoutedGraph.executionTime) {
      console.log('ELK execution time:', layoutedGraph.executionTime, 'seconds');
    }
  }
}
```

## Usage Guidelines

### Basic Usage

The ELK layout service is integrated into the `OrgStructureFlow` component and is used automatically:

```jsx
<OrgStructureFlow 
  initialStructure={orgStructure} 
  businessName={businessInfo?.name || 'My Company'}
  layoutDirection={layoutDirection}
  onStructureChange={handleStructureChange}
/>
```

### Layout Configuration

The ELK layout can be configured by modifying the default layout options in the `elkLayoutService.js` file.

### Manual Layout Mode

The system automatically switches to manual layout mode when a user drags a node. This mode can be identified by the "Manual Layout" indicator in the UI. To reset to automatic layout mode, click the reset button (circular arrow icon).

### Debugging

To enable debugging, pass `true` as the third parameter to the `calculateLayout` method:

```javascript
await layoutService.calculateLayout(structure, direction, true);
```

This will enable logging and execution time measurement, which can help diagnose layout issues.

## Performance Considerations

1. **Large Hierarchies**: For very large organizational structures (100+ nodes), consider:
   - Implementing pagination or virtualization
   - Using the Web Worker version of ELK.js
   - Limiting the depth of visible nodes

2. **Layout Calculation**: Layout calculation is an expensive operation:
   - Use manual layout mode for fine-tuning positions
   - Avoid unnecessary recalculations
   - Show loading indicators during layout calculations

## Troubleshooting

### Loading Loop

If you experience a loading loop (spinner never disappears):

1. Check the console for errors
2. Verify that the layout calculation is completing successfully
3. Ensure that the `isLoading` state is being properly reset
4. Try switching to manual layout mode

### Node Dragging Issues

If nodes are not draggable:

1. Verify that `nodesDraggable={true}` is set in the ReactFlow component
2. Check that the node components are not preventing event propagation
3. Ensure that the `draggable` property is set on the nodes
4. Try using the `panOnDrag` and `selectNodesOnDrag` options

## References

- [ELK.js GitHub Repository](https://github.com/kieler/elkjs)
- [ELK Layout Options](https://www.eclipse.dev/elk/reference.html)
- [ELK Documentation](https://www.eclipse.dev/elk/documentation.html)
- [React Flow Documentation](https://reactflow.dev/docs/) 
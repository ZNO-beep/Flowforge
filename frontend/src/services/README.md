# Services

This directory contains service modules that provide functionality to the application. Services are responsible for handling business logic, data fetching, and other operations that are not directly related to UI components.

## Available Services

### OrgStructureService

`orgStructureService.js` provides methods for loading, saving, and generating organizational structures. It includes:

- `loadOrgStructure`: Loads the organizational structure from local storage or a mock API
- `saveOrgStructure`: Saves the organizational structure to local storage or a mock API
- `generateOrgStructure`: Generates an organizational structure using AI based on business information
- `validateOrgStructure`: Validates the organizational structure against a schema

### ElkLayoutService

`elkLayoutService.js` provides methods for calculating layout for organizational hierarchies using ELK.js (Eclipse Layout Kernel for JavaScript). It includes:

- `calculateLayout`: Calculates layout for an organizational structure using ELK's advanced algorithms
- `convertToElkGraph`: Converts an organizational structure to ELK graph format
- `convertToReactFlow`: Converts ELK layout results to React Flow format
- `getDefaultLayoutOptions`: Provides configurable layout options for ELK
- Debugging capabilities for diagnosing layout issues

## Usage Guidelines

### ElkLayoutService

The ELK layout service is designed to be used with React Flow for visualizing complex hierarchical structures. It provides superior layout capabilities compared to other layout engines like Dagre.

#### Basic Usage

```javascript
import elkLayoutService from '../services/elkLayoutService';

// Calculate layout
const layoutResult = await elkLayoutService.calculateLayout(orgStructure, 'TB');

// Convert to React Flow format
const { nodes, edges } = elkLayoutService.convertToReactFlow(layoutResult);

// Use nodes and edges with React Flow
<ReactFlow nodes={nodes} edges={edges} />
```

#### Layout Modes

The ELK layout service supports two layout modes:

1. **Automatic Layout Mode**:
   - ELK calculates the layout automatically
   - Nodes are positioned according to the layout algorithm
   - Used for initial layout and after structural changes

2. **Manual Layout Mode**:
   - Activated when a user drags a node
   - Preserves user-defined node positions
   - Prevents automatic recalculation of layout

To implement these modes, use the `applyLayout` function with a force parameter:

```javascript
// Apply layout in automatic mode (respects layoutMode)
await applyLayout(structure, direction);

// Force layout calculation even in manual mode
await applyLayout(structure, direction, true);
```

#### Configuration

The ELK layout can be configured by modifying the default layout options:

```javascript
// Default layout options
const defaultOptions = elkLayoutService.getDefaultLayoutOptions();

// Custom layout options
const customOptions = {
  ...defaultOptions,
  'elk.layered.spacing.nodeNodeBetweenLayers': '150',
  'elk.spacing.nodeNode': '100'
};

// Calculate layout with custom options
const layoutResult = await elkLayoutService.calculateLayout(
  orgStructure, 
  'TB', 
  false, // debug mode
  customOptions // custom options
);
```

#### Layout Direction

The layout direction can be specified as 'TB' (top-to-bottom) or 'LR' (left-to-right):

```javascript
// Top-to-bottom layout
const verticalLayout = await elkLayoutService.calculateLayout(orgStructure, 'TB');

// Left-to-right layout
const horizontalLayout = await elkLayoutService.calculateLayout(orgStructure, 'LR');
```

#### Debugging

To enable debugging, pass `true` as the third parameter to the `calculateLayout` method:

```javascript
// Enable debugging
const layoutResult = await elkLayoutService.calculateLayout(orgStructure, 'TB', true);
```

This will enable logging and execution time measurement, which can help diagnose layout issues.

## Implementation Details

The services in this directory follow these implementation patterns:

1. **Singleton Pattern**: Services are implemented as singleton instances to ensure consistent state across the application.

2. **Method Decomposition**: Complex methods are broken down into smaller, focused functions to improve maintainability and comply with ESLint rules.

3. **Async/Await Pattern**: Asynchronous operations use the async/await pattern for better readability and error handling.

4. **Error Handling**: All methods include proper error handling with informative error messages.

5. **Documentation**: All methods are documented with JSDoc comments to provide clear usage guidelines.

## References

- [ELK.js GitHub Repository](https://github.com/kieler/elkjs)
- [ELK Layout Options](https://www.eclipse.dev/elk/reference.html)
- [ELK Documentation](https://www.eclipse.dev/elk/documentation.html)
- [React Flow Documentation](https://reactflow.dev/docs/) 
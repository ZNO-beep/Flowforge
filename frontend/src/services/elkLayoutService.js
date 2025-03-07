import ELK from 'elkjs/lib/elk.bundled.js';

/**
 * ELK layout service for organizational hierarchy visualization
 * Provides methods to calculate layout using ELK's advanced algorithms
 * 
 * This service uses the Eclipse Layout Kernel (ELK) to calculate optimal layouts
 * for organizational hierarchies. It supports both automatic and manual layout modes,
 * and provides debugging capabilities to help diagnose layout issues.
 * 
 * @see https://www.eclipse.dev/elk/documentation.html
 */
class ElkLayoutService {
  /**
   * Create a new ELK layout service instance
   */
  constructor() {
    this.elk = new ELK();
  }

  /**
   * Create default layout options for ELK
   * 
   * These options are configured based on the ELK documentation to provide
   * optimal layouts for organizational hierarchies. They can be customized
   * for specific use cases.
   * 
   * @returns {Object} Default layout options
   * @see https://www.eclipse.dev/elk/reference.html
   */
  getDefaultLayoutOptions() {
    return {
      'algorithm': 'layered',
      'elk.direction': 'DOWN',
      
      // Spacing options - increased for better visibility
      'elk.layered.spacing.nodeNodeBetweenLayers': '120', // Increased vertical spacing between layers
      'elk.spacing.nodeNode': '100',                      // Increased horizontal spacing between nodes
      'elk.padding': '[top=80,left=80,bottom=80,right=80]', // Increased padding around the entire graph
      
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
      'elk.layered.spacing.edgeNodeBetweenLayers': '50', // Increased space between edges and nodes
      'elk.layered.spacing.edgeEdgeBetweenLayers': '30', // Increased space between edges
      
      // Component handling
      'elk.separateConnectedComponents': 'false', // Keep connected components together
      'elk.layered.compaction.connectedComponents': 'true', // Compact connected components
      
      // Aspect ratio
      'elk.aspectRatio': '1.6', // Control the aspect ratio
      
      // Stability - helps maintain mental map when layout changes
      'elk.randomSeed': '1', // Use consistent seed for deterministic layouts
      
      // Centering and alignment
      'elk.alignment': 'CENTER', // Center nodes within their container
      'elk.layered.crossingMinimization.forceNodeModelOrder': 'false', // Allow reordering for better layout
      'elk.layered.cycleBreaking.strategy': 'DEPTH_FIRST', // Better for hierarchical structures
      'elk.layered.thoroughness': '7', // Higher thoroughness for better layout quality (default is 7)
      'elk.hierarchyHandling': 'INCLUDE_CHILDREN', // Include children in layout calculations
      'elk.partitioning.activate': 'true' // Activate partitioning for better layout
    };
  }

  /**
   * Convert organizational structure to ELK graph format
   * 
   * This method follows the architecture described in ELK documentation:
   * 1. Extract graph data from the organizational structure
   * 2. Create a properly structured ELK graph
   * 3. Configure layout options
   * 
   * @param {Object} orgStructure - Organizational structure to convert
   * @param {Object} [options] - Conversion options
   * @param {boolean} [options.debug=false] - Enable debug logging
   * @returns {Object} ELK graph
   * @see https://eclipse.dev/elk/documentation/tooldevelopers/usingeclipselayout.html
   */
  convertToElkGraph(orgStructure, options = {}) {
    const { debug = false } = options;
    
    // Validate input structure
    if (!this.isValidStructure(orgStructure)) {
      console.warn('ELK service: Invalid organizational structure:', orgStructure);
      return this.createEmptyElkGraph();
    }

    // Start timing for performance measurement
    const startTime = performance.now();
    
    // Step 1: Create the root graph object
    const elkGraph = this.createRootElkGraph();
    
    // Step 2: Process nodes recursively to build the graph
    this.processNode(orgStructure, elkGraph, null);
    
    // Step 3: Apply additional layout configurations if needed
    this.finalizeElkGraph(elkGraph);
    
    // Log statistics if debug is enabled
    if (debug) {
      const endTime = performance.now();
      console.debug(
        `ELK service: Converted org structure to ELK graph in ${(endTime - startTime).toFixed(2)}ms. ` +
        `Nodes: ${elkGraph.children.length}, Edges: ${elkGraph.edges.length}`
      );
    }

    return elkGraph;
  }
  
  /**
   * Validate organizational structure
   * 
   * Checks if the structure is valid for conversion to ELK graph.
   * 
   * @param {Object} structure - Structure to validate
   * @returns {boolean} True if structure is valid
   */
  isValidStructure(structure) {
    return (
      structure && 
      typeof structure === 'object' && 
      structure.id && 
      typeof structure.id === 'string'
    );
  }
  
  /**
   * Create an empty ELK graph
   * 
   * Used as a fallback when the input structure is invalid.
   * 
   * @returns {Object} Empty ELK graph
   */
  createEmptyElkGraph() {
    return {
      id: 'root',
      layoutOptions: this.getDefaultLayoutOptions(),
      children: [],
      edges: []
    };
  }
  
  /**
   * Create the root ELK graph
   * 
   * The root graph represents the drawing area and contains all nodes and edges.
   * 
   * @returns {Object} Root ELK graph
   */
  createRootElkGraph() {
    return {
      id: 'root',
      layoutOptions: this.getDefaultLayoutOptions(),
      children: [],
      edges: []
    };
  }
  
  /**
   * Finalize ELK graph before layout calculation
   * 
   * Performs any final adjustments to the graph before layout calculation.
   * 
   * @param {Object} elkGraph - ELK graph to finalize
   */
  finalizeElkGraph(elkGraph) {
    // Add any final adjustments to the graph here
    // For example, you might want to add additional layout options
    // based on the graph structure
    
    // Count nodes and edges for potential optimizations
    const nodeCount = elkGraph.children.length;
    const edgeCount = elkGraph.edges.length;
    
    // For larger graphs, adjust spacing to prevent overlaps
    if (nodeCount > 10) {
      elkGraph.layoutOptions['elk.spacing.nodeNode'] = '50';
    }
    
    // For dense graphs, increase edge spacing
    if (edgeCount > nodeCount * 1.5) {
      elkGraph.layoutOptions['elk.spacing.edgeEdge'] = '15';
      elkGraph.layoutOptions['elk.spacing.edgeNode'] = '25';
    }
  }

  /**
   * Create an ELK node from an org structure node
   * 
   * This method creates an ELK node following the official ELK JSON format.
   * It handles different node types with appropriate styling and dimensions.
   * 
   * @param {Object} node - Org structure node
   * @returns {Object} ELK node
   * @see https://eclipse.dev/elk/documentation/tooldevelopers/graphdatastructure/jsonformat.html
   */
  createElkNode(node) {
    if (!node || !node.id) {
      console.warn('ELK service: Cannot create node from invalid data:', node);
      return null;
    }
    
    // Get node dimensions and styling based on type
    const { width, height, padding } = this.getNodeDimensions(node);
    
    // Create the ELK node object with base properties
    const elkNode = {
      id: node.id,
      width,
      height,
      layoutOptions: this.getNodeLayoutOptions(node)
    };
    
    // Add labels according to ELK JSON format
    elkNode.labels = this.createNodeLabels(node, width);
    
    // If the node already has a position, use it (for manual layout)
    if (node.position) {
      elkNode.x = node.position.x;
      elkNode.y = node.position.y;
    }
    
    // Store original node data in a property that won't affect ELK layout
    elkNode.properties = {
      orgData: {
        name: node.name || '',
        type: node.type || 'default',
        description: node.description || '',
        isExpanded: node.isExpanded !== undefined ? node.isExpanded : true,
        responsibilities: node.responsibilities || [],
        childCount: node.children ? node.children.length : 0
      }
    };
    
    return elkNode;
  }
  
  /**
   * Get node dimensions based on node type
   * 
   * Different node types have different dimensions and styling.
   * 
   * @param {Object} node - Org structure node
   * @returns {Object} Node dimensions and padding
   */
  getNodeDimensions(node) {
    // Base dimensions
    let width = 250;
    let height = 100;
    let padding = 10;
    
    // Adjust dimensions based on node type
    switch (node.type) {
      case 'organization':
        width = 280;
        height = 120;
        padding = 15;
        break;
      case 'department':
        width = 260;
        height = 110;
        padding = 12;
        break;
      case 'role':
        width = 240;
        height = 100;
        padding = 10;
        break;
      case 'task':
        width = 220;
        height = 90;
        padding = 8;
        break;
      default:
        // Use default dimensions
    }
    
    // Adjust dimensions based on content if available
    if (node.name && node.name.length > 20) {
      width = Math.max(width, node.name.length * 10);
    }
    
    return { width, height, padding };
  }
  
  /**
   * Get node-specific layout options
   * 
   * Different node types may have different layout options.
   * 
   * @param {Object} node - Org structure node
   * @returns {Object} Node layout options
   */
  getNodeLayoutOptions(node) {
    const options = {
      'nodeLabels.placement': '[H_CENTER, V_CENTER]'
    };
    
    // Add padding based on node type
    const { padding } = this.getNodeDimensions(node);
    options['elk.padding'] = `[top=${padding},left=${padding},bottom=${padding},right=${padding}]`;
    
    // Add specific options based on node type
    switch (node.type) {
      case 'organization':
        // Root nodes might need special handling
        options['priority'] = '10';
        break;
      case 'department':
        // Departments should be aligned well
        options['alignment'] = 'CENTER';
        break;
      default:
        // No special options
    }
    
    return options;
  }
  
  /**
   * Create node labels
   * 
   * @param {Object} node - Org structure node
   * @param {number} nodeWidth - Width of the node
   * @returns {Array} Array of ELK labels
   */
  createNodeLabels(node, nodeWidth) {
    return [{
      id: `${node.id}-label`,
      text: node.name || 'Unnamed Node',
      width: nodeWidth * 0.8, // Label width as percentage of node width
      height: 20 // Fixed height for label
    }];
  }

  /**
   * Create an ELK edge between parent and child
   * 
   * This method creates an ELK edge following the official ELK JSON format.
   * It handles different edge types with appropriate styling and routing.
   * 
   * @param {string} parentId - Parent node ID
   * @param {string} childId - Child node ID
   * @param {Object} [options] - Edge options
   * @param {string} [options.type='parent-child'] - Type of relationship
   * @returns {Object} ELK edge
   * @see https://eclipse.dev/elk/documentation/tooldevelopers/graphdatastructure/jsonformat.html
   */
  createElkEdge(parentId, childId, options = {}) {
    if (!parentId || !childId) {
      console.warn('ELK service: Cannot create edge with invalid IDs:', { parentId, childId });
      return null;
    }
    
    const { type = 'parent-child' } = options;
    
    // Create the base edge object
    const elkEdge = {
      id: `e_${parentId}_${childId}`,
      sources: [parentId],
      targets: [childId],
      layoutOptions: this.getEdgeLayoutOptions(type)
    };
    
    // Store relationship information
    elkEdge.properties = {
      relationship: type,
      sourceId: parentId,
      targetId: childId
    };
    
    return elkEdge;
  }
  
  /**
   * Get edge-specific layout options
   * 
   * Different edge types may have different layout options.
   * 
   * @param {string} relationshipType - Type of relationship
   * @returns {Object} Edge layout options
   */
  getEdgeLayoutOptions(relationshipType) {
    const options = {
      'edgeRouting': 'ORTHOGONAL',
      'edgeThickness': '2'
    };
    
    // Add specific options based on relationship type
    switch (relationshipType) {
      case 'parent-child':
        // Standard hierarchical relationship
        options['priority'] = '1';
        break;
      case 'cross-department':
        // Cross-department relationships might need different styling
        options['edgeRouting'] = 'SPLINES';
        options['priority'] = '0';
        break;
      default:
        // No special options
    }
    
    return options;
  }

  /**
   * Process a node and its children recursively
   * 
   * This method creates an ELK node for the given org structure node,
   * adds it to the graph, creates an edge if it has a parent,
   * and processes its children recursively.
   * 
   * @param {Object} node - Current node from org structure
   * @param {Object} elkGraph - ELK graph being built
   * @param {string|null} parentId - ID of parent node (null for root)
   * @returns {Object|null} The created ELK node or null if creation failed
   */
  processNode(node, elkGraph, parentId) {
    if (!node || !node.id) {
      console.warn('ELK service: Invalid node in processNode:', node);
      return null;
    }

    // Create ELK node
    const elkNode = this.createElkNode(node);
    if (!elkNode) {
      console.warn('ELK service: Failed to create ELK node for:', node);
      return null;
    }

    // Add node to graph
    elkGraph.children.push(elkNode);

    // If this node has a parent, create an edge
    if (parentId) {
      const edge = this.createElkEdge(parentId, node.id);
      if (edge) {
        elkGraph.edges.push(edge);
      }
    }

    // Process children if they exist and node is expanded
    if (this.shouldProcessChildren(node)) {
      this.processNodeChildren(node, elkGraph);
    }
    
    return elkNode;
  }

  /**
   * Check if node children should be processed
   * 
   * @param {Object} node - Node to check
   * @returns {boolean} True if children should be processed
   */
  shouldProcessChildren(node) {
    return (
      node && 
      node.children && 
      Array.isArray(node.children) && 
      node.children.length > 0 && 
      node.isExpanded !== false
    );
  }

  /**
   * Process children of a node
   * 
   * This method processes all children of a node if the node is expanded.
   * 
   * @param {Object} node - Parent node from org structure
   * @param {Object} elkGraph - ELK graph being built
   */
  processNodeChildren(node, elkGraph) {
    if (!this.shouldProcessChildren(node)) {
      return;
    }
    
    // Process each child
    node.children.forEach((childNode, index) => {
      if (!childNode) {
        console.warn('ELK service: Invalid child node found in:', node);
        return;
      }
      
      // Process the child node
      const elkChildNode = this.processNode(childNode, elkGraph, node.id);
      
      // If this is not the first child, create edges between siblings for better layout
      if (index > 0 && elkChildNode) {
        this.createSiblingEdges(node.children, index, elkGraph);
      }
    });
  }
  
  /**
   * Create edges between siblings for better layout
   * 
   * This method creates invisible edges between siblings to improve layout.
   * These edges are not rendered but help ELK position nodes better.
   * 
   * @param {Array} children - Array of sibling nodes
   * @param {number} currentIndex - Index of the current child
   * @param {Object} elkGraph - ELK graph being built
   */
  createSiblingEdges(children, currentIndex, elkGraph) {
    // Skip if this is the first child
    if (currentIndex <= 0) {
      return;
    }
    
    const currentChild = children[currentIndex];
    const previousChild = children[currentIndex - 1];
    
    // Skip if either child is invalid
    if (!currentChild || !currentChild.id || !previousChild || !previousChild.id) {
      return;
    }
    
    // Create an invisible edge between siblings
    const siblingEdge = {
      id: `sibling_${previousChild.id}_${currentChild.id}`,
      sources: [previousChild.id],
      targets: [currentChild.id],
      layoutOptions: {
        'edgeRouting': 'INVISIBLE',
        'priority': '-1' // Lower priority than regular edges
      },
      properties: {
        relationship: 'sibling',
        invisible: true
      }
    };
    
    elkGraph.edges.push(siblingEdge);
  }

  /**
   * Create a timeout promise that rejects after a specified time
   * 
   * Used to prevent layout calculations from running indefinitely.
   * 
   * @param {number} ms - Timeout in milliseconds
   * @returns {Promise} A promise that rejects after the specified time
   */
  createTimeoutPromise(ms) {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Layout calculation timed out after ${ms/1000} seconds`));
      }, ms);
    });
  }

  /**
   * Perform the actual ELK layout calculation
   * 
   * This method handles the core layout calculation using ELK's API,
   * with a timeout to prevent infinite calculations.
   * 
   * @param {Object} elkGraph - ELK graph to layout
   * @returns {Promise<Object>} Layouted graph
   */
  async performLayoutCalculation(elkGraph) {
    if (!elkGraph || !elkGraph.children || elkGraph.children.length === 0) {
      console.warn('ELK service: Cannot calculate layout for empty graph');
      return elkGraph; // Return the original graph as fallback
    }
    
    console.log(`ELK service: Calculating layout for ${elkGraph.children.length} nodes and ${elkGraph.edges.length} edges`);
    
    try {
      // Create a layout promise
      const layoutPromise = this.elk.layout(elkGraph);
      
      // Create a timeout promise (10 seconds for larger graphs)
      const timeoutMs = Math.min(10000, 2000 + (elkGraph.children.length * 50));
      const timeoutPromise = this.createTimeoutPromise(timeoutMs);
      
      // Race the layout calculation against the timeout
      const layoutedGraph = await Promise.race([layoutPromise, timeoutPromise]);
      
      // Validate the result
      if (!layoutedGraph || !layoutedGraph.children) {
        console.warn('ELK service: Layout calculation returned invalid result', layoutedGraph);
        return elkGraph; // Return the original graph as fallback
      }
      
      console.log(`ELK service: Layout calculation complete for ${layoutedGraph.children.length} nodes`);
      return layoutedGraph;
    } catch (error) {
      console.error('ELK service: Layout calculation failed', error);
      // Return the original graph as fallback
      return elkGraph;
    }
  }

  /**
   * Apply layout to organizational structure
   * 
   * This is the main method for calculating layout using ELK. It coordinates the process of:
   * 1. Converting the organizational structure to ELK format
   * 2. Configuring layout options based on structure and preferences
   * 3. Calculating the layout using the appropriate algorithm
   * 4. Extracting the layout information and applying it to the structure
   * 
   * @param {Object} orgStructure - Organizational structure
   * @param {string} direction - Layout direction ('TB' for top-to-bottom, 'LR' for left-to-right)
   * @param {boolean} debug - Whether to enable debugging (logs and execution time measurement)
   * @param {Object} [customOptions] - Custom layout options to override defaults
   * @param {string} [algorithm='layered'] - Layout algorithm to use ('layered', 'force', 'mrtree', 'radial')
   * @returns {Promise<Object>} Layout information with positions
   */
  async calculateLayout(orgStructure, direction = 'TB', debug = false, customOptions = null, algorithm = 'layered') {
    if (!orgStructure) {
      console.warn('ELK service: Cannot calculate layout for undefined structure');
      return { structure: null, nodePositions: {} };
    }
    
    try {
      // Start timing
      const startTime = performance.now();
      console.log('ELK service: Starting layout calculation', { direction, algorithm });
      
      // Determine the best algorithm based on structure if not specified
      const bestAlgorithm = algorithm || this.determineBestAlgorithm(orgStructure);
      
      // Convert to ELK graph and configure options
      const elkGraph = this.prepareElkGraphForLayout(
        orgStructure, 
        direction, 
        debug, 
        customOptions,
        bestAlgorithm
      );
      
      // Perform layout calculation
      const layoutedGraph = await this.performLayoutCalculation(elkGraph);
      
      // Log performance and debug info
      this.logLayoutResults(layoutedGraph, debug, startTime);
      
      // Extract positions and create result
      return this.extractLayoutInformation(layoutedGraph, orgStructure);
    } catch (error) {
      console.error('ELK layout calculation failed:', error);
      // Return original structure without positions as fallback
      return { structure: orgStructure, nodePositions: {} };
    }
  }
  
  /**
   * Determine the best layout algorithm based on the structure
   * 
   * Different structures may benefit from different layout algorithms.
   * 
   * @param {Object} structure - Organizational structure
   * @returns {string} Best layout algorithm
   */
  determineBestAlgorithm(structure) {
    // Count nodes and determine structure characteristics
    const nodeCount = this.countNodes(structure);
    const maxDepth = this.getMaxDepth(structure);
    const isBalanced = this.isBalancedStructure(structure);
    
    // Choose algorithm based on structure characteristics
    if (nodeCount > 100) {
      // For very large structures, force layout might be faster
      return 'force';
    } else if (maxDepth > 5 && isBalanced) {
      // For deep, balanced hierarchies, mrtree works well
      return 'mrtree';
    } else if (nodeCount < 20 && maxDepth <= 3) {
      // For small structures, radial can look nice
      return 'radial';
    } else {
      // Default to layered for most cases
      return 'layered';
    }
  }
  
  /**
   * Count total nodes in a structure
   * 
   * @param {Object} structure - Organizational structure
   * @returns {number} Total number of nodes
   */
  countNodes(structure) {
    if (!structure) {
      return 0;
    }
    
    let count = 1; // Count the current node
    
    if (structure.children && Array.isArray(structure.children)) {
      structure.children.forEach(child => {
        count += this.countNodes(child);
      });
    }
    
    return count;
  }
  
  /**
   * Get maximum depth of a structure
   * 
   * @param {Object} structure - Organizational structure
   * @param {number} currentDepth - Current depth (for recursion)
   * @returns {number} Maximum depth
   */
  getMaxDepth(structure, currentDepth = 0) {
    if (!structure) {
      return currentDepth;
    }
    
    if (!structure.children || !Array.isArray(structure.children) || structure.children.length === 0) {
      return currentDepth + 1;
    }
    
    return Math.max(...structure.children.map(child => 
      this.getMaxDepth(child, currentDepth + 1)
    ));
  }
  
  /**
   * Check if a structure is balanced
   * 
   * A balanced structure has a similar number of nodes in each branch.
   * 
   * @param {Object} structure - Organizational structure
   * @returns {boolean} True if structure is balanced
   */
  isBalancedStructure(structure) {
    if (!structure || !structure.children || !Array.isArray(structure.children) || structure.children.length <= 1) {
      return true;
    }
    
    const childCounts = structure.children.map(child => this.countNodes(child));
    const avgCount = childCounts.reduce((sum, count) => sum + count, 0) / childCounts.length;
    
    // Check if any child deviates more than 50% from the average
    const isBalanced = childCounts.every(count => 
      Math.abs(count - avgCount) / avgCount < 0.5
    );
    
    return isBalanced;
  }
  
  /**
   * Prepare ELK graph for layout calculation
   * 
   * This method converts the organizational structure to ELK format
   * and configures the layout options.
   * 
   * @param {Object} orgStructure - Organizational structure
   * @param {string} direction - Layout direction ('TB' or 'LR')
   * @param {boolean} debug - Whether to enable debugging
   * @param {Object} customOptions - Custom layout options
   * @param {string} algorithm - Layout algorithm to use
   * @returns {Object} Configured ELK graph
   */
  prepareElkGraphForLayout(orgStructure, direction, debug, customOptions, algorithm) {
    // Convert to ELK graph
    const elkGraph = this.convertToElkGraph(orgStructure);
    
    // Log conversion results
    console.log('ELK service: Converted to ELK graph', { 
      nodeCount: elkGraph.children.length, 
      edgeCount: elkGraph.edges.length 
    });
    
    // Configure layout options
    this.configureLayoutOptions(elkGraph, direction, debug, customOptions, algorithm);
    
    return elkGraph;
  }
  
  /**
   * Configure layout options for ELK graph
   * 
   * This method sets the layout options for the ELK graph,
   * including algorithm, direction, custom options, and debugging.
   * 
   * @param {Object} elkGraph - ELK graph
   * @param {string} direction - Layout direction ('TB' or 'LR')
   * @param {boolean} debug - Whether to enable debugging
   * @param {Object} customOptions - Custom layout options
   * @param {string} algorithm - Layout algorithm to use
   */
  configureLayoutOptions(elkGraph, direction, debug, customOptions, algorithm) {
    // Convert direction from React Flow format to ELK format
    const elkDirection = direction === 'TB' ? 'DOWN' : 'RIGHT';
    
    // Set base layout options
    elkGraph.layoutOptions = {
      ...this.getDefaultLayoutOptions(),
      'elk.direction': elkDirection
    };
    
    // Apply algorithm-specific options
    this.applyAlgorithmOptions(elkGraph, algorithm);
    
    // Apply custom options if provided
    if (customOptions) {
      Object.assign(elkGraph.layoutOptions, customOptions);
    }
    
    // Enable debugging if requested
    if (debug) {
      elkGraph.layoutOptions['elk.logging'] = 'true';
      elkGraph.layoutOptions['elk.measureExecutionTime'] = 'true';
    }
  }
  
  /**
   * Apply algorithm-specific layout options
   * 
   * Different layout algorithms require different options.
   * 
   * @param {Object} elkGraph - ELK graph
   * @param {string} algorithm - Layout algorithm to use
   */
  applyAlgorithmOptions(elkGraph, algorithm) {
    // Set the algorithm
    elkGraph.layoutOptions['elk.algorithm'] = algorithm;
    
    // Apply algorithm-specific options
    switch (algorithm) {
      case 'layered':
        // Layered algorithm (default)
        Object.assign(elkGraph.layoutOptions, {
          'elk.layered.spacing.nodeNodeBetweenLayers': '80',
          'elk.layered.spacing.edgeNodeBetweenLayers': '40',
          'elk.layered.spacing.edgeEdgeBetweenLayers': '30',
          'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
          'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
          'elk.layered.considerModelOrder.strategy': 'NODES_AND_EDGES'
        });
        break;
        
      case 'force':
        // Force-based algorithm
        Object.assign(elkGraph.layoutOptions, {
          'elk.force.iterations': '300',
          'elk.force.repulsion': '2.0',
          'elk.force.attraction': '0.1',
          'elk.spacing.nodeNode': '100'
        });
        break;
        
      case 'mrtree':
        // Mr. Tree algorithm (good for trees)
        Object.assign(elkGraph.layoutOptions, {
          'elk.mrtree.spacing.nodeNode': '40',
          'elk.mrtree.compaction.strategy': 'POLYLINE'
        });
        break;
        
      case 'radial':
        // Radial algorithm
        Object.assign(elkGraph.layoutOptions, {
          'elk.radial.radius': '300',
          'elk.radial.compaction': 'true'
        });
        break;
        
      default:
        // No specific options for unknown algorithms
        break;
    }
    
    // Count nodes to adjust spacing for larger graphs
    const nodeCount = elkGraph.children.length;
    if (nodeCount > 50) {
      elkGraph.layoutOptions['elk.spacing.nodeNode'] = '60';
    } else if (nodeCount > 20) {
      elkGraph.layoutOptions['elk.spacing.nodeNode'] = '40';
    }
  }
  
  /**
   * Log layout calculation results
   * 
   * This method logs performance metrics and debugging information
   * after layout calculation.
   * 
   * @param {Object} layoutedGraph - Layouted ELK graph
   * @param {boolean} debug - Whether debugging is enabled
   * @param {number} startTime - Start time of layout calculation
   */
  logLayoutResults(layoutedGraph, debug, startTime) {
    // Calculate elapsed time
    const endTime = performance.now();
    const elapsedTime = (endTime - startTime).toFixed(2);
    
    console.log(`ELK service: Layout calculation complete in ${elapsedTime}ms`);
    
    // Log debugging information if available
    if (debug && layoutedGraph.logging) {
      console.log('ELK layout logging:', layoutedGraph.logging);
      
      if (layoutedGraph.executionTime) {
        console.log('ELK execution time:', layoutedGraph.executionTime, 'seconds');
      }
    }
  }

  /**
   * Extract layout information from the ELK layout result
   * 
   * This method extracts position information from the layouted ELK graph
   * and applies it to the original organizational structure. It also extracts
   * edge routing information for better visualization.
   * 
   * @param {Object} layoutedGraph - The ELK graph with layout information
   * @param {Object} originalStructure - The original organizational structure
   * @returns {Object} Object containing the updated structure with positions and layout information
   */
  extractLayoutInformation(layoutedGraph, originalStructure) {
    if (!layoutedGraph || !layoutedGraph.children) {
      console.warn('ELK service: Cannot extract layout from invalid graph', layoutedGraph);
      return { structure: originalStructure, nodePositions: {}, edgeRouting: {} };
    }
    
    if (!originalStructure) {
      console.warn('ELK service: Cannot apply layout to invalid structure', originalStructure);
      return { structure: null, nodePositions: {}, edgeRouting: {} };
    }
    
    try {
      // Start timing
      const startTime = performance.now();
      
      // Create maps for node positions and edge routing
      const nodePositions = {};
      const edgeRouting = {};
      
      // Process all nodes in the layouted graph
      this.extractNodePositions(layoutedGraph.children, nodePositions);
      
      // Process all edges in the layouted graph
      if (layoutedGraph.edges && Array.isArray(layoutedGraph.edges)) {
        this.extractEdgeRouting(layoutedGraph.edges, edgeRouting);
      }
      
      // Create a deep copy of the original structure
      const result = JSON.parse(JSON.stringify(originalStructure));
      
      // Apply positions to the original structure
      this.applyPositionsToStructure(result, nodePositions);
      
      // Log timing
      const endTime = performance.now();
      console.debug(`ELK service: Extracted layout information in ${(endTime - startTime).toFixed(2)}ms`);
      
      return {
        structure: result,
        nodePositions,
        edgeRouting,
        layoutAlgorithm: layoutedGraph.layoutOptions?.['elk.algorithm'] || 'unknown'
      };
    } catch (error) {
      console.error('ELK service: Failed to extract layout information', error);
      return { structure: originalStructure, nodePositions: {}, edgeRouting: {} };
    }
  }
  
  /**
   * Extract edge routing information from layouted edges
   * 
   * This method extracts routing information from the layouted edges,
   * including bend points and junction points.
   * 
   * @param {Array} edges - Layouted ELK edges
   * @param {Object} routingMap - Map to store routing information
   */
  extractEdgeRouting(edges, routingMap) {
    if (!edges || !Array.isArray(edges)) {
      return;
    }
    
    edges.forEach(edge => {
      if (!edge || !edge.id || edge.properties?.invisible) {
        return; // Skip invisible edges
      }
      
      const routing = {
        id: edge.id,
        sourceId: edge.properties?.sourceId || edge.sources?.[0],
        targetId: edge.properties?.targetId || edge.targets?.[0],
        bendPoints: [],
        junctionPoints: []
      };
      
      // Extract bend points if available
      if (edge.sections && Array.isArray(edge.sections)) {
        edge.sections.forEach(section => {
          if (section.bendPoints && Array.isArray(section.bendPoints)) {
            routing.bendPoints.push(...section.bendPoints);
          }
          
          // Add start and end points if they exist
          if (section.startPoint) {
            routing.bendPoints.unshift(section.startPoint);
          }
          
          if (section.endPoint) {
            routing.bendPoints.push(section.endPoint);
          }
        });
      }
      
      // Extract junction points if available
      if (edge.junctionPoints && Array.isArray(edge.junctionPoints)) {
        routing.junctionPoints = [...edge.junctionPoints];
      }
      
      // Store routing information
      routingMap[edge.id] = routing;
    });
  }

  /**
   * Extract node positions from layouted graph
   * 
   * This method extracts position information from all nodes in the layouted graph.
   * 
   * @param {Array} nodes - ELK nodes
   * @param {Object} positionsMap - Map to store positions
   */
  extractNodePositions(nodes, positionsMap) {
    if (!Array.isArray(nodes)) {
      console.warn('ELK service: Expected nodes to be an array:', nodes);
      return;
    }
    
    // Process each node
    nodes.forEach(node => {
      if (node) {
        this.extractSingleNodePosition(node, positionsMap);
      }
    });
  }

  /**
   * Extract position for a single node
   * 
   * This method extracts position information from a single node
   * and stores it in the positions map.
   * 
   * @param {Object} node - ELK node
   * @param {Object} positionsMap - Map to store positions
   */
  extractSingleNodePosition(node, positionsMap) {
    // Skip invalid nodes
    if (!node || !node.id) {
      return;
    }
    
    // Extract basic position and dimension information
    this.extractBasicNodePosition(node, positionsMap);
    
    // Process child nodes if any
    if (node.children && Array.isArray(node.children) && node.children.length > 0) {
      this.extractNodePositions(node.children, positionsMap);
    }
  }
  
  /**
   * Extract basic position and dimension information from a node
   * 
   * This method extracts the x, y, width, and height from a node
   * and stores it in the positions map.
   * 
   * @param {Object} node - ELK node
   * @param {Object} positionsMap - Map to store positions
   */
  extractBasicNodePosition(node, positionsMap) {
    // Store position and dimension information
    positionsMap[node.id] = {
      x: typeof node.x === 'number' ? node.x : 0,
      y: typeof node.y === 'number' ? node.y : 0,
      width: typeof node.width === 'number' ? node.width : 150,
      height: typeof node.height === 'number' ? node.height : 50
    };
  }

  /**
   * Apply positions to the original structure
   * 
   * This method applies the extracted positions to the original structure.
   * 
   * @param {Object} structure - Structure to update
   * @param {Object} positionsMap - Map of node positions
   */
  applyPositionsToStructure(structure, positionsMap) {
    if (!structure || !positionsMap) {
      return;
    }
    
    // Add position to current node
    this.applySingleNodePosition(structure, positionsMap);
    
    // Process children recursively
    this.applyPositionsToChildren(structure, positionsMap);
  }
  
  /**
   * Apply positions to children of a node
   * 
   * This method applies positions to all children of a node recursively.
   * 
   * @param {Object} node - Node whose children to process
   * @param {Object} positionsMap - Map of node positions
   */
  applyPositionsToChildren(node, positionsMap) {
    if (!node || !node.children || !Array.isArray(node.children) || node.children.length === 0) {
      return;
    }
    
    // Process each child
    node.children.forEach(child => {
      if (child) {
        this.applyPositionsToStructure(child, positionsMap);
      }
    });
  }

  /**
   * Apply position to a single node
   * 
   * This method applies the position from the positions map to a single node.
   * 
   * @param {Object} node - Node to update
   * @param {Object} positionsMap - Map of node positions
   */
  applySingleNodePosition(node, positionsMap) {
    if (!node || !node.id || !positionsMap || !positionsMap[node.id]) {
      return;
    }
    
    // Apply position
    node.position = {
      x: positionsMap[node.id].x,
      y: positionsMap[node.id].y
    };
    
    // Apply dimensions
    node.dimensions = {
      width: positionsMap[node.id].width,
      height: positionsMap[node.id].height
    };
  }

  /**
   * Convert organizational structure with positions to React Flow nodes and edges
   * 
   * This method converts the layout result from ELK to React Flow format,
   * including node positions, edge routing, and other layout information.
   * 
   * @param {Object} layoutResult - Layout result from calculateLayout
   * @returns {Object} React Flow nodes and edges
   */
  convertToReactFlow(layoutResult) {
    if (!layoutResult || !layoutResult.structure) {
      console.warn('ELK service: Invalid layout result:', layoutResult);
      return { nodes: [], edges: [] };
    }
    
    // Start timing
    const startTime = performance.now();
    
    const nodes = [];
    const edges = [];
    
    // Process the structure recursively to create nodes and edges
    this.processStructureForReactFlow(layoutResult.structure, nodes, edges, null, layoutResult);
    
    // Apply edge routing information if available
    if (layoutResult.edgeRouting) {
      this.applyEdgeRouting(edges, layoutResult.edgeRouting);
    }
    
    // Log timing
    const endTime = performance.now();
    console.debug(
      `ELK service: Converted to React Flow in ${(endTime - startTime).toFixed(2)}ms. ` +
      `Nodes: ${nodes.length}, Edges: ${edges.length}`
    );
    
    return { 
      nodes, 
      edges,
      layoutAlgorithm: layoutResult.layoutAlgorithm || 'unknown'
    };
  }
  
  /**
   * Apply edge routing information to React Flow edges
   * 
   * This method applies routing information from ELK to React Flow edges,
   * including bend points and junction points.
   * 
   * @param {Array} edges - React Flow edges
   * @param {Object} routingMap - Edge routing information
   */
  applyEdgeRouting(edges, routingMap) {
    if (!edges || !Array.isArray(edges) || !routingMap) {
      return;
    }
    
    edges.forEach(edge => {
      if (!edge || !edge.id) {
        return;
      }
      
      const routing = routingMap[edge.id];
      if (!routing) {
        return;
      }
      
      // Apply bend points as waypoints
      if (routing.bendPoints && routing.bendPoints.length > 0) {
        edge.data = {
          ...edge.data,
          waypoints: routing.bendPoints
        };
      }
      
      // Apply junction points
      if (routing.junctionPoints && routing.junctionPoints.length > 0) {
        edge.data = {
          ...edge.data,
          junctionPoints: routing.junctionPoints
        };
      }
    });
  }

  /**
   * Create a React Flow node from an org structure node
   * 
   * This method creates a React Flow node from an organizational structure node,
   * including position, data, and style.
   * 
   * @param {Object} node - Org structure node
   * @returns {Object} React Flow node
   */
  createReactFlowNode(node) {
    if (!node || !node.id) {
      console.warn('ELK service: Invalid node structure for React Flow conversion:', node);
      return null;
    }
    
    return {
      id: node.id,
      type: 'orgNode', // Custom node type
      position: this.getNodePosition(node),
      draggable: true,
      selectable: true,
      connectable: false,
      data: this.createNodeData(node),
      style: this.createNodeStyle(node)
    };
  }
  
  /**
   * Get position for a React Flow node
   * 
   * @param {Object} node - Org structure node
   * @returns {Object} Position object with x and y coordinates
   */
  getNodePosition(node) {
    return node.position || { x: 0, y: 0 };
  }
  
  /**
   * Create data object for a React Flow node
   * 
   * @param {Object} node - Org structure node
   * @returns {Object} Data object for the node
   */
  createNodeData(node) {
    return {
      label: node.name || 'Unnamed Node',
      type: node.type || 'default',
      description: node.description || '',
      isExpanded: node.isExpanded !== undefined ? node.isExpanded : true,
      responsibilities: node.responsibilities || [],
      childCount: node.children ? node.children.length : 0,
      // Event handlers will be set by the component
      onToggleExpand: () => {},
      onAddChild: () => {},
      onEdit: () => {},
      onDelete: () => {}
    };
  }
  
  /**
   * Create style object for a React Flow node
   * 
   * @param {Object} node - Org structure node
   * @returns {Object} Style object for the node
   */
  createNodeStyle(node) {
    return {
      cursor: 'move',
      width: node.dimensions?.width || 150,
      height: node.dimensions?.height || 50
    };
  }

  /**
   * Process structure recursively for React Flow
   * 
   * This method creates React Flow nodes and edges from the organizational structure,
   * processing the structure recursively.
   * 
   * @param {Object} node - Current node
   * @param {Array} nodes - React Flow nodes array
   * @param {Array} edges - React Flow edges array
   * @param {Object} parentNode - Parent node
   * @param {Object} layoutResult - Layout result from calculateLayout
   */
  processStructureForReactFlow(node, nodes, edges, parentNode = null, layoutResult) {
    if (!node) {
      console.warn('ELK service: Invalid node in processStructureForReactFlow');
      return;
    }
    
    // Create React Flow node
    const reactFlowNode = this.createReactFlowNode(node);
    
    // Add node to array if valid
    if (reactFlowNode) {
      nodes.push(reactFlowNode);
      
      // Create edge if there's a parent
      if (parentNode) {
        const edgeType = this.determineEdgeType(node, parentNode);
        const edge = this.createReactFlowEdge(parentNode, node, edgeType, layoutResult);
        if (edge) {
          edges.push(edge);
        }
      }
      
      // Process children recursively
      this.processChildrenForReactFlow(node, nodes, edges, layoutResult);
    }
  }
  
  /**
   * Determine the type of edge between two nodes
   * 
   * Different relationships may require different edge types.
   * 
   * @param {Object} node - Child node
   * @param {Object} parentNode - Parent node
   * @returns {string} Edge type
   */
  determineEdgeType(node, parentNode) {
    // Default edge type
    let edgeType = 'default';
    
    // Check node types to determine edge type
    if (parentNode.type === 'organization' && node.type === 'department') {
      edgeType = 'org-to-dept';
    } else if (parentNode.type === 'department' && node.type === 'role') {
      edgeType = 'dept-to-role';
    } else if (parentNode.type === 'role' && node.type === 'task') {
      edgeType = 'role-to-task';
    }
    
    return edgeType;
  }

  /**
   * Create a React Flow edge between parent and child
   * 
   * This method creates a React Flow edge between two nodes,
   * with appropriate styling and data.
   * 
   * @param {Object} parentNode - Parent node
   * @param {Object} childNode - Child node
   * @param {string} edgeType - Type of edge
   * @param {Object} layoutResult - Layout result from calculateLayout
   * @returns {Object} React Flow edge
   */
  createReactFlowEdge(parentNode, childNode, edgeType = 'default', layoutResult) {
    if (!parentNode || !childNode || !parentNode.id || !childNode.id) {
      console.warn('ELK service: Invalid nodes for edge creation:', { parentNode, childNode });
      return null;
    }
    
    // Create edge ID
    const edgeId = `e_${parentNode.id}_${childNode.id}`;
    
    // Get edge style based on type
    const style = this.getEdgeStyle(edgeType);
    
    // Create the edge
    const edge = {
      id: edgeId,
      source: parentNode.id,
      target: childNode.id,
      type: 'smoothstep',
      style,
      data: {
        edgeType,
        sourceType: parentNode.data?.type,
        targetType: childNode.data?.type
      }
    };
    
    // Add animated property for certain edge types
    if (edgeType === 'role-to-task') {
      edge.animated = true;
    }
    
    return edge;
  }
  
  /**
   * Get edge style based on edge type
   * 
   * Different edge types may have different styles.
   * 
   * @param {string} edgeType - Type of edge
   * @returns {Object} Edge style
   */
  getEdgeStyle(edgeType) {
    // Base style
    const style = {
      strokeWidth: 2
    };
    
    // Apply style based on edge type
    switch (edgeType) {
      case 'org-to-dept':
        style.stroke = '#3b82f6'; // blue-500
        style.strokeWidth = 3;
        break;
      case 'dept-to-role':
        style.stroke = '#10b981'; // emerald-500
        style.strokeWidth = 2;
        break;
      case 'role-to-task':
        style.stroke = '#f59e0b'; // amber-500
        style.strokeWidth = 1.5;
        break;
      default:
        style.stroke = '#94a3b8'; // slate-400
    }
    
    return style;
  }

  /**
   * Process children of a node for React Flow
   * 
   * This method processes all children of a node if the node is expanded,
   * creating edges between the parent and each child.
   * 
   * @param {Object} node - Parent node
   * @param {Array} nodes - React Flow nodes array
   * @param {Array} edges - React Flow edges array
   */
  processChildrenForReactFlow(node, nodes, edges, layoutResult) {
    if (!node) {
      return;
    }
    
    // Only process children if the node is expanded and has children
    if (node.children && Array.isArray(node.children) && node.children.length > 0 && node.isExpanded !== false) {
      node.children.forEach((childNode) => {
        if (childNode) {
          // Pass the parent node to ensure edges are created
          this.processStructureForReactFlow(childNode, nodes, edges, node, layoutResult);
        }
      });
    }
  }
}

// Create and export a singleton instance
const elkLayoutServiceInstance = new ElkLayoutService();
export default elkLayoutServiceInstance; 
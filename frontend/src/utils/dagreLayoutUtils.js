import dagre from 'dagre';

/**
 * Calculates layout positions for nodes and edges using the Dagre algorithm
 * @param {Array} nodes - Array of node objects with id property
 * @param {Array} edges - Array of edge objects with source and target properties
 * @param {string} direction - Direction of the layout ('TB' for top-to-bottom, 'LR' for left-to-right)
 * @param {Object} nodeSize - Size of nodes for layout calculation
 * @param {number} nodeSize.width - Width of nodes
 * @param {number} nodeSize.height - Height of nodes
 * @returns {Object} Object containing positioned nodes and edges
 */
export const getLayoutedElements = (
  nodes, 
  edges, 
  direction = 'TB',
  nodeSize = { width: 180, height: 80 }
) => {
  // Create a new directed graph
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  // Set graph direction and other options
  dagreGraph.setGraph({ 
    rankdir: direction,
    ranker: 'network-simplex',
    marginx: 50,
    marginy: 50,
    nodesep: 80,
    edgesep: 30,
    ranksep: 100
  });

  // Add nodes to the graph with their dimensions
  nodes.forEach((node) => {
    // Use node's dimensions if available, otherwise use default
    const width = node.width || nodeSize.width;
    const height = node.height || nodeSize.height;
    dagreGraph.setNode(node.id, { width, height });
  });

  // Add edges to the graph
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Calculate the layout
  dagre.layout(dagreGraph);

  // Apply the calculated positions to the nodes
  const positionedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    
    // If node is not in the graph, return it unchanged
    if (!nodeWithPosition) {
      return node;
    }
    
    // Center the node based on its dimensions
    const width = node.width || nodeSize.width;
    const height = node.height || nodeSize.height;
    
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - width / 2,
        y: nodeWithPosition.y - height / 2
      }
    };
  });

  return {
    nodes: positionedNodes,
    edges
  };
};

/**
 * Converts department data to React Flow nodes and edges
 * @param {Array} departments - Array of department objects
 * @returns {Object} Object containing nodes and edges for React Flow
 */
export const convertDepartmentsToNodesAndEdges = (departments) => {
  const nodes = [];
  const edges = [];
  
  // Process departments
  departments.forEach((department) => {
    // Add department node
    const departmentId = `dept-${department.id}`;
    nodes.push({
      id: departmentId,
      type: 'departmentNode', // Custom node type
      data: { 
        label: department.name,
        description: department.description,
        type: 'department',
        item: department
      },
      width: 220,
      height: 80
    });
    
    // Process roles if they exist
    if (department.roles && department.roles.length > 0) {
      department.roles.forEach((role) => {
        // Add role node
        const roleId = `role-${role.id}`;
        nodes.push({
          id: roleId,
          type: 'roleNode', // Custom node type
          data: { 
            label: role.name,
            description: role.description,
            type: 'role',
            item: role,
            departmentId: department.id
          },
          width: 200,
          height: 70
        });
        
        // Add edge from department to role
        edges.push({
          id: `${departmentId}-${roleId}`,
          source: departmentId,
          target: roleId,
          type: 'smoothstep'
        });
        
        // Process functions if they exist
        if (role.functions && role.functions.length > 0) {
          role.functions.forEach((func) => {
            // Add function node
            const functionId = `func-${func.id}`;
            nodes.push({
              id: functionId,
              type: 'functionNode', // Custom node type
              data: { 
                label: func.name,
                description: func.description,
                type: 'function',
                item: func,
                roleId: role.id,
                departmentId: department.id
              },
              width: 180,
              height: 60
            });
            
            // Add edge from role to function
            edges.push({
              id: `${roleId}-${functionId}`,
              source: roleId,
              target: functionId,
              type: 'smoothstep'
            });
          });
        }
      });
    }
  });
  
  return { nodes, edges };
};

/**
 * Applies Dagre layout to department data
 * @param {Array} departments - Array of department objects
 * @param {string} direction - Direction of the layout ('TB' for top-to-bottom, 'LR' for left-to-right)
 * @returns {Object} Object containing positioned nodes and edges for React Flow
 */
export const getLayoutedDepartments = (departments, direction = 'TB') => {
  // Convert departments to nodes and edges
  const { nodes, edges } = convertDepartmentsToNodesAndEdges(departments);
  
  // Apply layout
  return getLayoutedElements(nodes, edges, direction);
}; 
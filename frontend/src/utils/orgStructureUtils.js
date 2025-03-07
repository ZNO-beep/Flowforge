/**
 * Utility functions for organizational structure components
 */

import {
  getRolesByDepartment,
  getFunctionsByRole,
} from '../api/organization';

/**
 * Creates a department node with event handlers
 * @param {Object} dept - Department data
 * @param {number} index - Index for positioning
 * @param {Object} handlers - Event handlers
 * @returns {Object} Node object for React Flow
 */
export const createDepartmentNode = (dept, index, handlers) => {
  const { handleToggleExpand, handleAddChild, handleDeleteNode, handleEditNode } = handlers;
  
  return {
    id: `dept-${dept.id}`,
    type: 'orgNode',
    position: { x: 250, y: index * 150 },
    data: {
      label: dept.name,
      description: dept.description || '',
      type: 'department',
      expanded: false,
      onToggleExpand: () => handleToggleExpand(`dept-${dept.id}`),
      onAddChild: () => handleAddChild(`dept-${dept.id}`),
      onDelete: () => handleDeleteNode(`dept-${dept.id}`),
      onEdit: () => handleEditNode(`dept-${dept.id}`),
      apiId: dept.id
    },
  };
};

/**
 * Creates a role node with event handlers
 * @param {Object} role - Role data
 * @param {number} index - Index for positioning
 * @param {Object} parentNode - Parent node for positioning
 * @param {number} totalItems - Total number of items for positioning
 * @param {Object} handlers - Event handlers
 * @returns {Object} Node object for React Flow
 */
export const createRoleNode = (role, index, parentNode, totalItems, handlers) => {
  const { handleToggleExpand, handleAddChild, handleDeleteNode, handleEditNode } = handlers;
  
  return {
    id: `role-${role.id}`,
    type: 'orgNode',
    position: { 
      x: parentNode.position.x + (index - totalItems / 2) * 150, 
      y: parentNode.position.y + 150 
    },
    data: {
      label: role.name,
      description: role.description || '',
      type: 'role',
      expanded: false,
      onToggleExpand: () => handleToggleExpand(`role-${role.id}`),
      onAddChild: () => handleAddChild(`role-${role.id}`),
      onDelete: () => handleDeleteNode(`role-${role.id}`),
      onEdit: () => handleEditNode(`role-${role.id}`),
      apiId: role.id
    },
  };
};

/**
 * Creates a function node with event handlers
 * @param {Object} func - Function data
 * @param {number} index - Index for positioning
 * @param {Object} parentNode - Parent node for positioning
 * @param {number} totalItems - Total number of items for positioning
 * @param {Object} handlers - Event handlers
 * @returns {Object} Node object for React Flow
 */
export const createFunctionNode = (func, index, parentNode, totalItems, handlers) => {
  const { handleDeleteNode, handleEditNode } = handlers;
  
  return {
    id: `func-${func.id}`,
    type: 'orgNode',
    position: { 
      x: parentNode.position.x + (index - totalItems / 2) * 150, 
      y: parentNode.position.y + 150 
    },
    data: {
      label: func.name,
      description: func.description || '',
      type: 'function',
      expanded: false,
      onToggleExpand: () => {},
      onAddChild: () => {},
      onDelete: () => handleDeleteNode(`func-${func.id}`),
      onEdit: () => handleEditNode(`func-${func.id}`),
      apiId: func.id
    },
  };
};

/**
 * Updates node expanded state
 * @param {string} nodeId - ID of the node to toggle
 * @param {Object} expandedNodes - Current expanded state
 * @param {Function} setExpandedNodes - Function to update expanded state
 * @param {Function} setNodes - Function to update nodes
 * @returns {boolean} New expanded state for the node
 */
export const toggleNodeExpanded = (nodeId, expandedNodes, setExpandedNodes, setNodes) => {
  let newExpandedState = false;
  
  setExpandedNodes(prev => {
    const newState = { ...prev, [nodeId]: !prev[nodeId] };
    newExpandedState = newState[nodeId];
    
    // Update nodes with new expanded state
    setNodes(nds => 
      nds.map(node => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              expanded: newState[nodeId],
            },
          };
        }
        return node;
      })
    );
    
    return newState;
  });
  
  return newExpandedState;
};

/**
 * Fetches and creates role nodes for a department
 * @param {Object} node - Department node
 * @param {Function} setNodes - Function to update nodes
 * @param {Function} setEdges - Function to update edges
 * @param {Function} setExpandedNodes - Function to update expanded state
 * @param {Object} handlers - Event handlers
 * @returns {Promise<void>}
 */
export const fetchAndCreateRoleNodes = async (node, setNodes, setEdges, setExpandedNodes, handlers) => {
  const apiId = node.data.apiId;
  const nodeId = node.id;
  
  // Fetch roles for this department
  const roles = await getRolesByDepartment(apiId);
  
  if (roles && roles.length > 0) {
    // Create role nodes
    const roleNodes = roles.map((role, index) => 
      createRoleNode(role, index, node, roles.length, handlers)
    );
    
    // Create edges from department to roles
    const roleEdges = roles.map(role => ({
      id: `e-${nodeId}-role-${role.id}`,
      source: nodeId,
      target: `role-${role.id}`,
    }));
    
    // Add new nodes and edges
    setNodes(nds => [...nds, ...roleNodes]);
    setEdges(eds => [...eds, ...roleEdges]);
    
    // Initialize expanded state for new nodes
    setExpandedNodes(prev => {
      const newState = { ...prev };
      roleNodes.forEach(node => {
        newState[node.id] = false;
      });
      return newState;
    });
  }
};

/**
 * Fetches and creates function nodes for a role
 * @param {Object} node - Role node
 * @param {Function} setNodes - Function to update nodes
 * @param {Function} setEdges - Function to update edges
 * @param {Function} setExpandedNodes - Function to update expanded state
 * @param {Object} handlers - Event handlers
 * @returns {Promise<void>}
 */
export const fetchAndCreateFunctionNodes = async (node, setNodes, setEdges, setExpandedNodes, handlers) => {
  const apiId = node.data.apiId;
  const nodeId = node.id;
  
  // Fetch functions for this role
  const functions = await getFunctionsByRole(apiId);
  
  if (functions && functions.length > 0) {
    // Create function nodes
    const functionNodes = functions.map((func, index) => 
      createFunctionNode(func, index, node, functions.length, handlers)
    );
    
    // Create edges from role to functions
    const functionEdges = functions.map(func => ({
      id: `e-${nodeId}-func-${func.id}`,
      source: nodeId,
      target: `func-${func.id}`,
    }));
    
    // Add new nodes and edges
    setNodes(nds => [...nds, ...functionNodes]);
    setEdges(eds => [...eds, ...functionEdges]);
    
    // Initialize expanded state for new nodes
    setExpandedNodes(prev => {
      const newState = { ...prev };
      functionNodes.forEach(node => {
        newState[node.id] = false;
      });
      return newState;
    });
  }
};

/**
 * Utility functions for handling organizational structure hierarchy
 */

/**
 * Adds a node to the hierarchy
 * @param {Object} structure - The current hierarchy structure
 * @param {string} parentId - The ID of the parent node
 * @param {Object} newNode - The new node to add
 * @returns {Object} The updated hierarchy structure
 */
export const addNodeToHierarchy = (structure, parentId, newNode) => {
  // If this is the parent node, add the new node to its children
  if (structure.id === parentId) {
    return {
      ...structure,
      children: [...(structure.children || []), newNode]
    };
  }
  
  // If this node has no children, return it unchanged
  if (!structure.children || structure.children.length === 0) {
    return structure;
  }
  
  // Otherwise, recursively search through children
  return {
    ...structure,
    children: structure.children.map(child => 
      addNodeToHierarchy(child, parentId, newNode)
    )
  };
};

/**
 * Updates a node in the hierarchy
 * @param {Object} structure - The current hierarchy structure
 * @param {string} nodeId - The ID of the node to update
 * @param {Object} updatedData - The updated data for the node
 * @returns {Object} The updated hierarchy structure
 */
export const updateNodeInHierarchy = (structure, nodeId, updatedData) => {
  // If this is the node to update
  if (structure.id === nodeId) {
    return {
      ...structure,
      ...updatedData,
      // Preserve children if they exist
      children: structure.children || []
    };
  }
  
  // If this node has no children, return it unchanged
  if (!structure.children || structure.children.length === 0) {
    return structure;
  }
  
  // Otherwise, recursively search through children
  return {
    ...structure,
    children: structure.children.map(child => 
      updateNodeInHierarchy(child, nodeId, updatedData)
    )
  };
};

/**
 * Removes a node from the hierarchy
 * @param {Object} structure - The current hierarchy structure
 * @param {string} nodeId - The ID of the node to remove
 * @returns {Object} The updated hierarchy structure
 */
export const removeNodeFromHierarchy = (structure, nodeId) => {
  // If this node has no children, return it unchanged
  if (!structure.children || structure.children.length === 0) {
    return structure;
  }
  
  // Filter out the node to remove from children
  const updatedChildren = structure.children.filter(child => child.id !== nodeId);
  
  // Recursively remove from remaining children
  const processedChildren = updatedChildren.map(child => 
    removeNodeFromHierarchy(child, nodeId)
  );
  
  return {
    ...structure,
    children: processedChildren
  };
};

/**
 * Finds a node in the hierarchy
 * @param {Object} structure - The current hierarchy structure
 * @param {string} nodeId - The ID of the node to find
 * @returns {Object|null} The found node or null if not found
 */
export const findNodeInHierarchy = (structure, nodeId) => {
  // If this is the node we're looking for
  if (structure.id === nodeId) {
    return structure;
  }
  
  // If this node has no children, the target is not here
  if (!structure.children || structure.children.length === 0) {
    return null;
  }
  
  // Search through children
  for (const child of structure.children) {
    const found = findNodeInHierarchy(child, nodeId);
    if (found) {
      return found;
    }
  }
  
  // Not found in this branch
  return null;
};

/**
 * Converts a hierarchical structure to React Flow nodes and edges
 * @param {Object} structure - The hierarchical structure
 * @param {Object} options - Options for conversion
 * @param {string} options.parentId - The ID of the parent node (for recursion)
 * @param {number} options.x - The x position for layout
 * @param {number} options.y - The y position for layout
 * @param {number} options.horizontalSpacing - Horizontal spacing between nodes
 * @param {number} options.verticalSpacing - Vertical spacing between nodes
 * @returns {Object} Object containing nodes and edges arrays for React Flow
 */
export const convertHierarchyToFlow = (
  structure, 
  options = { 
    parentId: null, 
    x: 0, 
    y: 0, 
    horizontalSpacing: 250, 
    verticalSpacing: 100 
  }
) => {
  const nodes = [];
  const edges = [];
  
  // Create node for current item
  const currentNode = {
    id: structure.id,
    type: structure.type || 'default',
    position: { x: options.x, y: options.y },
    data: { 
      ...structure,
      childCount: structure.children ? structure.children.length : 0
    }
  };
  
  nodes.push(currentNode);
  
  // Create edge from parent if it exists
  if (options.parentId) {
    edges.push({
      id: `${options.parentId}-${structure.id}`,
      source: options.parentId,
      target: structure.id,
      type: 'smoothstep'
    });
  }
  
  // Process children if they exist and the node is expanded
  if (structure.children && structure.children.length > 0 && structure.isExpanded !== false) {
    // Calculate total width needed for children
    const totalChildrenWidth = (structure.children.length - 1) * options.horizontalSpacing;
    
    // Calculate starting position for children
    const childStartX = options.x - (totalChildrenWidth / 2);
    const childY = options.y + options.verticalSpacing;
    
    // Process each child
    structure.children.forEach((child, index) => {
      const childX = childStartX + (index * options.horizontalSpacing);
      
      // Recursively convert child and its descendants
      const { nodes: childNodes, edges: childEdges } = convertHierarchyToFlow(
        child,
        {
          parentId: structure.id,
          x: childX,
          y: childY,
          horizontalSpacing: options.horizontalSpacing,
          verticalSpacing: options.verticalSpacing
        }
      );
      
      // Add child nodes and edges to result
      nodes.push(...childNodes);
      edges.push(...childEdges);
    });
  }
  
  return { nodes, edges };
};

/**
 * Validates if a connection between nodes is valid
 * @param {Object} connection - The connection object
 * @param {Array} nodes - The array of nodes
 * @returns {boolean} Whether the connection is valid
 */
export const isValidConnection = (connection, nodes) => {
  const { source, target } = connection;
  
  // Prevent connecting to self
  if (source === target) {
    return false;
  }
  
  // Find source and target nodes
  const sourceNode = nodes.find(node => node.id === source);
  const targetNode = nodes.find(node => node.id === target);
  
  if (!sourceNode || !targetNode) {
    return false;
  }
  
  // Prevent circular references (would need more complex logic for deep checking)
  // This is a simple check to prevent immediate circular references
  const sourceConnections = nodes
    .filter(node => node.id === source)
    .flatMap(node => node.data?.connections || []);
  
  if (sourceConnections.includes(target)) {
    return false;
  }
  
  return true;
};

/**
 * Creates a default organization structure
 * @returns {Object} A default organization structure
 */
export const createDefaultOrgStructure = () => {
  return {
    id: 'org-root',
    name: 'Organization',
    type: 'organization',
    description: 'Root organization node',
    children: []
  };
};

/**
 * Creates a sample organization structure for demonstration
 * @param {string} companyName - The name of the company
 * @returns {Object} A sample organization structure
 */
export const createSampleOrgStructure = (companyName) => {
  return {
    id: 'org-root',
    name: companyName || 'Sample Company',
    type: 'organization',
    description: 'Real Estate Agency',
    isExpanded: true,
    children: [
      {
        id: 'dept-sales',
        name: 'Sales Department',
        type: 'department',
        description: 'Sales and business development',
        isExpanded: true,
        children: [
          {
            id: 'role-sales-director',
            name: 'Sales Director',
            type: 'role',
            description: 'Head of Sales',
            responsibilities: ['Sales strategy', 'Team management'],
            isExpanded: true,
            children: [
              {
                id: 'role-sales-manager',
                name: 'Sales Manager',
                type: 'role',
                description: 'Manages sales team',
                responsibilities: ['Team leadership', 'Performance tracking'],
                isExpanded: true,
                children: [
                  {
                    id: 'role-listing-agent',
                    name: 'Listing Agent',
                    type: 'role',
                    description: 'Handles property listings',
                    responsibilities: ['Property valuation', 'Seller relations'],
                    children: []
                  },
                  {
                    id: 'role-buyers-agent',
                    name: 'Buyer\'s Agent',
                    type: 'role',
                    description: 'Works with property buyers',
                    responsibilities: ['Property showings', 'Buyer relations'],
                    children: []
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'dept-marketing',
        name: 'Marketing Department',
        type: 'department',
        description: 'Marketing and brand management',
        isExpanded: true,
        children: [
          {
            id: 'role-marketing-director',
            name: 'Marketing Director',
            type: 'role',
            description: 'Head of Marketing',
            responsibilities: ['Marketing strategy', 'Brand management'],
            isExpanded: true,
            children: [
              {
                id: 'role-content-writer',
                name: 'Content Writer',
                type: 'role',
                description: 'Content creation specialist',
                responsibilities: ['Blog posts', 'Email campaigns'],
                children: []
              },
              {
                id: 'role-graphic-designer',
                name: 'Graphic Designer',
                type: 'role',
                description: 'Visual design specialist',
                responsibilities: ['Visual assets', 'Brand consistency'],
                children: []
              },
              {
                id: 'role-social-media',
                name: 'Social Media Manager',
                type: 'role',
                description: 'Manages social media presence',
                responsibilities: ['Content scheduling', 'Engagement tracking'],
                children: []
              }
            ]
          }
        ]
      },
      {
        id: 'dept-operations',
        name: 'Operations',
        type: 'department',
        description: 'Business operations and administration',
        isExpanded: true,
        children: [
          {
            id: 'role-operations-manager',
            name: 'Operations Manager',
            type: 'role',
            description: 'Manages day-to-day operations',
            responsibilities: ['Process optimization', 'Resource allocation'],
            isExpanded: true,
            children: [
              {
                id: 'role-admin-assistant',
                name: 'Administrative Assistant',
                type: 'role',
                description: 'Provides administrative support',
                responsibilities: ['Scheduling', 'Documentation'],
                children: []
              },
              {
                id: 'role-office-manager',
                name: 'Office Manager',
                type: 'role',
                description: 'Manages office facilities',
                responsibilities: ['Facility maintenance', 'Supply management'],
                children: []
              }
            ]
          }
        ]
      },
      {
        id: 'dept-finance',
        name: 'Finance',
        type: 'department',
        description: 'Financial management and accounting',
        isExpanded: true,
        children: [
          {
            id: 'role-finance-manager',
            name: 'Finance Manager',
            type: 'role',
            description: 'Manages financial operations',
            responsibilities: ['Financial reporting', 'Budget management'],
            isExpanded: true,
            children: [
              {
                id: 'role-accountant',
                name: 'Accountant',
                type: 'role',
                description: 'Handles accounting tasks',
                responsibilities: ['Bookkeeping', 'Tax preparation'],
                children: []
              }
            ]
          }
        ]
      }
    ]
  };
};

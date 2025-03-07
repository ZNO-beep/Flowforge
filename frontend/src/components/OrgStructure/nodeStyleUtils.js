/**
 * Utility functions for OrgStructureNode styling and type information
 */

/**
 * Determines node styling based on node type
 * @param {string} type - The type of node (department, role, function)
 * @returns {string} CSS class names for styling
 */
export const getNodeStyle = (type) => {
  switch (type) {
    case 'department':
      return 'bg-blue-100 border-blue-500 hover:bg-blue-200';
    case 'role':
      return 'bg-green-100 border-green-500 hover:bg-green-200';
    case 'function':
      return 'bg-amber-100 border-amber-500 hover:bg-amber-200';
    default:
      return 'bg-gray-100 border-gray-500 hover:bg-gray-200';
  }
};

/**
 * Determines icon and text based on node type
 * @param {string} type - The type of node (department, role, function)
 * @returns {Object} Object containing icon and text for the node type
 */
export const getTypeInfo = (type) => {
  switch (type) {
    case 'department':
      return { icon: '🏢', text: 'Department' };
    case 'role':
      return { icon: '👤', text: 'Role' };
    case 'function':
      return { icon: '⚙️', text: 'Function' };
    default:
      return { icon: '📄', text: 'Node' };
  }
}; 
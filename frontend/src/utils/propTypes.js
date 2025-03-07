import PropTypes from 'prop-types';

/**
 * Common PropTypes for the application
 */

/**
 * PropTypes for a department
 */
export const departmentPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
});

/**
 * PropTypes for a role
 */
export const rolePropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  department_id: PropTypes.number.isRequired,
});

/**
 * PropTypes for a function
 */
export const functionPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  role_id: PropTypes.number.isRequired,
});

/**
 * PropTypes for a task
 */
export const taskPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  completed: PropTypes.bool.isRequired,
});

/**
 * PropTypes for node data in OrgStructureNode
 */
export const nodeDataPropType = PropTypes.shape({
  label: PropTypes.string.isRequired,
  description: PropTypes.string,
  type: PropTypes.oneOf(['department', 'role', 'function']).isRequired,
  expanded: PropTypes.bool,
  onToggleExpand: PropTypes.func,
  onAddChild: PropTypes.func,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  isLoading: PropTypes.bool,
  apiId: PropTypes.number.isRequired,
}); 
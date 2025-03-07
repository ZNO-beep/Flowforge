import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

/**
 * Statistic item component
 * @param {Object} props - Component props
 * @param {string} props.title - Statistic title
 * @param {number|string} props.value - Statistic value
 * @param {string} [props.description] - Optional description
 * @returns {JSX.Element} Component JSX
 */
const StatisticItem = ({ title, value, description }) => (
  <div className="flex flex-col">
    <h4 className="text-sm font-medium text-gray-500">{title}</h4>
    <p className="text-2xl font-bold">{value}</p>
    {description && <p className="text-xs text-gray-500">{description}</p>}
  </div>
);

StatisticItem.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  description: PropTypes.string
};

/**
 * Statistics component for the OrgStructurePage
 * @param {Object} props - Component props
 * @param {boolean} props.showStats - Whether to show statistics
 * @param {Object} props.stats - Statistics data
 * @param {number} props.stats.totalDepartments - Total number of departments
 * @param {number} props.stats.totalRoles - Total number of roles
 * @param {number} props.stats.totalFunctions - Total number of functions
 * @param {number} props.stats.averageRolesPerDepartment - Average roles per department
 * @returns {JSX.Element|null} Component JSX or null if stats should not be shown
 */
const Statistics = ({ showStats, stats }) => {
  if (!showStats) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Organization Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatisticItem
            title="Departments"
            value={stats.totalDepartments}
          />
          <StatisticItem
            title="Roles"
            value={stats.totalRoles}
          />
          <StatisticItem
            title="Functions"
            value={stats.totalFunctions}
          />
          <StatisticItem
            title="Avg. Roles per Dept."
            value={stats.averageRolesPerDepartment.toFixed(1)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

Statistics.propTypes = {
  showStats: PropTypes.bool.isRequired,
  stats: PropTypes.shape({
    totalDepartments: PropTypes.number.isRequired,
    totalRoles: PropTypes.number.isRequired,
    totalFunctions: PropTypes.number.isRequired,
    averageRolesPerDepartment: PropTypes.number.isRequired
  }).isRequired
};

export default Statistics; 
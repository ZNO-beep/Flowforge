import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Handle, Position } from 'reactflow';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Building2, 
  Users, 
  User, 
  ChevronDown, 
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  ClipboardList
} from 'lucide-react';

/**
 * Base node component with common functionality
 * @param {Object} props - Component props
 * @returns {JSX.Element} Component JSX
 */
const BaseNode = ({ 
  data, 
  isCollapsible = false, 
  icon: Icon, 
  bgColor = 'bg-background',
  borderColor = 'border-border'
}) => {
  const { 
    label, 
    description, 
    isExpanded = true, 
    childCount = 0,
    onToggleExpand,
    onAddChild,
    onEdit,
    onDelete
  } = data;

  // Prevent event propagation to allow node dragging
  const handleMouseDown = (e) => {
    // Don't stop propagation - this would prevent dragging
    // Just prevent default to avoid text selection
    e.preventDefault();
  };

  return (
    <div 
      className={`p-4 rounded-md border-2 ${borderColor} ${bgColor} shadow-md min-w-[220px] cursor-move`}
      onMouseDown={handleMouseDown}
      style={{ touchAction: 'none' }} // Improve touch dragging
    >
      {/* Source handle - top */}
      <Handle
        type="source"
        position={Position.Top}
        style={{ background: '#555', visibility: 'hidden' }}
        isConnectable={false}
      />
      
      {/* Target handle - bottom */}
      <Handle
        type="target"
        position={Position.Bottom}
        style={{ background: '#555', visibility: 'hidden' }}
        isConnectable={false}
      />
      
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
          <h3 className="font-medium text-base">{label}</h3>
        </div>
        
        {isCollapsible && childCount > 0 && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleExpand) onToggleExpand();
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
      
      {description && (
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      )}
      
      <div className="flex flex-wrap gap-2 mt-3">
        {onAddChild && (
          <Button 
            size="sm" 
            variant="outline" 
            className="h-7 px-2 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onAddChild();
            }}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add
          </Button>
        )}
        
        {onEdit && (
          <Button 
            size="sm" 
            variant="outline" 
            className="h-7 px-2 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <Pencil className="h-3 w-3 mr-1" />
            Edit
          </Button>
        )}
        
        {onDelete && (
          <Button 
            size="sm" 
            variant="outline" 
            className="h-7 px-2 text-xs text-destructive hover:bg-destructive/10"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};

BaseNode.propTypes = {
  data: PropTypes.object.isRequired,
  isCollapsible: PropTypes.bool,
  icon: PropTypes.elementType,
  bgColor: PropTypes.string,
  borderColor: PropTypes.string
};

/**
 * Organization node component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Component JSX
 */
const OrganizationNode = memo(({ data }) => {
  return (
    <BaseNode 
      data={data} 
      isCollapsible={true}
      icon={Building2}
      bgColor="bg-blue-50"
      borderColor="border-blue-500"
    />
  );
});

OrganizationNode.displayName = 'OrganizationNode';

/**
 * Department node component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Component JSX
 */
const DepartmentNode = memo(({ data }) => {
  const { childCount = 0 } = data;
  
  return (
    <div className="relative">
      {childCount > 0 && (
        <Badge 
          variant="secondary" 
          className="absolute -top-2 -right-2 z-10"
        >
          {childCount}
        </Badge>
      )}
      <BaseNode 
        data={data} 
        isCollapsible={true}
        icon={Users}
        bgColor="bg-green-50"
        borderColor="border-green-500"
      />
    </div>
  );
});

DepartmentNode.displayName = 'DepartmentNode';

/**
 * Role node component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Component JSX
 */
const RoleNode = memo(({ data }) => {
  const { responsibilities = [] } = data;
  
  return (
    <div className="relative">
      <BaseNode 
        data={data} 
        icon={User}
        bgColor="bg-amber-50"
        borderColor="border-amber-500"
      />
      
      {responsibilities && responsibilities.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {responsibilities.map((resp, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="text-xs flex items-center bg-white"
            >
              <ClipboardList className="h-3 w-3 mr-1" />
              {resp}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
});

RoleNode.displayName = 'RoleNode';

/**
 * Task node component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Component JSX
 */
const TaskNode = memo(({ data }) => {
  return (
    <div className="p-2 rounded-md border border-muted bg-muted/20 shadow-sm">
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 bg-muted-foreground"
      />
      
      <div className="flex items-center gap-2">
        <ClipboardList className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm">{data.label}</span>
      </div>
      
      {data.description && (
        <p className="text-xs text-muted-foreground mt-1">{data.description}</p>
      )}
    </div>
  );
});

TaskNode.displayName = 'TaskNode';

/**
 * Generic organizational node component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Component JSX
 */
const OrgNode = memo(({ data }) => {
  const { type } = data;
  
  switch (type) {
    case 'organization':
      return <OrganizationNode data={data} />;
    case 'department':
      return <DepartmentNode data={data} />;
    case 'role':
      return <RoleNode data={data} />;
    case 'task':
      return <TaskNode data={data} />;
    default:
      return <BaseNode data={data} />;
  }
});

OrgNode.displayName = 'OrgNode';

// Export node types for React Flow
export const nodeTypes = {
  organization: OrganizationNode,
  department: DepartmentNode,
  role: RoleNode,
  task: TaskNode,
  orgNode: OrgNode
}; 
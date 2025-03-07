import React from 'react';
import { ChevronDown, ChevronRight, Plus, Trash2, Edit, Info } from 'lucide-react';
import { cn } from '../../utils';

/**
 * Node header component with type indicator and buttons
 * @param {Object} props - Component props
 * @returns {JSX.Element} Component JSX
 */
export const NodeHeader = ({
  icon,
  text,
  onToggleExpand,
  onAddChild,
  onEdit,
  onDelete,
  expanded,
  isLoading,
  type,
  setShowTooltip
}) => {
  return (
    <div className="flex items-center justify-between mb-1">
      <span className="text-xs text-gray-500 flex items-center gap-1">
        {icon} {text}
      </span>
      <div className="flex items-center gap-1">
        {/* Info button */}
        <button
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="p-1 rounded-full hover:bg-gray-200 transition-colors text-gray-500"
          title="Show details"
        >
          <Info className="w-4 h-4" />
        </button>
        
        {/* Only show expand toggle for departments and roles */}
        {(type === 'department' || type === 'role') && (
          <button
            onClick={onToggleExpand}
            className={cn(
              "p-1 rounded-full hover:bg-gray-200 transition-colors",
              isLoading && "animate-pulse"
            )}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-blue-500 animate-spin" />
            ) : expanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        )}
        
        {/* Add child button */}
        {(type === 'department' || type === 'role') && (
          <button
            onClick={onAddChild}
            className="p-1 rounded-full hover:bg-gray-200 transition-colors"
            title={`Add ${type === 'department' ? 'Role' : 'Function'}`}
            disabled={isLoading}
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
        
        {/* Edit button */}
        {onEdit && (
          <button
            onClick={onEdit}
            className="p-1 rounded-full hover:bg-blue-200 transition-colors text-blue-500"
            title="Edit"
            disabled={isLoading}
          >
            <Edit className="w-4 h-4" />
          </button>
        )}
        
        {/* Delete button */}
        {onDelete && (
          <button
            onClick={onDelete}
            className="p-1 rounded-full hover:bg-red-200 transition-colors text-red-500"
            title="Delete"
            disabled={isLoading}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Node content component with label and description
 * @param {Object} props - Component props
 * @returns {JSX.Element} Component JSX
 */
export const NodeContent = ({
  label,
  description,
  isLoading
}) => {
  return (
    <>
      <div className="font-medium text-center py-1">
        {label}
      </div>
      
      {description && (
        <div className="text-xs text-gray-600 text-center mt-1 italic">
          {description.length > 30 ? `${description.substring(0, 30)}...` : description}
        </div>
      )}
      
      {isLoading && (
        <div className="text-xs text-center text-gray-500 italic mt-1">
          Loading...
        </div>
      )}
    </>
  );
};

/**
 * Node tooltip component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Component JSX
 */
export const NodeTooltip = ({
  showTooltip,
  label,
  text,
  description,
  apiId,
  expanded
}) => {
  if (!showTooltip) return null;
  
  return (
    <div className="absolute z-10 bg-white p-3 rounded-md shadow-lg border border-gray-200 min-w-[200px] left-full ml-2 top-0">
      <h4 className="font-semibold mb-1">{label}</h4>
      <div className="text-xs mb-2">
        <span className="font-medium">Type:</span> {text}
      </div>
      {description && (
        <div className="text-xs mb-2">
          <span className="font-medium">Description:</span> {description}
        </div>
      )}
      <div className="text-xs mb-2">
        <span className="font-medium">ID:</span> {apiId}
      </div>
      {expanded !== undefined && (
        <div className="text-xs">
          <span className="font-medium">Status:</span> {expanded ? 'Expanded' : 'Collapsed'}
        </div>
      )}
    </div>
  );
}; 
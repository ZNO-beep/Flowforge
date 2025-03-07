import React from 'react';
import { Handle, Position } from 'reactflow';
import { cn } from '../../utils';
import { useOrgStructureNodeState } from '../../hooks/useOrgStructureNodeState';
import { getNodeStyle, getTypeInfo } from './nodeStyleUtils';
import { NodeHeader, NodeContent, NodeTooltip } from './OrgStructureNodeComponents';

/**
 * OrgStructureNode component for rendering department, role, and function nodes
 * in the organizational structure visualization.
 * @param {Object} props - Component props
 * @param {Object} props.data - Node data
 * @param {boolean} props.isConnectable - Whether the node can be connected
 * @returns {JSX.Element} Component JSX
 */
const OrgStructureNode = ({ data, isConnectable }) => {
  const { 
    label, 
    description, 
    type, 
    expanded, 
    onToggleExpand, 
    onAddChild, 
    onDelete, 
    onEdit, 
    isLoading, 
    apiId 
  } = data;
  
  // Use custom hook for state management
  const { showTooltip, setShowTooltip } = useOrgStructureNodeState();
  
  // Get styling and type information
  const nodeStyle = getNodeStyle(type);
  const { icon, text } = getTypeInfo(type);

  return (
    <div className={cn(
      'px-4 py-2 rounded-md border-2 shadow-md min-w-[180px] relative',
      nodeStyle,
      isLoading && 'opacity-70'
    )}>
      {/* Source handle - top */}
      <Handle
        type="source"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-gray-400"
      />

      {/* Node content */}
      <div className="flex flex-col">
        <NodeHeader
          icon={icon}
          text={text}
          onToggleExpand={onToggleExpand}
          onAddChild={onAddChild}
          onEdit={onEdit}
          onDelete={onDelete}
          expanded={expanded}
          isLoading={isLoading}
          type={type}
          setShowTooltip={setShowTooltip}
        />
        
        <NodeContent
          label={label}
          description={description}
          isLoading={isLoading}
        />
      </div>

      {/* Tooltip */}
      <NodeTooltip
        showTooltip={showTooltip}
        label={label}
        text={text}
        description={description}
        apiId={apiId}
        expanded={expanded}
      />

      {/* Target handle - bottom */}
      <Handle
        type="target"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-gray-400"
      />
    </div>
  );
};

export default OrgStructureNode; 
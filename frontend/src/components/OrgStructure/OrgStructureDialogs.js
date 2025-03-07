import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from '../ui/select';
import { Building2, Users, User, AlertTriangle } from 'lucide-react';

/**
 * Get default node type based on parent type
 * @param {string} parentType - Type of the parent node
 * @returns {string} Default node type
 */
function getDefaultNodeType(parentType) {
  switch (parentType) {
    case 'organization':
      return 'department';
    case 'department':
      return 'role';
    case 'role':
      return 'task';
    default:
      return 'department';
  }
}

/**
 * Get available node types based on parent type
 * @param {string} parentType - Type of the parent node
 * @returns {Array} Array of available node types
 */
function getAvailableNodeTypes(parentType) {
  switch (parentType) {
    case 'organization':
      return [
        { value: 'department', label: 'Department' }
      ];
    case 'department':
      return [
        { value: 'department', label: 'Sub-Department' },
        { value: 'role', label: 'Role' }
      ];
    case 'role':
      return [
        { value: 'role', label: 'Sub-Role' },
        { value: 'task', label: 'Task' }
      ];
    default:
      return [
        { value: 'department', label: 'Department' },
        { value: 'role', label: 'Role' },
        { value: 'task', label: 'Task' }
      ];
  }
}

/**
 * Helper function to get a label for a node type
 * @param {string} type - The node type
 * @returns {string} The node type label
 */
function getNodeTypeLabel(type) {
  switch (type) {
    case 'organization':
      return 'Organization';
    case 'department':
      return 'Department';
    case 'role':
      return 'Role';
    case 'task':
      return 'Task';
    default:
      return 'Node';
  }
}

/**
 * Render the form fields for the add node dialog
 * @param {Object} props - Component props
 * @returns {JSX.Element} Component JSX
 */
const AddNodeFormFields = ({
  formData,
  errors,
  parentType,
  handleChange,
  handleSelectChange,
  responsibilityInput,
  setResponsibilityInput,
  handleAddResponsibility,
  handleRemoveResponsibility
}) => {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value) => handleSelectChange('type', value)}
        >
          <SelectTrigger id="type">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {getAvailableNodeTypes(parentType).map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder={`Enter ${getNodeTypeLabel(formData.type).toLowerCase()} name`}
          required
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder={`Enter ${getNodeTypeLabel(formData.type).toLowerCase()} description`}
          rows={3}
        />
      </div>
      
      {(formData.type === 'role' || formData.type === 'task') && (
        <ResponsibilitiesSection
          responsibilities={formData.responsibilities}
          responsibilityInput={responsibilityInput}
          setResponsibilityInput={setResponsibilityInput}
          onAdd={handleAddResponsibility}
          onRemove={handleRemoveResponsibility}
        />
      )}
    </div>
  );
};

/**
 * Responsibilities section component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Component JSX
 */
const ResponsibilitiesSection = ({
  responsibilities,
  responsibilityInput,
  setResponsibilityInput,
  onAdd,
  onRemove
}) => {
  return (
    <div className="space-y-2">
      <Label>Responsibilities</Label>
      <div className="flex space-x-2">
        <Input
          value={responsibilityInput}
          onChange={(e) => setResponsibilityInput(e.target.value)}
          placeholder="Add a responsibility"
        />
        <Button 
          type="button" 
          variant="outline" 
          onClick={onAdd}
        >
          Add
        </Button>
      </div>
      
      {responsibilities.length > 0 && (
        <ul className="mt-2 space-y-1">
          {responsibilities.map((resp, index) => (
            <li 
              key={index} 
              className="flex items-center justify-between p-2 bg-muted rounded-md"
            >
              <span className="text-sm">{resp}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemove(index)}
                className="h-6 w-6 p-0 text-destructive"
              >
                &times;
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/**
 * Dialog for adding a new node to the organizational structure
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the dialog is open
 * @param {Function} props.onClose - Function to close the dialog
 * @param {Function} props.onSubmit - Function to submit the form
 * @param {string} props.parentId - ID of the parent node
 * @param {string} props.parentType - Type of the parent node
 * @returns {JSX.Element} Component JSX
 */
export const AddNodeDialog = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  parentId, 
  parentType 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: getDefaultNodeType(parentType),
    responsibilities: []
  });
  
  const [errors, setErrors] = useState({});
  const [responsibilityInput, setResponsibilityInput] = useState('');
  
  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        description: '',
        type: getDefaultNodeType(parentType),
        responsibilities: []
      });
      setResponsibilityInput('');
      setErrors({});
    }
  }, [isOpen, parentType]);
  
  /**
   * Handle form input changes
   * @param {Object} e - Event object
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  /**
   * Handle select changes
   * @param {string} name - Field name
   * @param {string} value - Field value
   */
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  /**
   * Add a responsibility
   */
  const handleAddResponsibility = () => {
    if (responsibilityInput.trim()) {
      setFormData(prev => ({
        ...prev,
        responsibilities: [...prev.responsibilities, responsibilityInput.trim()]
      }));
      setResponsibilityInput('');
    }
  };
  
  /**
   * Remove a responsibility
   * @param {number} index - Index of the responsibility to remove
   */
  const handleRemoveResponsibility = (index) => {
    setFormData(prev => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index)
    }));
  };
  
  /**
   * Validate the form
   * @returns {boolean} Whether the form is valid
   */
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  /**
   * Handle form submission
   * @param {Object} e - Event object
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(parentId, formData);
      onClose();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New {getNodeTypeLabel(formData.type)}</DialogTitle>
          <DialogDescription>
            Create a new {getNodeTypeLabel(formData.type).toLowerCase()} in your organizational structure.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <AddNodeFormFields
            formData={formData}
            errors={errors}
            parentType={parentType}
            handleChange={handleChange}
            handleSelectChange={handleSelectChange}
            responsibilityInput={responsibilityInput}
            setResponsibilityInput={setResponsibilityInput}
            handleAddResponsibility={handleAddResponsibility}
            handleRemoveResponsibility={handleRemoveResponsibility}
          />
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Add {getNodeTypeLabel(formData.type)}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

AddNodeDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  parentId: PropTypes.string,
  parentType: PropTypes.string
};

/**
 * Dialog for editing a node in the organizational structure
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the dialog is open
 * @param {Function} props.onClose - Function to close the dialog
 * @param {Function} props.onSubmit - Function to submit the form
 * @param {Object} props.node - The node to edit
 * @returns {JSX.Element} Component JSX
 */
export const EditNodeDialog = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  node 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    responsibilities: []
  });
  
  const [errors, setErrors] = useState({});
  const [responsibilityInput, setResponsibilityInput] = useState('');
  
  // Initialize form data when node changes
  useEffect(() => {
    if (node) {
      setFormData({
        name: node.name || '',
        description: node.description || '',
        responsibilities: node.responsibilities || []
      });
      setErrors({});
    }
  }, [node]);
  
  /**
   * Handle form input changes
   * @param {Object} e - Event object
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  /**
   * Add a responsibility
   */
  const handleAddResponsibility = () => {
    if (responsibilityInput.trim()) {
      setFormData(prev => ({
        ...prev,
        responsibilities: [...prev.responsibilities, responsibilityInput.trim()]
      }));
      setResponsibilityInput('');
    }
  };
  
  /**
   * Remove a responsibility
   * @param {number} index - Index of the responsibility to remove
   */
  const handleRemoveResponsibility = (index) => {
    setFormData(prev => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index)
    }));
  };
  
  /**
   * Validate the form
   * @returns {boolean} Whether the form is valid
   */
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  /**
   * Handle form submission
   * @param {Object} e - Event object
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(node.id, formData);
      onClose();
    }
  };
  
  if (!node) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit {getNodeTypeLabel(node.type)}</DialogTitle>
          <DialogDescription>
            Update the details of this {getNodeTypeLabel(node.type).toLowerCase()}.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={`Enter ${getNodeTypeLabel(node.type).toLowerCase()} name`}
                required
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder={`Enter ${getNodeTypeLabel(node.type).toLowerCase()} description`}
                rows={3}
              />
            </div>
            
            {(node.type === 'role' || node.type === 'task') && (
              <ResponsibilitiesSection
                responsibilities={formData.responsibilities}
                responsibilityInput={responsibilityInput}
                setResponsibilityInput={setResponsibilityInput}
                onAdd={handleAddResponsibility}
                onRemove={handleRemoveResponsibility}
              />
            )}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

EditNodeDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  node: PropTypes.object
};

/**
 * Dialog for confirming deletion of a node
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the dialog is open
 * @param {Function} props.onClose - Function to close the dialog
 * @param {Function} props.onConfirm - Function to confirm deletion
 * @param {Object} props.node - The node to delete
 * @returns {JSX.Element} Component JSX
 */
export const DeleteNodeDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  node 
}) => {
  if (!node) return null;
  
  const hasChildren = node.children && node.children.length > 0;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Confirm Deletion
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this {getNodeTypeLabel(node.type).toLowerCase()}?
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm font-medium">{node.name}</p>
          {node.description && (
            <p className="text-sm text-muted-foreground mt-1">{node.description}</p>
          )}
          
          {hasChildren && (
            <div className="mt-4 p-3 border border-destructive/20 bg-destructive/10 rounded-md">
              <p className="text-sm font-medium text-destructive flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Warning
              </p>
              <p className="text-sm mt-1">
                This {getNodeTypeLabel(node.type).toLowerCase()} has {node.children.length} child {node.children.length === 1 ? 'item' : 'items'} that will also be deleted.
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={() => {
              onConfirm(node.id);
              onClose();
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

DeleteNodeDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  node: PropTypes.object
};

// PropTypes for the form fields component
AddNodeFormFields.propTypes = {
  formData: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  parentType: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  handleSelectChange: PropTypes.func.isRequired,
  responsibilityInput: PropTypes.string.isRequired,
  setResponsibilityInput: PropTypes.func.isRequired,
  handleAddResponsibility: PropTypes.func.isRequired,
  handleRemoveResponsibility: PropTypes.func.isRequired
};

// PropTypes for the responsibilities section component
ResponsibilitiesSection.propTypes = {
  responsibilities: PropTypes.array.isRequired,
  responsibilityInput: PropTypes.string.isRequired,
  setResponsibilityInput: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
};

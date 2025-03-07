import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '../../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

/**
 * Help section component
 * @param {Object} props - Component props
 * @param {string} props.title - Section title
 * @param {React.ReactNode} props.children - Section content
 * @returns {JSX.Element} Component JSX
 */
const HelpSection = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-lg font-medium mb-2">{title}</h3>
    {children}
  </div>
);

HelpSection.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

/**
 * Help dialog component for the OrgStructurePage
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the dialog is open
 * @param {Function} props.onClose - Function to close the dialog
 * @returns {JSX.Element} Component JSX
 */
const HelpDialog = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Organization Structure Help</DialogTitle>
          <DialogDescription>
            Learn how to use the organization structure features effectively.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="getting-started" className="mt-4">
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="features">Key Features</TabsTrigger>
            <TabsTrigger value="node-types">Node Types</TabsTrigger>
            <TabsTrigger value="tips">Tips & Tricks</TabsTrigger>
            <TabsTrigger value="shortcuts">Shortcuts</TabsTrigger>
          </TabsList>

          <TabsContent value="getting-started" className="pt-4">
            <HelpSection title="Welcome to Organization Structure">
              <p className="mb-2">
                The Organization Structure tool helps you visualize and manage your company's
                organizational hierarchy, including departments, roles, and functions.
              </p>
              <p>
                Use the search bar to find specific departments, roles, or functions quickly.
                Click on any item in the structure to view its details and related items.
              </p>
            </HelpSection>

            <HelpSection title="Basic Navigation">
              <ul className="list-disc pl-5 space-y-1">
                <li>Click on departments to expand or collapse them</li>
                <li>Use the search bar to find specific items</li>
                <li>Toggle statistics to see organization metrics</li>
                <li>Add new departments using the "Add Department" button</li>
              </ul>
            </HelpSection>
          </TabsContent>

          <TabsContent value="features" className="pt-4">
            <HelpSection title="Search Functionality">
              <p className="mb-2">
                The search feature allows you to quickly find any department, role, or function
                within your organization.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Enter keywords in the search bar</li>
                <li>Results will show matching items with their type and department</li>
                <li>Click "View" to navigate directly to the item in the structure</li>
              </ul>
            </HelpSection>

            <HelpSection title="Statistics">
              <p className="mb-2">
                Toggle the statistics view to see key metrics about your organization:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Total number of departments</li>
                <li>Total number of roles</li>
                <li>Total number of functions</li>
                <li>Average roles per department</li>
              </ul>
            </HelpSection>
          </TabsContent>

          <TabsContent value="node-types" className="pt-4">
            <HelpSection title="Departments">
              <p>
                Departments represent the main organizational units in your company.
                Each department can contain multiple roles and is displayed at the top level
                of the hierarchy.
              </p>
            </HelpSection>

            <HelpSection title="Roles">
              <p>
                Roles represent positions within departments. Each role belongs to a specific
                department and can have multiple functions associated with it.
              </p>
            </HelpSection>

            <HelpSection title="Functions">
              <p>
                Functions represent specific responsibilities or tasks associated with a role.
                They are the most granular level of the organizational structure.
              </p>
            </HelpSection>
          </TabsContent>

          <TabsContent value="tips" className="pt-4">
            <HelpSection title="Efficient Searching">
              <p className="mb-2">
                To get the most out of the search functionality:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Use specific keywords for more precise results</li>
                <li>Search by department name to find all roles within that department</li>
                <li>Clear the search to return to the full organization view</li>
              </ul>
            </HelpSection>

            <HelpSection title="Organization Management">
              <p className="mb-2">
                Best practices for managing your organization structure:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Regularly update the structure to reflect organizational changes</li>
                <li>Use consistent naming conventions for departments, roles, and functions</li>
                <li>Review the statistics to identify imbalances in your organization</li>
              </ul>
            </HelpSection>
          </TabsContent>

          <TabsContent value="shortcuts" className="pt-4">
            <HelpSection title="Keyboard Shortcuts">
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Enter (in search field)</div>
                <div>Execute search</div>
                
                <div className="font-medium">Esc</div>
                <div>Close dialogs or clear search</div>
                
                <div className="font-medium">Alt + S</div>
                <div>Toggle statistics view</div>
                
                <div className="font-medium">Alt + A</div>
                <div>Open Add Department dialog</div>
                
                <div className="font-medium">Alt + H</div>
                <div>Open this help dialog</div>
                
                <div className="font-medium">Alt + R</div>
                <div>Refresh organization data</div>
              </div>
            </HelpSection>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

HelpDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default HelpDialog; 
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import OrgStructureFlow from '../components/OrgStructure/OrgStructureFlow';
import PageHeader from './components/PageHeader';
import { Button } from '../components/ui/button';
import { ArrowLeftRight, ArrowUpDown, HelpCircle, Save, Loader2 } from 'lucide-react';
import { createSampleOrgStructure } from '../utils/orgStructureUtils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import OrgStructureService from '../services/orgStructureService';

/**
 * OrgStructurePage component for displaying the organizational structure
 * visualization and management interface.
 * @returns {JSX.Element} Component JSX
 */
const OrgStructurePage = () => {
  const navigate = useNavigate();
  const [businessInfo, setBusinessInfo] = useState(null);
  const [orgStructure, setOrgStructure] = useState(null);
  const [layoutDirection, setLayoutDirection] = useState('TB'); // 'TB' for top-to-bottom, 'LR' for left-to-right
  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // Check if user has completed onboarding and load org structure
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Get business info
        const storedBusinessInfo = localStorage.getItem('businessInfo');
        if (!storedBusinessInfo) {
          navigate('/onboarding');
          return;
        }
        
        const parsedBusinessInfo = JSON.parse(storedBusinessInfo);
        setBusinessInfo(parsedBusinessInfo);
        
        // Get business ID
        const businessId = localStorage.getItem('currentBusinessId') || 
                          parsedBusinessInfo.businessName.toLowerCase().replace(/\s+/g, '-');
        
        // Load org structure
        const structure = await OrgStructureService.loadOrgStructure(businessId);
        setOrgStructure(structure);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load organizational structure. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [navigate]);

  // Toggle layout direction
  const toggleLayoutDirection = () => {
    setLayoutDirection(prev => prev === 'TB' ? 'LR' : 'TB');
  };

  // Save the current org structure
  const saveOrgStructure = async () => {
    if (!businessInfo || !orgStructure) return;
    
    try {
      setIsSaving(true);
      
      const businessId = localStorage.getItem('currentBusinessId') || 
                        businessInfo.businessName.toLowerCase().replace(/\s+/g, '-');
      
      await OrgStructureService.saveOrgStructure(businessId, orgStructure);
    } catch (error) {
      console.error('Error saving org structure:', error);
      setError('Failed to save organizational structure. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle structure changes
  const handleStructureChange = useCallback((newStructure) => {
    console.log('Structure changed in OrgStructurePage');
    
    // Only update if the structure has actually changed
    if (newStructure && (!orgStructure || JSON.stringify(newStructure) !== JSON.stringify(orgStructure))) {
      console.log('Updating orgStructure state in OrgStructurePage');
      setOrgStructure(newStructure);
    } else {
      console.log('Structure unchanged, skipping update');
    }
  }, [orgStructure]);

  return (
    <div className="container py-8">
      <PageHeader 
        title={businessInfo ? `${businessInfo.businessName} Organization` : 'Organization Structure'}
        description="Visualize and manage your organization's structure"
      >
        <Button
          variant="outline"
          size="sm"
          onClick={toggleLayoutDirection}
        >
          {layoutDirection === 'TB' ? (
            <>
              <ArrowLeftRight className="mr-2 h-4 w-4" />
              Horizontal
            </>
          ) : (
            <>
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Vertical
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={saveOrgStructure}
          disabled={isSaving || isLoading || !orgStructure}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsHelpDialogOpen(true)}
        >
          <HelpCircle className="mr-2 h-4 w-4" />
          Help
        </Button>
      </PageHeader>

      <div className="mt-6">
        {isLoading ? (
          <div className="h-[700px] w-full border rounded-lg bg-background flex items-center justify-center">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
              <p className="text-muted-foreground">Loading organizational structure...</p>
            </div>
          </div>
        ) : error ? (
          <div className="h-[700px] w-full border rounded-lg bg-background flex items-center justify-center">
            <div className="flex flex-col items-center text-center max-w-md">
              <div className="text-destructive mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Error Loading Structure</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        ) : (
          <OrgStructureFlow
            initialStructure={orgStructure}
            businessName={businessInfo?.businessName || 'My Company'}
            layoutDirection={layoutDirection}
            onStructureChange={handleStructureChange}
          />
        )}
      </div>

      {/* Help Dialog */}
      <Dialog open={isHelpDialogOpen} onOpenChange={setIsHelpDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Organization Structure Help</DialogTitle>
            <DialogDescription>
              Learn how to use the organization structure editor
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <h3 className="font-medium">Basic Navigation</h3>
              <ul className="list-disc pl-5 text-sm text-muted-foreground mt-2 space-y-1">
                <li>Use the mouse wheel to zoom in and out</li>
                <li>Click and drag to pan around the canvas</li>
                <li>Click on a node to select it</li>
                <li>Double-click on a node to expand/collapse it</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium">Managing Nodes</h3>
              <ul className="list-disc pl-5 text-sm text-muted-foreground mt-2 space-y-1">
                <li>Click the + button to add a new department</li>
                <li>Select a node and use the buttons in the top-right to add, edit, or delete</li>
                <li>Adding a node to a department creates a sub-department or role</li>
                <li>Adding a node to a role creates a sub-role or task</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium">Node Types</h3>
              <ul className="list-disc pl-5 text-sm text-muted-foreground mt-2 space-y-1">
                <li><span className="text-blue-500 font-medium">Organization</span> - The root node of your company</li>
                <li><span className="text-emerald-500 font-medium">Department</span> - A business unit or division</li>
                <li><span className="text-amber-500 font-medium">Role</span> - A position or job title</li>
                <li><span className="text-indigo-500 font-medium">Task</span> - A responsibility or duty</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium">Tips</h3>
              <ul className="list-disc pl-5 text-sm text-muted-foreground mt-2 space-y-1">
                <li>Use the layout toggle to switch between vertical and horizontal views</li>
                <li>Add responsibilities to roles to track what each position is responsible for</li>
                <li>Keep your structure organized by using consistent naming conventions</li>
                <li>Don't forget to save your changes using the Save button</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrgStructurePage; 
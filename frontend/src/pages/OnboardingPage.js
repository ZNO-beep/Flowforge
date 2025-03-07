import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { ArrowRight, Building2, Users, Loader2 } from 'lucide-react';
import useOnboardingState from '../hooks/useOnboardingState';
import OnboardingAIAgent from '../components/Onboarding/OnboardingAIAgent';
import OrgStructureService from '../services/orgStructureService';

/**
 * OnboardingPage component for collecting initial business information
 * and guiding users to the organizational structure.
 * @returns {JSX.Element} Component JSX
 */
const OnboardingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isGeneratingStructure, setIsGeneratingStructure] = useState(false);
  const {
    businessInfo,
    setBusinessInfo,
    errors,
    setErrors,
    isLoading,
    saveBusinessInfo,
    validateBusinessInfo
  } = useOnboardingState();

  // Populate with dummy data for testing - real estate agency focused
  useEffect(() => {
    if (!businessInfo.businessName && !businessInfo.businessType) {
      setBusinessInfo({
        businessName: 'Prestige Real Estate',
        businessType: 'real_estate',
        businessSize: '11-50'
      });
    }
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBusinessInfo(prev => ({
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

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setBusinessInfo(prev => ({
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

  // Handle next step
  const handleNext = () => {
    if (validateBusinessInfo(businessInfo)) {
      saveBusinessInfo(businessInfo);
      setStep(2);
    }
  };

  // Handle AI conversation complete
  const handleConversationComplete = async () => {
    try {
      setIsGeneratingStructure(true);
      
      // Generate organizational structure using AI
      const orgStructure = await OrgStructureService.generateOrgStructure(businessInfo);
      
      // Save the generated structure
      const businessId = businessInfo.businessName.toLowerCase().replace(/\s+/g, '-');
      await OrgStructureService.saveOrgStructure(businessId, orgStructure);
      
      // Save business ID for reference
      localStorage.setItem('currentBusinessId', businessId);
      
      // Navigate to organization page
      navigate('/organization');
    } catch (error) {
      console.error('Error generating organizational structure:', error);
      // Navigate anyway, will use default structure
      navigate('/organization');
    } finally {
      setIsGeneratingStructure(false);
    }
  };

  return (
    <div className="container max-w-3xl py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Welcome to FlowForge
        </h1>
        <p className="text-xl text-muted-foreground">
          Let's set up your business workflow automation
        </p>
      </div>

      {step === 1 ? (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Tell us about your business</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                name="businessName"
                placeholder="Enter your business name"
                value={businessInfo.businessName}
                onChange={handleInputChange}
                className={errors.businessName ? 'border-destructive' : ''}
              />
              {errors.businessName && (
                <p className="text-sm text-destructive">{errors.businessName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessType">Business Type</Label>
              <Select 
                value={businessInfo.businessType}
                onValueChange={(value) => handleSelectChange('businessType', value)}
              >
                <SelectTrigger id="businessType">
                  <SelectValue placeholder="Select your business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="real_estate">Real Estate</SelectItem>
                  <SelectItem value="mortgage">Mortgage</SelectItem>
                  <SelectItem value="property_management">Property Management</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.businessType && (
                <p className="text-sm text-destructive">{errors.businessType}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              <Building2 className="inline-block mr-1 h-4 w-4" />
              <span>Your data is stored securely</span>
            </div>
            <Button onClick={handleNext} disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Continue'}
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl">Chat with our AI Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Our AI assistant will help you identify the best workflows for your business.
                Feel free to describe your business challenges.
              </p>
              <OnboardingAIAgent 
                businessInfo={businessInfo} 
                onComplete={handleConversationComplete} 
              />
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              onClick={handleConversationComplete}
              disabled={isGeneratingStructure}
            >
              {isGeneratingStructure ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Organization Structure...
                </>
              ) : (
                <>
                  Skip to Organization
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      <div className="mt-8 text-center">
        <p className="text-muted-foreground">
          <Users className="inline-block mr-1 h-4 w-4" />
          <span>Already have an account? <a href="#" className="text-primary hover:underline">Sign in</a></span>
        </p>
      </div>
    </div>
  );
};

export default OnboardingPage; 
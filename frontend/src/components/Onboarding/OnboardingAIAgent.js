import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Bot, Send, User } from 'lucide-react';

/**
 * OnboardingAIAgent component for AI-driven conversation during onboarding
 * @param {Object} props - Component props
 * @param {Object} props.businessInfo - Business information
 * @param {Function} props.onComplete - Callback when conversation is complete
 * @returns {JSX.Element} Component JSX
 */
const OnboardingAIAgent = ({ businessInfo, onComplete }) => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationStage, setConversationStage] = useState(0);
  const initialMessageSent = useRef(false);

  // Get business type display name
  const getBusinessTypeDisplay = (type) => {
    const types = {
      real_estate: 'Real Estate',
      mortgage: 'Mortgage',
      property_management: 'Property Management',
      retail: 'Retail',
      service: 'Service',
      manufacturing: 'Manufacturing',
      technology: 'Technology',
      healthcare: 'Healthcare',
      education: 'Education',
      finance: 'Finance',
      other: 'Other'
    };
    return types[type] || type;
  };

  // Initial greeting message
  useEffect(() => {
    if (messages.length === 0 && !initialMessageSent.current) {
      initialMessageSent.current = true;
      setTimeout(() => {
        addBotMessage(`Hi there! I'm your AI assistant for ${businessInfo.businessName}. As a ${getBusinessTypeDisplay(businessInfo.businessType)} agency, what specific challenges are you facing with home seller lead conversion?`);
      }, 1000);
    }
  }, [businessInfo.businessName, businessInfo.businessType, messages.length]);

  // Handle conversation stages
  useEffect(() => {
    if (conversationStage === 1) {
      setTimeout(() => {
        addBotMessage(`That's a common challenge for real estate agencies. Based on your feedback, I recommend creating an automated workflow for nurturing home seller leads. This would include personalized follow-ups, property valuation tools, and market analysis reports to improve conversion rates. Would you like to explore this workflow?`);
      }, 1500);
    } else if (conversationStage === 2) {
      setTimeout(() => {
        addBotMessage("Great! I'll prepare a customized workflow template for your home seller lead conversion process. Let's head over to the organization structure where you can see the Sales department and its lead conversion functions.");
        
        // After a delay, complete the conversation
        setTimeout(() => {
          onComplete();
        }, 3000);
      }, 1500);
    }
  }, [conversationStage, businessInfo.businessType, onComplete]);

  // Add a bot message to the conversation
  const addBotMessage = (text) => {
    setIsTyping(true);
    
    // Simulate typing delay
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'bot', text }]);
      setIsTyping(false);
    }, 1000);
  };

  // Add a user message to the conversation
  const addUserMessage = (text) => {
    setMessages(prev => [...prev, { sender: 'user', text }]);
    setCurrentMessage('');
    
    // Move to next conversation stage
    setConversationStage(prev => prev + 1);
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      addUserMessage(currentMessage);
    }
  };

  // Handle pressing Enter to send a message
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && currentMessage.trim()) {
      handleSendMessage();
    }
  };

  // Provide a default message if user doesn't type anything
  const handleQuickResponse = (response) => {
    addUserMessage(response);
  };

  return (
    <Card className="w-full h-[400px] flex flex-col">
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`flex items-start max-w-[80%] ${
                message.sender === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              } rounded-lg p-3`}
            >
              <div className="mr-2 mt-0.5">
                {message.sender === 'user' ? (
                  <User className="h-5 w-5" />
                ) : (
                  <Bot className="h-5 w-5" />
                )}
              </div>
              <div>{message.text}</div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg p-3 flex items-center">
              <Bot className="h-5 w-5 mr-2" />
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <div className="p-4 border-t">
        {conversationStage === 0 && messages.length > 0 && !isTyping && (
          <div className="mb-2 flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleQuickResponse("We're struggling to convert home seller leads into listings")}
              className="text-xs"
            >
              We're struggling to convert home seller leads into listings
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleQuickResponse("Our follow-up process with potential sellers is inconsistent")}
              className="text-xs"
            >
              Our follow-up process with potential sellers is inconsistent
            </Button>
          </div>
        )}
        <div className="flex space-x-2">
          <Input
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={isTyping || conversationStage >= 2}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!currentMessage.trim() || isTyping || conversationStage >= 2}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

OnboardingAIAgent.propTypes = {
  businessInfo: PropTypes.shape({
    businessName: PropTypes.string.isRequired,
    businessType: PropTypes.string.isRequired,
    businessSize: PropTypes.string
  }).isRequired,
  onComplete: PropTypes.func.isRequired
};

export default OnboardingAIAgent; 
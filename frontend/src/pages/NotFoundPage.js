import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Home } from 'lucide-react';

const NotFoundPage = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
    <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
    <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
    <p className="text-muted-foreground mb-8">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <Button asChild>
      <Link to="/"><Home className="mr-2 h-4 w-4" />Return Home</Link>
    </Button>
  </div>
);

export default NotFoundPage; 
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare } from 'lucide-react';
import { Button } from './ui/button';

function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center space-x-2">
            <CheckSquare className="h-6 w-6" />
            <span className="font-bold">FlowForge</span>
          </Link>
        </div>
        <nav className="flex items-center space-x-4 lg:space-x-6">
          <Button asChild variant="ghost">
            <Link to="/">Home</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/tasks">Tasks</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/organization">Organization</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

export default Header; 
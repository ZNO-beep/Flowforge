import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { PlusCircle, CheckCircle2, LayoutList } from 'lucide-react';

function HomePage() {
  return (
    <div className="container max-w-4xl py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          Welcome to FlowForge
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          A simple and efficient task management application
        </p>
        <Button asChild size="lg">
          <Link to="/tasks">
            <PlusCircle className="mr-2 h-5 w-5" />
            Get Started
          </Link>
        </Button>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center p-6 text-center rounded-lg border bg-card">
          <PlusCircle className="h-12 w-12 text-primary mb-4" />
          <h2 className="text-xl font-semibold mb-2">Create Tasks</h2>
          <p className="text-muted-foreground">
            Easily create and organize your tasks
          </p>
        </div>
        <div className="flex flex-col items-center p-6 text-center rounded-lg border bg-card">
          <CheckCircle2 className="h-12 w-12 text-primary mb-4" />
          <h2 className="text-xl font-semibold mb-2">Track Progress</h2>
          <p className="text-muted-foreground">
            Monitor your task completion status
          </p>
        </div>
        <div className="flex flex-col items-center p-6 text-center rounded-lg border bg-card">
          <LayoutList className="h-12 w-12 text-primary mb-4" />
          <h2 className="text-xl font-semibold mb-2">Stay Organized</h2>
          <p className="text-muted-foreground">
            Keep your workflow smooth and efficient
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomePage; 
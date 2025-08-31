import { Button } from "@/components/ui/button";
import mustacheLogo from "@/assets/mustache-logo.jpg";

const Header = () => {
  return (
    <header className="w-full py-6 px-4 md:px-8 bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img 
            src={mustacheLogo} 
            alt="Mustache Logo" 
            className="w-10 h-10 rounded-lg shadow-glow"
          />
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Mustache
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
            How It Works
          </a>
          <a href="#community" className="text-muted-foreground hover:text-primary transition-colors">
            Community
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="hidden md:inline-flex">
            Sign In
          </Button>
          <Button variant="default" className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
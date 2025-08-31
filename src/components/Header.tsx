import { Button } from "@/components/ui/button";
import { Menu, X, MessageSquare, Users, User } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import mustacheLogo from "@/assets/mustache-logo.jpg";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const navItems = isHomePage ? [
    { name: "Features", href: "#features" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "Community", href: "#community" },
  ] : [
    { name: "Discover", href: "/discover", icon: Users },
    { name: "Messages", href: "/messages", icon: MessageSquare },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <header className="w-full py-6 px-4 md:px-8 bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src={mustacheLogo} 
              alt="Mustache Logo" 
              className="w-10 h-10 rounded-lg shadow-glow"
            />
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Mustache
            </h1>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              isHomePage ? (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-foreground/80 hover:text-primary transition-colors"
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center space-x-2 text-foreground/80 hover:text-primary transition-colors"
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.name}</span>
                </Link>
              )
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isHomePage ? (
              <>
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                  Log In
                </Button>
                <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
                  Sign Up
                </Button>
              </>
            ) : (
              <Link to="/">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                  Home
                </Button>
              </Link>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden space-y-4 py-4">
            {navItems.map((item) => (
              isHomePage ? (
                <a
                  key={item.name}
                  href={item.href}
                  className="block text-foreground/80 hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center space-x-2 text-foreground/80 hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.name}</span>
                </Link>
              )
            ))}
            <div className="flex flex-col space-y-2 pt-4">
              {isHomePage ? (
                <>
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                    Log In
                  </Button>
                  <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
                    Sign Up
                  </Button>
                </>
              ) : (
                <Link to="/">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 w-full">
                    Home
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
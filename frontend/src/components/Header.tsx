import { Button } from "@/components/ui/button";
import { Menu, X, MessageSquare, Users, User } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import mustacheLogo from "@/assets/mustache-logo.jpg";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const { user, logout } = useAuth();

  const navItems = isHomePage ? [
    { name: "Features", href: "#features" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "Community", href: "#community" },
  ] : [
    { name: "Discover", href: "/discover", icon: Users },
    { name: "Friends", href: "/friends", icon: Users },
    { name: "Messages", href: "/messages", icon: MessageSquare },
    { name: "Profile", href: "/profile", icon: User },
  ];

  // Don't show header on auth pages
  if (isAuthPage) {
    return null;
  }

  return (
    <header className="w-full py-4 px-4 sm:px-6 md:px-8 bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
            <img 
              src={mustacheLogo} 
              alt="Mustache Logo" 
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg shadow-glow"
            />
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Mustache
            </h1>
          </Link>

          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navItems.map((item) => (
              isHomePage ? (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-foreground/80 hover:text-primary transition-colors text-sm lg:text-base"
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center space-x-2 text-foreground/80 hover:text-primary transition-colors text-sm lg:text-base"
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.name}</span>
                </Link>
              )
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            {isHomePage ? (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10 text-sm">
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            ) : (
              <Link to="/">
                <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10 text-sm">
                  Home
                </Button>
              </Link>
            )}
            {!isHomePage && user && (
              <Button
                variant="outline"
                size="sm"
                className="border-primary text-primary hover:bg-primary/10 text-sm"
                onClick={logout}
              >
                Log Out
              </Button>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border mt-4 pt-4 pb-4">
            <div className="space-y-3">
              {navItems.map((item) => (
                isHomePage ? (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block text-foreground/80 hover:text-primary transition-colors py-2 px-2 rounded-md hover:bg-secondary/50 text-base"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center space-x-3 text-foreground/80 hover:text-primary transition-colors py-2 px-2 rounded-md hover:bg-secondary/50 text-base"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon && <item.icon className="h-5 w-5" />}
                    <span>{item.name}</span>
                  </Link>
                )
              ))}
            </div>
            
            <div className="flex flex-col space-y-3 pt-4 mt-4 border-t border-border">
              {isHomePage ? (
                <>
                  <Link to="/login">
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 w-full justify-center" onClick={() => setIsMenuOpen(false)}>
                      Log In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300 w-full justify-center" onClick={() => setIsMenuOpen(false)}>
                      Sign Up
                    </Button>
                  </Link>
                </>
              ) : (
                <Link to="/" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 w-full justify-center">
                    Home
                  </Button>
                </Link>
              )}
              {!isHomePage && user && (
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10 w-full justify-center"
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                >
                  Log Out
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
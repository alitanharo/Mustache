import mustacheLogo from "@/assets/mustache-logo.jpg";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 bg-muted/20 border-t border-border">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <div className="col-span-1 sm:col-span-2">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <img 
                src={mustacheLogo} 
                alt="Mustache Logo" 
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg shadow-glow"
              />
              <h3 className="text-xl sm:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Mustache
              </h3>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 max-w-md">
              Building authentic friendships between men through shared interests, 
              activities, and genuine connections. Join our brotherhood today.
            </p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <Link to="/register" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link to="/register" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Terms of Service
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">Platform</h4>
            <ul className="space-y-2">
              <li><Link to="/discover" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors">Discover</Link></li>
              <li><Link to="/friends" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors">Friends</Link></li>
              <li><Link to="/messages" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors">Messages</Link></li>
              <li><Link to="/profile" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors">Profile</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/login" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors">Login</Link></li>
              <li><Link to="/register" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors">Register</Link></li>
              <li><Link to="/discover" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors">Find Friends</Link></li>
              <li><Link to="/messages" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors">Chat Support</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <p className="text-sm sm:text-base text-muted-foreground text-center sm:text-left">
              © 2024 Mustache. All rights reserved.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground text-center sm:text-right">
              Made for men who value real friendships.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
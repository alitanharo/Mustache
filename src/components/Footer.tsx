import mustacheLogo from "@/assets/mustache-logo.jpg";

const Footer = () => {
  return (
    <footer className="py-20 px-4 md:px-8 bg-muted/20 border-t border-border">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src={mustacheLogo} 
                alt="Mustache Logo" 
                className="w-10 h-10 rounded-lg shadow-glow"
              />
              <h3 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Mustache
              </h3>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Building authentic friendships between men through shared interests, 
              activities, and genuine connections. Join our brotherhood today.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Download App</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Web Version</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Safety Guidelines</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Community Rules</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Report Issue</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Feedback</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground">
              © 2024 Mustache. All rights reserved.
            </p>
            <p className="text-muted-foreground mt-4 md:mt-0">
              Made for men who value real friendships.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import { Link } from "react-router-dom";
import microsoftLogo from "@/assets/microsoft-logo.png";

const Footer = () => {
  return (
    <footer className="py-12 bg-foreground text-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="/logo/omisp-logo.png" alt="OMISP" className="w-10 h-10 object-contain" />
              <span className="font-semibold text-lg">OMISP</span>
            </Link>
            <p className="text-background/70 text-sm mb-4">
              One Move. Infinite Power.
            </p>
            {/* Microsoft Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-background/10 border border-background/20">
              <img src={microsoftLogo.src} alt="Microsoft" className="w-5 h-5 object-contain" />
              <div className="text-left">
                <p className="text-xs font-medium text-background">Microsoft for Startups</p>
                <p className="text-[10px] text-background/60">Founders Hub Member</p>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-background/70 text-sm">
              <li><Link to="/features" className="hover:text-background transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-background transition-colors">Pricing</Link></li>
              <li><Link to="/capital" className="hover:text-background transition-colors">OMISP Capital</Link></li>
              <li><Link to="/dashboard" className="hover:text-background transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* Features Links */}
          <div>
            <h4 className="font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-background/70 text-sm">
              <li><Link to="/omi-chat" className="hover:text-background transition-colors">Omi Chat</Link></li>
              <li><Link to="/pitch-gauntlet" className="hover:text-background transition-colors">Pitch Gauntlet</Link></li>
              <li><Link to="/revenue-architect" className="hover:text-background transition-colors">Revenue Architect</Link></li>
              <li><Link to="/ideaverse" className="hover:text-background transition-colors">Ideaverse Hub</Link></li>
              <li><Link to="/build-a-biz" className="hover:text-background transition-colors">Build-a-Biz Game</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-background/70 text-sm">
              <li><Link to="/about" className="hover:text-background transition-colors">About</Link></li>
              <li><Link to="/privacy" className="hover:text-background transition-colors">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-background transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-background/50 text-sm">
            © {new Date().getFullYear()} OMISP. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-background/50 text-xs">
            <span>Built with ❤️ for founders</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

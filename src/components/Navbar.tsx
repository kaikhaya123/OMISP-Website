import { useState, useRef, useEffect } from "react";
import { User, LayoutDashboard, Settings, DollarSign, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { MenuToggleIcon } from "@/components/ui/menu-toggle-icon";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Features", to: "/features" },
  { label: "Pricing", to: "/pricing" },
  { label: "OMISP Capital", to: "/capital" },
  { label: "About", to: "/about" },
];

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { role } = useUserRole();
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    setUserMenuOpen(false);
  };

  const dashboardPath = role === "investor" ? "/vc-dashboard" : "/dashboard";

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-background/80 backdrop-blur-md fixed w-full z-20 top-0 start-0 border-b border-border/50">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-3 md:p-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo/Omisp.png" className="h-10 md:h-14 w-auto object-contain mt-1" alt="OMISP Logo" />
          <span className="font-tanker font-bold text-lg md:text-xl lg:text-2xl whitespace-nowrap leading-none" style={{ color: 'black' }}>
            OMISP
          </span>
        </Link>

        {/* User menu & mobile toggle */}
        <div className="flex items-center md:order-2 space-x-2 md:space-x-3 rtl:space-x-reverse">
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                className="flex text-sm bg-muted rounded-full focus:ring-4 focus:ring-ring"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-expanded={userMenuOpen}
              >
                <span className="sr-only">Open user menu</span>
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary flex items-center justify-center">
                  <User className="w-4 h-4 md:w-5 md:h-5 text-primary-foreground" />
                </div>
              </button>

              {/* User Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 z-50 bg-card border border-border rounded-lg shadow-lg w-44">
                  <div className="px-3 md:px-4 py-2 md:py-3 text-sm border-b border-border">
                    <span className="block text-foreground font-medium text-sm">
                      {user.email?.split("@")[0] || "User"}
                    </span>
                    <span className="block text-muted-foreground truncate text-xs">
                      {user.email}
                    </span>
                  </div>
                  <ul className="p-2 text-sm text-foreground font-medium">
                    <li>
                      <Link
                        to={dashboardPath}
                        className="flex items-center gap-2 w-full p-2 hover:bg-muted rounded transition-colors text-sm"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/pricing"
                        className="flex items-center gap-2 w-full p-2 hover:bg-muted rounded transition-colors text-sm"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <DollarSign className="w-4 h-4" />
                        Pricing
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 w-full p-2 hover:bg-muted rounded transition-colors text-left text-sm"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="text-xs md:text-sm font-medium hover:text-primary/80 transition-colors px-3 md:px-4 py-2 rounded-lg hover:bg-muted"
              style={{ color: 'black' }}
            >
              Log in
            </Link>
          )}

          {/* Mobile menu button */}
          <button
            type="button"
            className="inline-flex items-center p-2 w-9 h-9 md:w-10 md:h-10 justify-center rounded-lg md:hidden hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring bg-primary text-white shadow-md border border-primary/30"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-controls="navbar-user"
            aria-expanded={mobileMenuOpen}
          >
            <span className="sr-only">Toggle navigation menu</span>
            <MenuToggleIcon 
              open={mobileMenuOpen}
              className="w-5 h-5 md:w-6 md:h-6 text-white"
              duration={300}
              stroke="white"
              strokeWidth={2.5}
            />
          </button>
        </div>

        {/* Navigation links */}
        <div
          className={`${
            mobileMenuOpen ? "block" : "hidden"
          } items-center justify-between w-full md:flex md:w-auto md:order-1`}
          id="navbar-user"
        >
          <ul className="font-medium flex flex-col p-3 md:p-0 mt-3 md:mt-4 border border-border rounded-lg bg-muted/50 md:flex-row md:space-x-8 rtl:space-x-reverse md:border-0 md:bg-transparent">
            {navLinks.map((link, index) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`block py-2 px-3 rounded transition-colors text-sm md:text-base ${
                    index === 0
                      ? "font-semibold md:bg-transparent"
                      : "hover:bg-muted md:hover:bg-transparent md:hover:text-primary"
                  }`}
                  style={{ color: 'black' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

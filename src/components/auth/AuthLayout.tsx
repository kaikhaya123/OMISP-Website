import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface AuthPanelProps {
  accentClass?: string;
  headline: string;
  subheadline: string;
  bullets: { icon: React.ElementType; text: string }[];
}

export const AuthSidePanel = ({ accentClass = "bg-primary", headline, subheadline, bullets }: AuthPanelProps) => (
  <div className={`hidden lg:flex lg:w-[45%] xl:w-1/2 relative overflow-hidden flex-shrink-0 ${accentClass}`}>
    {/* Subtle texture blobs */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-background/5 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-background/5 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-background/3 blur-2xl" />
    </div>

    <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
      <Link to="/" className="flex items-center gap-3 w-fit">
        <img src="/logo/omisp-logo.png" alt="OMISP" className="w-9 h-9 object-contain brightness-[10]" />
        <span className="font-bold text-lg tracking-tight text-primary-foreground">OMISP</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="max-w-sm"
      >
        <h2 className="text-3xl xl:text-4xl font-bold text-primary-foreground leading-[1.15] mb-5"
          dangerouslySetInnerHTML={{ __html: headline }}
        />
        <p className="text-primary-foreground/70 text-base mb-10 leading-relaxed">{subheadline}</p>
        <ul className="space-y-4">
          {bullets.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-primary-foreground/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-primary-foreground" />
              </span>
              <span className="text-primary-foreground/80 text-sm font-medium">{text}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      <p className="text-primary-foreground/40 text-xs">© {new Date().getFullYear()} OMISP. All rights reserved.</p>
    </div>
  </div>
);

interface AuthShellProps {
  children: React.ReactNode;
  sidePanel?: React.ReactNode;
}

export const AuthShell = ({ children, sidePanel }: AuthShellProps) => (
  <div className="min-h-screen bg-background flex">
    {sidePanel}
    <div className="flex-1 flex items-center justify-center p-6 lg:p-10 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-[420px]"
      >
        {/* Mobile logo */}
        <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
          <img src="/logo/omisp-logo.png" alt="OMISP" className="w-8 h-8 object-contain" />
          <span className="font-bold text-base text-foreground">OMISP</span>
        </Link>
        {children}
      </motion.div>
    </div>
  </div>
);

export const AuthDivider = ({ label = "Or continue with" }: { label?: string }) => (
  <div className="relative my-5">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-border" />
    </div>
    <div className="relative flex justify-center">
      <span className="bg-background px-3 text-xs text-muted-foreground uppercase tracking-wide">{label}</span>
    </div>
  </div>
);

export const GoogleButton = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full flex items-center justify-center gap-2.5 rounded-lg border border-border bg-card hover:bg-muted transition-colors py-2.5 text-sm font-medium text-foreground"
  >
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
    Continue with Google
  </button>
);

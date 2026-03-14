'use client';
import React from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { useScroll } from '@/components/ui/use-scroll';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { User, LayoutDashboard, Settings, DollarSign, LogOut } from 'lucide-react';

export function Header() {
	const [open, setOpen] = React.useState(false);
	const [userMenuOpen, setUserMenuOpen] = React.useState(false);
	const scrolled = useScroll(10);
	const { user, signOut } = useAuth();
	const { role } = useUserRole();
	const navigate = useNavigate();
	const userMenuRef = React.useRef<HTMLDivElement>(null);

	const handleSignOut = async () => {
		await signOut();
		navigate('/');
		setUserMenuOpen(false);
	};

	const dashboardPath = role === 'investor' ? '/vc-dashboard' : '/dashboard';

	const links = [
		{
			label: 'Features',
			href: '/features',
		},
		{
			label: 'Pricing',
			href: '/pricing',
		},
		{
			label: 'OMISP Capital',
			href: '/capital',
		},
		{
			label: 'About',
			href: '/about',
		},
	];

	// Close user menu when clicking outside
	React.useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
				setUserMenuOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	React.useEffect(() => {
		if (open) {
			// Disable scroll
			document.body.style.overflow = 'hidden';
		} else {
			// Re-enable scroll
			document.body.style.overflow = '';
		}

		// Cleanup when component unmounts (important for Next.js)
		return () => {
			document.body.style.overflow = '';
		};
	}, [open]);

	return (
		<>
			<header
				className={cn(
					'sticky top-0 z-50 mx-auto w-full max-w-7xl border-b border-transparent md:rounded-md md:border md:transition-all md:ease-out',
					{
						'border-white/20 md:top-4 md:max-w-6xl md:shadow-lg bg-white/95 backdrop-blur-md':
							scrolled && !open,
						'max-md:hidden': open,
					},
				)}
			>
			<nav
				className={cn(
					'flex h-16 w-full items-center justify-between px-6 md:px-8 lg:px-12 md:h-14 md:transition-all md:ease-out',
					{
						'md:px-6': scrolled,
					},
				)}
			>
				<Link to="/" className="flex items-center gap-2">
					<img src="/logo/Omisp.png" alt="OMISP" className="h-14 w-auto object-contain mt-1" />
				<span className={cn("font-tanker font-bold text-xl md:text-2xl leading-none", open ? "text-white" : "text-black")}>OMISP</span>
			</Link>

			{/* Desktop Navigation Links */}
			<div className="hidden md:flex items-center gap-6 lg:gap-8">
				{links.map((link) => (
					<Link
						key={link.label}
						to={link.href}
					className="font-tanker text-sm lg:text-base font-semibold transition-colors hover:text-primary text-black"
				>
					{link.label}
				</Link>
			))}
			
			{user ? (
				<div className="relative" ref={userMenuRef}>
					<button
						onClick={() => setUserMenuOpen(!userMenuOpen)}
						className="flex items-center gap-2 font-tanker text-sm lg:text-base font-semibold transition-colors hover:text-primary text-black"
					>
						<User className="w-4 h-4" />
					<span>{user.email?.split('@')[0] || 'User'}</span>
				</button>
				
				{userMenuOpen && (
							<div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
								<div className="px-4 py-2 border-b border-gray-200">
									<p className="text-sm font-medium text-gray-900">{user.email?.split('@')[0]}</p>
									<p className="text-xs text-gray-500 truncate">{user.email}</p>
								</div>
								<Link
									to={dashboardPath}
									onClick={() => setUserMenuOpen(false)}
									className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
								>
									<LayoutDashboard className="w-4 h-4" />
									<span>Dashboard</span>
								</Link>
								<button
									onClick={handleSignOut}
									className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
								>
									<LogOut className="w-4 h-4" />
									<span>Sign Out</span>
								</button>
							</div>
						)}
					</div>
				) : (
					<>
						<Link
							to="/login"
							className={cn(
								"font-tanker text-sm lg:text-base font-semibold transition-colors hover:text-primary",
								scrolled ? "text-black" : "text-black"
							)}
						>
							Sign In
						</Link>
						<Link to="/signup">
							<Button size="sm" className="font-tanker">
								Get Started
							</Button>
						</Link>
					</>
				)}
			</div>

			{/* Mobile Menu Toggle Button */}
			<Button size="icon" variant="outline" onClick={() => setOpen(!open)} className={cn("md:hidden", open ? "border-white text-white hover:bg-white/10" : scrolled ? "" : "border-black text-black hover:bg-black/10")}>
					<MenuToggleIcon open={open} className="size-5" duration={300} />
				</Button>
			</nav>
		</header>

		{/* Full Screen Menu - Mobile Only */}
		<div
			className={cn(
				'fixed inset-0 z-[200] md:hidden',
				open ? 'flex' : 'hidden',
			)}
		>
				{/* Full Screen Video Background */}
				<div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
					<video
						autoPlay
						loop
						muted
						playsInline
						className="absolute inset-0 w-full h-full object-cover"
						src="/Videos/3248994-uhd_3840_2160_25fps.mp4"
					/>
					{/* Video Overlay */}
					<div className="absolute inset-0 bg-black/75" />
				</div>

				{/* Full Screen Content */}
				<div
					data-slot={open ? 'open' : 'closed'}
					className={cn(
						'data-[slot=open]:animate-in data-[slot=open]:fade-in data-[slot=open]:zoom-in-95 data-[slot=closed]:animate-out data-[slot=closed]:fade-out data-[slot=closed]:zoom-out-95 ease-out duration-300',
						'w-full h-full flex flex-col relative z-[10]',
					)}
				>
					{/* Header with Logo and Close Button */}
					<div className="flex items-center justify-between px-8 md:px-12 py-5 md:py-6">
						<Link to="/" className="flex items-center gap-2 md:gap-2.5" onClick={() => setOpen(false)}>
							<img src="/logo/Omisp.png" alt="OMISP" className="h-11 md:h-12 w-auto object-contain" />
							<span className="text-2xl md:text-2xl lg:text-3xl font-tanker font-bold text-white tracking-tight">OMISP</span>
						</Link>
						<button
							onClick={() => setOpen(false)}
							className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all border border-white/30 hover:border-white/50 group"
						>
							<span className="text-white text-2xl md:text-3xl font-light group-hover:scale-110 transition-transform">×</span>
						</button>
					</div>

					{/* Navigation Items - Right Aligned */}
					<nav className="flex-1 flex flex-col justify-center items-end gap-4 md:gap-4 lg:gap-5 px-8 md:px-12 lg:px-16">
						{links.map((link) => (
							<Link
								key={link.label}
								to={link.href}
								onClick={() => setOpen(false)}
								className="text-3xl md:text-3xl lg:text-4xl font-tanker font-bold text-white hover:text-primary transition-colors tracking-tight whitespace-nowrap"
							>
								{link.label.toUpperCase()}
							</Link>
						))}
						
						{user && (
							<>
								<Link
									to={dashboardPath}
									onClick={() => setOpen(false)}
									className="text-3xl md:text-3xl lg:text-4xl font-tanker font-bold text-white hover:text-primary transition-colors tracking-tight whitespace-nowrap"
								>
									DASHBOARD
								</Link>
								<button
									onClick={() => { setOpen(false); handleSignOut(); }}
									className="text-3xl md:text-3xl lg:text-4xl font-tanker font-bold text-white hover:text-primary transition-colors text-right tracking-tight whitespace-nowrap"
								>
									SIGN OUT
								</button>
							</>
						)}
						
						{!user && (
							<>
								<Link
									to="/login"
									onClick={() => setOpen(false)}
									className="text-3xl md:text-3xl lg:text-4xl font-tanker font-bold text-white hover:text-primary transition-colors tracking-tight whitespace-nowrap"
								>
									SIGN IN
								</Link>
								<Link
									to="/signup"
									onClick={() => setOpen(false)}
									className="mt-4 md:mt-4"
								>
									<Button size="default" className="font-tanker text-lg md:text-lg lg:text-xl px-9 md:px-10 py-5 md:py-5 bg-primary hover:bg-primary/90 text-white shadow-lg">
										GET STARTED
									</Button>
								</Link>
							</>
						)}
					</nav>

					{/* Footer Info */}
					<div className="mt-auto px-8 md:px-12 py-5 md:py-5">
						{user && (
							<div className="text-right text-white/80 mb-3">
								<p className="font-medium text-base md:text-base">{user.email?.split("@")[0] || "User"}</p>
								<p className="text-xs md:text-xs text-white/60">{user.email}</p>
							</div>
						)}
						<div className="flex items-center justify-end text-xs md:text-xs text-white/60">
							<span>© 2026 OMISP</span>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

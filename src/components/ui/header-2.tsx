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
		<header
			className={cn(
				'sticky top-0 z-50 mx-auto w-full max-w-7xl border-b border-transparent md:rounded-md md:border md:transition-all md:ease-out',
				{
					'border-white/20 md:top-4 md:max-w-6xl md:shadow-lg bg-white/95 backdrop-blur-md':
						scrolled && !open,
					'bg-white/95 backdrop-blur-md': open,
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
					<span className={cn("font-tanker font-bold text-xl md:text-2xl leading-none", scrolled ? "text-foreground" : "text-black")}>OMISP</span>
				</Link>
				<div className="hidden items-center gap-2 md:flex">
					{links.map((link, i) => (
						<Link key={i} className={cn(buttonVariants({ variant: 'ghost' }), 'font-tanker', scrolled ? '' : 'text-black hover:text-black')} to={link.href}>
							{link.label}
						</Link>
					))}
					{user ? (
						<div className="relative" ref={userMenuRef}>
							<button
								type="button"
								className={cn("flex text-sm rounded-full focus:ring-4", scrolled ? "bg-muted focus:ring-ring" : "bg-black/10 focus:ring-black/20")}
								onClick={() => setUserMenuOpen(!userMenuOpen)}
								aria-expanded={userMenuOpen}
							>
								<span className="sr-only">Open user menu</span>
								<div className={cn("w-8 h-8 rounded-full flex items-center justify-center", scrolled ? "bg-primary" : "bg-black")}>
									<User className={cn("w-5 h-5", scrolled ? "text-primary-foreground" : "text-white")} />
								</div>
							</button>

							{/* User Dropdown */}
							{userMenuOpen && (
								<div className="absolute right-0 mt-2 z-50 bg-card border border-border rounded-lg shadow-lg w-44">
									<div className="px-4 py-3 text-sm border-b border-border">
										<span className="block text-foreground font-medium">
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
												className="flex items-center gap-2 w-full p-2 hover:bg-muted rounded transition-colors"
												onClick={() => setUserMenuOpen(false)}
											>
												<LayoutDashboard className="w-4 h-4" />
												Dashboard
											</Link>
										</li>
										<li>
											<Link
												to="/pricing"
												className="flex items-center gap-2 w-full p-2 hover:bg-muted rounded transition-colors"
												onClick={() => setUserMenuOpen(false)}
											>
												<DollarSign className="w-4 h-4" />
												Pricing
											</Link>
										</li>
										<li>
											<button
												onClick={handleSignOut}
												className="flex items-center gap-2 w-full p-2 hover:bg-muted rounded transition-colors text-left"
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
						<>
							<Link to="/login">
								<Button variant="outline" className={cn('font-tanker', scrolled ? "" : "border-black text-black hover:bg-black/10")}>Sign In</Button>
							</Link>
							<Link to="/signup">
								<Button className={cn('font-tanker', scrolled ? "" : "bg-black text-white hover:bg-black/90")}>Get Started</Button>
							</Link>
						</>
					)}
				</div>
				<Button size="icon" variant="outline" onClick={() => setOpen(!open)} className={cn("md:hidden", scrolled ? "" : "border-black text-black hover:bg-black/10")}>
					<MenuToggleIcon open={open} className="size-5" duration={300} />
				</Button>
			</nav>

			<div
				className={cn(
					'bg-background/90 fixed top-16 right-0 bottom-0 left-0 z-50 flex flex-col overflow-hidden border-y md:hidden',
					open ? 'block' : 'hidden',
				)}
			>
				<div
					data-slot={open ? 'open' : 'closed'}
					className={cn(
						'data-[slot=open]:animate-in data-[slot=open]:zoom-in-95 data-[slot=closed]:animate-out data-[slot=closed]:zoom-out-95 ease-out',
						'flex h-full w-full flex-col justify-between gap-y-4 p-6',
					)}
				>
					<div className="grid gap-y-3">
						{links.map((link) => (
							<Link
								key={link.label}
								className={buttonVariants({
									variant: 'ghost',
									className: 'justify-start',
								})}
								to={link.href}
								onClick={() => setOpen(false)}
							>
								{link.label}
							</Link>
						))}
					</div>
					<div className="flex flex-col gap-3">
						{user ? (
							<>
								<div className="px-4 py-3 text-sm border border-border rounded-lg bg-muted/50">
									<span className="block text-foreground font-medium">
										{user.email?.split("@")[0] || "User"}
									</span>
									<span className="block text-muted-foreground truncate text-xs">
										{user.email}
									</span>
								</div>
								<Link to={dashboardPath} onClick={() => setOpen(false)}>
									<Button variant="outline" className="w-full font-tanker justify-start gap-2">
										<LayoutDashboard className="w-4 h-4" />
										Dashboard
									</Button>
								</Link>
								<Link to="/pricing" onClick={() => setOpen(false)}>
									<Button variant="outline" className="w-full font-tanker justify-start gap-2">
										<DollarSign className="w-4 h-4" />
										Pricing
									</Button>
								</Link>
								<Button className="w-full font-tanker justify-start gap-2" onClick={() => { setOpen(false); handleSignOut(); }}>
									<LogOut className="w-4 h-4" />
									Sign Out
								</Button>
							</>
						) : (
							<>
								<Link to="/login" onClick={() => setOpen(false)}>
									<Button variant="outline" className="w-full font-tanker">
										Sign In
									</Button>
								</Link>
								<Link to="/signup" onClick={() => setOpen(false)}>
									<Button className="w-full font-tanker">Get Started</Button>
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</header>
	);
}

'use client';
import React from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { useScroll } from '@/components/ui/use-scroll';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import omispLogo from '@/assets/omisp-logo.png';

export function Header() {
	const [open, setOpen] = React.useState(false);
	const scrolled = useScroll(10);
	const { user, signOut } = useAuth();
	const { role } = useUserRole();
	const navigate = useNavigate();

	const handleSignOut = async () => {
		await signOut();
		navigate('/');
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
					<img src="/logo/omisp-logo.png" alt="OMISP" className="h-6 w-6 object-contain" />
					<span className={cn("font-tanker font-semibold text-base", scrolled ? "text-foreground" : "text-black")}>OMISP</span>
				</Link>
				<div className="hidden items-center gap-2 md:flex">
					{links.map((link, i) => (
						<Link key={i} className={cn(buttonVariants({ variant: 'ghost' }), 'font-tanker', scrolled ? '' : 'text-black hover:text-black')} to={link.href}>
							{link.label}
						</Link>
					))}
					{user ? (
						<>
							<Link to={dashboardPath}>
								<Button variant="outline" className={cn(scrolled ? "" : "border-black text-black hover:bg-black/10")}>Dashboard</Button>
							</Link>
							<Button onClick={handleSignOut} className={cn(scrolled ? "" : "bg-black text-white hover:bg-black/90")}>Sign Out</Button>
						</>
					) : (
						<>
							<Link to="/login">
								<Button variant="outline" className={cn(scrolled ? "" : "border-black text-black hover:bg-black/10")} style={{ fontFamily: 'Lora, serif' }}>Sign In</Button>
							</Link>
							<Link to="/signup">
								<Button className={cn(scrolled ? "" : "bg-black text-white hover:bg-black/90")} style={{ fontFamily: 'Lora, serif' }}>Get Started</Button>
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
								<Link to={dashboardPath} onClick={() => setOpen(false)}>
									<Button variant="outline" className="w-full">
										Dashboard
									</Button>
								</Link>
								<Button className="w-full" onClick={() => { setOpen(false); handleSignOut(); }}>
									Sign Out
								</Button>
							</>
						) : (
							<>
								<Link to="/login" onClick={() => setOpen(false)}>
									<Button variant="outline" className="w-full" style={{ fontFamily: 'Lora, serif' }}>
										Sign In
									</Button>
								</Link>
								<Link to="/signup" onClick={() => setOpen(false)}>
									<Button className="w-full" style={{ fontFamily: 'Lora, serif' }}>Get Started</Button>
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</header>
	);
}

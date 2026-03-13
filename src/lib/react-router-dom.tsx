import NextLink from "next/link";
import { useRouter } from "next/router";
import {
  forwardRef,
  useEffect,
  useMemo,
  type AnchorHTMLAttributes,
  type ReactNode,
} from "react";

type NavigateOptions = {
  replace?: boolean;
  state?: unknown;
};

type NavState = {
  isActive: boolean;
  isPending: boolean;
};

type ClassNameValue = string | ((state: NavState) => string);
type ChildrenValue = ReactNode | ((state: NavState) => ReactNode);

export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  to: string;
  replace?: boolean;
  scroll?: boolean;
}

export interface NavLinkProps extends Omit<LinkProps, "children" | "className"> {
  children?: ChildrenValue;
  className?: ClassNameValue;
  end?: boolean;
}

export interface NavigateProps {
  to: string;
  replace?: boolean;
  state?: unknown;
}

export interface LocationLike {
  hash: string;
  key: string;
  pathname: string;
  search: string;
  state: unknown;
}

const normalizePath = (value: string) => {
  const [pathname] = value.split(/[?#]/);
  return pathname === "" ? "/" : pathname;
};

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ to, replace, scroll, children, ...props }, ref) => (
    <NextLink ref={ref} href={to} replace={replace} scroll={scroll} {...props}>
      {children}
    </NextLink>
  ),
);

Link.displayName = "Link";

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ to, end, className, children, ...props }, ref) => {
    const router = useRouter();
    const isActive = useMemo(() => {
      const currentPath = normalizePath(router.asPath || router.pathname || "/");
      const targetPath = normalizePath(to);

      if (end) {
        return currentPath === targetPath;
      }

      return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
    }, [end, router.asPath, router.pathname, to]);

    const state = useMemo<NavState>(() => ({ isActive, isPending: false }), [isActive]);
    const resolvedClassName = typeof className === "function" ? className(state) : className;
    const resolvedChildren = typeof children === "function" ? children(state) : children;

    return (
      <Link ref={ref} to={to} className={resolvedClassName} {...props}>
        {resolvedChildren}
      </Link>
    );
  },
);

NavLink.displayName = "NavLink";

export const useNavigate = () => {
  const router = useRouter();

  return (to: number | string, options?: NavigateOptions) => {
    if (typeof to === "number") {
      if (to < 0) {
        router.back();
      }
      return;
    }

    if (options?.replace) {
      void router.replace(to);
      return;
    }

    void router.push(to);
  };
};

export const useParams = <T extends Record<string, string | undefined> = Record<string, string | undefined>>() => {
  const router = useRouter();

  return useMemo(() => {
    const params = Object.fromEntries(
      Object.entries(router.query).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]),
    );

    return params as T;
  }, [router.query]);
};

export const useLocation = (): LocationLike => {
  const router = useRouter();

  return useMemo(() => {
    const asPath = router.asPath || router.pathname || "/";
    const [pathWithSearch, hashPart = ""] = asPath.split("#");
    const [pathname = "/", searchPart = ""] = pathWithSearch.split("?");

    return {
      pathname,
      search: searchPart ? `?${searchPart}` : "",
      hash: hashPart ? `#${hashPart}` : "",
      state: null,
      key: asPath,
    };
  }, [router.asPath, router.pathname]);
};

export const Navigate = ({ to, replace }: NavigateProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(to, { replace });
  }, [navigate, replace, to]);

  return null;
};
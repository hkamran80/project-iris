"use client";

import { usePathname } from "next/navigation";
import { classNames } from "@hkamran/utility-web";
import Link from "next/link";
import type { NavLinkProps } from "../NavLink";

const NavLinkClient = ({
    href,
    children,
    className,
    conditionalClassNames,
    target,
    rel,
    ...rest
}: NavLinkProps) => {
    const pathname = usePathname();

    if (href === pathname) {
        return <span className={className}>{children}</span>;
    } else {
        return (
            <Link
                href={href}
                className={classNames(
                    className ?? "",
                    conditionalClassNames ?? "",
                )}
                target={target}
                rel={rel}
                {...rest}
            >
                {children}
            </Link>
        );
    }
};

export default NavLinkClient;

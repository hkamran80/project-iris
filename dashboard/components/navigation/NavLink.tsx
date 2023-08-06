import { classNames } from "@hkamran/utility-web";
import { type HTMLAttributeAnchorTarget } from "react";
import NavLinkClient from "./NavLink/Client";

export type NavLinkProps = {
    href: string;
    children: React.ReactNode;
    className?: string;
    conditionalClassNames?: string;
    target?: HTMLAttributeAnchorTarget;
    rel?: string;
} & Partial<Pick<HTMLAnchorElement, "title" | "ariaLabel">>;

const NavLink = ({
    href,
    children,
    className,
    conditionalClassNames,
    target,
    rel,
    ...rest
}: NavLinkProps) => {
    if (href.startsWith("http")) {
        return (
            <a
                href={href}
                className={classNames(
                    className ?? "",
                    conditionalClassNames ?? "",
                )}
                target={target ?? "_blank"}
                rel={rel ?? "noopener noreferrer"}
                {...rest}
            >
                {children}
            </a>
        );
    } else {
        return (
            <NavLinkClient
                href={href}
                className={className}
                conditionalClassNames={conditionalClassNames}
                target={target}
                rel={rel}
                {...rest}
            >
                {children}
            </NavLinkClient>
        );
    }
};

export default NavLink;

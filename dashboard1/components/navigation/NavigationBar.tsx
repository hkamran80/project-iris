"use client";

import NavLink from "./NavLink";
import Logout from "./NavigationBar/Logout";
import ThemeToggle from "./NavigationBar/ThemeToggle";

const NavigationBar = () => (
    <nav className="bg-white shadow dark:bg-hk-grey">
        <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
            <div className="flex h-16 justify-between">
                <div className="flex w-full px-2 lg:px-0">
                    <NavLink
                        href="/"
                        className="flex flex-shrink-0 items-center font-bold text-indigo-500"
                    >
                        Iris
                    </NavLink>
                </div>
                <div className="flex flex-1 items-center justify-center space-x-4 px-2 md:space-x-8 lg:ml-6 lg:justify-end">
                    <Logout />
                    <ThemeToggle />
                </div>
            </div>
        </div>
    </nav>
);

export default NavigationBar;

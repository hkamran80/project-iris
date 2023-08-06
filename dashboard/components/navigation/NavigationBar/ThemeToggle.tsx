"use client";

import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import {
    Laptop2,
    Moon,
    Sun,
    MoreHorizontal,
    type LucideIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { classNames } from "@hkamran/utility-web";

const buttonStyle = (active: boolean): string =>
    classNames(
        active ? "bg-pink-700 text-white dark:bg-pink-400" : "text-gray-900",
        "flex w-full items-center rounded-md px-2 py-2 text-sm transition-colors duration-150 ease-in-out text-gray-900 dark:text-white",
    );

const ThemeIcon = ({ theme }: { theme: string }) => {
    switch (theme) {
        case "system":
            return <Laptop2 />;
        case "dark":
            return <Moon />;
        case "light":
            return <Sun />;
    }
};

const ThemeToggle = () => {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="py-2 text-sm font-medium text-black dark:text-white">
                <MoreHorizontal />
            </div>
        );
    }

    return (
        <div className="text-right">
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <Menu.Button className="inline-flex w-full justify-center rounded-lg py-2 text-sm font-medium text-black hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-700 focus-visible:ring-opacity-75 dark:text-white dark:focus-visible:ring-pink-400">
                        <ThemeIcon theme={theme ?? "system"} />
                    </Menu.Button>
                </div>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute right-0 mt-2 w-32 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-hk-grey-hover">
                        <div className="space-y-1 px-2 py-2">
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        className={buttonStyle(active)}
                                        onClick={() => setTheme("system")}
                                    >
                                        <Laptop2 className="mr-2" />
                                        System
                                    </button>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        className={buttonStyle(active)}
                                        onClick={() => setTheme("light")}
                                    >
                                        <Sun className="mr-2" />
                                        Light
                                    </button>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        className={buttonStyle(active)}
                                        onClick={() => setTheme("dark")}
                                    >
                                        <Moon className="mr-2" />
                                        Dark
                                    </button>
                                )}
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    );
};

export default ThemeToggle;

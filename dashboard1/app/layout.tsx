// eslint-disable-next-line import/no-unassigned-import
import "./globals.css";
import { Nunito_Sans } from "next/font/google";
import { classNames } from "@hkamran/utility-web";
import Providers from "@/providers/Providers";
import NavigationBar from "@/components/navigation/NavigationBar";
import type { Metadata } from "next";

const nunitoSans = Nunito_Sans({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-nunito-sans",
});

export const metadata: Metadata = {
    title: "Iris",
    description: "Curated news stories, delivered by Discord",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body
                className={classNames(
                    nunitoSans.className,
                    "bg-gray-100 text-black dark:bg-black dark:text-white",
                )}
            >
                <Providers>
                    <NavigationBar />
                    {children}
                </Providers>
            </body>
        </html>
    );
}

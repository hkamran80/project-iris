"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { checkAuthorized } from "@/lib/auth";

const Login = () => {
    const { data: session, status } = useSession();
    const { push } = useRouter();

    if (status === "loading") {
        return (
            <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
                <div className="mt-8">
                    <Loading />
                </div>
            </div>
        );
    }

    if (status === "authenticated") {
        if (checkAuthorized(session.user?.image ?? "")) {
            push("/");
        } else {
            return (
                <div className="mx-auto max-w-2xl space-y-4 px-6 py-10 lg:px-8">
                    <h1 className="text-2xl font-semibold leading-6 text-gray-700 dark:text-gray-300">
                        Iris
                    </h1>

                    <p>
                        This application is exclusively for use by authorized
                        users. If you do not have access, please sign out and
                        leave this app.
                    </p>

                    <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={() => signOut()}
                    >
                        Sign out
                    </button>
                </div>
            );
        }
    }

    return (
        <div className="mx-auto max-w-xl space-y-4 px-6 py-10 lg:px-8">
            <div className="space-y-1 text-center">
                <h1 className="text-2xl font-semibold leading-6 text-gray-700 dark:text-gray-300">
                    Iris
                </h1>
            </div>

            <div>
                <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => signIn("github")}
                >
                    Sign in
                </button>
            </div>
        </div>
    );
};

export default Login;

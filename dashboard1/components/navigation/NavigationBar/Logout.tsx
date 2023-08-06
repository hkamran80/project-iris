"use client";

import { LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

const Logout = () => {
    const { status } = useSession();
    if (status === "authenticated") {
        return (
            <button
                type="button"
                onClick={async () =>
                    await signOut({
                        callbackUrl: "/login",
                    })
                }
            >
                <LogOut className="h-5 w-5 text-red-500" />
            </button>
        );
    }

    return null;
};

export default Logout;

import { withAuth } from "next-auth/middleware";
import { checkAuthorized } from "@/lib/auth";

export default withAuth({
    callbacks: {
        authorized: ({ token }) => {
            if (token && token.picture) {
                return checkAuthorized(token.picture);
            }

            return false;
        },
    },
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login).*)"],
};

import NextAuth from "next-auth";
import { options } from "@/lib/constants";

const handler = NextAuth(options);

export { handler as GET, handler as POST };

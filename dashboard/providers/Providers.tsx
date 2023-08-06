import ThemeProvider from "./ThemeProvider";
import AuthProvider from "./AuthProvider";

const Providers = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>
        <ThemeProvider>{children}</ThemeProvider>
    </AuthProvider>
);

export default Providers;

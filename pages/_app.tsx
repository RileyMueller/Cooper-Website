import { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { theme } from "../theme";
import { ThemeProvider } from "styled-components";

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <ThemeProvider theme={theme}>
            <SessionProvider session={pageProps.session}>
                <Component {...pageProps} />
            </SessionProvider>
        </ThemeProvider>
    );
};

export default App;

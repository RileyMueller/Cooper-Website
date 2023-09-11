import { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { theme } from "../theme";
import { ThemeProvider } from "styled-components";
import Head from 'next/head';

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <ThemeProvider theme={theme}>
            <SessionProvider session={pageProps.session}>
                <Head>
                    <link rel="icon" href="/images/favicon.ico"/>
                </Head>
                <Component {...pageProps} />
            </SessionProvider>
        </ThemeProvider>
    );
};

export default App;

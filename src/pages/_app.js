import { useEffect, useState } from "react";
import Layout from "@/components/layout";
import "@/styles/globals.css";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import Head from "next/head";
import { usePathname } from "next/navigation";
import ErrorGlobalProvider from "@/components/globalError";
import customizeTheme from "@/theme";

export default function App({ Component, pageProps }) {
  const [themeMode, setThemeMode] = useState("dark");
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setThemeMode(savedTheme);
    }
  }, []);

  return (
    <ThemeProvider theme={customizeTheme}>
      <Head>
        <title>NoteX</title>
        <meta name="description" content="notex your fast and easy note application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CssBaseline />
      <ErrorGlobalProvider>
        {isAuthPage ? <Component {...pageProps} /> : <Layout pageTitle={Component.pageTitle}><Component {...pageProps} /></Layout>}
      </ErrorGlobalProvider>
    </ThemeProvider>
  );
}
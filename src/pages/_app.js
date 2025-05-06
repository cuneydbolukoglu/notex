import { useEffect, useState } from "react";
import Layout from "@/components/layout";
import "@/styles/globals.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
import { CssBaseline } from "@mui/material";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  const [themeMode, setThemeMode] = useState("dark");
  const router = useRouter();
  const noLayoutPages = ["/login"];

  const isNoLayoutPage = noLayoutPages.includes(router.pathname);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setThemeMode(savedTheme);
    }
  }, []);

  const customizeTheme = createTheme({
    palette: {
      mode: themeMode === "light" ? "light" : "dark",
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                boxShadow: 'none',
                '-webkit-box-shadow': 'none',
              },
              '&:hover fieldset': {
                boxShadow: 'none',
              },
              '&.Mui-focused fieldset': {
                boxShadow: 'none',
              },
              '& .MuiInputBase-input.MuiOutlinedInput-input:-webkit-autofill': {
                backgroundColor: 'transparent',
                color: 'inherit',
                boxShadow: 'none',
              },
            },
          },
        },
      }
    },
  });

  return (
    <ThemeProvider theme={customizeTheme}>
      <Head>
        <title>NoteX</title>
        <meta name="description" content="notex your fast and easy note application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CssBaseline />
      {isNoLayoutPage ? <Component {...pageProps} /> : <Layout pageTitle={Component.pageTitle}><Component {...pageProps} /></Layout>}
    </ThemeProvider>
  );
}
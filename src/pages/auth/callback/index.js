"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/services/axiosInstance";
import utils from "@/utils";
import { Box, CircularProgress, Typography } from "@mui/material";

const signInWithGoogleToken = async (googleIdToken) => {
    const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI;

    if (!FIREBASE_API_KEY) {
        console.error("Firebase API Key is missing");
        return null;
    }

    try {
        const URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=${FIREBASE_API_KEY}`;

        const response = await axiosInstance.post(
            URL,
            {
                postBody: `id_token=${googleIdToken}&providerId=google.com`,
                requestUri: REDIRECT_URI,
                returnIdpCredential: true,
                returnSecureToken: true,
            },
            { headers: { "Content-Type": "application/json" } }
        );

        const respData = response?.data;
        const { idToken, refreshToken, expiresIn } = respData;

        if (!idToken) {
            console.error("No ID token received from Firebase");
            return null;
        }

        // Session cookie'yi server-side ayarla (HTTP-only)
        const sessionResponse = await fetch('/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken, refreshToken, expiresIn })
        });

        if (!sessionResponse.ok) {
            console.error("Failed to set session cookie");
            return null;
        }

        // Client-side token'ı da set et (fallback için)
        utils.cookieManager.set("token", idToken);
        if (refreshToken) {
            utils.cookieManager.set("refreshToken", refreshToken);
        }

        // İsteğe bağlı: client-side yardımcı bilgiler
        localStorage.setItem("user", JSON.stringify([{ 
            displayName: respData.displayName, 
            email: respData.email 
        }]));

        return idToken;
    } catch (error) {
        console.error("Firebase Sign-In Error:", error.response?.data || error.message);
        return null;
    }
};

const GoogleCallback = () => {
    const router = useRouter();

    useEffect(() => {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const urlParams = new URLSearchParams(window.location.search);
        
        // Check both hash and query parameters for the token
        const googleIdToken = hashParams.get("id_token") || urlParams.get("id_token");
        const state = hashParams.get("state") || urlParams.get("state");
        const error = hashParams.get("error") || urlParams.get("error");

        // Check for OAuth errors
        if (error) {
            console.error("Google OAuth Error:", error);
            router.push("/auth/login?error=oauth_error");
            return;
        }

        // Verify state parameter for security
        const storedState = sessionStorage.getItem('oauth_state');
        if (state !== storedState) {
            console.error("State parameter mismatch. Possible CSRF attack.");
            router.push("/auth/login?error=state_mismatch");
            return;
        }

        if (googleIdToken) {
            signInWithGoogleToken(googleIdToken).then((token) => {
                if (token) {
                    // Clear OAuth state
                    sessionStorage.removeItem('oauth_state');
                    sessionStorage.removeItem('oauth_nonce');
                    router.push("/");
                } else {
                    router.push("/auth/login?error=token_exchange_failed");
                }
            }).catch((error) => {
                console.error("Token exchange failed:", error);
                router.push("/auth/login?error=token_exchange_failed");
            });
        } else {
            console.error("Google ID Token alınamadı.");
            router.push("/auth/login?error=no_token");
        }
    }, [router]);

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
            // bgcolor="#f5f5f5"
        >
            <CircularProgress size={60} color="primary" />
            <Typography variant="h6" mt={3}>
                Google ile giriş yapılıyor...
            </Typography>
            <Typography variant="body2" mt={1} color="textSecondary">
                Lütfen bekleyin, yönlendiriliyorsunuz...
            </Typography>
        </Box>
    );
};

export default GoogleCallback;
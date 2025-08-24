"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/services/axiosInstance";
import utils from "@/utils";
import { Box, CircularProgress, Typography } from "@mui/material";

const signInWithGoogleToken = async (googleIdToken) => {
    const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI;

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

        const { idToken, refreshToken } = respData;

        utils.cookieManager.set("token", idToken);
        utils.cookieManager.set("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify([{ displayName: respData.displayName, email: respData.email }]));

        return idToken;
    } catch (error) {
        console.error("Firebase Sign-In Error:", error.response?.data || error.message);
    }
};

const GoogleCallback = () => {
    const router = useRouter();

    useEffect(() => {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const googleIdToken = hashParams.get("id_token");

        if (googleIdToken) {
            signInWithGoogleToken(googleIdToken).then(() => {
                router.push("/");
            });
        } else {
            console.error("Google ID Token alınamadı.");
            router.push("/auth/login");
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
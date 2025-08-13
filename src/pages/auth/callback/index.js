"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/services/axiosInstance";
import utils from "@/utils";

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

    const { idToken, refreshToken } = response.data;
    console.log("Firebase Response:", response.data);

    // Tokenları sakla
    utils.cookieManager.set("token", idToken);
    utils.cookieManager.set("refreshToken", refreshToken);

    return idToken;
  } catch (error) {
    console.error("Firebase Sign-In Error:", error.response?.data || error.message);
  }
};

const GoogleCallback = () => {
  const router = useRouter();

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const googleIdToken = hashParams.get("id_token"); // Artık direkt geliyor

    if (googleIdToken) {
      signInWithGoogleToken(googleIdToken).then(() => {
        router.push("/"); // giriş başarılı
      });
    } else {
      console.error("Google ID Token alınamadı.");
      router.push("/auth/login");
    }
  }, [router]);

  return <p>Giriş yapılıyor...</p>;
};

export default GoogleCallback;
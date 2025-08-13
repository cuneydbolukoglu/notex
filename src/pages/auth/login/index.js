import { Container, Typography, FormControlLabel, Checkbox, Button, Link, Paper, Divider, FormLabel, FormHelperText, Snackbar } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import utils from '@/utils';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axiosInstance from '@/services/axiosInstance';
import CustomInput from '@/components/customInput';

export default function Login() {
    const [token, setToken] = useState(null);
    const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const router = useRouter();

    useEffect(() => {
        if (token !== null) {
            utils.cookieManager.set("token", token);
        }
    }, [token]);

    const signIn = async (values, { setSubmitting }) => {
        const URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`;
        try {
            const response = await axiosInstance.post(URL, {
                email: values.email,
                password: values.password,
                returnSecureToken: true
            }, {
                headers: { "Content-Type": "application/json" }
            });
            const respData = response?.data;
            const idToken = respData?.idToken;
            const refreshToken = respData?.refreshToken;

            if (respData) {
                setToken(idToken);
                utils.cookieManager.set("token", idToken);
                utils.cookieManager.set("refreshToken", refreshToken);
                localStorage.setItem("user", JSON.stringify([{ displayName: respData.displayName, email: respData.email }]));
                router.push("/");
            }
        } catch (error) {
            console.error("Login error:", error);
        }
        setSubmitting(false);
    };

    const signInWithGoogle = () => {
        const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI;
        // const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=openid email profile&state=random_string`;
        const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=id_token%20token&scope=openid%20email%20profile&state=random_string&nonce=random_nonce`;

        window.location.href = GOOGLE_AUTH_URL;
    };

    const validationSchema = Yup.object({
        email: Yup.string().email("Geçerli bir email girin").required("Email zorunludur"),
        password: Yup.string().min(6, "Şifre en az 6 karakter olmalıdır").required("Şifre zorunludur")
    });

    const forgotPassword = async (values) => {
        const URL = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${FIREBASE_API_KEY}`;
        try {
            const response = await axiosInstance.post(URL, {
                email: "cuneydbolukogluu@gmail.com",
                requestType: "PASSWORD_RESET",
            }, {
                headers: { "Content-Type": "application/json" }
            });

        } catch (error) {
            console.error("Login error:", error);
        }
    };

    return (
        <Container className='auth' component="main" maxWidth="xs">
            <Paper elevation={6} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography sx={{ textAlign: 'left' }} component="h1" variant="h5">Sign In</Typography>
                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={validationSchema}
                    onSubmit={signIn}
                >
                    {({ isSubmitting, errors, touched }) => (
                        <Form className='form'>
                            <div style={{ marginBottom: 16 }}>
                                <FormLabel htmlFor="email">Email</FormLabel>
                                <Field
                                    fullWidth
                                    name="email"
                                    id="email"
                                    as={CustomInput}
                                    placeholder="your@email.com"
                                    type="email"
                                    aria-label="email"
                                />
                                {touched.email && errors.email && (
                                    <FormHelperText error>{errors.email}</FormHelperText>
                                )}
                            </div>

                            <div style={{ marginBottom: 16 }}>
                                <FormLabel htmlFor="password">Password</FormLabel>
                                <Field
                                    fullWidth
                                    name="password"
                                    id="password"
                                    as={CustomInput}
                                    placeholder="......"
                                    type="password"
                                    aria-label="password"
                                />
                                {touched.password && errors.password && (
                                    <FormHelperText error>{errors.password}</FormHelperText>
                                )}
                            </div>

                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Remember me"
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                disabled={isSubmitting}
                            >
                                Sign In
                            </Button>

                            <Typography textAlign="center">
                                Don't have an account? <Link href="/auth/sign-up" variant="body2">Sign up</Link>
                            </Typography>

                            <Link onClick={forgotPassword} variant="body2">Forgot password?</Link>

                            <Divider sx={{ my: 2 }}>or</Divider>

                            <Button
                                fullWidth
                                sx={{ mt: 2 }}
                                variant="outlined"
                                onClick={signInWithGoogle}
                                disabled={isSubmitting}
                            >
                                Sign in with Google
                            </Button>

                        </Form>
                    )}
                </Formik>
            </Paper>
        </Container>
    );
}
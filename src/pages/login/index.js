import { Container, Box, Typography, TextField, FormControlLabel, Checkbox, Button, Link, Paper, Divider } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import utils from '@/utils';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axiosInstance from '@/services/axiosInstance';

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
            const idToken = response.data.idToken;
            const refreshToken = response.data.refreshToken;
            setToken(idToken);
            utils.cookieManager.set("token", idToken);
            utils.cookieManager.set("refreshToken", refreshToken);
            router.push("/");
        } catch (error) {
            console.error("Login error:", error);
        }
        setSubmitting(false);
    };

    const signInWithGoogle = () => {
        const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI;
        const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=openid email profile&state=random_string`;

        window.location.href = GOOGLE_AUTH_URL;
    };

    const validationSchema = Yup.object({
        email: Yup.string().email("Geçerli bir email girin").required("Email zorunludur"),
        password: Yup.string().min(6, "Şifre en az 6 karakter olmalıdır").required("Şifre zorunludur")
    });

    return (
        <Container className='auth' component="main" maxWidth="xs">
            <Paper elevation={6} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">Sign in</Typography>
                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={validationSchema}
                    onSubmit={signIn}
                >
                    {({ isSubmitting, errors, touched }) => (
                        <Form>
                            <Field as={TextField}
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                error={touched.email && !!errors.email}
                                helperText={touched.email && errors.email}
                            />
                            <Field as={TextField}
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                error={touched.password && !!errors.password}
                                helperText={touched.password && errors.password}
                            />
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
                            <Link href="/forgot-password" variant="body2">Forgot password?</Link>
                            <Divider>or</Divider>
                            <Button
                                fullWidth
                                sx={{ mt: 3, mb: 2 }}
                                disabled={isSubmitting}
                                onClick={() => signInWithGoogle()}
                                variant="outlined"
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
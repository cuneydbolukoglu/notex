import { Container, Typography, FormControlLabel, Checkbox, Button, Link, Paper, Divider, FormLabel, FormHelperText } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import utils from '@/utils';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axiosInstance from '@/services/axiosInstance';
import CustomInput from '@/components/customInput';

export default function SignUp() {
  const [token, setToken] = useState(null);
  const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const router = useRouter();

  useEffect(() => {
    if (token !== null) {
      utils.cookieManager.set("token", token);
    }
  }, [token]);

  const signIn = async (values, { setSubmitting }) => {
    const URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`;
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

  const validationSchema = Yup.object({
    email: Yup.string().email("Geçerli bir email girin").required("Email zorunludur"),
    password: Yup.string().min(6, "Şifre en az 6 karakter olmalıdır").required("Şifre zorunludur"),
    passwordConfirmation: Yup.string().oneOf([Yup.ref('password'), null], "Şifreler aynı olmalıdır")
  });

  return (
    <Container className='auth' component="main" maxWidth="xs">
      <Paper elevation={6} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography sx={{ textAlign: 'left' }} component="h1" variant="h5">Sign Up</Typography>
        <Formik
          initialValues={{ email: '', password: '', passwordConfirmation: '' }}
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
              <div style={{ marginBottom: 16 }}>
                <FormLabel htmlFor="passwordConfirmation">Password Again</FormLabel>
                <Field
                  fullWidth
                  name="passwordConfirmation"
                  id="passwordConfirmation"
                  as={CustomInput}
                  placeholder="......"
                  type="password"
                  aria-label="passwordConfirmation"
                />
                {touched.passwordConfirmation && errors.passwordConfirmation && (
                  <FormHelperText error>{errors.passwordConfirmation}</FormHelperText>
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
                Sign Up
              </Button>
              <Typography textAlign="center">
                If you have an account <Link href="/auth/login" variant="body2">Login</Link>
              </Typography>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
}
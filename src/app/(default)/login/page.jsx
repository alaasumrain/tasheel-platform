'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// @mui
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import TasheelButton from '@/components/TasheelButton';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

const SIGN_IN = 'sign-in';
const SIGN_UP = 'sign-up';

function formatAuthError(error, context) {
  if (!error) {
    return 'Something went wrong. Please try again.';
  }

  const rawMessage = error?.message || 'Something went wrong. Please try again.';

  if (rawMessage === 'Failed to fetch') {
    return 'Unable to reach Tasheel auth right now. Please check your connection and try again.';
  }

  const normalized = rawMessage.toLowerCase();
  const status = error?.status ?? error?.cause?.status;
  const code = error?.code;

  if (context === SIGN_IN) {
    if (normalized.includes('invalid login credentials') || status === 400) {
      return 'Incorrect email or password.';
    }
    if (normalized.includes('email not confirmed')) {
      return 'Please confirm your email address before signing in.';
    }
  }

  if (context === SIGN_UP) {
    if (code === 'user_already_exists' || status === 422 || normalized.includes('already registered')) {
      return 'An account already exists with this email. Try signing in instead.';
    }
    if (normalized.includes('password should be at least')) {
      return 'Password must be at least 6 characters long.';
    }
  }

  if (context === 'magic-link' && normalized.includes('retry limit')) {
    return 'You requested too many links. Please wait a moment before trying again.';
  }

  if (context === 'reset' && normalized.includes('email not found')) {
    return 'We couldn’t find an account with that email.';
  }

  return rawMessage;
}

export default function LoginPage() {
  const params = useSearchParams();
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const redirectedFrom = params?.get('redirectedFrom');
  const loginError = params?.get('error');

  const [activeTab, setActiveTab] = useState(SIGN_IN);

  const [signInState, setSignInState] = useState({
    email: '',
    password: '',
    loading: false,
    error: null,
    success: null
  });

  const [signUpState, setSignUpState] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    loading: false,
    error: null,
    success: null
  });

  const [magicLinkStatus, setMagicLinkStatus] = useState({ loading: false, message: null, error: null });

  useEffect(() => {
    let isMounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted || !session) return;
      const target = redirectedFrom || '/portal';
      router.replace(target);
    });
    return () => {
      isMounted = false;
    };
  }, [supabase, redirectedFrom, router]);

  const handleTabChange = (_event, newValue) => {
    setActiveTab(newValue);
    setSignInState((prev) => ({ ...prev, error: null, success: null }));
    setSignUpState((prev) => ({ ...prev, error: null, success: null }));
    setMagicLinkStatus({ loading: false, message: null, error: null });
  };

  const redirectAfterAuth = () => {
    const target = redirectedFrom || '/portal';
    router.push(target);
    router.refresh();
  };

  const handleSignInSubmit = async (event) => {
    event.preventDefault();
    setSignInState((prev) => ({ ...prev, loading: true, error: null, success: null }));
    try {
      const { email, password } = signInState;
      if (!email || !password) {
        throw new Error('Please enter both email and password.');
      }
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        throw error;
      }
      setSignInState((prev) => ({ ...prev, success: 'Signed in successfully.', loading: false }));
      redirectAfterAuth();
    } catch (err) {
      const message = formatAuthError(err, SIGN_IN);
      setSignInState((prev) => ({ ...prev, error: message, loading: false }));
    }
  };

  const handleSignUpSubmit = async (event) => {
    event.preventDefault();
    setSignUpState((prev) => ({ ...prev, loading: true, error: null, success: null }));
    try {
      const { email, password, confirmPassword, fullName } = signUpState;
      if (!email || !password) {
        throw new Error('Email and password are required.');
      }
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long.');
      }
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match.');
      }

      const redirectUrl = `${window.location.origin}/auth/confirm?next=${encodeURIComponent('/portal')}`;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName
          }
        }
      });

      if (error) {
        throw error;
      }

      setSignUpState((prev) => ({
        ...prev,
        loading: false,
        success: 'Check your inbox to confirm your email address.',
        error: null
      }));
      setSignInState((prev) => ({ ...prev, email }));
      setActiveTab(SIGN_IN);

      if (data.session) {
        redirectAfterAuth();
      }
    } catch (err) {
      const message = formatAuthError(err, SIGN_UP);
      setSignUpState((prev) => ({ ...prev, error: message, loading: false }));
    }
  };

  const handleMagicLink = async () => {
    setMagicLinkStatus({ loading: true, error: null, message: null });
    try {
      if (!signInState.email) {
        throw new Error('Enter your email above before requesting a magic link.');
      }
      const redirectUrl = `${window.location.origin}/auth/confirm?next=${encodeURIComponent('/portal')}`;
      const { error } = await supabase.auth.signInWithOtp({
        email: signInState.email,
        options: { emailRedirectTo: redirectUrl }
      });
      if (error) {
        throw error;
      }
      setMagicLinkStatus({ loading: false, message: 'Magic link sent! Check your email.', error: null });
    } catch (err) {
      const message = formatAuthError(err, 'magic-link');
      setMagicLinkStatus({ loading: false, message: null, error: message });
    }
  };

  const handleForgotPassword = async () => {
    setSignInState((prev) => ({ ...prev, error: null, success: null }));
    try {
      if (!signInState.email) {
        throw new Error('Enter your email above before requesting a reset link.');
      }
      const redirectUrl = `${window.location.origin}/auth/reset`;
      const { error } = await supabase.auth.resetPasswordForEmail(signInState.email, {
        redirectTo: redirectUrl
      });
      if (error) {
        throw error;
      }
      setSignInState((prev) => ({ ...prev, success: 'Password reset instructions sent to your email.' }));
    } catch (err) {
      const message = formatAuthError(err, 'reset');
      setSignInState((prev) => ({ ...prev, error: message }));
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 8, md: 12 }
      }}
    >
      <Container maxWidth="sm">
        <Stack spacing={3} sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="overline" color="primary" sx={{ letterSpacing: 1 }}>
            Tasheel client portal
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Manage translation requests without the inbox spiral
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Submit briefs, upload files, and follow approvals from one secure dashboard.
          </Typography>
        </Stack>

        <Card sx={{ borderRadius: 4, boxShadow: '0 36px 120px rgba(15, 46, 83, 0.18)' }}>
          <CardContent sx={{ p: { xs: 4, md: 5 } }}>
            <Stack spacing={3.5}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                aria-label="authentication tabs"
                sx={{ '& .MuiTab-root': { fontWeight: 600 } }}
                centered
              >
                <Tab label="Sign in" value={SIGN_IN} />
                <Tab label="Create account" value={SIGN_UP} />
              </Tabs>

              {redirectedFrom && (
                <Alert severity="info">
                  Sign in to view <strong>{redirectedFrom}</strong>.
                </Alert>
              )}
              {loginError === 'staff_only' && <Alert severity="warning">Admin area requires a Tasheel staff account.</Alert>}

              {activeTab === SIGN_IN ? (
                <Box component="form" onSubmit={handleSignInSubmit} noValidate>
                  <Stack spacing={2.5}>
                    {signInState.error && <Alert severity="error">{signInState.error}</Alert>}
                    {signInState.success && <Alert severity="success">{signInState.success}</Alert>}
                    {magicLinkStatus.error && <Alert severity="error">{magicLinkStatus.error}</Alert>}
                    {magicLinkStatus.message && <Alert severity="success">{magicLinkStatus.message}</Alert>}

                    <TextField
                      label="Email"
                      type="email"
                      required
                      value={signInState.email}
                      onChange={(event) => setSignInState((prev) => ({ ...prev, email: event.target.value }))}
                      autoComplete="email"
                    />
                    <TextField
                      label="Password"
                      type="password"
                      required
                      value={signInState.password}
                      onChange={(event) => setSignInState((prev) => ({ ...prev, password: event.target.value }))}
                      autoComplete="current-password"
                    />
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between" alignItems="center">
                      <Button size="small" onClick={handleForgotPassword} sx={{ textTransform: 'none' }}>
                        Forgot password?
                      </Button>
                      <Button size="small" onClick={handleMagicLink} disabled={magicLinkStatus.loading} sx={{ textTransform: 'none' }}>
                        {magicLinkStatus.loading ? 'Sending magic link…' : 'Send me a magic link instead'}
                      </Button>
                    </Stack>
                    <TasheelButton type="submit" variant="contained" size="large" disabled={signInState.loading}>
                      {signInState.loading ? 'Signing in…' : 'Sign in'}
                    </TasheelButton>
                  </Stack>
                </Box>
              ) : (
                <Box component="form" onSubmit={handleSignUpSubmit} noValidate>
                  <Stack spacing={2.5}>
                    {signUpState.error && <Alert severity="error">{signUpState.error}</Alert>}
                    {signUpState.success && <Alert severity="success">{signUpState.success}</Alert>}

                    <TextField
                      label="Full name"
                      value={signUpState.fullName}
                      onChange={(event) => setSignUpState((prev) => ({ ...prev, fullName: event.target.value }))}
                      autoComplete="name"
                    />
                    <TextField
                      label="Work email"
                      type="email"
                      required
                      value={signUpState.email}
                      onChange={(event) => setSignUpState((prev) => ({ ...prev, email: event.target.value }))}
                      autoComplete="email"
                    />
                    <TextField
                      label="Password"
                      type="password"
                      required
                      value={signUpState.password}
                      onChange={(event) => setSignUpState((prev) => ({ ...prev, password: event.target.value }))}
                      helperText="Minimum 8 characters."
                      autoComplete="new-password"
                    />
                    <TextField
                      label="Confirm password"
                      type="password"
                      required
                      value={signUpState.confirmPassword}
                      onChange={(event) => setSignUpState((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                      autoComplete="new-password"
                    />
                    <TasheelButton type="submit" variant="contained" size="large" disabled={signUpState.loading}>
                      {signUpState.loading ? 'Creating account…' : 'Create account'}
                    </TasheelButton>
                  </Stack>
                </Box>
              )}

              <Divider />
              <Typography variant="caption" color="text.secondary" align="center">
                By signing in you agree to Tasheel’s privacy policy and understand we may contact you about your requests.
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

// @mui
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import TasheelButton from '@/components/TasheelButton';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ error: null, success: null });
  const [requiresLogin, setRequiresLogin] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      if (!session) {
        setRequiresLogin(true);
      }
    });
    return () => {
      mounted = false;
    };
  }, [supabase]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ error: null, success: null });
    try {
      if (!form.password || !form.confirmPassword) {
        throw new Error('Enter your new password in both fields.');
      }
      if (form.password.length < 8) {
        throw new Error('Password must be at least 8 characters long.');
      }
      if (form.password !== form.confirmPassword) {
        throw new Error('Passwords do not match.');
      }
      setLoading(true);
      const { error } = await supabase.auth.updateUser({ password: form.password });
      if (error) {
        throw error;
      }
      setStatus({ success: 'Password updated. Redirecting to your portal…', error: null });
      setTimeout(() => {
        router.push('/portal');
        router.refresh();
      }, 1500);
    } catch (err) {
      setStatus({ error: err.message, success: null });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'stretch',
        py: { xs: 8, md: 12 }
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ borderRadius: 4, boxShadow: '0 32px 90px rgba(15,46,83,0.18)' }}>
          <CardContent sx={{ p: { xs: 4, md: 5 } }}>
            <Stack spacing={3}>
              <Box>
                <Typography variant="overline" color="primary" sx={{ letterSpacing: 1 }}>
                  Tasheel portal
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  Choose a new password
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Use a password that you haven’t used before. You’ll be signed in automatically once it’s updated.
                </Typography>
              </Box>

              {requiresLogin && (
                <Alert severity="warning">
                  Reset link expired or already used. Head back to{' '}
                  <a href="/login" style={{ fontWeight: 600 }}>
                    sign in
                  </a>{' '}
                  to request a fresh link.
                </Alert>
              )}

              {status.error && <Alert severity="error">{status.error}</Alert>}
              {status.success && <Alert severity="success">{status.success}</Alert>}

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Stack spacing={2.5}>
                  <TextField
                    label="New password"
                    type="password"
                    required
                    value={form.password}
                    onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                    helperText="Minimum 8 characters."
                    autoComplete="new-password"
                    disabled={requiresLogin}
                  />
                  <TextField
                    label="Confirm new password"
                    type="password"
                    required
                    value={form.confirmPassword}
                    onChange={(event) => setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                    autoComplete="new-password"
                    disabled={requiresLogin}
                  />
                  <TasheelButton type="submit" variant="contained" size="large" disabled={loading || requiresLogin}>
                    {loading ? 'Updating…' : 'Update password'}
                  </TasheelButton>
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

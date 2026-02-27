import React from 'react';
import { Box, Button, Typography } from '@mui/material';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught:', error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <Box
        sx={{
          minHeight: '70vh',
          display: 'grid',
          placeItems: 'center',
          p: 3,
          textAlign: 'center',
        }}
      >
        <Box sx={{ maxWidth: 520 }}>
          <Typography variant="h5" sx={{ fontWeight: 950, mb: 1 }}>
            Something went wrong
          </Typography>
          <Typography sx={{ opacity: 0.8, fontWeight: 650, mb: 2 }}>
            A runtime error occurred. Try reloading the page.
          </Typography>

          <Button variant="contained" onClick={this.handleReload} sx={{ borderRadius: 999, fontWeight: 900 }}>
            Reload
          </Button>

          {process.env.NODE_ENV !== 'production' && this.state.error ? (
            <Box sx={{ mt: 2, textAlign: 'left' }}>
              <Typography variant="caption" sx={{ opacity: 0.7, fontWeight: 800 }}>
                Dev details:
              </Typography>
              <pre style={{ whiteSpace: 'pre-wrap', opacity: 0.75 }}>
                {String(this.state.error?.message || this.state.error)}
              </pre>
            </Box>
          ) : null}
        </Box>
      </Box>
    );
  }
}

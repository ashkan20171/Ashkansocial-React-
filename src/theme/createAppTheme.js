import { createTheme, alpha } from '@mui/material/styles';

// Color psychology choices:
// - Deep blue: trust, stability
// - Cyan accent: modern, tech
// - Neutral surfaces: clarity, premium feel

export function createAppTheme({ mode = 'light', direction = 'ltr' } = {}) {
  const isDark = mode === 'dark';

  const brand = {
    main: '#1E3A8A', // deep blue
    accent: '#06B6D4', // cyan
  };

  // Light mode is intentionally "soft" (no pure whites) so the UI doesn't feel harsh/overly bright.
  const paper = isDark ? '#0B1220' : '#F8FAFC';
  const bg = isDark ? '#060914' : '#EEF2FF';

  return createTheme({
    direction,
    palette: {
      mode,
      primary: { main: brand.main },
      secondary: { main: brand.accent },
      background: { default: bg, paper },
      success: { main: '#22C55E' },
      warning: { main: '#F59E0B' },
      error: { main: '#EF4444' },
      info: { main: '#0EA5E9' },
    },
    shape: { borderRadius: 14 },
    typography: {
      fontFamily:
        'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
      h6: { fontWeight: 800, letterSpacing: -0.2 },
      subtitle1: { fontWeight: 700 },
      button: { textTransform: 'none', fontWeight: 700 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '@keyframes ashkanEnter': {
            '0%': { opacity: 0, transform: 'translateY(10px) scale(.99)', filter: 'blur(2px)' },
            '100%': { opacity: 1, transform: 'translateY(0) scale(1)', filter: 'blur(0)' },
          },
          '@keyframes ashkanRouteIn': {
            '0%': { opacity: 0, transform: 'translateY(14px) scale(.985)', filter: 'blur(3px)' },
            '60%': { opacity: 1, filter: 'blur(0px)' },
            '100%': { opacity: 1, transform: 'translateY(0) scale(1)', filter: 'blur(0)' },
          },
          '@keyframes ashkanDialogIn': {
            '0%': { opacity: 0, transform: 'translateY(8px) scale(.98)', filter: 'blur(2px)' },
            '100%': { opacity: 1, transform: 'translateY(0) scale(1)', filter: 'blur(0)' },
          },
          '@keyframes ashkanFloat': {
            '0%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-10px)' },
            '100%': { transform: 'translateY(0px)' },
          },
          '@keyframes ashkanShimmer': {
            '0%': { transform: 'translateX(-120%)' },
            '100%': { transform: 'translateX(120%)' },
          },
          '@keyframes ashkanSkeletonMove': {
            '0%': { backgroundPosition: '180% 0' },
            '100%': { backgroundPosition: '-80% 0' },
          },
          '@keyframes ashkanShine': {
            '0%': { transform: 'translateX(-120%)' },
            '100%': { transform: 'translateX(120%)' },
          },
          body: {
            backgroundImage: isDark
              ? 'radial-gradient(900px 600px at 20% 10%, rgba(6,182,212,0.12), transparent 55%), radial-gradient(900px 600px at 80% 10%, rgba(30,58,138,0.16), transparent 55%)'
              : 'radial-gradient(1000px 700px at 18% 8%, rgba(6,182,212,0.12), transparent 58%), radial-gradient(1000px 700px at 82% 10%, rgba(30,58,138,0.14), transparent 58%), radial-gradient(900px 650px at 50% 95%, rgba(99,102,241,0.08), transparent 62%)',
            backgroundAttachment: 'fixed',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          '@keyframes ashkanEnter': {
            '0%': { opacity: 0, transform: 'translateY(10px) scale(.99)', filter: 'blur(2px)' },
            '100%': { opacity: 1, transform: 'translateY(0) scale(1)', filter: 'blur(0)' },
          },
          '@keyframes ashkanRouteIn': {
            '0%': { opacity: 0, transform: 'translateY(14px) scale(.985)', filter: 'blur(3px)' },
            '60%': { opacity: 1, filter: 'blur(0px)' },
            '100%': { opacity: 1, transform: 'translateY(0) scale(1)', filter: 'blur(0)' },
          },
          '@keyframes ashkanDialogIn': {
            '0%': { opacity: 0, transform: 'translateY(8px) scale(.98)', filter: 'blur(2px)' },
            '100%': { opacity: 1, transform: 'translateY(0) scale(1)', filter: 'blur(0)' },
          },
          '@keyframes ashkanFloat': {
            '0%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-10px)' },
            '100%': { transform: 'translateY(0px)' },
          },
          '@keyframes ashkanShimmer': {
            '0%': { transform: 'translateX(-120%)' },
            '100%': { transform: 'translateX(120%)' },
          },
          '@keyframes ashkanShine': {
            '0%': { transform: 'translateX(-120%)' },
            '100%': { transform: 'translateX(120%)' },
          },
          root: ({ theme }) => ({
            backgroundImage: 'none',
            border: `1px solid ${alpha(theme.palette.common.black, theme.palette.mode === 'dark' ? 0.22 : 0.06)}`,
            backgroundColor:
              theme.palette.mode === 'dark'
                ? alpha(theme.palette.background.paper, 0.78)
                : alpha(theme.palette.background.paper, 0.86),
            backdropFilter: 'blur(10px) saturate(150%)',
          }),
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 14,
            transition: 'transform 160ms ease, background-color 160ms ease',
            '&:hover': {
              transform: 'translateY(-1px)',
              backgroundColor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.18 : 0.10),
            },
          }),
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: ({ theme }) => ({
            borderRadius: 24,
            border: `1px solid ${alpha(theme.palette.divider, theme.palette.mode === 'dark' ? 0.55 : 0.9)}`,
            backgroundImage:
              theme.palette.mode === 'dark'
                ? `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.92)}, ${alpha(
                    theme.palette.background.paper,
                    0.78
                  )})`
                : `linear-gradient(180deg, ${alpha('#ffffff', 0.98)}, ${alpha('#ffffff', 0.90)})`,
            boxShadow:
              theme.palette.mode === 'dark'
                ? '0 32px 90px rgba(0,0,0,0.55)'
                : '0 32px 90px rgba(2,6,23,0.16)',
            animation: 'ashkanDialogIn 280ms cubic-bezier(.2,.8,.2,1) both',
            backdropFilter: 'blur(10px)',
          }),
        },
      },
      MuiAppBar: {
        styleOverrides: {
          '@keyframes ashkanEnter': {
            '0%': { opacity: 0, transform: 'translateY(10px) scale(.99)', filter: 'blur(2px)' },
            '100%': { opacity: 1, transform: 'translateY(0) scale(1)', filter: 'blur(0)' },
          },
          '@keyframes ashkanRouteIn': {
            '0%': { opacity: 0, transform: 'translateY(14px) scale(.985)', filter: 'blur(3px)' },
            '60%': { opacity: 1, filter: 'blur(0px)' },
            '100%': { opacity: 1, transform: 'translateY(0) scale(1)', filter: 'blur(0)' },
          },
          '@keyframes ashkanDialogIn': {
            '0%': { opacity: 0, transform: 'translateY(8px) scale(.98)', filter: 'blur(2px)' },
            '100%': { opacity: 1, transform: 'translateY(0) scale(1)', filter: 'blur(0)' },
          },
          '@keyframes ashkanFloat': {
            '0%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-10px)' },
            '100%': { transform: 'translateY(0px)' },
          },
          '@keyframes ashkanShimmer': {
            '0%': { transform: 'translateX(-120%)' },
            '100%': { transform: 'translateX(120%)' },
          },
          '@keyframes ashkanShine': {
            '0%': { transform: 'translateX(-120%)' },
            '100%': { transform: 'translateX(120%)' },
          },
          root: {
            backgroundImage: 'none',
            borderBottom: `1px solid ${alpha(isDark ? '#ffffff' : '#0f172a', isDark ? 0.08 : 0.06)}`,
            backdropFilter: 'saturate(180%) blur(10px)',
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 18,
            transition: 'box-shadow 180ms ease, transform 180ms ease',
            '&.Mui-focused': {
              boxShadow: `0 0 0 4px ${alpha(theme.palette.secondary.main, theme.palette.mode === 'dark' ? 0.18 : 0.14)}`,
            },
          }),
          notchedOutline: ({ theme }) => ({
            borderColor: alpha(theme.palette.divider, theme.palette.mode === 'dark' ? 0.55 : 0.9),
          }),
        },
      },
      MuiSkeleton: {
        defaultProps: { animation: false },
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundImage: isDark
              ? 'linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.10), rgba(255,255,255,0.06))'
              : 'linear-gradient(90deg, rgba(15,23,42,0.06), rgba(15,23,42,0.10), rgba(15,23,42,0.06))',
            backgroundSize: '260% 100%',
            animation: 'ashkanSkeletonMove 1.55s ease-in-out infinite',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          '@keyframes ashkanEnter': {
            '0%': { opacity: 0, transform: 'translateY(10px) scale(.99)', filter: 'blur(2px)' },
            '100%': { opacity: 1, transform: 'translateY(0) scale(1)', filter: 'blur(0)' },
          },
          '@keyframes ashkanRouteIn': {
            '0%': { opacity: 0, transform: 'translateY(14px) scale(.985)', filter: 'blur(3px)' },
            '60%': { opacity: 1, filter: 'blur(0px)' },
            '100%': { opacity: 1, transform: 'translateY(0) scale(1)', filter: 'blur(0)' },
          },
          '@keyframes ashkanDialogIn': {
            '0%': { opacity: 0, transform: 'translateY(8px) scale(.98)', filter: 'blur(2px)' },
            '100%': { opacity: 1, transform: 'translateY(0) scale(1)', filter: 'blur(0)' },
          },
          '@keyframes ashkanFloat': {
            '0%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-10px)' },
            '100%': { transform: 'translateY(0px)' },
          },
          '@keyframes ashkanShimmer': {
            '0%': { transform: 'translateX(-120%)' },
            '100%': { transform: 'translateX(120%)' },
          },
          '@keyframes ashkanShine': {
            '0%': { transform: 'translateX(-120%)' },
            '100%': { transform: 'translateX(120%)' },
          },
          root: ({ theme }) => ({
            border: `1px solid ${alpha(isDark ? '#ffffff' : '#0f172a', isDark ? 0.10 : 0.06)}`,
            borderRadius: 24,
            background:
              theme.palette.mode === 'dark'
                ? `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.72)}, ${alpha(
                    theme.palette.background.default,
                    0.55
                  )})`
                : `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.92)}, ${alpha(
                    theme.palette.primary.main,
                    0.02
                  )})`,
            boxShadow: theme.palette.mode === 'dark' ? '0 24px 60px rgba(0,0,0,0.45)' : '0 24px 60px rgba(2,6,23,0.10)',
            backdropFilter: 'blur(10px) saturate(160%)',
          }),
        },
      },
    },
  });
}

import React from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Notifications from './Notifications'; // اضافه کردن نوتیفیکیشن‌ها

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Ashkan Social
        </Typography>
        <Notifications /> {/* نمایش نوتیفیکیشن‌ها */}
        <Button color="inherit" onClick={handleMenuClick}>
          Menu
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
          </MenuItem>
          {isAuthenticated ? (
            <>
              <MenuItem onClick={handleMenuClose}>
                <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>Profile</Link>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <Link to="/messages" style={{ textDecoration: 'none', color: 'inherit' }}>Messages</Link>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <Button color="inherit" onClick={logout}>Logout</Button>
              </MenuItem>
            </>
          ) : (
            <>
              <MenuItem onClick={handleMenuClose}>
                <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>Login</Link>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <Link to="/register" style={{ textDecoration: 'none', color: 'inherit' }}>Register</Link>
              </MenuItem>
            </>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

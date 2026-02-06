import React from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, IconButton, InputBase, Badge } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#fff', boxShadow: 3 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, color: '#1DA1F2' }}>
          Ashkan Social
        </Typography>
        <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'relative', maxWidth: 600, width: '100%' }}>
            <InputBase
              sx={{ padding: '5px 15px', width: '100%', borderRadius: '20px', backgroundColor: '#f4f6f9' }}
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              startAdornment={<SearchIcon sx={{ color: '#888' }} />}
            />
          </div>
        </div>
        <div>
          <IconButton sx={{ color: '#555', marginLeft: 2 }}>
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Button color="inherit" onClick={handleMenuClick}>Menu</Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}><Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link></MenuItem>
            {isAuthenticated ? (
              <>
                <MenuItem onClick={handleMenuClose}><Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>Profile</Link></MenuItem>
                <MenuItem onClick={handleMenuClose}><Link to="/messages" style={{ textDecoration: 'none', color: 'inherit' }}>Messages</Link></MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <Button color="inherit" onClick={logout}>Logout</Button>
                </MenuItem>
              </>
            ) : (
              <>
                <MenuItem onClick={handleMenuClose}><Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>Login</Link></MenuItem>
                <MenuItem onClick={handleMenuClose}><Link to="/register" style={{ textDecoration: 'none', color: 'inherit' }}>Register</Link></MenuItem>
              </>
            )}
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

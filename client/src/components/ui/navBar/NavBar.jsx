import React from "react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
// import QuackLogo from '../assets/quack-logo.png';

const Navbar = () => {
  const handleLogoClick = () => {
    window.location.reload(); 
  };

  return (
    <AppBar
      position="fixed"
      color="primary"
      elevation={4}
      sx={{
        backgroundColor: 'background.default',
        color: 'text.primary',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div" fontWeight={600}>
          Workers Dashboard
        </Typography>

        {/* <Box
          component="img"
          src={QuackLogo}
          alt="Quack Logo"
          sx={{
            height: 40,
            width: 'auto',
            cursor: 'pointer',
          }}
          onClick={handleLogoClick}
        /> */}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
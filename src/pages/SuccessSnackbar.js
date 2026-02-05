import React, { useState } from 'react';
import { Snackbar, Button } from '@mui/material';

const SuccessSnackbar = () => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button onClick={handleClick}>Show Snackbar</Button>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message="Post Submitted Successfully!"
      />
    </div>
  );
};

export default SuccessSnackbar;

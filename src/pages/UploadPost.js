import React, { useState } from 'react';
import { Button, TextField, Container, Box } from '@mui/material';

const UploadPost = () => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");

  const handleImageChange = (event) => {
    setImage(URL.createObjectURL(event.target.files[0]));
  };

  const handlePostSubmit = () => {
    alert('Post submitted with image and caption!');
  };

  return (
    <Container>
      <Box sx={{ marginTop: 4 }}>
        <TextField
          label="Write a caption"
          variant="outlined"
          fullWidth
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <input type="file" onChange={handleImageChange} />
        {image && <img src={image} alt="preview" style={{ width: '100%', marginTop: 10 }} />}
        <Button variant="contained" color="primary" onClick={handlePostSubmit} sx={{ marginTop: 2 }}>
          Post
        </Button>
      </Box>
    </Container>
  );
};

export default UploadPost;

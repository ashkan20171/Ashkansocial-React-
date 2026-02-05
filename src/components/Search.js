import React, { useState } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = () => {
  const [query, setQuery] = useState("");

  const handleSearchChange = (event) => {
    setQuery(event.target.value);
  };

  return (
    <TextField
      label="Search"
      value={query}
      onChange={handleSearchChange}
      variant="outlined"
      fullWidth
      sx={{
        backgroundColor: 'white',
        borderRadius: '4px',
        marginBottom: '16px',
        '@media (max-width: 600px)': {
          marginBottom: '8px',
        }
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchBar;

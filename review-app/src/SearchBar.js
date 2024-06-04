//import './App.css';
import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

function SearchBar ({inputWord, onChange}) {
  return (
    <TextField
      //key="searchBar"
      //type="text"
      value={inputWord}
      onChange={(e) => onChange(e.target.value)}
      variant="outlined"
      fullWidth
      placeholder="Search for a game and add a new entry!"
      InputProps={{
        startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>)
      }}
      />
  );
}

export default SearchBar;
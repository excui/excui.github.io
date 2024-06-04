import React from 'react';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

function ReviewComponent ({id, title, date, rating, text, onDelete}) {

  const deleteReview = () => {
    onDelete(id);
  }

  return (
    <Box
      sx={{
        width:"25vw", height: "25vw", display: "flex", alignItems: "stretch", flexDirection: 'column', border:1,
        p: 3, m: 3, mt: 1, overflow:'hidden', borderRadius:'10px', boxShadow: 3, position: 'relative', '&hover .delete-button':{display:'inline-flex'}
      }}
      >
      <div>
        <Typography variant="h6" component="h6">
          {title}
        </Typography>
        <br></br>
        <Typography variant="subtitle1" component="subtitle1" sx={{fontWeight:"bold"}}>
          Date Completed: 
        </Typography>
        <Typography variant="subtitle1" component="subtitle1">
          {" " + date}
        </Typography>
        <br></br>
        <Typography variant="subtitle1" component="subtitle1" sx={{fontWeight:"bold"}}>
          Rating: 
        </Typography>
        <Typography variant="subtitle1" component="subtitle1">
          {" " + rating + ' / 5'}
        </Typography>
        <br></br>
        <Typography variant="subtitle1" component="subtitle1" sx={{fontWeight:"bold"}}>
          My Thoughts: 
        </Typography>
        <Typography variant="subtitle1" component="subtitle1" sx={{overflow:'hidden'}}>
          {" " + text}
        </Typography>
      </div>
      <IconButton className="delete" sx={{ justifyContent: 'flex-end', '&:hover':{backgroundColor:'transparent'} }} onClick={deleteReview}>
        <DeleteIcon />
      </IconButton>
    </Box>
  );
}

export default ReviewComponent;
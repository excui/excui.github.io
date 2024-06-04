import React from 'react';
import {useState} from 'react';


import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './App.css';

function NewReviewPopUp ({game,onSave,onClose}) {

  const [datePlayed, setDatePlayed] = useState('');
  const [rating, setRating] = useState('');
  const [textArea, setTextArea] = useState('');

  const addedDate = (e) => {
    setDatePlayed(e.target.value);
  }

  const addedRating = (e) => {
    setRating(e.target.value);
  }

  const addedText = (e) => {
    setTextArea(e.target.value);
  }

  const saveContent = () => {
    onSave({game, datePlayed, rating, textArea})
  };

  return (
    <div className= 'pop-up-background'>
    <div className = "pop-up-window">
      <Typography variant="h3" component="h3">
        {game.name}
      </Typography>
      <br></br>
      <div>
        <Typography variant="body1" component="body1">
          {"Date Completed:*" + " "}
        </Typography>
        <input className="addingDate" type="date" value={datePlayed} onChange={addedDate}/>
      </div>

      <br></br>

      <div>
        <TextField 
          required
          id="outlined-required"
          value={rating}
          type="text"
          onChange={addedRating}
          label="Give your rating out of 5."
          fullWidth/>
        </div>

      <br></br>

      <div>
        <TextField
          required
          id="outlined-required"
          value={textArea}
          onChange={addedText}
          variant="outlined"
          fullWidth
          inputProps={{
            maxLength: 200,
          }}
          label="Write your review here. Max 200 characters!"/>
        
      </div>

      <br></br>

      <Button
        variant="contained"
        color="primary"
        onClick={saveContent}
        sx={{marginBottom: '10px'}}>
        Save Review
      </Button>

      <Button
        variant='contained'
        color='secondary'
        onClick={onClose}>
        Cancel
      </Button>

    </div>
    </div>
  )
}

export default NewReviewPopUp;
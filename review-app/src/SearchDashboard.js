import React from 'react';
//<img className='thumbnail' src={game.background_image} alt={game.name}/>}

import Typography from '@mui/material/Typography';

function searchDashboard ({games,clickTitle}) {
  return (
    <div className='searchResults'>
      {games.map((game) => (
        <div>
          <Typography 
            variant="body1"
            component="body1"
            onClick = {() => clickTitle(game)}>
            {game.name}
          </Typography>
        </div>
      ))}
    </div>
  );
};

export default searchDashboard;
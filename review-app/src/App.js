//API KEY: 1e5168ff273b4c759f0a695ede462a07
import React from 'react';
import {useState, useEffect} from 'react';

import { collection, addDoc, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from './firebase';
import { auth } from "./firebase";

import { Link, Route, Routes, useNavigate, BrowserRouter as Router } from 'react-router-dom';
import {createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut} from "firebase/auth";

import SearchBar from './SearchBar';
import SearchDashboard from './SearchDashboard';
import NewReviewPopUp from './NewReviewPopUp';
import HomeReviewComponent from './HomeReviewComponent';
import api_key from './api_key';

import mario from'./mario.png';
import link from './link.png';
import star from './star.png';
import controller from './controller.png';
import health from './health.jpeg';

import './App.css';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

function Home () {

  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
        navigate("/login");
      }
    });
  }, [])

  const [inputWord, setinputWord] = useState('');
  const [games, setGames] = useState([]);

  const [chooseTitle, setChooseTitle] = useState(null);
  const [showPopUp, setShowPopUp] = useState(false);
  const [loggedReviews, setLoggedReviews] = useState([]);

  async function getReviewsFromDb () {
    try {
      const q = query(collection(db, 'loggedReviews'), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      console.log(querySnapshot);
      const fetchedReviews = querySnapshot.docs.map((review) => ({
        ...review.data(), id: review.id}));
      setLoggedReviews(fetchedReviews);
    } catch (e) {
      console.error("Error fetching notes:", e)
    }
  }

  useEffect(() => {
    getReviewsFromDb();
    if (user) {
      getReviewsFromDb();
    }
  }, [user]);


  useEffect(() => {
    /*
      For the following function getGames, which is used for the search bar functionality, I referenced
      the following online documentation to help me understand and write my code with --> https://geshan.com.np/blog/2022/10/react-search-bar/#:~:text=the%20existing%20components.-,Wire%20up%20React%20search%20bar%20component,-%23
      The documentation assisted me with understanding how to take the data from an API and match
      a user's input result with the values in the API. Specifically, I referenced the areas that required
      the "filter" in order for the search bar to produce the correct output.
      */
    async function getGames () {
      if (inputWord) {
        try {
          let nameWithSpace = inputWord;
          let gameNameApi = nameWithSpace.replace(' ', '%');
          const response = await fetch('https://api.rawg.io/api/games?key=' + api_key + '&search=' + gameNameApi + '&page=1&page_size=80');
          const data = await response.json();
          console.log(data);
          const filteredGames = data.results.filter((game) =>
            game.name && typeof game.name === 'string' && game.name.toLowerCase().includes(inputWord.toLowerCase())
          );
          setGames(filteredGames);
        } catch (e) {
          console.error('Error finding games:', e);
        }
      } else {
        setGames([]);
      }
    };

    getGames();
  }, [inputWord]);

  const clickOnGameTitle = (game) => {
    setChooseTitle(game);
    setShowPopUp(true);
  };

  async function saveContent (review)  {
    if (user) {
      try {
        const reviewRef = await addDoc(collection(db, "loggedReviews"), {userId: user.uid, ...review});
        setLoggedReviews([...loggedReviews, {...review, id:reviewRef.id, userId:user.uid}]);
        setShowPopUp(false);
      } catch (e) {
        console.error("Error adding review:", e);
      }
    }
  };

  async function deleteReview (id)  {
    try {
      await deleteDoc(doc(db, "loggedReviews", id));
      setLoggedReviews(loggedReviews.filter(review => review.id !== id));
    } catch (e) {
      console.error("Error deleting review:", e);
    }
  };

  function signOutUser() {
    signOut(auth).then(() => {
      //
    }).catch((error) => {
      console.error("Error");
    });
  }

  const closePopUp = (e) => {
    setShowPopUp(false);
  }

  if (user === null) {
    return <p>Please <Link to ="/login">log in</Link></p>
  } else {
  return (
    <div className="App">

      <header>
        <div className='title'>
          <Typography variant="h2" component="h2">
            Your Game Reviews!
          </Typography>
          <br></br>
          <div className = 'images'>
            <img src={mario} alt="pixel mario"style={{width:'5vw', height: 'auto', marginRight: '1vw', marginLeft:'1vw'}}/>
            <img src={link} alt="pixel link"style={{width:'auto', height: '4vw', marginRight: '1vw', marginLeft:'1vw'}}/>
            <img src={star} alt="pixel star"style={{width:'4vw', height: 'auto', marginRight: '1vw', marginLeft:'1vw'}}/>
          </div>
        </div>
        <Button
          variant='contained'
          color='secondary'
          onClick={signOutUser}>
          Sign Out
        </Button>
      </header>

      <div className="searchbody">
        <SearchBar inputWord={inputWord} onChange={setinputWord}/>

        <SearchDashboard games={games} clickTitle={clickOnGameTitle}/>
        {/* For the following Pop-up window flow, I referenced the following documentation to understand how
            how the pop-up appears and closes: https://www.youtube.com/watch?v=Gy4G68WoHq4.
            Though for my project, I developed the pop-up as a separate component. */
        showPopUp && <NewReviewPopUp game={chooseTitle} onSave={saveContent} onClose={closePopUp}/>}
      </div>


      <div className="reviews-heading">
        <Typography variant="h4" component="h4" sx={{padding:4, pb: 2, pt: 5, pr: 0}}>
          My Reviews
        </Typography>
        <img src={controller} alt="controller"style={{width:'6vw', height: 'auto'}}/>
      </div>
       <div className="savedReviews">
          <Box
            sx={{
              display: "flex", flexDirection: 'row', flexWrap: 'wrap'}}>
            {
              loggedReviews.map((review) => review.game && review.game.name && (<HomeReviewComponent key={review.id} id={review.id} title={review.game.name} date={review.datePlayed} rating={review.rating} text={review.textArea} onDelete={deleteReview}/>))
            }
            </Box>
        </div>

    </div>);
}}

function Login () {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  function loginUser (e) {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        navigate("/")
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage)
      });
  }
  return (
    <div className = 'login-page'>
      <Typography variant="h2" component="h2" align="center">
        Welcome to your Game Reviews!
      </Typography>
    <div className='login-form'>
    <form>
      <div className='logintitle'>
        <Typography variant="h4" component="h4">
          Log in
        </Typography>
        <img src={health} alt="health"style={{width:'5vw', height: 'auto', marginRight: '1vw', marginLeft:'1vw'}}/>
      </div>
      <TextField
          value={email}
          type="email"
          id="email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          variant="outlined"
          fullWidth
          placeholder="Email"/>
      <br></br>
      <TextField
          value={password}
          type="password"
          id="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
          fullWidth
          placeholder="Password"/>
      <br></br>
      <Button
        type='submit'
        variant='contained'
        color='primary'
        onClick={loginUser}>
        Log in
      </Button>
      <p>New user? Sign up <Link to="/signup">here</Link></p>
    </form>
    </div>
    </div>
  );
}

function Signup () {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  function signUpUser (e) {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        navigate("/login");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage);
      });
  }
  return (
    <div className='signup-form'>
    <form>
      <div className='signuptitle'>
        <Typography variant="h4" component="h4">
          New user? Sign Up!
        </Typography>
        <img src={health} alt="health"style={{width:'5vw', height: 'auto', marginRight: '1vw', marginLeft:'1vw'}}/>
      </div>
        <TextField
          value={email}
          type="email"
          id="email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          variant="outlined"
          fullWidth
          placeholder="Enter your email"/>
      <br></br>
      <TextField
          value={password}
          type="password"
          id="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
          fullWidth
          placeholder="Enter a password"/>
      <br></br>
      <Button
        type='submit'
        variant='contained'
        color='primary'
        onClick={signUpUser}>
        Sign up
      </Button>
      <p>Already have an account? Log in <Link to="/login">here</Link></p>
  </form>
  </div>
  );
}

function App () {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/signup" element={<Signup />}/>
      </Routes>
    </Router>
  );
}

export default App;

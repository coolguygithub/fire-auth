import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config'
import { useState } from 'react';

firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photoURL: ''
  })

  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
      .then(res => {
        const { displayName, photoURL, email } = res.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(signedInUser);
        console.log(displayName, photoURL, email);
      })
      .catch(err => {
        console.log(err);
        console.log(err.message);
      })
  }

  const handleSignOut = () => {
    firebase.auth().signOut()
    .then(res=> {
      const signedOutUser = {
        isSignedIn: false,
        name: '',
        photo: '',
        email: ''
      }
      setUser(signedOutUser);
      console.log(res);
    })
    .catch( err => {
      
    })
  }

  const handleBlur = (e) => {
    console.log(e.target.name ,e.target.value);
    if(e.target.name === 'email'){
      const isEmailValid = /\S+@\S+\.\S+/.test(e.target.value);
      console.log(isEmailValid);
    }
    if (e.target.name === 'password') {
      const isPasswordValid = e.target.length > 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      console.log(isPasswordValid && passwordHasNumber);
    }
  }
  const handleSubmit = () => {

  }

  return (
    <div className="App">
      {
        user.isSignedIn ?
          <button onClick={handleSignOut} >Sign Out</button>
          :
          <button onClick={handleSignIn} >Sign In</button>
      }
      {
        user.isSignedIn && <div>
          <p> Welcome, {user.name}</p>
          <p> Email : {user.email}</p>
          <img src={user.photo} alt="" width="150rem" />
        </div>
      }

      <h1>Our own Authentication</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" onBlur={handleBlur} name="email" placeholder="Your Email Address" required/>
        <br/>
        <input type="password" onBlur={handleBlur} name="password" placeholder="Your Password" required/>
        <br/>
        <input type="submit" value="Submit"/>
      </form>
    </div>
  );
}

export default App;

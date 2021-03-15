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
    password: '',
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
    let isFieldValid = true;
    if(e.target.name === 'email'){
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if (e.target.name === 'password') {
      const isPasswordValid = e.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      isFieldValid = isPasswordValid && passwordHasNumber;
    }
    if (isFieldValid) {
      const newUserInfo = {...user};
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  }
  const handleSubmit = (e) => {
    console.log(user.name, user.password);
    if(user.name && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
  .then((userCredential) => {
    // Signed in 
    var user = userCredential.user;
    // ...
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode, errorMessage);
    // ..
  });
    }
    e.preventDefault();
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
        <input type="text" onBlur={handleBlur} name="name" placeholder="Your Name"/>
        <br/>
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

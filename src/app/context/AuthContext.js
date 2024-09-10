'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider } from 'firebase/auth';
import {auth} from '../firebase.js';
const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const googleSignIn =() => {
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
  }
  const logOut = () =>{
    signOut(auth)
  }

  useEffect(() =>{
    const unsubscribe = onAuthStateChanged(auth,(currentUser)=>{
        setUser(currentUser)
    })
    return () => unsubscribe();
  })

  return (
    <AuthContext.Provider value={{ user, googleSignIn, logOut}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
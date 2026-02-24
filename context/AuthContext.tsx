"use client";
import React, { useContext, createContext, useEffect, useState } from "react";
import  { auth, db } from "../config/firebase"
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from "firebase/auth";
import { getDoc, setDoc, doc } from "firebase/firestore"; 


const AuthContext = createContext<any>({})

export const useAuth = () => useContext(AuthContext)


export const AuthContextProvider = ({
    children,
}:{
    children: React.ReactNode
}) => {

    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    //console.log(user)


    useEffect(() => {
        console.log('useEffect called');
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if(user){
                setUser({
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                })
       
            
            }
            
            else{
                setUser(null)
            }
            setLoading(false)
        })
        return () => unsubscribe()
    }, [])

    const signup = async (email: string, password: string) => {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnapshot = await getDoc(userDocRef);
          if (!userDocSnapshot.exists()) {
            await setDoc(userDocRef, {
              email: user.email,
              freeRewritesLeft: 1,
              paidUser: false
            });
          }
          return userCredential;
        } catch (error) {
          throw error;
        }
      };

    const login = (email: string, password: string) =>{
        return signInWithEmailAndPassword(auth, email, password)
    }

    const logout = async () => {
        setUser(null)
        await signOut(auth)
    }

    
    return<AuthContext.Provider value={{ user, login, signup, logout }}>
    {children}
  </AuthContext.Provider>
}
"use client"
import React, { useContext, useEffect, useState } from "react"
import { auth, db } from "../firebase"
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null)
    const [userDataObj, setuserDataObj] = useState(null)
    const [loading, setloading] = useState(true)

    // Auth handlers
    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    function logout() {
        setuserDataObj(null)
        setCurrentUser(null)
        return signOut(auth)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            try {
                // set user to local context
                setloading(true)
                setCurrentUser(user)
                if (!user) {
                    console.log("no user found")
                    return
                }

                // if user exists fetch data from firebase
                const docRef = doc(db, 'users', user.uid)
                const docSnap = await getDoc(docRef)
                let firebaseData = {}
                if (docSnap.exists()) {
                    firebaseData = docSnap.data()
                }
                setuserDataObj(firebaseData) // Assuming you want to set the fetched data to userDataObj

            } catch (error) {
                console.log(error)
            } finally {
                setloading(false)
            }
        })
        return unsubscribe
    }, [])

    const value = {
        currentUser,
        userDataObj,
        loading,
        signup,
        login,
        logout,
        setuserDataObj
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
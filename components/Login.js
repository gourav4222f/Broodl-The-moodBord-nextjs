"use client"
import React, { useState } from 'react'
import { Fugaz_One } from "next/font/google";
import Button from './Button';
import { useAuth } from '@/context/AuthContext';


const fugaz = Fugaz_One({ subsets: ['latin'], weight: ['400'] })

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isRegister, setIsRegister] = useState('')
    const [authenticating, setAuthenticating] = useState(false)
    const { signup, login } = useAuth()

    async function handleSumbit() {
        if (!email || !password || password.length < 6) {
            return
        }
        setAuthenticating(true)
        try {
            if (isRegister) {
                console.log("signup new user")
                await signup(email, password)
            } else {
                console.log("singin with existing user")
                await login(email, password)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setAuthenticating(false)
        }
    }

    return (
        <div className=' flex flex-col flex-1 justify-center items-center gap-4'>
            <h1 className={' text-4xl sm:text-5xl md:text-6xl  ' + fugaz.className}>{isRegister ? 'Register' : 'Log In '}</h1>
            <p>You&apos;re one step away!</p>
            <input value={email} onChange={(e) => { setEmail(e.target.value) }} className=' w-full max-w-[400px] mx-auto px-3 duration-200 hover:border-indigo-600 focus:border-indigo-600 py-2 sm:py-3 border border-solid border-indigo-400  rounded-full outline-none' placeholder='email' type='email' />
            <input value={password} onChange={(e) => { setPassword(e.target.value) }} className=' w-full max-w-[400px] mx-auto px-3 duration-200 hover:border-indigo-600 focus:border-indigo-600 py-2 sm:py-3 border border-solid border-indigo-400  rounded-full outline-none' placeholder='password' type='password' />
            <div className=' max-w-[400px] w-full mx-auto'>
                <Button clickHandler={handleSumbit} full text={authenticating ? 'Sumbitting' : 'Sumbit'} />
            </div>
            <p>

                {isRegister ? "Already have an account" : "Don't have an account ?"}
                <button onClick={() => { setIsRegister(!isRegister) }} className=' text-indigo-500'>{isRegister ? 'sing in' : 'sing up'}</button>
            </p>
        </div>
    )
}

"use client"
import React, { useState } from 'react'
import { Fugaz_One } from "next/font/google";
import Button from './Button';
import { useAuth } from '@/context/AuthContext';


const fugaz = Fugaz_One({ subsets: ['latin'], weight: ['400'] })

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isRegister, setIsRegister] = useState(false)
    const [authenticating, setAuthenticating] = useState(false)
    const [error, setError] = useState('')
    const { signup, login, loginWithGoogle } = useAuth()

    function validate() {
        const emailRegex = /[^@\s]+@[^@\s]+\.[^@\s]+/;
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address.'
        }
        if (password.length < 6) {
            return 'Password must be at least 6 characters.'
        }
        return ''
    }

    async function handleSumbit() {
        setError('')
        const validationMsg = validate()
        if (validationMsg) {
            setError(validationMsg)
            return
        }
        setAuthenticating(true)
        try {
            if (isRegister) {
                await signup(email, password)
            } else {
                await login(email, password)
            }
        } catch (err) {
            console.log(err)
            setError(err?.message || 'Something went wrong. Please try again.')
        } finally {
            setAuthenticating(false)
        }
    }

    async function handleGoogle() {
        setError('')
        setAuthenticating(true)
        try {
            await loginWithGoogle()
        } catch (err) {
            console.log(err)
            setError(err?.message || 'Google sign-in failed. Please try again.')
        } finally {
            setAuthenticating(false)
        }
    }

    return (
        <div className=' flex flex-col flex-1 justify-center items-center gap-4'>
            <h1 className={' text-4xl sm:text-5xl md:text-6xl  ' + fugaz.className}>{isRegister ? 'Register' : 'Log In '}</h1>
            <p>You&apos;re one step away!</p>
            {error && (
                <p className='text-red-600 text-sm'>{error}</p>
            )}
            <input
                value={email}
                onChange={(e) => { setEmail(e.target.value) }}
                disabled={authenticating}
                className=' w-full max-w-[400px] mx-auto px-3 duration-200 hover:border-indigo-600 focus:border-indigo-600 py-2 sm:py-3 border border-solid border-indigo-400  rounded-full outline-none disabled:opacity-60'
                placeholder='email'
                type='email'
                aria-label='email'
            />
            <input
                value={password}
                onChange={(e) => { setPassword(e.target.value) }}
                disabled={authenticating}
                className=' w-full max-w-[400px] mx-auto px-3 duration-200 hover:border-indigo-600 focus:border-indigo-600 py-2 sm:py-3 border border-solid border-indigo-400  rounded-full outline-none disabled:opacity-60'
                placeholder='password'
                type='password'
                aria-label='password'
                onKeyDown={(e) => { if (e.key === 'Enter') handleSumbit() }}
            />
            <div className=' max-w-[400px] w-full mx-auto'>
                <Button clickHandler={handleSumbit} full text={isRegister ? 'Create account' : 'Sign in'} loading={authenticating} disabled={authenticating} dark />
            </div>
            <div className=' max-w-[400px] w-full mx-auto'>
                <Button clickHandler={handleGoogle} full text={'Continue with Google'} disabled={authenticating} />
            </div>
            <p>

                {isRegister ? "Already have an account" : "Don't have an account ?"}
                <button onClick={() => { setIsRegister(!isRegister) }} className=' text-indigo-500'>{isRegister ? 'sign in' : 'sign up'}</button>
            </p>
        </div>
    )
}

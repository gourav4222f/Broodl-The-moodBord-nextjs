"use client"
import React from 'react'
import Button from './Button'
import { useAuth } from '@/context/AuthContext'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function Logout() {
    const { logout, currentUser } = useAuth()
    const pathName = usePathname()

    console.log(pathName)
    if (!currentUser) {
        return null
    }

    if (pathName === '/') {
        return (
            <Link href="/dashboard">
                <Button text="go to dashboard" />
            </Link>
        )
    }

    return (
        <Button text="Logout" clickHandler={logout} />
    )
}

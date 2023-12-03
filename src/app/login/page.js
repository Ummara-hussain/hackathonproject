"use client"
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { facebookLogin } from "../config/firebase"


export default function Login() {
    const router = useRouter()

    const handleFacebookLogin = async () => {
        try {
            const login = await facebookLogin()
            router.push('/dashboard', { scroll: false })
        }
        catch (error) {
            console.log(error)
        }
    }



    // console.log('user', user)

    return <div>
        <h1>Login</h1>
        <button onClick={handleFacebookLogin}>Signin with Facebook</button>
    </div>
}
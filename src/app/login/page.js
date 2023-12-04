"use client"
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { facebookLogin, auth } from "../config/firebase"
import { onAuthStateChanged } from "firebase/auth"


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

    // useEffect(() => {
    //     onAuthStateChanged(auth, (user) => {
    //         if (user) {
    //             const id = user.uid
    //             console.log('user', id)
    //             router.push('/dashboard', { scroll: false })
    //         }
    //         else {
    //             router.push('/login', { scroll: false })
    //         }
    //     })
    // }, [])

    // console.log('user', user)

    return <div>
        {/* <h1>Login</h1> */}
        <div style={{ textAlign: 'center', borderRadius: '10px', padding: '10px', lineHeight: '3', margin: 'auto', width: '350px', height: '250px', border: '1px solid deeppink', marginTop: '40px', marginBottom: '40px' }}>
            <h2>Welcome!</h2>
            <h4>Log in with your Facebook account to continue.</h4>
            <button style={{border:'1px solid deeppink', width:'100px'}} onClick={handleFacebookLogin}>Signin</button>
        </div>
    </div>
}
"use client"
import { useState } from "react"
import { useRouter } from 'next/navigation'
import { addUser } from "../config/firebase"

export default function Register() {
    const router = useRouter()

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");

    async function register() {
        const signin = await addUser(email, password, fullName);
        setEmail("")
        setPassword("")
        setFullName("")

        router.push('/login')
    }

    return (
        <div style={{ border: '1px solid lightpink', backgroundColor: 'pink', padding: '10px', borderRadius: '10px', height: '320px', boxShadow: '5px 5px 10px white', width: '370px', textAlign: 'center', margin: 'auto', marginTop: '40px' }}>
            <h1 style={{ fontSize: 'x-large', fontWeight: 'bolder', margin: '20px', textAlign: 'center' }}>Sign Up</h1>
            <input style={{ width: '95%', color: 'black', height: '35px', fontSize: 'x-large', borderRadius: '5px', padding: '4px', marginBottom: '10px' }} type="text" placeholder="First Name" onChange={e => setFullName(e.target.value)} /><br />
            <input style={{ width: '95%', color: 'black', height: '35px', fontSize: 'x-large', borderRadius: '5px', padding: '4px', marginBottom: '10px' }} type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} /><br />
            <input style={{ width: '95%', color: 'black', height: '35px', fontSize: 'x-large', borderRadius: '5px', padding: '4px', marginBottom: '10px' }} type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} /><br />
            <button style={{ width: '150px', height: '35px', fontSize: 'x-large', borderRadius: '5px', color: 'grey', backgroundColor: 'lightblue' }} onClick={register}>Sign up</button> <br /><br />
            <p style={{ fontSize: 'large' }}>Already have an account? <span onClick={() => { router.push('/login') }} style={{ cursor: 'pointer' }}> Sign In</span></p>
        </div>
    )
}
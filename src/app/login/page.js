"use client"
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { facebookLogin, auth, LoginUser } from "../config/firebase"
import { onAuthStateChanged, getAdditionalUserInfo } from "firebase/auth"


export default function Login() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleFacebookLogin = async () => {
        try {
            const login = await facebookLogin()
            router.push('/dashboard', { scroll: false })
        }
        catch (error) {
            console.log(error)
        }
    }
    const signin = async () => {
        const res = await LoginUser(email, password);
        console.log(res);
        router.push("/dashboard");
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
        <div style={{ textAlign: 'center', borderRadius: '10px', padding: '10px', lineHeight: '1', margin: 'auto', width: '550px', height: '350px', border: '1px solid deeppink', marginTop: '40px', marginBottom: '40px' }}>
            <h2 style={{ fontSize: 'xx-large', fontWeight: 'bolder', margin: '20px', textAlign: 'center' }}>Welcome!</h2>
            <h4>Sign in OR Log in with your Facebook account to continue.</h4> <br />
            <input style={{ color: 'black', width: '250px', height: '25px', border: '1px solid deeppink', borderRadius: '5px' }} type='email' placeholder='Enter your email' onChange={(e) => setEmail(e.target.value)} /><br /><br />
            <input style={{ color: 'black', width: '250px', height: '25px', border: '1px solid deeppink', borderRadius: '5px' }} type='password' placeholder='Enter your password' onChange={(e) => setPassword(e.target.value)} /><br /><br />
            <button style={{ border: '1px solid deeppink', width: '80px', height: '30px' }} onClick={signin}>Sign in</button> <br /><br />
            <button style={{ border: '1px solid white', backgroundColor: 'blue', height: '50px', width: '200px' }} onClick={handleFacebookLogin}>Continue with facebook</button> <br /><br />
            <p style={{ fontSize: 'large' }}>Don`t have an account? <span onClick={() => { router.push('/register') }} style={{ cursor: 'pointer' }}> Sign up</span></p>

        </div>

    </div>
}
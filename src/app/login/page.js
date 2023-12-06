"use client"
import { useEffect, useState } from "react"
import ReactPlayer from "react-player"
import Image from "next/image"
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

    
    const [files, setFiles] = useState(null)
    const isImage = (file) => file.type.startsWith('image')
    const isAudio = (file) => file.type.startsWith('audio')
    const isVideo = (file) => file.type.startsWith('video')


    return <div>
        {/* <h1>Login</h1> */}
        <div style={{ textAlign: 'center', borderRadius: '10px', padding: '10px', lineHeight: '3', margin: 'auto', width: '350px', height: '250px', border: '1px solid deeppink', marginTop: '40px', marginBottom: '40px' }}>
            <h2>Welcome!</h2>
            <h4>Log in with your Facebook account to continue.</h4>
            <button style={{ border: '1px solid deeppink', width: '100px' }} onClick={handleFacebookLogin}>Signin</button>
        </div>
        <input
            type='file'
            onChange={(e) => setFiles(e.target.files)
            } />

        {files && Array.from(files).map((file, index) => {
            return <div key={index}>
                {isImage(file) && (
                    <Image
                        src={URL.createObjectURL(file)}
                        width={200}
                        height={200}
                        alt='uploading' />
                )}
                {
                    isVideo(file) && (
                        <ReactPlayer url={URL.createObjectURL(file)} controls={true} />
                    )
                } 
                {
                    isAudio(file) && (
                        <ReactPlayer url={URL.createObjectURL(file)} controls={true} />
                    )
                } 
                </div>
        })}

    </div>
}
'use client'
import Image from 'next/image'
import ReactPlayer from 'react-player'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { postAd, getPost, where, collection, query, onSnapshot, db, updateStatus } from '../config/firebase'
import Popup from '../popup/page'
import { getAuth, onAuthStateChanged, getAdditionalUserInfo, signOut } from 'firebase/auth'
import Link from 'next/link'

import { MdHome, MdOutlineGroup } from "react-icons/md";
import { TbGridDots, TbMessage } from "react-icons/tb";
import { FaFaceGrinBeam, FaRegBookmark } from "react-icons/fa6";
import { RiShoppingBag2Line } from "react-icons/ri";
import { IoNavigateOutline, IoSettingsOutline } from "react-icons/io5";
import { FcVideoCall, FcAddImage } from "react-icons/fc";


export default function Dashboard() {
    const router = useRouter()
    const auth = getAuth()

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [description, setDescription] = useState()
    const [files, setFiles] = useState([])
    const [post, setPost] = useState([])
    const [type, setType] = useState()
    const [userExist, setUserExist] = useState()
    const [friendRequest, setFriendRequest] = useState([])
    const [friends, setFriends] = useState()

    const openPopup = () => {
        setIsPopupOpen(true);
    };
    const closePopup = () => {
        setIsPopupOpen(false);
    };

    const addData = async () => {
        await postAd({ description, files: files[0], type })
        setIsPopupOpen(false)
    }
    // console.log(setPost)

    useEffect(() => {
        getData()
        renderProfile()
        contacts()
    }, [])



    const getData = async () => {
        const postData = await getPost()
        setPost(postData)
    }

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid
                setUserExist(user)
            }
            else {

            }
        })
    }, [logOut])
    // console.log('users', userExist)


    const renderProfile = async () => {
        const a = query(collection(db, 'profile'), where('status', '==', 'pending'))
        const unsubscribe = onSnapshot(a, (querySnapshot) => {
            const data = [];
            querySnapshot.forEach((doc) => {
                data.push({ id: doc.id, ...doc.data() })
            })
            // console.log(data)
            setFriendRequest(data)
        })
    }

    async function contacts() {
        const q = query(collection(db, "profile"), where("status", "==", "accepted"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const data = [];
            querySnapshot.forEach((doc) => {
                data.push({ id: doc.id, ...doc.data() });
            });
            //   console.log(data)
            setFriends(data)
        });
    }

    async function logOut() {
        await signOut(auth)
            .then(() => {
                setUserExist(null);
                router.push('/login', { scroll: false })
            })
            .catch((error) => {
                // An error happened.
            });
    }


    if (!friends) {
        return <div>Loading...</div>
    }
    if (!friendRequest) {
        return <div>Loading...</div>
    }
    if (!post) {
        return <div>Loading...</div>
    }
    const handleClick = async (item, index) => {
        router.push('/chats')
    }

    return <div style={{ backgroundColor: 'white', color: 'black' }}>
        {/* NAVBAR */}
        <div className='navbar'>  <h1 style={{ fontSize: 'x-large', color: 'GrayText' }}>Scrolllink</h1>
            <input style={{ border: '1px solid grey', borderRadius: '5px', width: '400px', height: '40px' }} placeholder='Search something here...' />
            <button style={{ border: '1px solid grey', height: '30px', width: '70px', borderRadius: '10px' }} onClick={logOut}>Log out</button>
            <p style={{ display: 'flex' }}>{userExist && userExist.displayName}
                {userExist ? <img src={userExist.photoURL} /> : <span>No Photo</span>} </p>
        </div>

        <div style={{ display: 'flex' }}>
            {/* SIDEBAR */}
            <div style={{ width: '15%' }}>
                <ul className="iconList" style={{ margin: '3px', backgroundColor: '#EEEAEA ', height: '300px', fontSize: 'large', paddingTop: '15px', lineHeight: 2 }}>
                    <li style={{ color: 'deeppink' }}><MdHome /><Link href="/login">Feed</Link></li>
                    <li ><TbGridDots /><Link href="/login">Explore</Link></li>
                    <li ><RiShoppingBag2Line /><Link href="/login">Marketplace</Link></li>
                    <li ><MdOutlineGroup /><Link href="/login">Groups</Link></li>
                    <li ><FaRegBookmark /><Link href="/login">My favorites</Link></li>
                    <li ><IoNavigateOutline /><Link href="/login">Messages</Link></li>
                    <li ><IoSettingsOutline /><Link href="/login">Settings</Link></li>
                </ul>
                {/* FRIENDS */}
                <h1>My Contacts</h1>
                {friends.map((item, index) => {
                    return <div style={{ width: '180px', margin: '3px', borderRadius: '5px', padding: '5px', backgroundColor: '#EEEAEA', display: 'flex' }}>
                        <img width='60px' src='https://i.imgflip.com/6yvpkj.jpg' />
                        <h1 style={{ padding: '5px' }}>{item.displayName}</h1>
                    </div>
                })}
            </div>

            <div style={{ padding: '10px' }}>
                <input style={{ width: '450px', height: '100px', padding: '10px', border: '1px solid grey', borderRadius: '10px', margin: 'auto' }} onClick={openPopup} placeholder="Tell us about your day...." />
                <div onClick={openPopup} style={{ display: 'flex', width: '400px', justifyContent: 'space-evenly', fontSize: 'large', margin: '10px', }}> <FcVideoCall /> Video<FcAddImage /> Photos <FaFaceGrinBeam /> Feeling/Activity
                    <button style={{ backgroundColor: 'deeppink', width: '80px', borderRadius: '10px', color: 'white' }} onClick={openPopup}>POST</button>
                </div>
                {/* FEED */}
                <div >
                    {post.map((item, index) => (
                        <div style={{ border: '1px solid grey', borderRadius: '10px', margin: '3px', padding: '5px' }}>
                            <p style={{ display: 'flex' }}>
                                {userExist ? <img src={userExist.photoURL} /> : <span>No Photo</span>}
                                {userExist && userExist.displayName}
                            </p>
                            <div key={index}>
                                <h1>{item.description}</h1>
                                {item.type === 'image' ? (
                                    <img src={item.url} alt={item.description} style={{ maxWidth: '100%', maxHeight: '400px' }} />
                                ) : item.type === 'video' ? (
                                    <video controls width="400">
                                        <source src={item.url} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                ) : null}
                            </div>
                            <button className="button" >Like</button>
                            <button className="button" >Comment</button>
                            <button className="button" >Share</button>
                        </div>
                    ))}

                </div>
            </div>
            {/* FRIEND REQUEST */}
            <div style={{ width: '20%', margin: '5px' }}>
                <h1 style={{ fontSize: 'large', fontWeight: 'bolder' }}>Friend Requests</h1>
                {friendRequest.map((item, index) => {
                    return <div style={{ display: 'flex', width: '220px', height: '80px', borderRadius: '5px', border: '1px solid grey', margin: '5px' }}>
                        <img width='60px' src='https://i.imgflip.com/6yvpkj.jpg' />
                        <div> <h1>{item.displayName}</h1>
                            <button onClick={() => { updateStatus(item.id, 'accepted') }} style={{ backgroundColor: 'green', margin: '2px', width: '50px', height: '25px', borderRadius: '5px', color: 'white', fontSize: 'small' }}>Accept</button>
                            <button onClick={() => { updateStatus(item.id, 'rejected') }} style={{ backgroundColor: 'red', width: '50px', margin: '2px', height: '25px', borderRadius: '5px', color: 'white', fontSize: "small" }}>Reject</button>
                        </div> </div>
                })}
            </div>
            {/* CHAT */}
            <div>
                <h1 style={{ fontSize: 'large', margin: '10px', padding: '10px', height: '40px', fontWeight: 'bolder' }} >CHATS</h1>
                {friends.map((item, index) => {
                    return <div onClick={(item,index) => handleClick(item)
                    } style={{ border: '1px solid black', borderRadius: '10px', margin: '10px', padding: '10px', width: '200px', display: 'flex', justifyContent: 'space-between' }} >
                        <h1> {item.displayName}</h1> <TbMessage />
                    </div>
                })}
            </div>
        </div>

        <Popup isOpen={isPopupOpen} onClose={closePopup}>

            <input style={{ width: '450px', height: '100px', padding: '10px', border: '1px solid grey', borderRadius: '10px', margin: 'auto' }} onChange={(e) => setDescription(e.target.value)} placeholder="Tell us about your day...." />
            <div style={{ display: 'flex', width: '400px', fontSize: 'x-large', margin: '10px', padding: '5px' }}> <FcVideoCall /> Video <FcAddImage /> Photos <FaFaceGrinBeam /> Feeling/Activity</div>
            <input type='file' onChange={(e) => setFiles(e.target.files)} multiple />
            <input type='text' placeholder='Write image/video' onChange={(e) => setType(e.target.value)} />
            <button style={{ backgroundColor: '#3B71CA', width: '80px', borderRadius: '10px', color: 'white' }} onClick={addData}>POST</button>
        </Popup>



    </div>
}



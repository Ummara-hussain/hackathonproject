'use client'
import { useEffect, useState, useRef, useCallback } from 'react';
import { postMessages, collection, query, where, onSnapshot, db } from '../config/firebase';

const Chats = () => {
    const [newMessages, setNewMessages] = useState('');
    const [room, setRoom] = useState('');
    const [chats, setChats] = useState([]);

    const roomInputRef = useRef();

    const getChat = useCallback(() => {
        if (room !== '') {
            const q = query(collection(db, 'messages'), where('room', '==', room));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const chat = [];
                querySnapshot.forEach((doc) => {
                    chat.push({ id: doc.id, ...doc.data() });
                });
                console.log('chat', chat);
                setChats(chat);
            });

            return () => unsubscribe();
        }
    }, [room]);

    useEffect(() => {
        getChat();
    }, [getChat]);

    const handleMessages = async (e) => {
        e.preventDefault();
        if (newMessages === '') return;
        await postMessages(newMessages, room);
        setNewMessages('');
        getChat();
    };

    return (
        <div style={{ border: '1px solid black', backgroundColor: 'white', width: '70%', margin: 'auto', height: '550px', borderRadius: '10px', padding: '10px', marginTop: '10px' }}>
            <div>
                <center>
                    {chats.map((item, index) => {
                        return <div style={{ border: '1px solid deeppink', marginBottom: '6px', padding: '5px', width: '30%', borderRadius: '10px', backgroundColor: 'lightpink' }} key={item.id}>{item.text}</div>
                    })}
                </center>
            </div>

            {room ? (
                <div>
                    <center>
                        <form>
                            <input
                                style={{ border: '1px solid black', color: 'black', borderRadius: '10px', padding: '5px', margin: '10px', width: '250px' }}
                                type='text'
                                placeholder='Type your message here'
                                value={newMessages}
                                onChange={(e) => setNewMessages(e.target.value)}
                            />
                            <button style={{ backgroundColor: 'green', color: 'white', padding: '10px', margin: '10px', borderRadius: '10px', width: '100px' }} onClick={handleMessages} type='submit'>
                                Send
                            </button>
                        </form>
                    </center>
                </div>
            ) : (
                <div>
                    <center>
                        <label style={{ fontSize: 'large' }}>Enter Room Name:</label><br />
                        <input style={{ border: '1px solid black', color: 'black', borderRadius: '10px', padding: '5px', margin: '10px' }} ref={roomInputRef} /><br />
                        <button style={{ backgroundColor: 'green', color: 'white', padding: '10px', margin: '10px', borderRadius: '10px' }} onClick={() => setRoom(roomInputRef.current.value)}>Enter Chat</button>
                    </center>
                </div>
            )}
        </div>
    );
};

export default Chats;
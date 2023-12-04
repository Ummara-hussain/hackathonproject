import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, FacebookAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, query, where, updateDoc, onSnapshot } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyAAyVND6-zIFi_jBrG11YIXDtmUhkuvn7g",
    authDomain: "hackathon-bd351.firebaseapp.com",
    projectId: "hackathon-bd351",
    storageBucket: "hackathon-bd351.appspot.com",
    messagingSenderId: "113326217068",
    appId: "1:113326217068:web:3c96e5e4bba67d113d8549",
    measurementId: "G-JKKGEX4VN6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new FacebookAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);


function facebookLogin() {
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user
            const credential = FacebookAuthProvider.credentialFromResult(result);
            const accessToken = credential.accessToken;
            console.log(user)
            return user

        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = FacebookAuthProvider.credentialFromError(error);
        })
}

async function postAd({ description, file }) {
    try {
        const url = await uploadImage(file)
        const data = { description, url }
        await addDoc(collection(db, "posts"), data);
        alert('Posted sucessfully!')
    } catch (e) {
        alert(e.message)
    }
}

async function uploadImage(file) {
    try {
        const storageRef = ref(storage, 'posts/' + file.name);
        await uploadBytes(storageRef, file)
        const url = await getDownloadURL(storageRef)
        return url
    } catch (e) {
        alert(e.message)
    }
}

async function getPost() {
    const querySnapshot = await getDocs(collection(db, "posts"));
    const posts = []
    querySnapshot.forEach((doc) => {
        const postData = doc.data()
        posts.push(postData);
    });
    return posts
}
const profile = [
    {
        fullname: 'Iqra Ali',
        email: 'iqraali@gmailcom',
        status: 'pending'
    },
    {
        fullname: 'Sana Khan',
        email: 'sanakhan@gmailcom',
        status: 'pending'
    }, {
        fullname: 'Sara Ahmed',
        email: 'saraahmed@gmailcom',
        status: 'pending'
    }, {
        fullname: 'Ali Muhammad',
        email: 'alimuhammad@gmailcom',
        status: 'pending'
    }, {
        fullname: 'Mustafa Soomro',
        email: 'mustafa@gmailcom',
        status: 'pending'
    }, {
        fullname: 'Abdullah khan',
        email: 'abdullah@gmailcom',
        status: 'pending'
    },
]
async function profiles() {
    try {
        for (var i = 0; i < profile.length; i++) {
            const add = addDoc(collection(db, "profiles"), profile[i])
            console.log('add', add)
        }
    } catch (e) {
        alert(e.message)
    }
}

async function updateStatus(id, status) {
    await updateDoc(doc(db, "profiles", id), {
        status
    });
}

async function handleChat(NewMessages) {
    const mainCollectionRef = collection(db, 'chatRoom');
    const mainDocRef = await addDoc(mainCollectionRef, {
    });
    const mainDocId = mainDocRef.id;
    const subCollectionRef = collection(db, 'chatRoom', mainDocId, 'messages')
    await addDoc(subCollectionRef, {
        text: NewMessages,
        createdAt: Date.now(),
        userId: auth.currentUser.uid
    });
}

async function checkAndCreateRoom(friendId, setMsg) {
    const profiles = { [friendId]: true, [auth.currentUser.uid]: true }
    const docRef = await addDoc(collection(db, "chatRoom"), {
        profiles,
        createdAt: Date.now(),
        lastMessage: {}
    });

    const q = query(collection(db, "chatRoom"), where(`profiles.${friendId}`, "==", true));
    console.log('q', q)

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let room;
        const chat = [];
        querySnapshot.forEach((doc) => {
            chat.push({ id: doc.id, ...doc.data() });
            room = doc.data()
        });
        setMsg(chat)
        console.log('chats', chat)
    });
}

// checkAndCreateRoom()

export { facebookLogin, auth, postAd, getPost, collection, query, where, onSnapshot, db, profiles, updateStatus, handleChat, checkAndCreateRoom }
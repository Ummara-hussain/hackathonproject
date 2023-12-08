import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, FacebookAuthProvider, signInWithPopup, getAdditionalUserInfo, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, query, where, updateDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"

const firebaseConfig = {
    apiKey: "AIzaSyAAyVND6-zIFi_jBrG11YIXDtmUhkuvn7g",
    authDomain: "hackathon-bd351.firebaseapp.com",
    projectId: "hackathon-bd351",
    storageBucket: "hackathon-bd351.appspot.com",
    messagingSenderId: "113326217068",
    appId: "1:113326217068:web:3c96e5e4bba67d113d8549",
    measurementId: "G-JKKGEX4VN6"
}

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
            // const photoURL = user.photoURL;
            // const uid = user.uid
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

async function addUser(email, password, fullName) {
    await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            console.log('user', user)
            addDetail(user.uid, fullName, user.email)
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
}

function LoginUser(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
}

async function addDetail(uid, fullName, email) {
    const docRef = await addDoc(collection(db, "profile"), {
        uid,
        displayName: fullName,
        email,
        status: 'pending'
    });
}

async function getUsers() {
    const list = [];
    const querySnapshot = await getDocs(collection(db, "profile"));
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        list.push(doc.data());
    });
    return list;
}

async function postAd({ description, files, type }) {
    try {
        const url = await uploadImage(files)
        const data = { description, url, type }
        await addDoc(collection(db, "posts"), data);
        alert('Posted sucessfully!')
    } catch (e) {
        alert(e.message)
    }
}

// function profilePic(photoURL, userId){
//     // const storageRef = ref();

//         const profilePictureRef = storageRef.child(`profile_pictures/${userId}.jpg`);
//         // Fetch the image and store it in Firebase Storage
//         fetch(photoURL)
//           .then(response => response.blob())
//           .then(blob => profilePictureRef.put(blob))
//           .then(snapshot => {
//             console.log('Profile picture uploaded successfully!');
//           })
//           .catch(error => {
//             console.error('Error uploading profile picture:', error);
//           });
// }
// profilePic()
async function uploadImage(files) {
    try {
        const storageRef = ref(storage, 'posts/' + files.name);
        await uploadBytes(storageRef, files)
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

async function updateStatus(id, status) {
    await updateDoc(doc(db, "profile", id), {
        status
    });
}

async function postMessages(newMessages, room) {
    const docRef = await addDoc(collection(db, "messages"), {
        text: newMessages,
        createdAt: serverTimestamp(),
        user: auth.currentUser.displayName,
        room: room
    });
}

export { facebookLogin, auth, postAd, getPost, collection, query, where, onSnapshot, db, updateStatus, addUser, LoginUser, getUsers, getDocs, postMessages }
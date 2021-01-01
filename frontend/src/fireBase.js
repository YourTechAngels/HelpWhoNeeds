import firebase from "firebase/app"
import "firebase/auth"

const app = firebase.initializeApp({
    
    apiKey: "AIzaSyAQD-Hez1rIIaIlTYomLubx8QCfjmH9iNQ",
    authDomain: "helpwhoneeds-dev.firebaseapp.com",
    projectId: "helpwhoneeds-dev",
    storageBucket: "helpwhoneeds-dev.appspot.com",
    messagingSenderId: "610243223694",
    appId: "1:610243223694:web:2fc8ba826f29471e54e9df"
})

export const auth = app.auth()
export default app
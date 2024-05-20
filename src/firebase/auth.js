import { createUserWithEmailAndPassword, GoogleAuthProvider, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, updatePassword, updateProfile } from "firebase/auth";
import {app,auth} from "./firebase";
import { initializeApp } from "firebase/app";
import { getFirestore, addDoc, updateDoc, collection, doc, setDoc } from "firebase/firestore"; 


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// seedha function-just for email+pwd
// export const doCreateUserWithEmailAndPassword = async (username,email,password)=>{
//     return createUserWithEmailAndPassword(auth,username,email,password);
// };

export const doCreateUserWithEmailAndPassword = async (username,email,password,personRole)=>{
    try {
        // Create the user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // console.log(userCredential)
        // Get a reference to the newly created user
        const user = userCredential.user;
        // console.log(user)
        // Update the user profile with the username (assuming 'displayName' holds the username)
        user.displayName = username ;
        // console.log(user)
        user.providerData.forEach((profile)=>{
            profile.displayName = username;
        })        
        // console.log(user)

        // Update the Firestore document with the user's role
        const d = await setDoc(doc(db, "roles", user.uid), {
          username: user.displayName,
          role: personRole
        });
        console.log('User role updated');
        
        //sending verification mail to user
        await sendEmailVerification(user);

        // Return the user object (optional, depending on your needs)
        return user;
      } catch (error) {
        console.error('Error creating user:', error);
        // Handle errors appropriately, e.g., display an error message to the user
        throw error; // Re-throw the error for further handling
      }
};

export const doSignInWithEmailAndPassword = (email,password)=>{
    return signInWithEmailAndPassword(auth,email,password);
};

export const doSignInWithGoogle = async()=>{
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth,provider);
    //result.user
    return result;
};

export const doSignOut = () =>{
    return auth.signOut();
};

export const doPasswordReset = (email) =>{
    return sendPasswordResetEmail(auth,email);
};

// export const doPasswordChange = (password)=>{
//     return updatePassword(auth.currentUser,password);
// };

export const doSendEmailVerification = () => {
    return sendEmailVerification(auth.currentUser,{
        url: `${window.location.origin}/home`,
    });
};
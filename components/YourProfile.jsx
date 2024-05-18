import { doPasswordReset } from "../src/firebase/auth"
import { useAuth } from '../src/contexts/authContext/index'
import { useState} from "react"
import { getAuth } from "firebase/auth";

export default function YourProfile(){
    const auth = getAuth();
    const user = auth.currentUser;
    const { userLoggedIn } = useAuth()
    const [email, setEmail] = useState('')
    let signInProvider = ''
    let username = ''
    let useremail = ''
    let photoUrl = ''

    if (user !== null) {
        user.providerData.forEach((profile) => {
        //   console.log("Sign-in provider: " + profile.providerId);
        //   console.log("  Provider-specific UID: " + profile.uid);
        //   console.log("  Name: " + profile.displayName);
        //   console.log("  Email: " + profile.email);
        //   console.log("  Photo URL: " + profile.photoURL);
          signInProvider = profile.providerId;
          username = profile.displayName;
          useremail = profile.email;
          photoUrl = profile.photoURL;
        });
      }

    return (
        <>
        { userLoggedIn ? (
        <div className=" flex flex-col  items-center ">
            <div className="p-8 sm:p-36 w-3/6">
        <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl mb-8">Your Profile.</h2>
        <div>
            <img className=" rounded-full mb-2" src={photoUrl} alt="User's profile picture" />
            <p> <span className=" font-semibold">Sign In provider:</span> {signInProvider}</p>
            <p><span className=" font-semibold">Name:</span> {username}</p>
            <p><span className=" font-semibold">Email ID:</span> {useremail}</p>
        </div>
        <h4 className="text-xl font-bold leading-tight text-black sm:text-lg my-4">Do you want to reset password?</h4>
        <div>
            <label htmlFor="email">Email ID</label>
            <input type="email" id="email" placeholder="yourname@email.com"
            className=" w-full mt-2 mb-8 py-3 px-5 border-2 border-solid"
                      autoComplete='email'
                      required value={email} onChange={(e) => { setEmail(e.target.value) }}></input>
        </div>
        <button type="submit" className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80" onClick={(email)=>  {doPasswordReset(email)}}>Reset password</button>
        </div>
        </div>
        ):(
            <div className=" flex flex-col  items-center ">
                <div className="p-8 sm:p-20 w-3/6">
                <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl mb-8">You are not Signed In yet.</h2>
                </div>
            </div>
        )
}
        </>
    )
}

// Reference: https://firebase.google.com/docs/auth/web/manage-users#web-modular-api_3
// https://github.com/WebDevSimplified/React-Firebase-Auth
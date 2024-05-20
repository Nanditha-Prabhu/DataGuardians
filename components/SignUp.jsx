import { ArrowRight } from 'lucide-react'
import React, { useRef, useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../src/contexts/authContext/index'
import { doCreateUserWithEmailAndPassword } from '../src/firebase/auth'

export default function SignUp() {

  const navigate = useNavigate()

  const usernameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setconfirmPassword] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const { userLoggedIn } = useAuth()

  const onSubmit = async (e) => {
    e.preventDefault();
  
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      setErrorMessage("Passwords do not match");
      return;
    }
  
    try {
      setErrorMessage("");
      setIsRegistering(true);
      await userLoggedIn(usernameRef.current.value, emailRef.current.value, passwordRef.current.value); // Assuming this function checks authentication (optional)
    } catch {
      // Handle potential authentication errors (optional)
    }
  
    setIsRegistering(false);
  
    if (!isRegistering) {
      setIsRegistering(true);
      try {
        await doCreateUserWithEmailAndPassword(
          usernameRef.current.value,
          emailRef.current.value,
          passwordRef.current.value
        );
        console.log('User created successfully');
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          setErrorMessage('Email already in use. Please try a different email address.');
        } else if(error.code === 'auth/weak-password') {
          setErrorMessage('Password must have more than 6 characters.');
        } else {
          setErrorMessage('Failed to create an account. Please try again.');
        }
      }
    }
  };
  

  // const onSubmit = async (e) => {
  //     e.preventDefault()

  //     if (passwordRef.current.value !== passwordConfirmRef.current.value) {
  //       return setErrorMessage("Passwords do not match")
  //     }

  //     try {
  //       setErrorMessage("")
  //       setIsRegistering(true)
  //       await userLoggedIn(usernameRef.current.value, emailRef.current.value, passwordRef.current.value)
  //     } catch {
  //       setErrorMessage("Failed to create an account. You might already have an account or something went wrong.")
  //     }

  //     setIsRegistering(false)

  //     if(!isRegistering) {
  //         setIsRegistering(true)
  //         await doCreateUserWithEmailAndPassword(username, email, password)
  //     }
  // }

  return (
    <section>

{userLoggedIn && (<Navigate to={'/'} replace={true} />)}

      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
          <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
            <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl">Sign up</h2>
            <p className="mt-2 text-base text-gray-600">
              Already have an account?
              <Link
                to="/SignIn"
                title=""
                className="font-medium text-black transition-all duration-200 hover:underline"
              >
                Sign In
              </Link>
            </p>
            <form onSubmit={onSubmit} action="#" method="POST" className="mt-8">
              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="text-base font-medium text-gray-900">
                    Username
                  </label>
                  <div className="mt-2">
                    <input
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type="text"
                      placeholder="Kapil Dev"
                      id="name"
                      ref={usernameRef}
                      required
                      value={username} onChange={(e) => {setUsername(e.target.value)}}
                    ></input>
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="text-base font-medium text-gray-900">
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type="email"
                      ref={emailRef}
                      autoComplete='email'
                      required
                      value={email} onChange={(e) => { setEmail(e.target.value) }}
                      placeholder="Email"
                      id="email"
                    ></input>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-base font-medium text-gray-900">
                      Password
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                    disabled={isRegistering}
                    autoComplete='new-password'
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type="password"
                      ref={passwordRef}
                      required
                      placeholder="Password"
                      id="password"
                      value={password} onChange={(e) => { setPassword(e.target.value) }}
                    ></input>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-base font-medium text-gray-900">
                      Confirm Password
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                    disabled={isRegistering}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type="password"
                      ref={passwordConfirmRef} 
                      placeholder="Password"
                      autoComplete='off'
                      required
                      value={confirmPassword} onChange={(e) => { setconfirmPassword(e.target.value) }}
                    ></input>
                  </div>
                </div>
                <div>

                {errorMessage && (
                            <span className='text-red-600 font-bold'>{errorMessage}</span>
                        )}

                  <button
                    type="submit"
                    disabled={isRegistering}
                    className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                  >
                    {isRegistering ? 'Signing Up...' : 'Sign Up'} <ArrowRight className="ml-2" size={16} />
                  </button>
                </div>
              </div>
            </form>
            
          </div>
        </div>
        <div className="h-full w-full">
          <img
            className="mx-auto h-full w-full rounded-md object-cover"
            src="/karnataka-state-police-logo-2.png"
            alt="Logo of karnataka state police"
          />
        </div>
      </div>
    </section>
  )
}

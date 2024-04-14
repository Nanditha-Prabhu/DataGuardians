import { ArrowRight } from 'lucide-react'
import React, { useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../src/contexts/authContext/index'
import { doCreateUserWithEmailAndPassword } from '../src/firebase/auth'

export default function SignUp() {

  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setconfirmPassword] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const { userLoggedIn } = useAuth()

  const onSubmit = async (e) => {
      e.preventDefault()
      if(!isRegistering) {
          setIsRegistering(true)
          await doCreateUserWithEmailAndPassword(email, password)
      }
  }

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
                {/* <div>
                  <label htmlFor="name" className="text-base font-medium text-gray-900">
                    {' '}
                    Full Name{' '}
                  </label>
                  <div className="mt-2">
                    <input
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type="text"
                      placeholder="Full Name"
                      id="name"
                    ></input>
                  </div>
                </div> */}
                <div>
                  <label htmlFor="email" className="text-base font-medium text-gray-900">
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type="email"
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
            src="./public/karnataka-state-police-logo-2.png"
            alt="Logo of karnataka state police"
          />
        </div>
      </div>
    </section>
  )
}

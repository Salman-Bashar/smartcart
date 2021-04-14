import React, { Fragment, useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useAlert } from "react-alert"
import { Link } from "react-router-dom"

import MetaData from "../layout/MetaData"
import Loader from "../layout/Loader"

import { login, clearErrors } from "../../actions/userActions"

const Login = ({ history, location }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const alert = useAlert()
  const dispatch = useDispatch()

  const { isAuthenticatedUser, error, loading } = useSelector(
    (state) => state.auth
  )

  const redirect = location.search ? location.search.split("=")[1] : "/"

  useEffect(() => {
    if (isAuthenticatedUser) history.push(redirect)

    if (error) {
      alert.error(error)
      dispatch(clearErrors())
    }
  }, [dispatch, alert, isAuthenticatedUser, error, history, redirect])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(login(email, password))
  }

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={"Login"} />
          <div className='row wrapper'>
            <div className='col-10 col-lg-5'>
              <form className='shadow-lg' onSubmit={submitHandler}>
                <h1 className='mb-3'>Login</h1>
                <div className='form-group'>
                  <label htmlFor='email_field'>Email</label>
                  <input
                    type='email'
                    id='email_field'
                    className='form-control'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label>Normal User: demouser01@gmail.com</label>
                  <label>Admin User: admin@gmail.com</label>
                </div>

                <div className='form-group'>
                  <label htmlFor='password_field'>Password</label>
                  <input
                    type='password'
                    id='password_field'
                    className='form-control'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <label>Normal User: demouser001</label>
                  <label>Admin User: adminpass</label>
                </div>

                <Link to='/password/forgot' className='float-right mb-4'>
                  Forgot Password?
                </Link>

                <button
                  id='login_button'
                  type='submit'
                  className='btn btn-block py-3'
                >
                  LOGIN
                </button>
                <Link to='/register' className='float-left mt-3'>
                  Don't Have an Account yet?
                </Link>
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  )
}

export default Login

import "./App.css"

import { useEffect } from "react"
import { BrowserRouter as Router, Route } from "react-router-dom"

import Header from "./components/layout/Header"
import Footer from "./components/layout/Footer"

import Home from "./components/Home"
import ProductDetails from "./components/product/ProductDetails"

import Login from "./components/user/Login"
import Register from "./components/user/Register"
import Profile from "./components/user/Profile"
import UpdateProfile from "./components/user/UpdateProfile"
import UpdatePassword from "./components/user/UpdatePassword"
import ForgotPassword from "./components/user/ForgotPassword"
import ResetPassword from "./components/user/ResetPassword"

import Cart from "./components/cart/Cart"

import ProtectedRoute from "./components/route/ProtectedRoute"
import { loadUser } from "./actions/userActions"
import store from "./store"

function App() {
  useEffect(() => {
    store.dispatch(loadUser())
  }, [])

  return (
    <Router>
      <div className='App'>
        <Header />
        <div className='container container-fluid'>
          <Route path='/' component={Home} exact />
          <Route path='/search/:keyword' component={Home} />
          <Route path='/product/:id' component={ProductDetails} exact />

          <Route path='/login' component={Login} />
          <Route path='/password/forgot' component={ForgotPassword} exact />
          <Route
            path='/password/reset/:token'
            component={ResetPassword}
            exact
          />
          <Route path='/register' component={Register} />

          <ProtectedRoute path='/myprofile' component={Profile} exact />
          <ProtectedRoute
            path='/myprofile/update'
            component={UpdateProfile}
            exact
          />
          <ProtectedRoute
            path='/password/update'
            component={UpdatePassword}
            exact
          />

          <ProtectedRoute path='/cart' component={Cart} exact />
        </div>
        <Footer />
      </div>
    </Router>
  )
}

export default App

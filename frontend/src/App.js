import "./App.css"

import { useEffect, useState } from "react"
import { BrowserRouter as Router, Route } from "react-router-dom"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import axios from "axios"

import Header from "./components/layout/Header"
import Footer from "./components/layout/Footer"

import Home from "./components/Home"
import ProductDetails from "./components/product/ProductDetails"

//Auth Imports
import Login from "./components/user/Login"
import Register from "./components/user/Register"
import Profile from "./components/user/Profile"
import UpdateProfile from "./components/user/UpdateProfile"
import UpdatePassword from "./components/user/UpdatePassword"
import ForgotPassword from "./components/user/ForgotPassword"
import ResetPassword from "./components/user/ResetPassword"

//Admin Imports
import Dashboard from "./components/admin/Dashboard"
import ProductsList from "./components/admin/ProductsList"

//Cart Imports
import Cart from "./components/cart/Cart"
import Shipping from "./components/cart/Shipping"
import ConfirmOrder from "./components/cart/ConfirmOrder"
import Payment from "./components/cart/Payment"
import OrderSuccess from "./components/cart/OrderSuccess"

//Order Imports
import ListOrders from "./components/order/ListOrders"
import OrderDetails from "./components/order/OrderDetails"

import ProtectedRoute from "./components/route/ProtectedRoute"
import { loadUser } from "./actions/userActions"
import store from "./store"

function App() {
  const [stripeApiKey, setStripeApiKey] = useState("")

  useEffect(() => {
    store.dispatch(loadUser())

    async function getStripeApiKey() {
      const { data } = await axios.get("/api/stripeapi")
      setStripeApiKey(data.stripeApiKey)
    }

    getStripeApiKey()
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

          <Route path='/cart' component={Cart} exact />
          <ProtectedRoute path='/shipping' component={Shipping} />
          <ProtectedRoute path='/order/confirm' component={ConfirmOrder} />
          {stripeApiKey && (
            <Elements stripe={loadStripe(stripeApiKey)}>
              <ProtectedRoute path='/payment' component={Payment} />
            </Elements>
          )}
          <ProtectedRoute path='/success' component={OrderSuccess} />

          <ProtectedRoute path='/orders/myorders' component={ListOrders} />
          <ProtectedRoute path='/order/:id' component={OrderDetails} />
        </div>

        <ProtectedRoute
          path='/dashboard'
          isAdmin={true}
          component={Dashboard}
        />

        <ProtectedRoute
          path='/admin/products'
          isAdmin={true}
          component={ProductsList}
        />
        <Footer />
      </div>
    </Router>
  )
}

export default App

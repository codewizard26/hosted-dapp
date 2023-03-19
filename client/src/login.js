import React from "react"
import {UAuthConnector } from '@uauth/web3-react'
import { useState } from 'react'
import connectors from './authentication'
import App from './App'
import {useNavigate,Route,Routes, BrowserRouter} from "react-router-dom"
import PrivateRoute from "./PrivateRoutes"
import "./App.css"


function Main(props) {
  const connector = connectors["UAuth"][0]
  const nav = useNavigate();


  // Get web3-react hooks from UAuthConnector
  const { useIsActivating, useIsActive } = connectors["UAuth"][1]
  const isActivating = useIsActivating()
  const isActive = useIsActive()

  const [connectionStatus, setConnectionStatus] = useState('Disconnected')
  const [error, setError] = useState()
  const [userName,setUserName] = useState()



  // Handle connector activation and update connection/error state
  const handleToggleConnect = () => {
    setError(undefined) // Clear error state
    
    if (isActive) {
      if (connector?.deactivate) {
        void connector.deactivate()
      } else {
        void connector.resetState()
      }
      setConnectionStatus('Disconnected')
      localStorage.clear()
    }
    else if (!isActivating) {
      setConnectionStatus('Connecting...')

      // Activate the connector and update states
      connector.activate(1)
        .then(() => {
          
          setConnectionStatus('Connected')
          console.log(localStorage.getItem("username"))
          props.func(localStorage.getItem("username"))

          // console.log(connectors['UAuth'][1])
        })
        .catch((e) => {
          connector.resetState()
          setError(e)
        })
    }
    console.log(localStorage)
    if (localStorage.getItem("username")){
      setUserName(JSON.parse(localStorage.getItem("username")).value)
    }
    console.log(userName)
  }

const navigateDashboard = () =>{

  nav("/dashboard")
  }

const walletinfo = () =>{
  if (localStorage.value){
    setUserName(JSON.parse(localStorage.getItem("username")).value)
  }
}



  return (
    <>
      <div className="navigation">
      Billing dashboard
      </div>
<div>
  <h3>Please login with your Unstoppable domain and then generate nft</h3>
</div>
      <div className="login-card">
        <div className="card-heading">
          Login
        </div>
        <div className="connection-status">
        Status - {(error?.message) ? ("Error: " + error.message) : connectionStatus}
        </div>
        <div >
        <button className="btn-1" onClick={handleToggleConnect} disabled={false}>
        {isActive ? "Disconnect" : "Connect Unstoppable"}
      </button>
        </div>
        <div className="btn-2">
        <button className="btn-2"> Connect Coinbase</button>
        </div>
        <hr></hr>
        <div className="btn-3">
        <button className="btn-3" onClick={navigateDashboard}> Generate Bill Nft</button>
        </div>
        
      </div>

 
      
      
     
   

      <br></br>
      <br></br>
      <br></br>





          
    </>
  )
}

export default Main
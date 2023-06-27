import { useEffect, useState } from 'react'

// // Components
// import Navigation from './components/Navigation'
// import Section from './components/Section'
// import Product from './components/Product'

// ABIs
import Dappazon from './abis/Dappazon.json'

// Config
import config from './config.json'

const { ethers } = require('ethers')

function App() {

  const loadBlockChainData=async()=>{
    const accounts= await window?.ethereum?.request({method:'eth_requestAccounts'});
    const account= ethers?.getAddress(accounts[0])
  console.log("account",account)
  }

  useEffect(()=>{
loadBlockChainData();
  },[])

  return (
    <div>
      <h1>Dappazon</h1>
    </div>
  );
}

export default App;

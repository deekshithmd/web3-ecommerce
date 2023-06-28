import { useEffect, useState } from 'react'
import {ethers} from 'ethers'

// // Components
import Navigation from './components/Navigation'
// import Section from './components/Section'
// import Product from './components/Product'

// ABIs
import Ecommerce from './abis/Ecommerce.json'

// Config
import config from './config.json'

function App() {
  const [account,setAccount]=useState(null);
  const [provider,setProvider]=useState(null);
  const [ecommerce,setEcommrce]=useState(null)

  const loadBlockChainData=async()=>{
    // Connect to blockchain
    const provider= new ethers.BrowserProvider(window.ethereum);
    setProvider(provider);
    const network= await provider.getNetwork();
    // Connect with smart contract create JS versions
    const ecommerce= new ethers.Contract(config[parseInt(network.chainId)].ecommerce.address, Ecommerce, provider);
    setEcommrce(ecommerce);
    // load products
    const items=[];
    for(let i=0;i<9;i++){
      const item=ecommerce.items[i+1];
      items.push(item);
    }
    console.log("items");
  }

  useEffect(()=>{
loadBlockChainData();
  },[])

  return (
    <div>
      <Navigation account={account} setAccount={setAccount}/>
      <h1>Dappazon</h1>
    </div>
  );
}

export default App;

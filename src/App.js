import { useEffect, useState } from "react";
import { ethers } from "ethers";

// // Components
import Navigation from "./components/Navigation";
import Section from "./components/Section";
import Product from "./components/Product";

// ABIs
import Ecommerce from "./abis/Ecommerce.json";

// Config
import config from "./config.json";

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [ecommerce, setEcommrce] = useState(null);
  const [electronics, setElectronics] = useState([]);
  const [toys, setToys] = useState([]);
  const [clothing, setClothing] = useState([]);
  const [filter, setFilter] = useState("all");

  const [item, setItem] = useState(null);
  const [toggle, setToggle] = useState(false);

  const togglePop = (item) => {
    setItem(item);
    setToggle(!toggle);
  };

  const loadBlockChainData = async () => {
    // Connect to blockchain
    const provider = new ethers.BrowserProvider(window.ethereum);
    setProvider(provider);
    const network = await provider.getNetwork();
    // Connect with smart contract create JS versions
    console.log(parseInt(network.chainId));
    const ecommerceContract = new ethers.Contract(
      config[parseInt(network.chainId)].ecommerce.address,
      Ecommerce,
      provider
    );
    setEcommrce(ecommerceContract);

    // load products
    const items = [];
    for (let i = 0; i < 9; i++) {
      const item = await ecommerceContract.items(i + 1);
      items.push(item);
    }

    const electronics = items.filter(
      (item) => item?.category === "electronics"
    );
    setElectronics(electronics);
    const clothing = items.filter((item) => item?.category === "clothing");
    setClothing(clothing);
    const toys = items.filter((item) => item?.category === "toys");
    setToys(toys);
  };

  useEffect(() => {
    loadBlockChainData();
  }, []);

  const handleFilter = (filterString) => {
    setFilter(filterString);
  };

  console.log("filter",filter)

  return (
    <div>
      <Navigation
        account={account}
        setAccount={setAccount}
        handleFilter={handleFilter}
      />
      {(filter === "all" || filter === "electronics") && electronics && (
        <Section
          title="Electronics"
          items={electronics}
          togglePop={togglePop}
        />
      )}
      {(filter === "all" || filter === "clothing") && clothing && (
        <Section title="Clothing" items={clothing} togglePop={togglePop} />
      )}
      {(filter === "all" || filter === "toys") && toys && (
        <Section title="Toys" items={toys} togglePop={togglePop} />
      )}
      {toggle && (
        <Product
          item={item}
          provider={provider}
          account={account}
          ecommerce={ecommerce}
          togglePop={togglePop}
        />
      )}
    </div>
  );
}

export default App;

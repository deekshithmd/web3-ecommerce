import { ethers } from "ethers";

const Navigation = ({ account, setAccount, handleFilter }) => {
  const connectHandler = async () => {
    const accounts = await window?.ethereum?.request({
      method: "eth_requestAccounts",
    });
    const account = ethers?.getAddress(accounts[0]);
    setAccount(account);
  };

  return (
    <nav>
      <div className="nav__brand">
        <h1>Ecommerce</h1>
      </div>
      {account ? (
        <button type="button" className="nav__connect">
          {account.slice(0, 6) + "..." + account.slice(38, 42)}
        </button>
      ) : (
        <button type="button" className="nav__connect" onClick={connectHandler}>
          Connect
        </button>
      )}

      <ul className="nav__links">
        <li onClick={() => handleFilter("all")}>All</li>
        <li onClick={() => handleFilter("clothing")}>Clothing & Jewellery</li>
        <li onClick={() => handleFilter("electronics")}>
          Electronics & Gadgets
        </li>
        <li onClick={() => handleFilter("toys")}>Toys & Gaming</li>
      </ul>
    </nav>
  );
};

export default Navigation;

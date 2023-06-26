// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const {items} = require("../src/assets/items")

const tokens = (n) => {
  return hre.ethers.parseEther(n)
};

async function main() {
const [deployer]= hre.ethers.getSigners();

const Ecommerce = await hre.ethers.getContractFactory("Ecommerce");
const ecommerceContract = await Ecommerce.deploy();
await ecommerceContract.deplyed();

console.log("Contract deployed at",ecommerceContract.getAddress())

// List items

for( let i =0 ;i<items.length;i++){
  const transaction= await ecommerceContract.connect(deployer).listenerCount(
    items[i].id,
    items[i].name,
    items[i].category,
    items[i].image,
    tokens(items[i].price),
    items[i].rating,
    items[i].stock
  )

  await transaction.wait();
  console.log(`Listed item is ${items[i].id}:${items[i].name}`);

}
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

const { ethers } = require("hardhat");
const { expect } = require("chai");

// const tokens = (n) => {
//   console.log(n.toString())
//   return ethers.utils.parseUnits(n.toString(), "ether");
// };

const ID=1;
const NAME="Shirt";
const CATEGORY="Clothing";
const IMAGE="image";
const COST=10000000000000000000;
const RATING=4;
const STOCK=5;

describe("Ecommerce", function () {
  let ecommerceContract;
  let deployer, buyer;

  this.beforeEach("Before Each Test", async () => {
    [deployer, buyer] = await ethers.getSigners();
    const Ecommerce = await ethers.getContractFactory("Ecommerce");
    ecommerceContract = await Ecommerce.deploy();
  });

  describe("Deploying Contract", () => {
    it("Setting Name",async()=>{
      expect(await ecommerceContract.owner()).to.equal(deployer.address)
    })
  });

  describe('Listing',()=>{
    let transaction;

    beforeEach(async()=>{
      transaction=await ecommerceContract.connect(deployer).list(
        ID,
        NAME,
        CATEGORY,
        IMAGE,
        COST,
        RATING,
        STOCK
      )
      await transaction.wait();
    })
    it("Returns item attributes", async()=>{
      const item=await ecommerceContract.items(ID)
      expect(item.id).to.equal(ID)
      expect(item.name).to.equal(NAME)
      expect(item.category).to.equal(CATEGORY)
      expect(item.image).to.equal(IMAGE)
      expect(item.cost).to.equal(COST)
      expect(item.rating).to.equal(RATING)
      expect(item.stock).to.equal(STOCK)
    })
  })
});

const { ethers } = require("hardhat");
const { expect } = require("chai");

const tokens = (n) => {
  return ethers.parseEther(n)
};

const ID=1;
const NAME="Shirt";
const CATEGORY="Clothing";
const IMAGE="image";
const COST = tokens("1");
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

    it("Emits list event",()=>{
      expect(transaction).to.emit(ecommerceContract,"List")
    })
  })
  describe('Buying',()=>{
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
      transaction= await ecommerceContract.connect(buyer).buy(ID, {value:COST});
      await transaction.wait();
    })
    
    it("Updates the contract balance",async()=>{
      const result=await ethers.provider.getBalance(ecommerceContract.getAddress());
      expect(result).to.equal(COST);
    })

    it("Update buyers order count",async()=>{
      const result = await ecommerceContract.orderCount(buyer.address);
      expect(result).to.equal(1)
    })

    it("Adds the order",async()=>{
      const order= await ecommerceContract.orders(buyer.address,1);
      expect(order.time).to.be.greaterThan(0);
      expect(order.item.name).to.equal(NAME);
    })

    it("Updates the contract balance",async()=>{
      const result= await ethers.provider.getBalance(ecommerceContract.getAddress());
      expect(result).to.equal(COST);
    })

    it("Emits Buy Event",()=>{
      expect(transaction).to.emit(ecommerceContract,"Buy");
    })
  })

  describe('Withdrawing',()=>{
    let transaction, balanceBefore;

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
      transaction= await ecommerceContract.connect(buyer).buy(ID, {value:COST});
      await transaction.wait();

      balanceBefore= await ethers.provider.getBalance(deployer.address);

      // withdraw
      transaction = await ecommerceContract.connect(deployer).withdraw();
      await transaction.wait();
    })

    it("Updates the owner balance",async()=>{
      const balanceAfter= await ethers.provider.getBalance(deployer.address);
      expect(balanceAfter).to.be.greaterThan(balanceBefore);
    })

    it("Updates the contract balance",async()=>{
      const result= await ethers.provider.getBalance(ecommerceContract.getAddress());
      expect(result).to.equal(0);
    })

  })
   
});

const { ethers } = require("hardhat");
const { expect } = require("chai");


const token=(n)=>{
  return ethers.utils.parseUnits(n.toString(),'ether')
}

describe("Ecommerce", function () {

  let ecommerceContract;
  this.beforeEach('Before Each Test',async()=>{
   const Ecommerce= await ethers.getContractFactory('Ecommerce');
  ecommerceContract= await Ecommerce.deploy();
  })

 describe('Deploying Contract',()=>{
  it('Checking Name',async()=>{
    expect(await ecommerceContract.name()).to.equal('Ecommerce')
   })
 })
});

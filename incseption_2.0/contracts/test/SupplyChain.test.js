const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SupplyChain", function () {
  let supplyChain;
  let admin, farmer, distributor, retailer, consumer;

  beforeEach(async function () {
    [admin, farmer, distributor, retailer, consumer] = await ethers.getSigners();

    const SupplyChain = await ethers.getContractFactory("SupplyChain");
    supplyChain = await SupplyChain.deploy();
    await supplyChain.waitForDeployment();
  });

  describe("User Registration", function () {
    it("Should register users with different roles", async function () {
      await supplyChain.registerUser(farmer.address, 1, "John Farmer");
      await supplyChain.registerUser(distributor.address, 2, "Bob Distributor");
      await supplyChain.registerUser(retailer.address, 3, "Alice Retailer");
      await supplyChain.registerUser(consumer.address, 4, "Carol Consumer");

      const farmerUser = await supplyChain.getUser(farmer.address);
      expect(farmerUser.role).to.equal(1);
      expect(farmerUser.name).to.equal("John Farmer");
      expect(farmerUser.isRegistered).to.be.true;
    });

    it("Should prevent duplicate registration", async function () {
      await supplyChain.registerUser(farmer.address, 1, "John Farmer");
      await expect(
        supplyChain.registerUser(farmer.address, 1, "John Farmer")
      ).to.be.revertedWith("User already registered");
    });

    it("Should only allow admin to register users", async function () {
      await expect(
        supplyChain.connect(farmer).registerUser(distributor.address, 2, "Bob")
      ).to.be.revertedWith("Only admin can perform this action");
    });
  });

  describe("Product Creation", function () {
    beforeEach(async function () {
      await supplyChain.registerUser(farmer.address, 1, "John Farmer");
    });

    it("Should allow farmer to create product", async function () {
      await expect(
        supplyChain.connect(farmer).createProduct(
          "Organic Tomatoes",
          "Fresh organic tomatoes",
          100,
          "kg",
          "Farm Location A"
        )
      ).to.emit(supplyChain, "ProductCreated");

      const product = await supplyChain.getProduct(1);
      expect(product.name).to.equal("Organic Tomatoes");
      expect(product.quantity).to.equal(100);
      expect(product.currentOwner).to.equal(farmer.address);
      expect(product.state).to.equal(0); // Created state
    });

    it("Should prevent non-farmer from creating product", async function () {
      await supplyChain.registerUser(consumer.address, 4, "Carol Consumer");
      
      await expect(
        supplyChain.connect(consumer).createProduct(
          "Tomatoes",
          "Fresh tomatoes",
          100,
          "kg",
          "Location"
        )
      ).to.be.revertedWith("Unauthorized role");
    });
  });

  describe("Supply Chain Flow", function () {
    beforeEach(async function () {
      await supplyChain.registerUser(farmer.address, 1, "John Farmer");
      await supplyChain.registerUser(distributor.address, 2, "Bob Distributor");
      await supplyChain.registerUser(retailer.address, 3, "Alice Retailer");
      await supplyChain.registerUser(consumer.address, 4, "Carol Consumer");

      await supplyChain.connect(farmer).createProduct(
        "Organic Tomatoes",
        "Fresh organic tomatoes",
        100,
        "kg",
        "Farm A"
      );
    });

    it("Should transfer from farmer to distributor", async function () {
      await expect(
        supplyChain.connect(farmer).transferToDistributor(
          1,
          distributor.address,
          ethers.parseEther("0.5"),
          "Warehouse B"
        )
      ).to.emit(supplyChain, "ProductTransferred");

      const product = await supplyChain.getProduct(1);
      expect(product.currentOwner).to.equal(distributor.address);
      expect(product.state).to.equal(1); // WithDistributor
    });

    it("Should transfer from distributor to retailer", async function () {
      await supplyChain.connect(farmer).transferToDistributor(
        1,
        distributor.address,
        ethers.parseEther("0.5"),
        "Warehouse B"
      );

      await expect(
        supplyChain.connect(distributor).transferToRetailer(
          1,
          retailer.address,
          ethers.parseEther("0.8"),
          "Store C"
        )
      ).to.emit(supplyChain, "ProductTransferred");

      const product = await supplyChain.getProduct(1);
      expect(product.currentOwner).to.equal(retailer.address);
      expect(product.state).to.equal(2); // WithRetailer
    });

    it("Should complete full supply chain to consumer", async function () {
      await supplyChain.connect(farmer).transferToDistributor(
        1,
        distributor.address,
        ethers.parseEther("0.5"),
        "Warehouse B"
      );

      await supplyChain.connect(distributor).transferToRetailer(
        1,
        retailer.address,
        ethers.parseEther("0.8"),
        "Store C"
      );

      await expect(
        supplyChain.connect(retailer).sellToConsumer(
          1,
          consumer.address,
          ethers.parseEther("1.2"),
          "Consumer Home"
        )
      ).to.emit(supplyChain, "ProductTransferred");

      const product = await supplyChain.getProduct(1);
      expect(product.currentOwner).to.equal(consumer.address);
      expect(product.state).to.equal(3); // Sold
    });

    it("Should track complete product history", async function () {
      await supplyChain.connect(farmer).transferToDistributor(
        1,
        distributor.address,
        ethers.parseEther("0.5"),
        "Warehouse B"
      );

      await supplyChain.connect(distributor).transferToRetailer(
        1,
        retailer.address,
        ethers.parseEther("0.8"),
        "Store C"
      );

      await supplyChain.connect(retailer).sellToConsumer(
        1,
        consumer.address,
        ethers.parseEther("1.2"),
        "Consumer Home"
      );

      const history = await supplyChain.getProductHistory(1);
      expect(history.length).to.equal(4); // Created + 3 transfers
      expect(history[0].newState).to.equal(0); // Created
      expect(history[1].newState).to.equal(1); // WithDistributor
      expect(history[2].newState).to.equal(2); // WithRetailer
      expect(history[3].newState).to.equal(3); // Sold
    });
  });
});

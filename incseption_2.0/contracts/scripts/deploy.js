const hre = require("hardhat");

async function main() {
  console.log("Deploying SupplyChain contract...");

  const SupplyChain = await hre.ethers.getContractFactory("SupplyChain");
  const supplyChain = await SupplyChain.deploy();

  await supplyChain.waitForDeployment();

  const address = await supplyChain.getAddress();
  console.log(`SupplyChain deployed to: ${address}`);

  // Save contract address to a file
  const fs = require('fs');
  const deploymentInfo = {
    address: address,
    network: hre.network.name,
    deployedAt: new Date().toISOString()
  };

  fs.writeFileSync(
    'deployment.json',
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("Deployment info saved to deployment.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

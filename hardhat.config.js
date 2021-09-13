require("@nomiclabs/hardhat-waffle");
const fs = require("fs");
const privateKey =
  fs.readFileSync(".secret").toString().trim() || "01234567890123456789";
const projectId = "b10ee952e53944bda93d5ec291b03594";

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${projectId}`,
      // url: "https://matic-mumbai.chainstacklabs.com",
      accounts: [privateKey],
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${projectId}`,
      // url: "https://matic-mumbai.chainstacklabs.com",
      accounts: [privateKey],
    },
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};

require("@nomiclabs/hardhat-waffle");
const fs = require('fs');
const privateKey = fs.readFileSync(".secret").toString().trim() || "01234567890123456789";
const InfuraOrAlchemyPolygonTestNetURL = fs.readFileSync(".InfuraOrAlchemyPolygonTestNetURL").toString().trim() || "";
//const InfuraOrAlchemyPolygonMainNetURL = fs.readFileSync(".InfuraOrAlchemyPolygonMainNetURL").toString().trim() || "";

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
    /**mumbai: {
      //+-Infura/Alchemy:_
      //url: `${InfuraOrAlchemyPolygonTestNetURL}`,
      accounts: [privateKey]
    },
    matic: {
      //+-Infura/Alchemy:_
      //url: `${InfuraOrAlchemyPolygonMainNetURL}`,
      accounts: [privateKey]
    }*/
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};


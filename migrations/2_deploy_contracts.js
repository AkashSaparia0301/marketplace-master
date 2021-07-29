const Gold = artifacts.require("GoldMarketplace");

module.exports = function(deployer) {
  deployer.deploy(Gold);
};

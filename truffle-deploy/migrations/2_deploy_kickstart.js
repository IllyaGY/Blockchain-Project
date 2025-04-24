const Kickstart = artifacts.require("Kickstart");

module.exports = function (deployer) {
  deployer.deploy(Kickstart);
};
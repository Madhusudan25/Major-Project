const MajorProject = artifacts.require("MajorProject");

module.exports = function (deployer) {
  deployer.deploy(MajorProject);
};

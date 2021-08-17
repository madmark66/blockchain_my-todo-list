var myTodoList = artifacts.require("./myTodoList.sol");

module.exports = function(deployer) {
  deployer.deploy(myTodoList);
};

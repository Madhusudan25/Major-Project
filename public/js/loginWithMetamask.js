export const App = {

  contracts: {},

  load: async () => {
    await App.loadWeb3();
    console.log("The public address of logged in patient ►►► " + window.ethereum.selectedAddress);
    // await App.loadAccount();
  },

  loadWeb3: async () => {
    if (typeof web3 !== "undefined") {
      // console.log(web3.currentProvider);
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      window.alert("Please connect to Metamask.");
    }

    if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
        
      });

      if (accounts.length == 0) {
        try {
          console.log("Opening metamask");
          await ethereum.enable();
          //   web3.eth.sendTransaction({
          //     /* ... */
          //   });
        } catch (error) {
          alert("Please select the account");
        }
      }
    }
  },

  loadAccount: async () => {
    console.log(window.ethereum.selectedAddress);
  },

  loadContract: async () => {
    // Create a JavaScript version of the smart contract
    const health = await $.getJSON('/MajorProject.json')
    console.log("The json format of the smart contract written ▼▼▼ ")
    console.log(health);
    App.contracts.MajorProject = TruffleContract(health);
    App.contracts.MajorProject.setProvider(web3.currentProvider)

    // Hydrate the smart contract with values from the blockchain
    App.health = await App.contracts.MajorProject.deployed()
    console.log("The contract is loaded ▼▼▼ ");
    console.log(App.health);
  },

  addDiabetesData: async (record_id,record_hash) => {
    await App.health.setPatientDiabetesData(window.ethereum.selectedAddress,record_id,record_hash,{from : window.ethereum.selectedAddress});
    console.log("Successfully added data onto Blockchain");
    console.log("The data added to blockchain is ►►► \n1.Mongo Id for last test data ► " + record_id + "\n2.Hash for last test data object ► " + record_hash);
  },

  getDiabetesData: async () => {
    console.log(window.ethereum.selectedAddress);
    var result= await App.health.getDiabetesData(window.ethereum.selectedAddress);
    console.log("The blockchain content for Diabetes data ▼▼▼");
    console.log(result);
    return (result);
  },

  addHeartData: async (record_id,record_hash) => {
    await App.health.setPatientHeartData(window.ethereum.selectedAddress,record_id,record_hash,{from : window.ethereum.selectedAddress});
    console.log("Successfully added data onto Blockchain");
    console.log("The data added to blockchain is ►►► \n1.Mongo Id for last test data ► " + record_id + "\n2.Hash for last test data object ► " + record_hash);
  },

  getHeartData: async () => {
    console.log(window.ethereum.selectedAddress);
    var result= await App.health.getHeartData(window.ethereum.selectedAddress);
    console.log("The blockchain content for Heart data ▼▼▼");
    console.log(result);
    return (result);
  },

  getPatientDiabetesDataForDoctor: async (publicAddress) => {
    var result= await App.health.getDiabetesData(publicAddress);
    console.log("The blockchain content for Diabetes data ▼▼▼");
    console.log(result);
    return (result);
  },

  getPatientHeartDataForDoctor: async (publicAddress) => {
    var result= await App.health.getHeartData(publicAddress);
    console.log("The blockchain content for Heart data ▼▼▼");
    console.log(result);
    return (result);
  }
};                                                    

// 26404975793▼

export const App = {

  contracts: {},

  load: async () => {
    await App.loadWeb3();
    console.log(window.ethereum.selectedAddress);
    // await App.loadAccount();
  },

  loadWeb3: async () => {
    if (typeof web3 !== "undefined") {
      console.log(web3.currentProvider);
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
          console.log("opening metamask");
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
    console.log(health);
    App.contracts.MajorProject = TruffleContract(health);
    console.log("Truffle contract working");
    App.contracts.MajorProject.setProvider(web3.currentProvider)

    // Hydrate the smart contract with values from the blockchain
    App.health = await App.contracts.MajorProject.deployed()
    console.log(App.health);
  },

  // registerPublicAddress: async () => {
  //   await App.health.setPublicAddress(window.ethereum.selectedAddress,{from : window.ethereum.selectedAddress})
  // },

  addDiabetesData: async (record_id,record_hash) => {
    await App.health.setPatientDiabetesData(window.ethereum.selectedAddress,record_id,record_hash,{from : window.ethereum.selectedAddress});
    console.log("successfully added data")
  },

  getDiabetesData: async () => {
    var result= await App.health.getDiabetesData(window.ethereum.selectedAddress);
    return (result);
  },

  addHeartData: async (record_id,record_hash) => {
    await App.health.setPatientHeartData(window.ethereum.selectedAddress,record_id,record_hash,{from : window.ethereum.selectedAddress});
    console.log("successfully added data")
  },

  getHeartData: async () => {
    var result= await App.health.getHeartData(window.ethereum.selectedAddress);
    console.log(result)
  },

};                                                    

// 26404975793

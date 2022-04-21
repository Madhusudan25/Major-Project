export const App = {
  load: async () => {
    await App.loadWeb3();
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
};

// 26404975793

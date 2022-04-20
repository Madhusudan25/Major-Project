// Metamask secret phrase
// involve spoon affair portion stay tumble keen unusual swamp skull type autumn
// let web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
let userLoggedIn = false;

App = {
  load: async () => {
    await App.loadWeb3();
    await App.loadAccount();
    await verifyAccount();
  },

  loadWeb3: async () => {
    if (typeof web3 !== "undefined") {
      console.log("Working");
      console.log(web3.currentProvider);
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
      userLoggedIn = true;
    } else {
      window.alert("Please connect to Metamask.");
    }

    if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log(accounts);
      while (!userLoggedIn) {
        try {
          console.log("opening metamask");
          await ethereum.enable();
          userLoggedIn = true;
          //   web3.eth.sendTransaction({
          //     /* ... */
          //   });
        } catch (error) {
          alert("Please select the account");
        }
      }

      console.log("User logged in");
    }
  },

  loadAccount: async () => {
    console.log(window.ethereum.selectedAddress);
  },
};

function verifyAccount() {
  $.ajax({
    url: "/doctor/verify",
    type: "post",
    data: { address: window.ethereum.selectedAddress },
    success: function (d) {
      console.log("Success");
      console.log(d.doctorData);
      
      //   window.location.href = d.url;
    },
    error: function (request, status, error) {
      // console.log(request);
      console.log(status);
      console.log(error);
      alert(request.responseText);
    },
  });
}

$(() => {
  $(window).load(() => {
    App.load();
  });
});

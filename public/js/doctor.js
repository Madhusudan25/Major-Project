// Metamask secret phrase
// involve spoon affair portion stay tumble keen unusual swamp skull type autumn

import { App } from "./loginWithMetamask.js";

function verifyAccount() {
  $.ajax({
    url: "/doctor/verify",
    type: "post",
    data: { address: window.ethereum.selectedAddress },
    success: function (d) {
      console.log("Success");
      console.log(d.doctorData);
    },
    error: function (request, status, error) {
      console.log(status);
      console.log(error);
      alert(request.responseText);
    },
  });
}

$(() => {
  $(window).load(() => {
    App.load();
    verifyAccount();
  });
});

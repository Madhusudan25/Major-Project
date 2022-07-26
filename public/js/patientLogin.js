// Metamask secret phrase
// involve spoon affair portion stay tumble keen unusual swamp skull type autumn

import { App } from "./loginWithMetamask.js";

function verifyAccount() {
  if(window.ethereum.selectedAddress==null){
    alert("Select the Metamask Address before proceeding");
    return;
  }
  const data={
    password:$("#password").val(),
    address: window.ethereum.selectedAddress
  }

  if(data.password===""||data.address===""){
    alert("Please enter all the details")
    return
  }
  $.ajax({
    url: "/patient/login",
    type: "post",
    data: data,
    success: function (d) {
      console.log(d);
      window.location.href=`/patient/${d.id}`;
    },
    error: function (request, status, error) {
      $("#loginToMetamask").text("Login to Metamask");
      $("#loginToMetamask").prop("disabled",false);
      $("#metamaskAddress").text("");
      $("#password").val("");
      alert(request.responseJSON.errorMsg);
    },
  });
}

$("#submitDetails").click(() => {
  verifyAccount();
});

$("#loginToMetamask").click(async ()=>{
  await App.load();
  $("#loginToMetamask").text("Logged in");
  $("#loginToMetamask").prop("disabled",true);
  $("#metamaskAddress").append(window.ethereum.selectedAddress);
})

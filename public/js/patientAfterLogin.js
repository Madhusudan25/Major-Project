// Metamask secret phrase
// involve spoon affair portion stay tumble keen unusual swamp skull type autumn

import { App } from "./loginWithMetamask.js";

function verifyAccount() {
  if(window.ethereum.selectedAddress==null){
    alert("Select the Metamask Address before proceeding");
    return;
  }
  const data={
    patientName:$("#patientName").val(),
    phoneNo:$("#phoneNo").val(),
    age:$("#age").val(),
    password:$("#password").val(),
    address: window.ethereum.selectedAddress,
    hospitalId:$("#hospitalDetails").val(),
    doctorId:$("#doctorDetails").val()
  }

  $.ajax({
    url: "/patient/register",
    type: "post",
    data: data,
    success: function (d) {
      console.log("Success");
      console.log(d);
    },
    error: function (request, status, error) {
      alert(request.responseJSON.Message);
    },
  });
}

$("#submitDetails").click(() => {
  verifyAccount();
});

$( document ).ready(function() {
  App.load();
    console.log( "ready!" );
    App.loadContract();
  });

$("#testDiabetesbtn").click(()=>{
  $.ajax({
    url: window.location.pathname+"/diabtetesTest",
    type: "post",
    data: {data:window.ethereum.selectedAddress},
    success: function (d) {
      console.log(d);
      App.addDiabetesData(d.id,d.hash);
    },
    error: function (request, status, error) {
      alert(request.responseJSON.Message);
    },
  });
})

$("#showDiabetesDatabtn").click(()=>{
  App.getDiabetesData();
})

$("#testHeartbtn").click(()=>{
  
  $.ajax({
    url: window.location.pathname+"/heartDiseaseTest",
    type: "post",
    data: {data:window.ethereum.selectedAddress},
    success: function (d) {
      console.log(d);
      App.addHeartData(d.id,d.hash);
    },
    error: function (request, status, error) {
      alert(request.responseJSON.Message);
    },
  });
})

$("#showHeartDatabtn").click(()=>{
  App.getHeartData();
})
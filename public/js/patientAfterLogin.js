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
      App.addDiabetesData(d.id,d.hash).catch(function(){
        alert("Test data as been deleted..Please retest!!");
        $.ajax({
          url: window.location.pathname+"/deteleLastDiabetesData",
          type: "delete",
          data: {data:d.id},
          success: function (d) {
            console.log(d);
          },
          error: function (request, status, error) {
            alert(request.responseJSON.Message);
          },
        });
      })
    },
    error: function (request, status, error) {
      alert(request.responseJSON.Message);
    },
  });
})

$("#showDiabetesDatabtn").click(()=>{
  App.getDiabetesData().then(function(result){
    if(result.length===0){
      alert("You dont have records!!")
    }
    else{
      $.ajax({
        url: window.location.pathname+"/compareBCandMongoDiabetesData",
        type: "post",
        data: {result:result},
        success: function (d) {
          console.log(d.data);
        },
        error: function (request, status, error) {
          alert(request.responseJSON.msg);
        },
      });
    }
  });
})

$("#testHeartbtn").click(()=>{
  $.ajax({
    url: window.location.pathname+"/heartDiseaseTest",
    type: "post",
    data: {data:window.ethereum.selectedAddress},
    success: function (d) {
      console.log(d);
      App.addHeartData(d.id,d.hash).catch(function(){
        alert("Test data as been deleted..Please retest!!");
        $.ajax({
          url: window.location.pathname+"/deteleLastHeartData",
          type: "delete",
          data: {data:d.id},
          success: function (d) {
            console.log(d);
          },
          error: function (request, status, error) {
            alert(request.responseJSON.Message);
          },
        });
      })
    },
    error: function (request, status, error) {
      alert(request.responseJSON.Message);
    },
  });
})

$("#showHeartDatabtn").click(()=>{
  App.getHeartData().then(function(result){
    if(result.length===0){
      alert("You dont have records!!")
    }
    else{
      $.ajax({
        url: window.location.pathname+"/compareBCandMongoHeartData",
        type: "post",
        data: {result:result},
        success: function (d) {
          console.log(d.data);
        },
        error: function (request, status, error) {
          alert(request.responseJSON.msg);
        },
      });
    }
  });
})

$("#allowSharing").change(()=>{
      $.ajax({
        url: window.location.pathname+"/toggleSharing",
        type: "patch",
        success: function (d) {
          console.log(d.data);
        },
        error: function (request, status, error) {
          alert(request.responseJSON.msg);
        },
      });
    }
)
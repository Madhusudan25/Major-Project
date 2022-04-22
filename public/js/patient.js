// Metamask secret phrase
// involve spoon affair portion stay tumble keen unusual swamp skull type autumn

import { App } from "./loginWithMetamask.js";

var hospitalInfo=JSON.parse($("#hospitalDetails").attr('data-test-value'));

for (let i = 0; i < hospitalInfo.length; i++) {
  const element = hospitalInfo[i];
  $("#hospitalDetails").append(`
    <option value=${element._id} > ${element.hospitalName} </option>
  `)
};

$("#loginToMetamask").click(async ()=>{
  await App.load();
  $("#loginToMetamask").text("Logged in");
  $("#loginToMetamask").prop("disabled",true);
  $("#metamaskAddress").append(window.ethereum.selectedAddress);
})

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
      window.location.href=`/patient/${d.id}`;
    },
    error: function (request, status, error) {
      $("#loginToMetamask").text("Login to metamask");
      $("#loginToMetamask").prop("disabled",false);
      $("#metamaskAddress").text("");
      alert(request.responseJSON.Message);
    },
  });
}

$("#submitDetails").click(() => {
  verifyAccount();
});

$( "#hospitalDetails" ).change(function(e) {
  $("#doctorDetails").attr("hidden",false);
  $("#doctorDetails").empty();
  var result=hospitalInfo.filter(obj=> obj._id==e.target.value);
  var doctors=result[0].doctorsList;
  $("#doctorDetails").append(`
    <option value="" disabled selected>Select Doctor...</option>
  `)
  
  doctors.forEach(doctor => {
    $("#doctorDetails").append(`
      <option value=${doctor._id} > ${doctor.doctorName} </option>
    `)
  });
});

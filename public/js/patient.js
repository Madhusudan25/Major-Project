// Metamask secret phrase
// involve spoon affair portion stay tumble keen unusual swamp skull type autumn

import { App } from "./loginWithMetamask.js";

function verifyAccount() {
  const data={
    patientName:$("#patientName").val(),
    phoneNo:$("#phoneNo").val(),
    age:$("#age").val(),
    address: window.ethereum.selectedAddress
  }
  $.ajax({
    url: "/patient/verify",
    type: "post",
    data: data,
    success: function (d) {
      console.log("Success");
      console.log(d.hospitalInfo);
      const data=d.hospitalInfo;
      data.forEach(element => {
        console.log(element);
        console.log(element.hospitalPublicAddress);
        console.log(element.doctorsList);
        $("#afterLoginContent").append(
          ''+element.hospitalName
        );
        element.doctorsList.forEach(doctor => {
          $("#afterLoginContent").append(
            `<p style="margin-left:50px">${doctor.doctorName}</p>` 
          );
        });
      });
    },
    error: function (request, status, error) {
      console.log(status);
      console.log(error);
      alert(request.responseText);
    },
  });
}

$(() => {
  $("#submitDetails").click(() => {
    App.load();
    verifyAccount();
  });
});

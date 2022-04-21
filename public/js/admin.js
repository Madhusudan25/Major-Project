import { App } from "./loginWithMetamask.js";

$(() => {
  $(window).load(() => {
    App.load();
    verifyAccount();
  });
});

function verifyAccount() {
  if (window.ethereum.selectedAddress != null) {
    $.ajax({
      url: "/admin/verify",
      type: "post",
      data: { address: window.ethereum.selectedAddress },
      success: function (d) {
        console.log("Logged in");
        $("body").removeAttr("hidden");
        console.log(d.hospitalData);
        renderDoctorsInfoInHospital(d.hospitalData);
      },
      error: function (request, status, error) {
        console.log(request);
        console.log(error);
        // alert(request.responseJSON.data);
        // web3.currentProvider.close();

        window.location.href = "/error";
      },
    });
  }
}

$("#addDoctor").click(function (event) {
  event.preventDefault();
  const doctorData = {
    doctorName: $("#doctor_name").val(),
    publicAddress: $("#public_address").val(),
    hospitalPublicAddress: window.ethereum.selectedAddress,
  };

  console.log(doctorData);

  $.ajax({
    url: "/admin/addDoctor",
    type: "post",
    data: doctorData,
    success: function (d) {
      console.log(d);
      //   window.location.href = d.url;
    },
    error: function (request, status, error) {
      console.log(request);
      console.log(status);
      console.log(error);
      alert(request.responseText);
    },
  });
});

function renderDoctorsInfoInHospital(data){
  console.log(data);
  data.forEach(element => {
    console.log(element.publicAddress);
  });
}
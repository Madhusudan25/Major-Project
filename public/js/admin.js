import { App } from "./loginWithMetamask.js";

$(() => {
  $(window).load(async () => {
    await App.load();
    verifyAccount();
  });
});

function verifyAccount() {
  if(window.ethereum.selectedAddress==null){
    alert("Select the Metamask Address before proceeding");
    return;
  }
  $.ajax({
    url: "/admin/verify",
    type: "post",
    data: { address: window.ethereum.selectedAddress },
    success: function (d) {
      // console.log("Logged in");
      console.log(d.hospitalData);
      $("#accessMsg").hide();
      $("form").attr("hidden",false);
      renderDoctorsInfoInHospital(d.hospitalData);
    },
    error: function (request, status, error) {
      console.log(request);
      console.log(error);
      alert("You are not authenticated..Please check your login");
    },
  });
  
}

$("#addDoctor").click(function (e) {
  e.preventDefault();
  console.log(window.ethereum.selectedAddress);
  const doctorData = {
    doctorName: $("#doctor_name").val(),
    publicAddress: $("#public_address").val(),
    hospitalPublicAddress: window.ethereum.selectedAddress,
  };

  $.ajax({
    url: "/admin/addDoctor",
    type: "post",
    data: doctorData,
    success: function (d) {
      $("#accessMsg").hide();
      $("#form").show();
      console.log("Success")
      $("#doctor_name").val("");
      $("#public_address").val("");
      alert("Doctor added successfully");
      renderDoctorsInfoInHospital(d.data)
    },
    error: function (request, status, error) {
      alert(request.responseJSON.msg);
    },
    
  });
});

function renderDoctorsInfoInHospital(data){
  $("#doctorsList").empty();
  console.log(data);
  $("#doctorsList").append(`
    <tr>
      <th>Doctor No</th>
      <th>Doctor Name</th>
      <th>Doctor Public Address</th>
    </tr>
    `)
  data.forEach((element,i) => {
    $("#doctorsList").append(`
    <tr>
      <td>${i+1}</td>
      <td>${element.doctorName}</td>
      <td>${element.publicAddress}</td>
    </tr>
    `)
  });
}
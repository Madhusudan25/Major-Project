// Metamask secret phrase
// involve spoon affair portion stay tumble keen unusual swamp skull type autumn
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
    url: "/doctor/verify",
    type: "post",
    data: { address: window.ethereum.selectedAddress },
    success: function (d) {
      // console.log("Success");
      console.log(d.doctorData.length);
      $("#accessMsg").hide();
      $("#content").attr("hidden",false);
     
      if(d.doctorData.length==0){
        $("#patientContent").hide();
        $("#noPatientMsg").append("There are no patients under you!!");
      }
      else{
        displayContent(d.doctorData);
      }
    },
    error: function (request, status, error) {
      $("#content").attr("hidden",true)
      $("#accessMsg").show();
      alert(request.responseText);
    },
  });
}

function displayContent(patients){
  var disableButton="";
  $("#patientContent").show();
  $("#noPatientMsg").text("");
  if(patients.length>0){
    patients.forEach((patient,i) => {
      console.log(patient.allowSharing);
      disableButton= patient.allowSharing?"":"disabled";
      console.log(disableButton);
      $("#patientContent").append(`
        <tr>
          <td>${i+1}</td>
          <td>${patient.patientName}</td>
          <td>${patient.patientPhoneNo}</td>
          <td>${patient.patientAge}</td>
          <td><button class="viewTestResults btn btn-outline-secondary" ${disableButton} name="${patient.patientPublicAddress}" value="${patient._id}">View</button></td>
        </tr>
      `)
    });
  }
}

$("body").on ("click", ".viewTestResults", function(e){
  var patientPublicAddress=e.target.name;
  //Blockchain retrival
  $.ajax({
    url: "/doctor/viewPatientRecords",
    type: "post",
    data: { id: e.target.value },
    success: function (d) {
      // console.log("Success");
      var details=d.patientDetails;
      $("#diabetesData").append(`
        <th>Age</th>
        <th>Pregnancy</th>
        <th>Glucose</th>
        <th>Blood Pressure</th>
        <th>Skin Thickness</th>
        <th>Insulin</th>
        <th>BMI</th>
        <th>Pedigree Function</th>
        <th>Diabetes Test Result</th>
      `)
      array.forEach(element => {
        
      });
    },
    error: function (request, status, error) {
      alert(request.responseJSON.msg);
    },
  });
})


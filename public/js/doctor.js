// Metamask secret phrase
// involve spoon affair portion stay tumble keen unusual swamp skull type autumn
import { App } from "./loginWithMetamask.js";

$(() => {
  $(window).load(async () => {
    await App.load();
    await App.loadContract();
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
      console.log("Number of patients under you ►►► " + d.doctorData.length);
      $("#accessMsg").hide();
      $("#content").attr("hidden",false);
      displayContent(d.doctorData);
    },
    error: function (request, status, error) {
      $("#content").attr("hidden",true)
      $("#accessMsg").show();
      alert(request.responseJSON.msg);

    },
  });
}

function displayContent(patients){
  if(patients.length===0){
    $("#patientContent").hide();
    $("#noPatientMsg").append(
    `<div class="alert alert-info" role="alert">
      There are no patients under you!!
    </div>`);
    return;
  }
  var disableButton="";
  $("#patientContent").show();
  $("#noPatientMsg").text("");
  if(patients.length>0){
    console.log("Allow sharing ▼▼▼")
    patients.forEach((patient,i) => {
      console.log("Patient "+ (i+1) + " ►►►" + patient.allowSharing);
      disableButton= patient.allowSharing?"":"disabled";
      $("#patientContent").append(`
        <tr>
          <td>${i+1}</td>
          <td>${patient.patientName}</td>
          <td>${patient.patientPhoneNo}</td>
          <td>${patient.patientAge}</td>
          <td><button class="viewTestResults btn btn-outline-success" ${disableButton} name="${patient.patientPublicAddress}" value="${patient._id}" style="padding:2px 8px">View</button></td>
        </tr>
      `)
    });
  }
}

$("body").on ("click", ".viewTestResults", function(e){
  var patientPublicAddress=e.target.name;
  App.getPatientDiabetesDataForDoctor(patientPublicAddress).then(function(result){
    if(result.length===0){
      $("#diabetesContentTable").empty();
      $("#diabetesContentTable").append(`
        <div class="alert alert-info" role="alert">
          There is no testing done for diabetes!!
         </div>
      `)
    }
    else{
      $.ajax({
        url: window.location.pathname+"/compareBCandMongoDiabetesData/doctorDisplay",
        type: "post",
        data: {result:result, patientPublicAddress:patientPublicAddress},
        success: function (d) {
          fillDiabetesTestData(d.data);
        },
        error: function (request, status, error) {
          alert(request.responseJSON.msg);
        },
      });
    }
  })

  App.getPatientHeartDataForDoctor(patientPublicAddress).then(function(result){
    if(result.length===0){
      $("#heartDataContentTable").empty();
      $("#heartDataContentTable").append(`
      <div class="alert alert-info" role="alert">
      There is no testing done for heart disease!!
     </div>
  `)
    }
    else{
      $.ajax({
        url: window.location.pathname+"/compareBCandMongoHeartData/doctorDisplay",
        type: "post",
        data: {result:result,patientPublicAddress:patientPublicAddress},
        success: function (d) {
          fillHeartTestData(d.data);
        },
        error: function (request, status, error) {
          alert(request.responseJSON.msg);
        },
      });
    }
  });
})

function fillDiabetesTestData(diabetesDetails) {
  $("#diabetesContentTable").empty();
  $("#heartDataContentTable").empty();
  $("#diabetesContentTable").append(`
  
  <thead class="thead-dark">  
      <tr>
        <td colspan="10" style="text-align:center;">
          <b>Diabetes Data</b>
        </td>
      </tr>
      <tr style="text-align:center;">
        <th>Test no</th>
        <th>Date and Time</th>
        <th>Pregnancy</th>
        <th>Glucose</th>
        <th>Blood Pressure</th>
        <th>Skin Thickness</th>
        <th>Insulin</th>
        <th>BMI</th>
        <th>Pedigree Function</th>
        <th>Diabetes Test Result</th>
      </tr>  
    </thead> 
  `)
  diabetesDetails.forEach((detail,i) => {
    var result="";
    if(detail.testDiabetesResult===0){
      result='<button type="button" class="btn btn-success" style="background-color: #198754;">Negative</button>'
    }
    else{
      result='<button type="button" class="btn btn-danger"  style="background-color: #bb2d3b;">Positive</button>'
    }
    $("#diabetesContentTable").append(`
    <tr style="text-align:center;">
        <td>${i+1}</td>
        <td>${detail.testTimings}</td>
        <td>${detail.testPregnancies}</td>
        <td>${detail.testGlucose}</td>
        <td>${detail.testBloodPressure}</td>
        <td>${detail.testSkinThickness}</td>
        <td>${detail.testInsulin}</td>
        <td>${detail.testBMI}</td>
        <td>${detail.testPedigreeFunction}</td>
        <td>${result}</td>
    </tr>
  `)
  });
}

function fillHeartTestData(heartDetails){
  $("#heartDataContentTable").empty();
  $("#heartDataContentTable").append(`
  <thead class="thead-dark">  
      <tr>
        <td colspan="14" style="text-align:center;">
          <b>Heart Test Data</b>
        </td>
      </tr>
      <tr style="text-align:center;">
        <th>Test no</th>
        <th>Date and Time</th>
        <th>Chest pain</th>
        <th>Trestbps</th>
        <th>Cholesterol</th>
        <th>Fbs</th>
        <th>Restecg</th>
        <th>Thalach</th>
        <th>Exang</th>
        <th>Oldpeak</th>
        <th>Slope</th>
        <th>Ca</th>
        <th>Thal</th>
        <th>HeartDisease Test Result</th>
      </tr>  
    </thead> 
  `)
  heartDetails.forEach((detail,i) => {
    var result="";
    if(detail.testHeartResult===0){
      result='<button class="btn btn-success" style="background-color: #198754;">Negative</button>'
    }
    else{
      result='<button class="btn btn-danger" style="background-color: #bb2d3b;">Positive</button>'
    }
    $("#heartDataContentTable").append(`
    <tr style="text-align:center;">
        <td>${i+1}</td>
        <td>${detail.testTimings}</td>
        <td>${detail.cp}</td>
        <td>${detail.trestbps}</td>
        <td>${detail.chol}</td>
        <td>${detail.fbs}</td>
        <td>${detail.restecg}</td>
        <td>${detail.thalach}</td>
        <td>${detail.exang}</td>
        <td>${detail.oldpeak}</td>
        <td>${detail.slope}</td>
        <td>${detail.ca}</td>
        <td>${detail.thal}</td>
        <td>${result}</td>
    </tr>
  `)
  });
}
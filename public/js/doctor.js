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
      alert(request.responseJSON.msg);

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
  App.getPatientDiabetesDataForDoctor(patientPublicAddress).then(function(result){
    console.log("Blockchain Content : ");
    console.log(result);
    if(result.length===0){
      $("#diabetesContentTable").empty();
      $("#diabetesContentTable").append(`
      <p>There are no testing done for diabetes</p>
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
      <p>There are no testing done for heart</p>
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
        <td>${detail.testDiabetesResult}</td>
    </tr>
  `)
  });
}

function fillHeartTestData(heartDetails){
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
        <td>${detail.testHeartResult}</td>
    </tr>
  `)
  });
}
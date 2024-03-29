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

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

$( document ).ready(function() {
  App.load();
  App.loadContract();
  $(".testDiabetesBtn").on('click', function(event){
    testDiabetes(event);
  });
  $(".testHeartBtn").on('click', function(event){
    testHeart(event);
  });
});

$("#enterDiabetesData").click(()=>{
  $(".diabetesClear").val("");
})

$("#enterHeartData").click(()=>{
  $(".heartClear").val("");
})

function testDiabetes(e){
  var mongoId=e.target.value;
  console.log("Initating testing..Please wait!!!");
  $.ajax({
    url: window.location.pathname+"/diabetesTest",
    type: "post",
    data: {data:window.ethereum.selectedAddress, mongoId:mongoId},
    beforeSend:function(){
      $('.loader').modal('show');
    },
    success: function (d) {
      console.log("The data obtained after saving into mongoDB \n1.MongoDB ID of latest test data ►►► " + d.id +"\n2.Hash of whole latest test data object ►►► " + d.hash);
      console.log("→If the user rejects the Transaction...The latest inserted test data in the MongoDB has to be deleted!!");
      console.log("→If the user confirms the Transaction...the Id and Hash will be stored into blockchain!!");
      App.addDiabetesData(d.id,d.hash).then(()=>{
        window.location.reload();
      }).catch(function(){
        console.log("The user has rejected the transaction!Initiating delete of last test data from MongoDB!!");
        $.ajax({
          url: window.location.pathname+"/deteleLastDiabetesData",
          type: "delete",
          data: {data:d.id,mongoId:mongoId},
          success: function (d) {
            // console.log("The deleted data from mongoDB (Last tested and cancelled transaction) ▼▼▼ ");
            // console.log(d)
            // console.log("Last test data is successfully deleted:(");
            // alert("Test data has been deleted..Please retest!!");
            window.location.href=d.data;
          },
          error: function (request, status, error) {
            alert(request.responseJSON.Message);
          },
        });
      })
      $('.loader').modal('hide');
    },
    error: function (request, status, error) {
      alert(request.responseJSON.Message);
    },
  });
}

$("#showDiabetesDatabtn").click(()=>{
  console.log("Your public address ▼▼ " );
  App.getDiabetesData().then(function(result){
    if(result.length===0){
      alert("You dont have records!!")
    }
    else{
      console.log("Initiating comparision of Blockcain data and MongoDB data to ensure Integrity!!");
      $.ajax({
        url: window.location.pathname+"/compareBCandMongoDiabetesData",
        type: "post",
        data: {result:result},
        success: function (d) {
          console.log("The data is secure and unaltered!!");
          fillDiabetesTestData(d.data);
        },
        error: function (request, status, error) {
          alert(request.responseJSON.msg);
        },
      });
    }
  });
})

function testHeart(e){
  console.log("Initating testing..Please wait!!!");
  var mongoId=e.target.value;
  $.ajax({
    url: window.location.pathname+"/heartDiseaseTest",
    type: "post",
    data: {data:window.ethereum.selectedAddress, mongoId:mongoId},
    beforeSend:function(){
      $('.loader').modal('show');
    },
    success: function (d) {
      console.log("The data obtained after saving into mongoDB \n1.MongoDB ID of latest test data ►► " + d.id + "\n2.Hash of whole latest test data object ►► " + d.hash);
      console.log("→If the user rejects the Transaction...The latest inserted test data in the MongoDB has to be deleted!!");
      console.log("→If the user confirms the Transaction...the Id and Hash will be stored into blockchain!!");
      App.addHeartData(d.id,d.hash).then(()=>{
        window.location.reload();
      }).catch(function(){
        console.log("The user has rejected the transaction!Initiating delete of last test data from MongoDB!!");
        $.ajax({
          url: window.location.pathname+"/deteleLastHeartData",
          type: "delete",
          data: {data:d.id,mongoId:mongoId},
          success: function (d) {
            // console.log("The deleted data from mongoDB (Last tested and cancelled transaction) ▼▼▼");
            // console.log(d)
            // console.log("Last test data is successfully deleted:(");
            // alert("Test data has been deleted..Please retest!!");
            window.location.href=d.data;
          },
          error: function (request, status, error) {
            alert(request.responseJSON.Message);
          },
        });
      })
      $('.loader').modal('hide');
    },
    error: function (request, status, error) {
      alert(request.responseJSON.Message);
    },
  });
}

$("#showHeartDatabtn").click(()=>{
  console.log("Your public address is ▼▼ " );
  App.getHeartData().then(function(result){
    if(result.length===0){
      alert("You dont have records!!")
    }
    else{
      console.log("→→Initiating comparision of Blockcain data and MongoDB data to ensure Integrity!!");
      $.ajax({
        url: window.location.pathname+"/compareBCandMongoHeartData",
        type: "post",
        data: {result:result},
        success: function (d) {
          console.log("→→The data is secure and unaltered!!");
          fillHeartTestData(d.data);
        },
        error: function (request, status, error) {
          alert(request.responseJSON.msg);
        },
      });
    }
  });
})

$("#allowSharing").click(()=>{
    console.log("Clicked");
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
      result='<button class="btn btn-success" style="background-color: #198754;">Negative</button>'
    }
    else{
      result='<button class="btn btn-danger" style="background-color: #bb2d3b;">Positive</button>'
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
  $("#diabetesContentTable").append(`
  <br>
    <button class="btn btn-outline-primary" onclick="window.location.reload()"><i class="fa-solid fa-arrow-right-from-bracket" style="transform:rotate(180deg)"></i></button>
  
    `);
}

function fillHeartTestData(heartDetails){
  $("#diabetesContentTable").empty();
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
        <th>Heart Disease Test Result</th>
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
  $("#heartDataContentTable").append(`
  <br>
    <button class="btn btn-outline-primary" onclick="window.location.reload()"><i class="fa-solid fa-arrow-right-from-bracket" style="transform:rotate(180deg)"></i></button>
    `);
}
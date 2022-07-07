// Metamask secret phrase
// involve spoon affair portion stay tumble keen unusual swamp skull type autumn

import { App } from "./loginWithMetamask.js";

var diabetesQuestion=["Q1: Are you facing increased thirst, increased hunger?", "Q2: Is your vision getting blurred?","Q3: Have you gained too much weight or facing unintended weight loss?","Q4: Are you frequently using washroom?","Q5: Are you facing slow-healing with sores comeout from your body?","Q6: Is your body getting infect frequently?","Q7: Are you facing numbness or tingling in the feet or hands"];
var heartQuestion=["Q1: Are you facing chest pain or fluttering in chest?", "Q2: Are you facing dizziness or fainting?", "Q3: Any fluctions in heartbeat like slow heartbeat, fast heartbeat?", "Q4: Are you having pain in arms/neck/jaw/throat/back or upper abdomen?", "Q5: Are you having vomiting/nausea sensation?", "Q6: Is your body becoming extreme fatigue ?", "Q7: Are you facing numbness or tingling in the feet or hands?"]

var hospitalInfo=JSON.parse($("#hospitalDetails").attr('data-test-value'));
var hospitalID;
var doctorID;

for (let i = 0; i < hospitalInfo.length; i++) {
  const element = hospitalInfo[i];
  $("#hospitalDetails").append(`
    <option value=${element._id} > ${element.hospitalName} </option>
  `)
};

$( document ).ready(function() {
  App.loadContract();
  fillDiabetesSymptoms();
});

$("#loginToMetamask").click(async ()=>{
  await App.load();
  $("#loginToMetamask").text("Logged in");
  $("#loginToMetamask").prop("disabled",true);
  $("#metamaskAddress").empty();
  $("#metamaskAddress").append(window.ethereum.selectedAddress);
  $("#metamaskAddress").attr("hidden",false)
  $("#hospitalDetails").removeAttr("disabled")
})

$("#diabetesSymptoms").click(()=>{
  $("#symptoms").empty();
  $("#diabetesSymptoms").addClass("active");
  $("#heartSymptoms").removeClass("active");
  $("#diabetesMessage").attr("hidden",true);
  $("#heartMessage").attr("hidden",true);
  fillDiabetesSymptoms();
})

$("#heartSymptoms").click(()=>{
  $("#symptoms").empty();
  $("#diabetesSymptoms").removeClass("active");
  $("#heartSymptoms").addClass("active");
  $("#diabetesMessage").attr("hidden",true);
  $("#heartMessage").attr("hidden",true);
  fillHeartSymptoms();
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
    sex:$("#sex").val(),
    password:$("#password").val(),
    address: window.ethereum.selectedAddress,
    hospitalId:hospitalID,
    doctorId:doctorID
  }

  console.log(data);
  
  $.ajax({
    url: "/patient/register",
    type: "post",
    data: data,
    success: function (d) {
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

$("#doctorDetails").change(()=>{
  $("#saveChanges").removeAttr("disabled")
})

$("#saveChanges").click(()=>{
  $("#submitDetails").removeAttr("disabled")
  hospitalID = $("#hospitalDetails").val();
  doctorID = $("#doctorDetails").val();
})

function fillDiabetesSymptoms(){
  diabetesQuestion.forEach((question,i) => {
    $("#symptoms").append(`
      <div>
        <p>${question}</p>
        <input type="radio" value="1" id="Q${i}Yes_Diabetes" name="Q${i}">
        <label for="Q${i}Yes_Diabetes">Yes</label><br>
        <input type="radio" value="0" id="Q${i}No_Diabetes" name="Q${i}">
        <label for="Q${i}No_Diabetes">No</label><br>
        <br>
      </div>
    `);
    
  });
  $("#symptoms").append(`
    <div style="text-align:center">
      <button class="btn btn-primary" id="submitDiabetesSymptoms"><i class="fa-solid fa-arrow-right-from-bracket"></i>&nbspProceed</button>
    </div>
  `)
}

function fillHeartSymptoms(){
  heartQuestion.forEach((question,i) => {
    $("#symptoms").append(`
      <div>
        <p>${question}</p>
        <input type="radio" value="1" id="Q${i}Yes_Heart" name="Q${i}">
        <label for="Q${i}Yes_Heart">Yes</label><br>
        <input type="radio" value="0" id="Q${i}No_Heart" name="Q${i}">
        <label for="Q${i}No_Heart">No</label><br>
        <br>
      </div>
    `);
  });
  $("#symptoms").append(`
    <div style="text-align:center">
      <button class="btn btn-primary" id="submitHeartSymptoms"><i class="fa-solid fa-arrow-right-from-bracket"></i>&nbspSubmit</button>
    </div>
  `)
}

$("body").on ("click", "#submitDiabetesSymptoms", function(e){
  var diabetesAnswer=[];
  var diabetesYesCount=0;
  var div = $("#symptoms");
  var radioBtns = div.find("input[type='radio']:checked");
  if(radioBtns.length!==7){
    alert("Please answer all the questions!")
  }
  else{
    var addToDiabetesArray = function(i,radiobtn){
      if(radiobtn.value=="1"){
        diabetesYesCount+=1;
      }
      diabetesAnswer.push(radiobtn.value);
    };
    $.each(radioBtns,addToDiabetesArray);

    console.log(diabetesAnswer);
    $("#diabetesMessage").empty();
    if(diabetesYesCount>=4){
      $("#diabetesMessage").removeClass();
      $("#diabetesMessage").addClass("alert alert-danger")
      $("#diabetesMessage").append(`
        You might be prone to diabetes disease symptoms...We kindly suggest you to have a test!
      `)
    }
    else{
      $("#diabetesMessage").removeClass();
      $("#diabetesMessage").addClass("alert alert-success")
      $("#diabetesMessage").append(`
        You might not be prone to diabetes disease symptoms..We would rather suggest to have a test!
      `)
    }
    $("#heartSymptoms").click();
  }
  
})

$("body").on ("click", "#submitHeartSymptoms", function(e){
  var heartAnswer=[];
  var heartYesCount=0;
  var div = $("#symptoms");
  var radioBtns = div.find("input[type='radio']:checked");
  if(radioBtns.length!==7){
    alert("Please answer all the questions!")
  }
  else{
    var addToHeartArray = function(i,radiobtn){
      if(radiobtn.value=="1"){
        heartYesCount+=1;
      }
      heartAnswer.push(radiobtn.value);
    };
    $.each(radioBtns,addToHeartArray);

    console.log(heartAnswer);
    $("#heartMessage").empty();
    if(heartYesCount>=4){
      $("#heartMessage").removeClass();
      $("#heartMessage").addClass("alert alert-danger")
      $("#heartMessage").append(`
        You might be prone to heart disease symptoms...We kindly suggest you to have a test!
      `)
    }
    else{
      $("#heartMessage").removeClass();
      $("#heartMessage").addClass("alert alert-success")
      $("#heartMessage").append(`
        You might not be prone to heart disease symptoms..We would rather suggest to have a test!
      `)
    }
    $("#symptoms").empty();
    $("#diabetesMessage").attr("hidden",false);
    $("#heartMessage").attr("hidden",false);
    $("#diabetesSymptoms").removeClass("active");
    $("#heartSymptoms").removeClass("active");

    $("#loginToMetamask").removeAttr("disabled")
    }
})
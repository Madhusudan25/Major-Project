$(window).load(()=>{
    var username =$("#username").html();
        $("#navbar").append(`<div style=" position: absolute; right: 23px;top: 32px;">
            <img src="/images/userIcon.png" alt="User Icon" style="height:30px">
            <span style="padding-top:10px">${username}</span>
        </div>`); 
        
    var userData=JSON.parse($("#userdata").attr('data-test-value'));
    console.log(userData);
    var isTestedDiabetesString=$("#diabetesTestedArray").attr('data-test-value');
    var isTestedDiabetes=isTestedDiabetesString.split(",")
    var isTestedHeartString=$("#heartTestedArray").attr('data-test-value');
    var isTestedHeart=isTestedHeartString.split(",");

    var disabledDiabetes="";
    var disabledHeart="";
    
    if(userData.length===0){
      $("#noPatientMsg").attr("hidden",false)
    }
    userData.forEach((data,i) => {
      disabledDiabetes = isTestedDiabetes[i]==="true"?"":"disabled";
      disabledHeart=isTestedHeart[i]==="true"?"":"disabled";
      var pregnancies;
      var disabled=""
      if(data.patientSex==="Male" || data.patientSex==="male"){
        pregnancies=0;
      }
      if(pregnancies===0){
        disabled="disabled";
      }
      $("#accordionFlushExample").append(
        `<div class="accordion-item">
        <h2 class="accordion-header" id="patientId-${data._id}">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#patient-${data._id}" aria-expanded="false" aria-controls="patient-${data._id}">
            <span style="width:25%">${data.patientName}</span>
            <span style="width:25%">${data.patientPhoneNo}</span>
            <span style="width:25%">${data.patientAge}</span>
            <span style="width:25%">${data.patientSex}</span>
          </button>
        </h2>
        <div id="patient-${data._id}" class="accordion-collapse collapse" aria-labelledby="patientId-${data._id}" data-bs-parent="#accordionFlushExample">
          <div class="accordion-body">
          <div class="row">
          <div class="col">
            <div style="width: 60%; margin: 30px auto;position: relative;">
              <label for="testAgeDiabetes-${data._id}" class="form-label">Patient Age</label>
              <div class="input-group mb-2 mr-sm-2">
                <input type="number" class="form-control rounded" name="testAge" id="testAgeDiabetes-${data._id}" value=${data.patientAge} disabled>
                <div class="input-group-prepend">
                  <div class="input-group-text rounded-circle" data-toggle="tooltip" data-placement="top" title="Age"><i class="fa-solid fa-info"></i></div>
                </div>
              </div>
              <label for="testPregnancies-${data._id}" class="form-label">Pregnancies</label>
              <div class="input-group mb-2 mr-sm-2">
                <input class="form-control rounded diabetesClear" type="number" name="testPregnancies" id="testPregnancies-${data._id}" placeholder="Pregnancies" value=${pregnancies} ${disabled}>
                <div class="input-group-prepend">
                    <div class="input-group-text rounded-circle" data-toggle="tooltip" data-placement="top" title="Pregnancies"><i class="fa-solid fa-info"></i></div>
                  </div>
              </div>
              <label for="testGlucose-${data._id}" class="form-label">Glucose</label>
              <div class="input-group mb-2 mr-sm-2">
                <input class="form-control rounded diabetesClear" type="number" name="testGlucose" id="testGlucose-${data._id}" placeholder="Glucose">
                <div class="input-group-prepend">
                    <div class="input-group-text rounded-circle" data-toggle="tooltip" data-placement="top" title="Glucose"><i class="fa-solid fa-info"></i></div>
                  </div>
              </div>
              <label for="testBloodPressure-${data._id}" class="form-label">Blood Pressure</label>
              <div class="input-group mb-2 mr-sm-2">
                <input class="form-control rounded diabetesClear" type="number" name="testBloodPressure" id="testBloodPressure-${data._id}" placeholder="Blood Pressure">
                <div class="input-group-prepend">
                    <div class="input-group-text rounded-circle" data-toggle="tooltip" data-placement="top" title="Blood Pressure"><i class="fa-solid fa-info"></i></div>
                  </div>
              </div>
              <label for="testSkinThickness-${data._id}" class="form-label">Skin Thickness</label>
              <div class="input-group mb-2 mr-sm-2">
                <input class="form-control rounded diabetesClear" type="number" name="testSkinThickness" id="testSkinThickness-${data._id}" placeholder="Skin Thickness" >
                <div class="input-group-prepend">
                    <div class="input-group-text rounded-circle" data-toggle="tooltip" data-placement="top" title="Skin Thickness"><i class="fa-solid fa-info"></i></div>
                  </div>
              </div>
              <label for="testInsulin-${data._id}" class="form-label">Insulin</label>
              <div class="input-group mb-2 mr-sm-2">
                <input class="form-control rounded diabetesClear" type="number" name="testInsulin" id="testInsulin-${data._id}" placeholder="Insulin" >
                <div class="input-group-prepend">
                    <div class="input-group-text rounded-circle" data-toggle="tooltip" data-placement="top" title="Insulin"><i class="fa-solid fa-info"></i></div>
                  </div>
              </div>
              <label for="testBMI-${data._id}" class="form-label">BMI</label>
              <div class="input-group mb-3">
                <input class="form-control rounded diabetesClear" type="number" name="testBMI" id="testBMI-${data._id}" placeholder="testBMI" >
                <div class="input-group-prepend">
                    <div class="input-group-text rounded-circle" data-toggle="tooltip" data-placement="top" title="testBMI"><i class="fa-solid fa-info"></i></div>
                  </div>
              </div>
              <label for="testPedigreeFunction-${data._id}" class="form-label">Pedigree Function</label>
              <div class="input-group mb-2 mr-sm-2">
                <input class="form-control rounded diabetesClear" type="number" name="testPedigreeFunction" id="testPedigreeFunction-${data._id}" placeholder="Pedigree Function" >
                <div class="input-group-prepend">
                    <div class="input-group-text rounded-circle" data-toggle="tooltip" data-placement="top" title="Pedigree Function"><i class="fa-solid fa-info"></i></div>
                  </div>
              </div>
              <div style="text-align:center;margin-top:30px">
                <button class="btn btn-primary fillDiabetesData" value="${data._id}" type="submit" ${disabledDiabetes}>Submit Diabetes Data</button>
              </div>
            </div>

          </div>
          <div class="col">
            <div style="width: 60%; margin: 30px auto;position: relative;">
              <label for="testAgeHeart-${data._id}" class="form-label">Patient Age</label>
              <div class="input-group mb-2 mr-sm-2">
                <input type="number" class="form-control rounded" name="testAge" id="testAgeHeart-${data._id}" value=${data.patientAge} disabled>
                <div class="input-group-prepend">
                  <div class="input-group-text rounded-circle" data-toggle="tooltip" data-placement="top" title="Age"><i class="fa-solid fa-info"></i></div>
                </div>
              </div>
              <label for="sex-${data._id}" class="form-label">Sex</label>
              <div class="input-group mb-2 mr-sm-2">
                <input class="form-control rounded" type="text" name="sex" id="sex-${data._id}" placeholder="Sex" value=${data.patientSex} disabled>
                <div class="input-group-prepend">
                    <div class="input-group-text rounded-circle" data-toggle="tooltip" data-placement="top" title="Sex"><i class="fa-solid fa-info"></i></div>
                  </div>
              </div>
              <label for="cp-${data._id}" class="form-label">Chest Pain Type</label>
              
              <div class="input-group mb-2 mr-sm-2">    
                <input class="form-control rounded heartClear" type="text" name="cp" id="cp-${data._id}" placeholder="Chest Pain">
    
                <div class="input-group-prepend">
                    <div class="input-group-text rounded-circle" data-toggle="tooltip" data-placement="top" title="Chest Pain Type"><i class="fa-solid fa-info"></i></div>
                  </div>
              </div>
              <label for="trestbps-${data._id}" class="form-label">Resting BP</label>
              <div class="input-group mb-2 mr-sm-2">
                <input class="form-control rounded heartClear" type="number" name="trestbps" id="trestbps-${data._id}" placeholder="Resting Blood Pressure">
                <div class="input-group-prepend">
                    <div class="input-group-text rounded-circle" data-toggle="tooltip" data-placement="top" title="Resting Blood Pressure"><i class="fa-solid fa-info"></i></div>
                  </div>
              </div>
              <label for="chol-${data._id}" class="form-label">Cholesterol</label>
              <div class="input-group mb-2 mr-sm-2">
                <input class="form-control rounded heartClear" type="number" name="chol" id="chol-${data._id}" placeholder="Cholesterol" >
                <div class="input-group-prepend">
                    <div class="input-group-text rounded-circle" data-toggle="tooltip" data-placement="top" title="Cholesterol"><i class="fa-solid fa-info"></i></div>
                  </div>
              </div>
              <label for="fbs-${data._id}" class="form-label">Fasting Blood Sugar</label>
              <div class="input-group mb-2 mr-sm-2">
                <input class="form-control rounded heartClear" type="number" name="fbs" id="fbs-${data._id}" placeholder="Fasting Blood Sugar">

                <div class="input-group-prepend">
                    <div class="input-group-text rounded-circle" data-toggle="tooltip" data-placement="top" title="Fasting Blood Sugar"><i class="fa-solid fa-info"></i></div>
                  </div>
              </div>
              <label for="restecg-${data._id}" class="form-label">Resting Electrocardiographic</label>
              <div class="input-group mb-2 mr-sm-2">
                <input class="form-control rounded heartClear" type="number" name="restecg" id="restecg-${data._id}" placeholder="Resting Electrocardiographic">
                
                <div class="input-group-prepend">
                    <div class="input-group-text rounded-circle" data-toggle="tooltip" data-placement="top" title="Resting Electrocardiographic"><i class="fa-solid fa-info"></i></div>
                  </div>
              </div>
              <label for="thalach-${data._id}" class="form-label">Maximum Heart Rate Achieved (Thalach)</label>
              <div class="input-group mb-2 mr-sm-2">
                <input class="form-control rounded heartClear" type="number" name="thalach" id="thalach-${data._id}" placeholder="Thalach value" >
                <div class="input-group-prepend">
                    <div class="input-group-text rounded-circle" data-toggle="tooltip" data-placement="top" title="Thalach value"><i class="fa-solid fa-info"></i></div>
                  </div>
              </div>
              <label for="exang-${data._id}" class="form-label">Exercise Induced Angina (Exang)</label>
              <div class="input-group mb-2 mr-sm-2">
              <input class="form-control rounded heartClear" type="number" name="exang" id="exang-${data._id}" placeholder="Exercise Induced Angina" >
                <div class="input-group-prepend">
                    <div class="input-group-text rounded-circle" data-toggle="tooltip" data-placement="top" title="Exang"><i class="fa-solid fa-info"></i></div>
                  </div>
              </div>
              <label for="oldpeak-${data._id}" class="form-label">ST depression (Oldpeak)</label>
              <div class="input-group mb-2 mr-sm-2">
                <input class="form-control rounded heartClear" type="number" name="oldpeak" id="oldpeak-${data._id}" placeholder="Oldpeak" >
                <div class="input-group-prepend">
                    <div class="input-group-text rounded-circle" data-toggle="tooltip" data-placement="top" title="Oldpeak"><i class="fa-solid fa-info"></i></div>
                  </div>
              </div>
              <label for="slope-${data._id}" class="form-label">Slope of the peak exercise</label>
              <div class="input-group mb-2 mr-sm-2">
                <input class="form-control rounded heartClear" type="number" name="slope" id="slope-${data._id}" placeholder="Slope" >

                <div class="input-group-prepend">
                    <div class="input-group-text rounded-circle" data-toggle="tooltip" data-placement="top" title="Slope of the peak exercise"><i class="fa-solid fa-info"></i></div>
                  </div>
              </div>
              <label for="ca-${data._id}" class="form-label">Number of major vessels (CA)</label>
              <div class="input-group mb-2 mr-sm-2">
                <input class="form-control rounded heartClear" type="number" name="ca" id="ca-${data._id}" placeholder="Number of major vessels" >

                <div class="input-group-prepend">
                    <div class="input-group-text rounded-circle" data-toggle="tooltip" data-placement="top" title="Coronary Artery"><i class="fa-solid fa-info"></i></div>
                  </div>
              </div>
              <label for="thal-${data._id}" class="form-label">Defect Value (Thal)</label>
              <div class="input-group mb-2 mr-sm-2">
                <input class="form-control rounded heartClear" type="number" name="thal" id="thal-${data._id}" placeholder="Defect Value (Thal)" >

                <div class="input-group-prepend">
                    <div class="input-group-text rounded-circle" data-toggle="tooltip" data-placement="top" title="Thal"><i class="fa-solid fa-info"></i></div>
                </div>
              </div>
              <div style="text-align:center;margin-top:30px">
                <button class="btn btn-primary fillHeartData" value="${data._id}" type="submit" ${disabledHeart}>Submit Heart Data</button>
              </div>
            </div>
          </div>
        </div>
          </div>
        </div>
      </div>`)
    });
    }
);

$("body").on ("click", ".fillDiabetesData", function(e){
    const data=e.target.value;
    var diabetesData = {
        testTimings:"",
        testAge:$("#testAgeDiabetes-"+data).val(),
        testPregnancies:$("#testPregnancies-"+data).val(),
        testGlucose:$("#testGlucose-"+data).val(),
        testBloodPressure:$("#testBloodPressure-"+data).val(),
        testSkinThickness:$("#testSkinThickness-"+data).val(),
        testInsulin:$("#testInsulin-"+data).val(),
        testBMI:$("#testBMI-"+data).val(),
        testPedigreeFunction:$("#testPedigreeFunction-"+data).val(),
        testDiabetesResult:""
    } 
    
    if(diabetesData.testAge===""||diabetesData.testPregnancies===""||diabetesData.testGlucose==="" || diabetesData.testBloodPressure===""||
    diabetesData.testSkinThickness===""||diabetesData.testInsulin===""||diabetesData.testBMI===""||diabetesData.testPedigreeFunction==="")
    {
      alert("Please fill all the fields!!");
      return
    }

    $.ajax({
        url: "/technician/diabetes",
        type: "post",
        data: {patientId:data,diabetesData:diabetesData},
        success: function (d) {
          alert(d.data);
          window.location.reload();
        },
        error: function (request, status, error) {
          alert(request.responseJSON.msg);
        },
      });
})

$("body").on ("click", ".fillHeartData", function(e){
    const data=e.target.value;
    var heartData = {
        testTimings:"",
        testAgeHeart:$("#testAgeHeart-"+data).val(),
        sex:$("#sex-"+data).val(),
        cp:$("#cp-"+data).val(),
        trestbps:$("#trestbps-"+data).val(),
        chol:$("#chol-"+data).val(),
        fbs:$("#fbs-"+data).val(),
        restecg:$("#restecg-"+data).val(),
        thalach:$("#thalach-"+data).val(),
        exang:$("#exang-"+data).val(),
        oldpeak:$("#oldpeak-"+data).val(),
        slope:$("#slope-"+data).val(),
        ca:$("#ca-"+data).val(),
        thal:$("#thal-"+data).val(),
        testHeartResult:""
    }

    if(
      heartData.testAgeHeart==="" ||
      heartData.sex==="" ||
      heartData.cp==="" ||
      heartData.trestbps==="" ||
      heartData.chol==="" ||
      heartData.fbs==="" ||
      heartData.restecg==="" ||
      heartData.thalach==="" ||
      heartData.exang==="" ||
      heartData.oldpeak==="" ||
      heartData.slope==="" ||
      heartData.ca==="" ||
      heartData.thal===""
    )
    {
      alert("Please fill all the fields!!");
      return
    }

    $.ajax({
        url: "/technician/heart",
        type: "post",
        data: {patientId:data,heartData:heartData},
        success: function (d) {
          alert(d.data);
          window.location.reload();
        },
        error: function (request, status, error) {
          alert(request.responseJSON.msg);
        },
      });
})
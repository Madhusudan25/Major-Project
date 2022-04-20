$(document).ready(function () {
  console.log("ready!");
});

$("#addDoctor").click(function (event) {
  event.preventDefault();
  const doctorData = {
    doctorname: $("#doctor_name").val(),
    public_address: $("#public_address").val(),
  };

  console.log(doctorData);

  $.ajax({
    url: "/admin",
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

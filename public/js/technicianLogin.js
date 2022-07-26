$("#login").click(()=>{
    var data={
        username:$("#username").val(),
        password:$("#password").val()
    }
    if(data.username==="" || data.password===""){
        alert("Please enter all the details");
        return;
    }
    if(!data.username.match(".*@gmail.com")){
        alert("Please enter valid gmail id!");
        return;
    }
    $.ajax({
        url: "/technician/login",
        type: "post",
        data: data,
        success: (d)=>{
           window.location.href=window.location.origin+"/technician/"+d.data;
        },
        error: function (request, status, error) {
            alert(request.responseJSON.msg);
        },
    });
})
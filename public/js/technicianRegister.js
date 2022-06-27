$("#register").click(()=>{
    var data={
        username:$("#username").val(),
        password:$("#password").val()
    }

    $.ajax({
        url: "/technician/register",
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
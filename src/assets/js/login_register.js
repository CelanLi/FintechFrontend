//********注册
$('#register_Submit').submit(function(){
    submitFun();
    return false;
});

//********登录
$('#login_Submit').submit(function(){
    submitFun();
    return false;
});


//验证
$(".alert-input input").focus(function(){
    $(this).next('p').html('');
});
$(".yzm-write").focus(function(){
    $(this).parent('.form-yzm').next('p').html('');
});
function submitFun(){
    var num=$('.login-box form input.user-num').val();
    var pass=$('.login-box form input.user-pass').val();
    var yan=$('.login-box form input.yzm-write').val();
    var kong=/^\s*$/;


    //手机号验证
    var numpattern=/^1[3|4|5|6|7|8|9]\d{9}$/;
    boolTel=numpattern.test(num);
    if(boolTel){
        $('.login-box form p.prompt_num').html('');
    }else{
        $('.login-box form p.prompt_num').html('请输入正确格式的手机号');
        return false;
    }
    //密码验证是否为空
    Kongpass=kong.test(pass);
    if(Kongpass){
        $('.alert-input p.prompt_pass').html('请输入密码！');
        return false;
    }else{
        $('.alert-input p.prompt_pass').html('');
    }
    //短信验证码是否为数字
    var massagepattern=/^\d{4,6}$/;
    boolMassage=massagepattern.test(yan);
    if(boolMassage){
        $('.login-box form p.prompt_yan').html('');
    }else{
        $('.login-box form p.prompt_yan').html('请输入正确的验证码');
        return false;
    }
    return false;
}

timer=null;
/* 发送验证码 */
var wait=60;
function time(o,dom_id){
    var id=dom_id||"yzmBtn";
    if(wait==0){
        $('#'+id).css({
            'background':'none',
            'color':'#688EF9'
        });
        o.removeAttribute("disabled");
        o.value="发送验证码";
        wait=60;
        return;
    }else{
        $('#'+id).css({
            'background':'none',
            'color':'#FE2E55'
        });
        o.setAttribute("disabled","disabled");
        o.value=wait+'秒后可重发';

        wait--;
    }
    timer=setTimeout(function(){
        time(o);
    },1000);
}

document.getElementById("yzmBtn").onclick=function(){
    // var that=this;
    time(this);

};
/* 手机号 */
$('.login-box form input.user-num').on("input propertychange",function(){
    var tel=$('.login-box form input.user-num').val();//手机号
    var telpattern=/^1[3|4|5|6|7|8|9]\d{9}$/;
    bool=telpattern.test(tel);
    if(bool){
        $('#yzmBtn').removeAttr("disabled");
    }else{
        $('#yzmBtn').attr("disabled","disabled");
    }
});

var values = $("#register_Submit").serializeArray();
console.log(values);

//协议选中效果
$(".alert-input-agree i.fa").click(function () {
    if ($(this).hasClass("fa-square-o")) {
        $(this).addClass("fa-check-square-o").removeClass("fa-square-o");
    } else {
        $(this).addClass("fa-square-o").removeClass("fa-check-square-o");
    }
});
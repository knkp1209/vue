var handler = function (captchaObj) {
    captchaObj.appendTo("#captcha");
    captchaObj.onSuccess(function () {
        //验证成功执行
     });
    captchaObj.onReady(function () {
        //加载完毕执行
    });
};
$.ajax({
   url: "/api/geetest.html?t=" + (new Date()).getTime(),
   type: "get",
   dataType: "json",
   success: function (data) {
   initGeetest({
        gt: data.gt,
        challenge: data.challenge,
        product: "float",
        offline: !data.success
      }, handler);
   }
});
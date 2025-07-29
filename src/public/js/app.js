document.addEventListener('DOMContentLoaded', function () {
    var btnSearch = $(".btn-search");
    var formSearch = $(".form-search");

    // toggle search form
    btnSearch.click(function () {
        formSearch.slideToggle();
    });

    // validate form login
    $("form.login").validate({
        rules: {
            email: {
                required: true,
            },
            password: {
                required: true,
                email: true
            },
        },
        messages: {
            email: {
                required: "Vui lòng nhập email",
                email: "Email chưa đúng định dạng"
            },
            password: {
                required: "Vui lòng nhập password",
               
            },
        },
        errorClass: 'help-block',
        highlight: function (element) {
            $(element).parent().addClass('has-error'); // element là input hiện tại
        },
        unhighlight: function (element) {
            $(element).parent().removeClass('has-error');
        },
        // submit form
        submitHandler: function (form) {
            form.submit();
        }
    });

})

function getUpdatedParam(k, v) {
    var params = {};
    window.location.search
        .replace(/[?&]+([^=&]+)=([^&]*)/gi, function (str, key, value) {
            params[key] = value;
        }
        );

    params[k] = v;
    if (v == "") {
        delete params[k];
    }

    var x = [];
    for (p in params) {
        x.push(p + "=" + params[p]);
    }
    return str_param = x.join("&");
}
document.addEventListener('DOMContentLoaded', function () {
    var btnSearch = $(".btn-search");
    var formSearch = $(".form-search");

    // toggle search form
    btnSearch.click(function () {
        formSearch.slideToggle();
    });

    // validate form login
    $(".login").validate({
        rules: {
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
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
        errorClass: 'invalid-feedback',
        highlight: function (element) {
            $(element).parent().children('input').addClass('is-invalid'); // element is current input
        },
        unhighlight: function (element) {
            $(element).parent().children('input').removeClass('is-invalid');
        },
        // submit form
        submitHandler: function (form) {
            form.submit();
        }
    });

    // validate form register
    $(".register").validate({
        rules: {
            fullname: {
                required: true,
            },
            email: {
                required: true,
                email: true,
            },
            password: {
                required: true,
                minlength: 6
            },
            password_confirm: {
                required: true,
                equalTo: "[name=password]"
            },
        },
        messages: {
            fullname: {
                required: "Vui lòng nhập họ tên",
            },
            email: {
                required: "Vui lòng nhập email",
                email: "Email chưa đúng định dạng",
            },
            password: {
                required: "Vui lòng nhập mật khẩu",
                minlength: "Mật khẩu phải ít nhất 6 kí tự"

            },
            password_confirm: {
                required: "Vui lòng nhập lại mật khẩu",
                equalTo: "Mật khẩu nhập lại chưa khớp"
            },
        },
        errorClass: 'invalid-feedback',
        highlight: function (element) {
            $(element).parent().children('input').addClass('is-invalid'); // element is current input
        },
        unhighlight: function (element) {
            $(element).parent().children('input').removeClass('is-invalid');
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
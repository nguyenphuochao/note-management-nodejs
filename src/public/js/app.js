document.addEventListener('DOMContentLoaded', function () {
    var btnSearch = $(".btn-search");
    var formSearch = $(".form-search");

    btnSearch.click(function () {
        formSearch.slideToggle();
    });
})
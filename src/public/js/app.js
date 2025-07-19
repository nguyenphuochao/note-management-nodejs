document.addEventListener('DOMContentLoaded', function () {
    var btnSearch = $(".btn-search");
    var formSearch = $(".form-search");

    // toggle search form
    btnSearch.click(function () {
        formSearch.slideToggle();
    });
})

function getUpdatedParam(k, v) {//sort, price-asc
    var params = {};
    //params = {"c":"proudct", "category_id":"5", "sort": "price-desc"}
    // window.location.search = "?c=product&price-range=200000-300000&sort=price-desc"
    window.location.search
        .replace(/[?&]+([^=&]+)=([^&]*)/gi, function (str, key, value) {
            params[key] = value;
            // alert(str);
            // alert(key);
            // alert(value);

        }
        );

    //{c:"proudct", category_id:"5", sort: "price-desc"}
    params[k] = v;
    if (v == "") {
        delete params[k];
    }

    var x = [];//là array
    for (p in params) {
        //x[0] = 'c=product'
        //x[1] = 'category_id=5'
        //x[2] = 'sort=price-asc'
        x.push(p + "=" + params[p]);
    }
    return str_param = x.join("&");//c=product&category_id=5&sort=price-asc
}
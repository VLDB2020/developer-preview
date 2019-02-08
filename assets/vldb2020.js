const menuActive = (category) => {
    let chk = document.getElementsByClassName("category-check");
    for (var c = 0; c < chk.length; c++) {
        chk[c].checked = false;
    }
    document.getElementById(category).checked = true;
}

document.onkeydown = (e) => {
    e = e || window.event;
    if (e.keyCode == '40') {
        document.getElementById("toppage-toggle").checked = !document.getElementById("toppage-toggle").checked ;
    }
};

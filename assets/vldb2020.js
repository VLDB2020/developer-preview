const menuActive = (category) => {
    console.log(category);
    document.getElementById('toppage-cnt').setAttribute('class', category);
    console.log(document.querySelector('input[name="submenu-active"][value="' + category + '"]'));
    document.querySelector('input[name="category-active"][value="' + category + '"]').checked = true;
}
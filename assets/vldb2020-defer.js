let submenuInAction = false;
const submenuToggle = (before, after) => {
    before = before == 'conference' ? null : before;
    after = after == 'conference' ? null : after;
    if (before === null && after === null) {
        return;
    }
    submenuInAction = true;
    let sequence = [];
    if (before === after) {
        after = null;
    }
    if (after == null) {
        sequence.push(new Promise(resolve => {
            anime({
                targets: "#submenu-mask",
                opacity: 0.0,
                duration: 300,
                complete: () => {
                    document.getElementById("submenu-mask").style.display = "none";
                    resolve();
                }
            });
        })
        );
    }
    if (before != null) {
        let panelID = 'submenu-panel-' + before;
        sequence.push(new Promise(resolve => {
            anime({
                targets: '#' + panelID,
                translateY: -(document.getElementById(panelID).offsetHeight) + 'px',
                easing: 'easeOutExpo',
                duration: 1000,
                complete: () => {
                    resolve();
                }
            });
        })
        );
    }
    if (after != null) {
        if (before == null) {
            document.getElementById("submenu-mask").style.display = "block";
            sequence.push(
                new Promise(resolve => {
                    anime({
                        targets: "#submenu-mask",
                        opacity: 0.8,
                        duration: 300,
                        complete: () => {
                            resolve();
                        }
                    });
                })
            );
        }
        let panelID = 'submenu-panel-' + after;
        sequence.push(new Promise(resolve => {
            document.getElementById(panelID).style.zIndex = 95;
            anime({
                targets: '#' + panelID,
                translateY: (document.getElementById(panelID).offsetHeight) + 'px',
                easing: 'easeOutQuint',
                duration: 1000,
                complete: () => {
                    document.getElementById(panelID).style.zIndex = 90;
                    resolve();
                }
            });
        })
        );
    }
    Promise.all(sequence).then(function (message) {
        submenuInAction = false;
    });
}

const maskClear = () => {
    if (submenuInAction) {
        return;
    }
    let before = null;
    if (document.querySelector('input[name="submenu-active"]:checked') !== null) {
        before = document.querySelector('input[name="submenu-active"]:checked').value;
    }
    let after = null;
    document.querySelector('input[name="submenu-active"]:checked').checked = false;
    submenuToggle(before, after);
}

let sublinks = document.querySelectorAll('.submenu-item:not(.link-disable)');
for (var c = 0; c < sublinks.length; c++) {
    sublinks[c].addEventListener('click', maskClear);
}

document.getElementById('submenu-mask').addEventListener('click', maskClear);

const menuItem = document.getElementsByClassName('submenu-toggle');
for (let c = 0; c < menuItem.length; c++) {
    menuItem[c].addEventListener('click', (e) => {
        if (submenuInAction) {
            e.stopPropagation();
            return;
        }
        let before = null;
        if (document.querySelector('input[name="submenu-active"]:checked') !== null) {
            before = document.querySelector('input[name="submenu-active"]:checked').value;
        }
        const checkID = 'submenu-' + e.currentTarget.attributes['x-category'].value;
        document.getElementById(checkID).checked = !document.getElementById(checkID).checked;
        let after = null;
        if (document.querySelector('input[name="submenu-active"]:checked') !== null) {
            after = document.querySelector('input[name="submenu-active"]:checked').value;
        }
        submenuToggle(before, after);
    });
}

document.onkeydown = (e) => {
    e = e || window.event;
    if (e.keyCode == '40') {
        let submenu = document.getElementsByClassName('submenu-active');
        for (let c = 0; c < submenu.length; c++) {
            if (submenu[c].checked) {
                return;
            }
        }
        let el = document.getElementById('contents-body');
        let height = parseInt(window.getComputedStyle(el).getPropertyValue('height'));
        if (document.getElementById("toppage-toggle").checked && Math.ceil(el.scrollTop + height) < el.scrollHeight) {
            return;
        }
        document.getElementById("toppage-toggle").checked = !document.getElementById("toppage-toggle").checked;
    } else if (e.keyCode == '38') {
        let submenu = document.getElementsByClassName('submenu-active');
        for (let c = 0; c < submenu.length; c++) {
            if (submenu[c].checked) {
                document.querySelector('input[name="submenu-active"]:checked').checked = false;
                submenuToggle(submenu[c].value, null);
                return;
            }
        }
    }
};


Barba.Pjax.start();
Barba.Dispatcher.on('linkClicked', function () {
    console.log("Click");
});
Barba.Dispatcher.on('newPageReady', function (currentStatus, oldStatus, container) {
    //eval(container.querySelector("script").innerHTML);
    const category = container.attributes['x-category'].value;
    document.getElementById('toppage-cnt').setAttribute('class', category);
    console.log(document.querySelector('input[name="submenu-active"][value="' + category + '"]'));
    document.querySelector('input[name="category-active"][value="' + category + '"]').checked = true;
});
Barba.Prefetch.init();

const categoryColors = {};
(() => {
    const col = document.getElementsByClassName('menu-line');
    for (let c = 0; c < col.length; c++) {
        let color = window.getComputedStyle(col[c]).getPropertyValue('background-color');
        let category = col[c].parentNode.querySelector('label').attributes['x-category'].value;
        categoryColors[category] = color;
    }
    let links = document.querySelectorAll('a[href]');
    const cbk = function (e) {
        if (e.currentTarget.href === window.location.href) {
            e.preventDefault();
            e.stopPropagation();
        }
    };
    for (var i = 0; i < links.length; i++) {
        links[i].addEventListener('click', cbk);
    }
})();


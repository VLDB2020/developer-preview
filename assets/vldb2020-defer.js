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
    console.log(before, "=>", after);
    if (after == null) {
        sequence.push(new Promise(resolve => {
            anime({
                targets: "#submenu-mask",
                opacity: 0.0,
                duration: 500,
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
            console.log("show mask");
            document.getElementById("submenu-mask").style.display = "block";
            sequence.push(
                new Promise(resolve => {
                    console.log("show mask --> go");
                    anime({
                        targets: "#submenu-mask",
                        opacity: 0.8,
                        duration: 500,
                        complete: () => {
                            resolve();
                        }
                    });
                })
            );
        }
        let panelID = 'submenu-panel-' + after;
        console.log("show panel");
        sequence.push(new Promise(resolve => {
            console.log("show panel --> " + panelID);
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
    console.log("start!");
    Promise.all(sequence).then(function (message) {
        submenuInAction = false;
        console.log(message);	// [ "3秒経過", "1秒経過", "2秒経過", ]
    });
}

document.getElementById('submenu-mask').addEventListener('click', () => {
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
});

const menuItem = document.getElementsByClassName('submenu-toggle');
for (let c = 0; c < menuItem.length; c++) {
    menuItem[c].addEventListener('click', (e) => {
        if (submenuInAction) {
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
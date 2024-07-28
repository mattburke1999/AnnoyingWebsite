const container1 = document.getElementById("container1");
const container2 = document.getElementById("container2");
const container3 = document.getElementById("container3");
const finish = document.getElementById("finished");
const themeSwitch = document.getElementById("dark-light-mode");

const colors = ["red", "blue", "green", "purple", "orange", "pink", "brown"];

container1.onmouseover = () => mouseOver(500, container1);
container2.onmouseover = () => mouseOver(350, container2);
container3.onmouseover = () => mouseOver2(container3);

let isMoving = false;

let counter = 0;
let counter2 = 0;

let missTexts = 0;

function mouseOver(timeLimit, container) {
    if (!isMoving) {
        isMoving = true;
        setTimeout(function () {
            moveRandom(container);
            isMoving = false;
        }, timeLimit);
    }
};

function mouseOver2(container) {
    // move the container slightly after a 200ms delay
    setTimeout(function () {
        moveSlightly(container);
    }, 200);
}

function nextStep() {
    removeMisses();
    // remove the current container
    let container1Start = localStorage.getItem("container1StartTime");
    let container1Time = Date.now() - container1Start;
    localStorage.setItem("container1Time", container1Time);
    container1.style.display = "none";
    // set the next container to be active
    localStorage.setItem("activeContainer", "container2");
    localStorage.setItem("container2StartTime", Date.now());
    container2.style.display = "flex";
    moveRandom(container2);
}

function nextStep2() {
    removeMisses();
    counter += 1;
    if (counter === 3) {
        let container2Start = localStorage.getItem("container2StartTime");
        let container2Time = Date.now() - container2Start;
        localStorage.setItem("container2Time", container2Time);
        container2.style.display = "none";
        localStorage.setItem("activeContainer", "container3");
        localStorage.setItem("container3StartTime", Date.now());
        container3.style.display = "flex";
        moveRandom(container3);
    }
    else {
        const h2 = document.getElementById("h2");
        h2.textContent = counter + "/3";
    }
}

function nextStep3() {
    removeMisses();
    counter2 += 1;
    const h2 = document.getElementById("h3");
    if (counter2 === 1) {
        container3.onmouseover = () => mouseOver(325, container3);
        h2.textContent = counter2 + "/3";
    } else if (counter2 === 2) {
        container3.onmouseover = () => mouseOver2(container3);
        h2.textContent = counter2 + "/3";
    } else if (counter2 === 3) {
        let container3Start = localStorage.getItem("container3StartTime");
        let container3Time = Date.now() - container3Start;
        localStorage.setItem("container3Time", container3Time);
        container3.style.display = "none";
        localStorage.setItem("activeContainer", "finished");
        setTimes();
        finish.style.display = "flex";
    }
}

function startOver() {
    // reset counters
    counter = 0;
    document.getElementById("h2").textContent = "0/3";
    counter2 = 0;
    document.getElementById("h3").textContent = "0/3";
    // reset storage
    localStorage.clear();
    // remove miss texts
    removeMisses();
    // reset active container
    localStorage.setItem("activeContainer", "container1");
    localStorage.setItem("container1StartTime", Date.now());
    finish.style.display = "none";
    container1.style.display = "flex";
    moveRandom(container1);
}

function moveSlightly(container) {
    const containerWidth = parseInt(container.offsetWidth);
    const containerHeight = parseInt(container.offsetHeight);
    // move the container slightly
    let x_movement = Math.floor(2 * (Math.random() - .5) * 100);
    let y_movement = Math.floor(2 * (Math.random() - .5) * 100);
    let left = parseInt(container.style.left);
    let top = parseInt(container.style.top);
    let new_left = left + x_movement;
    let new_top = top + y_movement;
    if (new_left < 0 || new_left > (window.innerWidth - containerWidth)) {
        new_left = left - x_movement;
    }
    if (new_top < 0 || new_top > (window.innerHeight - containerHeight)) {
        new_top = top - y_movement;
    }
    container.style.left = new_left + "px";
    container.style.top = new_top + "px";
}

function moveRandom(object) {
    const objectWidth = parseInt(object.offsetWidth);
    const objectHeight = parseInt(object.offsetHeight);
    let x = Math.floor(Math.random() * (window.innerWidth - objectWidth));
    let y = Math.floor(Math.random() * (window.innerHeight - objectHeight));
    let x_condition = Math.abs(x - parseInt(object.style.left)) < objectWidth / 2
    let y_condition = Math.abs(y - parseInt(object.style.top)) < objectHeight / 2
    if (x_condition && y_condition) {
        moveRandom(object);
    } else {
        object.style.left = x + "px";
        object.style.top = y + "px";
    }
}

function convertMsToSec(ms) {
    if (!ms) {
        return 0;
    }
    return ms / 1000;
}

function setTimes() {
    let container1Time = convertMsToSec(localStorage.getItem("container1Time"));
    let container2Time = convertMsToSec(localStorage.getItem("container2Time"));
    let container3Time = convertMsToSec(localStorage.getItem("container3Time"));
    let total = container1Time + container2Time + container3Time;
    document.getElementById("part1").textContent = "Part 1: " + container1Time + " seconds";
    document.getElementById("part2").textContent = "Part 2: " + container2Time + " seconds";
    document.getElementById("part3").textContent = "Part 3: " + container3Time + " seconds";
    document.getElementById("total").textContent = "Total: " + total + " seconds";
}

function removeMisses() {
    for (let i = 1; i < missTexts+1; i++) {
        let text = document.getElementById(`miss${i}`);
        text.style.display = "none";
    }
}

function miss() {
    // pick random color
    let randomColor = colors[Math.floor(Math.random() * colors.length)];
    let random = Math.floor(Math.random() * missTexts) + 1;
    let textRandom = document.getElementById(`miss${random}`);
    for (let i = 1; i < missTexts+1; i++) {
        let text = document.getElementById(`miss${i}`);
        if (i === random) {
            text.style.display = "block";
            text.style.color = randomColor;
        } else {
            text.style.display = "none";
        }
    }
    moveRandom(textRandom);
}

function countMissTexts() {
    let i = 1;
    while(true){
        var missText = document.getElementById(`miss${i}`);
        if(missText) {
            i += 1;
        } else {
            break;
        }
    }
    return i-1;
}

window.onload = function () {
    setTimes();
    missTexts = countMissTexts();
    let activeContainer = localStorage.getItem("activeContainer");
    if (!activeContainer) {
        startOver();
        return;
    } else {
        let lastGameStartTime = localStorage.getItem("container1StartTime");
        // if last game was over an hour ago, start over
        if (Date.now() - lastGameStartTime > 3600000) {
            startOver();
            return;
        }
    }
    let container = document.getElementById(activeContainer);
    container.style.display = "flex";
    if (!activeContainer.includes("finished")) {
        moveRandom(container);
    }
}

themeSwitch.onchange = function () {
    removeMisses();
    if (themeSwitch.checked) {
        document.getElementById('body').style.backgroundColor = "#3a3d40";
        document.getElementById('theme-label').textContent = 'Enable Light Mode?';
        document.getElementById('theme-label').style.color = "white";
    } else {
        document.getElementById('body').style.backgroundColor = "white";
        document.getElementById('theme-label').textContent = 'Enable Dark Mode?';
        document.getElementById('theme-label').style.color = "black";
    }
}

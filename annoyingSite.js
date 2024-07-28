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

const container1 = document.getElementById("container1");
const container2 = document.getElementById("container2");
const container3 = document.getElementById("container3");
const finish = document.getElementById("finished");

container1.onmouseover = () => mouseOver(500, container1);
container2.onmouseover = () => mouseOver(350, container2);
container3.onmouseover = () => mouseOver2(container3);

let isMoving = false;

function nextStep() {
    // remove the current container
    container1Start = localStorage.getItem("container1StartTime");
    container1Time = Date.now() - container1Start;
    localStorage.setItem("container1Time", container1Time);
    container1.style.display = "none";
    // set the next container to be active
    localStorage.setItem("activeContainer", "container2");
    localStorage.setItem("container2StartTime", Date.now());
    container2.style.display = "flex";
    moveRandom(container2);
}

let counter = 0;

function nextStep2() {
    counter += 1;
    if (counter === 3) {
        container2Start = localStorage.getItem("container2StartTime");
        container2Time = Date.now() - container2Start;
        localStorage.setItem("container2Time", container2Time);
        container2.style.display = "none";
        localStorage.setItem("activeContainer", "container3");
        localStorage.setItem("container3StartTime", Date.now());
        container3.style.display = "flex";
        moveRandom(container3);
    }
    else {
        h2 = document.getElementById("h2");
        h2.textContent = counter + "/3";
    }
}

let counter2 = 0;

function nextStep3() {
    console.log(counter2);
    counter2 += 1;
    h2 = document.getElementById("h3");
    if (counter2 === 1) {
        container3.onmouseover = () => mouseOver(325, container3);
        h2.textContent = counter2 + "/3";
    } else if (counter2 === 2) {
        container3.onmouseover = () => mouseOver2(container3);
        h2.textContent = counter2 + "/3";
    } else if (counter2 === 3) {
        container3Start = localStorage.getItem("container3StartTime");
        container3Time = Date.now() - container3Start;
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
    // reset active container
    localStorage.setItem("activeContainer", "container1");
    finish.style.display = "none";
    container1.style.display = "flex";
    moveRandom(container);
}

function moveSlightly(container) {
    const containerWidth = parseInt(container.offsetWidth);
    const containerHeight = parseInt(container.offsetHeight);
    // move the container slightly
    var x_movement = Math.floor(2 * (Math.random() - .5) * 100);
    var y_movement = Math.floor(2 * (Math.random() - .5) * 100);
    var left = parseInt(container.style.left);
    var top = parseInt(container.style.top);
    new_left = left + x_movement;
    new_top = top + y_movement;
    if (new_left < 0 || new_left > (window.innerWidth - containerWidth)) {
        new_left = left - x_movement;
    }
    if (new_top < 0 || new_top > (window.innerHeight - containerHeight)) {
        new_top = top - y_movement;
    }
    container.style.left = new_left + "px";
    container.style.top = new_top + "px";
}

function moveRandom(container) {
    const containerWidth = parseInt(container.offsetWidth);
    const containerHeight = parseInt(container.offsetHeight);
    var x = Math.floor(Math.random() * (window.innerWidth - containerWidth));
    var y = Math.floor(Math.random() * (window.innerHeight - containerHeight));
    x_condition = Math.abs(x - parseInt(container.style.left)) < containerWidth / 2
    y_condition = Math.abs(y - parseInt(container.style.top)) < containerHeight / 2
    if (x_condition && y_condition) {
        moveRandom(container);
    } else {
        container.style.left = x + "px";
        container.style.top = y + "px";
    }
}

function convertMsToSec(ms) {
    if (!ms) {
        return 0;
    }
    return ms / 1000;
}

function setTimes() {
    container1Time = convertMsToSec(localStorage.getItem("container1Time"));
    container2Time = convertMsToSec(localStorage.getItem("container2Time"));
    container3Time = convertMsToSec(localStorage.getItem("container3Time"));
    total = container1Time + container2Time + container3Time;
    document.getElementById("part1").textContent = "Part 1: " + container1Time + " seconds";
    document.getElementById("part2").textContent = "Part 2: " + container2Time + " seconds";
    document.getElementById("part3").textContent = "Part 3: " + container3Time + " seconds";
    document.getElementById("total").textContent = "Total: " + total + " seconds";
}

window.onload = function () {
    setTimes();
    var activeContainer = localStorage.getItem("activeContainer");
    if (!activeContainer) {
        activeContainer = "container1";
        localStorage.setItem("container1StartTime", Date.now());
    }
    localStorage.setItem("activeContainer", activeContainer);
    var container = document.getElementById(activeContainer);
    container.style.display = "flex";
    if (!activeContainer.includes("finished")) {
        moveRandom(container);
    }
}

const themeSwitch = document.getElementById("dark-light-mode");

themeSwitch.onchange = function () {
    console.log(themeSwitch.checked);
    if (themeSwitch.checked) {
        document.body.style.backgroundColor = "#3a3d40";
        document.getElementById('theme-label').textContent = 'Enable Light Mode';
        document.getElementById('theme-label').style.color = "white";
    } else {
        document.body.style.backgroundColor = "white";
        document.getElementById('theme-label').textContent = 'Enable Dark Mode';
        document.getElementById('theme-label').style.color = "black";
    }
}

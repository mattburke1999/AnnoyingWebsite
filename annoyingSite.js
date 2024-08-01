const container1 = document.getElementById("container1");
const container2 = document.getElementById("container2");
const container3 = document.getElementById("container3");
const container4 = document.getElementById("container4");
const click4Container = document.getElementById('click4-container');
const container5 = document.getElementById('container5');
const container5Wrapper = document.getElementById('container5-wrapper');
const finish = document.getElementById("finished");
const bodyContainer = document.getElementById('body');
const timeContainer = document.getElementById('times');
const themeSwitch = document.getElementById("dark-light-mode");
const button4 = document.getElementById('click4');
const title = document.getElementById("title");
const draggable = document.getElementById('draggable');
const dropzone = document.getElementById('dropzone');

const colors = ["red", "blue", "green", "purple", "orange", "pink", "brown"];

container1.onmouseover = () => mouseOver(500, container1);
container2.onmouseover = () => mouseOver(350, container2);
container3.onmouseover = () => mouseOver2(container3);
container4.onmouseover = () => mouseOver(1500, container4);
container5.onmouseover = () => mouseOver(500, container5);

button4.onmouseover = () => mouseOver3(button4, click4Container);

draggable.ondragstart = (event) => nextStep5_start(event);
dropzone.ondrop = (event) => nextStep5_finish(event);
dropzone.ondragover = (event) => allowDrop(event);

let isMoving = false;
let isFinished = false;

let counter = 0;
let counter2 = 0;

let currentColor = 0;
let currentText = 0;

let missTexts = 0;

function miss() {
    if (!isFinished) {
        // pick random color
        let randomColor = colors[Math.floor(Math.random() * colors.length)];
        let random = Math.floor(Math.random() * missTexts) + 1;
        while (random === currentText) {
            random = Math.floor(Math.random() * missTexts) + 1;
        }
        while (randomColor === currentColor) {
            randomColor = colors[Math.floor(Math.random() * colors.length)];
        }
        let textRandom = document.getElementById(`miss${random}`);
        for (let i = 1; i < missTexts+1; i++) {
            let text = document.getElementById(`miss${i}`);
            if (i === random) {
                text.style.display = "block";
                text.style.color = randomColor;
                text.style.textShadow = `0 0 7px ${randomColor}`;
                currentColor = randomColor;
                currentText = random;
            } else {
                text.style.display = "none";
            }
        }
        moveRandom(textRandom);
        if(check_div_over_miss_text(textRandom)) {
            moveRandom(textRandom);
        }
    }
}

function check_div_over_miss_text(text) {
    // look through the miss texts for any that are display: block, mkae sure the container is not over them
    let activeContainer = localStorage.getItem("activeContainer");
    let container = activeContainer!== "container5-wrapper" ? document.getElementById(activeContainer) : document.getElementById("container5");
    let containerLeft = parseInt(container.style.left);
    let containerTop = parseInt(container.style.top);
    let containerWidth = parseInt(container.offsetWidth);
    let containerHeight = parseInt(container.offsetHeight);
    let textLeft = parseInt(text.style.left);
    let textTop = parseInt(text.style.top);
    let textWidth = parseInt(text.offsetWidth);
    let textHeight = parseInt(text.offsetHeight);
    let left_condition = containerLeft < textLeft + textWidth && containerLeft + containerWidth > textLeft;
    let top_condition = containerTop < textTop + textHeight && containerTop + containerHeight > textTop;
    return left_condition && top_condition 
}

function setContainerTime(container) {
    let containerStart = localStorage.getItem(`${container}StartTime`);
    let containerTime = Date.now() - containerStart;
    localStorage.setItem(`${container}Time`, containerTime);
}

function allowDrop(event) {
    event.preventDefault();
}

function mouseOver(timeLimit, container) {
    if (!isMoving) {
        isMoving = true;
        setTimeout(function () {
            moveRandom(container);
            isMoving = false;
        }, timeLimit);
    }
}

function mouseOver2(container) {
    // move the container slightly after a 200ms delay
    setTimeout(function () {
        moveSlightly(container);
    }, 200);
}

function mouseOver3(container, outerContainer) {
    // move the container slightly after a 200ms delay
    setTimeout(function () {
        moveSlightlyWithinContainer(container, outerContainer);
    }, 90);
}

function setContainerTime(container) {
    let containerStart = localStorage.getItem(`${container}StartTime`);
    let containerTime = Date.now() - containerStart;
    localStorage.setItem(`${container}Time`, containerTime);
}

function nextContainer(prevContainer, newContainer) {
    console.log(`Moving from ${prevContainer} to ${newContainer}`);
    setContainerTime(prevContainer);
    const prevElement = document.getElementById(prevContainer);
    const newElement = document.getElementById(newContainer);
    prevElement.style.display = "none";
    newElement.style.display = "flex";
    localStorage.setItem("activeContainer", newContainer);
    if (newContainer.includes('container5')) {
        newContainer = 'container5';
        moveRandom(container5, true);
    } else {
        moveRandom(newElement);
    }
    localStorage.setItem(`${newContainer}StartTime`, Date.now());
}

function nextStep(event) {
    event.stopPropagation();
    removeMisses();
    nextContainer("container1", "container2");
}

function nextStep2(event) {
    event.stopPropagation();
    removeMisses();
    counter += 1;
    if (counter === 3) {
        nextContainer("container2", "container3");
    } else {
        const h2 = document.getElementById("h2");
        h2.textContent = counter + "/3";
    }
}

function nextStep3(event) {
    event.stopPropagation();
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
        nextContainer("container3", "container4");
    }
}

function nextStep4(event) {
    event.stopPropagation();
    removeMisses();
    setContainerTime("container4");
    resetContainer5();
    nextContainer("container4", "container5-wrapper");
    addEventListenersToLevel5();
}

function nextStep5_start(event){
    let color = window.getComputedStyle(draggable).backgroundColor;
    let border = window.getComputedStyle(draggable).border;
    event.dataTransfer.setData("color", color);
    event.dataTransfer.setData("border", border);
}

function nextStep5_finish(event) {
    event.preventDefault();
    isFinished = true;
    removeMisses();
    let newColor = event.dataTransfer.getData("color")
    let newBorder = event.dataTransfer.getData("border")
    dropzone.style.backgroundColor = newColor;
    dropzone.style.border = newBorder;
    dropzone.textContent = 'Dropped!';
    draggable.style.display = 'none';
    let container5Start = localStorage.getItem("container5StartTime");
    let container5Time = Date.now() - container5Start;
    localStorage.setItem("container5Time", container5Time);
    localStorage.setItem("activeContainer", "finished");
    setTimes();
    // pause briefly to show the dropzone color
    setTimeout(function () {
        container5Wrapper.style.display = "none";
        finish.style.display = "flex";
        title.style.display = "none";
    }, 300);
}

function resetContainer5() {
    draggable.style.display = 'block';
    dropzone.style.backgroundColor = 'white';
    dropzone.style.border = '1.5px dashed black';
}

function addEventListenersToLevel5() {

    container5.addEventListener('dragover', (event) => {
        allowDrop(event);
        mouseOver(500, container5);
    });
    container5.addEventListener('drop', (event) => {
        allowDrop(event);
        if (event.target!==dropzone) {
            miss();
        }
        
    });
    
    container5Wrapper.addEventListener('dragover', (event) => {
        allowDrop(event);
    });
    container5Wrapper.addEventListener('drop', (event) => {
        allowDrop(event);
        if (event.target.id!=='dropzone' && event.target.id!=='container5') {
            miss();
        }
    });
}

function startOver(event) {
    if (event) {
        event.stopPropagation();
    }
    removeMisses();
    isFinished = false;
    // reset counters
    counter = 0;
    document.getElementById("h2").textContent = "0/3";
    counter2 = 0;
    document.getElementById("h3").textContent = "0/3";
    // reset storage
    localStorage.clear();
    // reset active container
    nextContainer("finished", "container1");
    title.style.display = "block";
}

function moveSlightlyWithinContainer(object, outerContainer) {
    // move the object a few pixels in a random direction
    // make sure the object stays within the outer container
    const objectWidth = parseFloat(window.getComputedStyle(object).getPropertyValue('width'));
    const objectHeight = parseFloat(window.getComputedStyle(object).getPropertyValue('height'));
    const outerContainerWidth = parseInt(outerContainer.offsetWidth);
    const outerContainerHeight = parseInt(outerContainer.offsetHeight);
    let x_move = (outerContainerWidth - objectWidth) / 2 - 1; // allows the object to move the max distance without going out of bounds
    let y_move = (outerContainerHeight - objectHeight) / 2 - 1;
    let x = parseFloat(window.getComputedStyle(object).getPropertyValue('left'));
    let x_movement = 0;
    if (x < x_move) { // if the object is close to the left edge, move it to the right
        x_movement = Math.floor(Math.random() * x_move);
    } else if (x + objectWidth > outerContainerWidth - x_move) { // too close to the right edge, move it to the left
        x_movement = Math.floor(Math.random() * -x_move);
    } else { // move it in a random direction
        x_movement = Math.floor(Math.random() * 2 * x_move) - x_move;
    }
    let y = parseFloat(window.getComputedStyle(object).getPropertyValue('top'));
    let y_movement = 0;
    if (y < y_move) {
        y_movement = Math.floor(Math.random() * y_move);
    } else if (y + objectHeight > outerContainerHeight - y_move) {
        y_movement = Math.floor(Math.random() * -y_move);
    } else {
        y_movement = Math.floor(Math.random() * 2 * y_move) - y_move;
    }
    let new_x = x + x_movement;
    let new_y = y + y_movement;
    if (new_x < 0) {
        new_x = 0;
    } else if (new_x + objectWidth > outerContainerWidth) {
        new_x = outerContainerWidth - objectWidth;
    }
    if (new_y < 0) {
        new_y = 0;
    } else if (new_y + objectHeight > outerContainerHeight) {
        new_y = outerContainerHeight - objectHeight;
    }
    object.style.left = new_x + "px";
    object.style.top = new_y + "px";
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
    const titleWidth = parseInt(title.offsetWidth) + 20; // add some padding
    const titleHeight = parseInt(title.offsetHeight) + 20;
    let x = Math.floor(Math.random() * (window.innerWidth - objectWidth));
    let y = Math.floor(Math.random() * (window.innerHeight - objectHeight));
    if ((Math.abs(x - parseInt(object.style.left)) < objectWidth) && (Math.abs(y - parseInt(object.style.top)) < objectHeight)) {
        moveRandom(object);
    }else if (x < titleWidth && y < titleHeight) { // make sure the object is not overlapping the title
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

function countContainers() {
    let i = 1;
    while (true) {
        let container = document.getElementById(`container${i}`);
        if (container) {
            i += 1;
        } else {
            break;
        }
    }
    return i - 1;
}

function setTimes() {
    // clear contents of timeContainer
    timeContainer.innerHTML = "";
    let numContainers = countContainers();
    let total = 0;
    for (i = 1; i < numContainers + 1; i++) {
        let containerTime = convertMsToSec(localStorage.getItem(`container${i}Time`));
        total += containerTime;
        let h2 = document.createElement("h2");
        h2.textContent = `Part ${i}: ${containerTime.toFixed(2)} seconds`;
        timeContainer.appendChild(h2);
    }
    let h2 = document.createElement("h2");
    h2.textContent = `Total: ${total.toFixed(2)} seconds`;
    timeContainer.appendChild(h2);
}

function removeMisses() {
    for (let i = 1; i < missTexts+1; i++) {
        let text = document.getElementById(`miss${i}`);
        text.style.display = "none";
    }
}

function countMissTexts() {
    return document.querySelectorAll('.miss').length;
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
    if (activeContainer.includes("finished")) {
        title.style.display = "none";
    } else if (activeContainer.includes("container5")) {
        addEventListenersToLevel5();
        moveRandom(container5, true);
    } else {
        moveRandom(container);
    }
}
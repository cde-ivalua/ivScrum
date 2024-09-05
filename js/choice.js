// const apiUrl = 'https://iv-scrum-api.herokuapp.com';
// const apiUrl = 'https://localhost:5001'
const DccReminder = () => {
    const CCtab = document.querySelector('.tab.selected[data-team-id="2b139375-8dda-40ae-94d9-c4d58713ac91"]');
    const txt = document.getElementById('txtDevCurrent');
    if (!CCtab) {
        txt.textContent = null;
        return;
    }
    // var a = new Date('24 december 2022')
    var a = new Date('28 november 2022');
    var b = new Date()
    const diffTime = Math.abs(a - b);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    txt.textContent = `Anaïs, ${diffDays} Days Before End of Free Hosting Plan...`;
    // txt.textContent = `${diffDays} Days Before DCC Release...`;    
}

const teams = [
    {
        "name": "Integration",
        "id": "1",
        "trelloId": "NU3JyLTu",
        "devs":
        {
            'afo': {'trigram' : 'afo', 'name': 'Antonin', 'trello': '617a5c4c59490938673593f0', 'present' : getBoolFromStorage('afo'), 'tab' : null, 'done' : false, 'time' : 0 },
            'cda': {'trigram' : 'cda', 'name': 'Christophe', 'trello': '5721daa1b7364971e546197a', 'present' : getBoolFromStorage('cda'), 'tab' : null, 'done' : false, 'time' : 0 },
            'cdn': {'trigram' : 'cdn', 'name': 'Christopher', 'present' : getBoolFromStorage('cdn'), 'tab' : null, 'done' : false, 'time' : 0 },
            'cdr': {'trigram' : 'cdr', 'name': 'Cyril', 'present' : getBoolFromStorage('cdr'), 'tab' : null, 'done' : false, 'time' : 0 },
            'ksi': {'trigram' : 'ksi', 'name': 'Kaka', 'trello': '633d8f1ea46007042dc1269c', 'present' : getBoolFromStorage('ksi'), 'tab' : null, 'done' : false, 'time' : 0 },
            'cde': {'trigram' : 'cde', 'name': 'Kiki', 'trello': '5e69fb8126f1b17a8b9e282b', 'present' : getBoolFromStorage('cde'), 'tab' : null, 'done' : false, 'time' : 0 },
            'mil': {'trigram' : 'mil', 'name': 'Michael', 'trello': '61828a4b9c03d460e173385e', 'present' : getBoolFromStorage('mil'), 'tab' : null, 'done' : false, 'time' : 0 },
            'pst': {'trigram' : 'pst', 'name': 'Philippe', 'trello': '57357594b69d9fd7e3cf8037', 'present' : getBoolFromStorage('pst'), 'tab' : null, 'done' : false, 'time' : 0 },
            'skf': {'trigram' : 'skf', 'name': 'Salim', 'trello': '62dfa8865f56db0ad39af728', 'present' : getBoolFromStorage('skf'), 'tab' : null, 'done' : false, 'time' : 0 },
            'vml': {'trigram' : 'vml', 'name': 'Vincent', 'trello': '6182a222015f9d30b7ae7620', 'present' : getBoolFromStorage('vml'), 'tab' : null, 'done' : false, 'time' : 0 }
        }
    }
]

function getBoolFromStorage(key) {
    var it = localStorage.getItem(key);
    if (it === null) {
        return true;
    }
    return localStorage.getItem(key) === 'true';
}

function setBoolToStorage(key, value) {
    localStorage.setItem(key, value);
}

var currentTeam = null;
var selectedDev = null;
const getTeam = () => {
    const tab = document.querySelector('.selected.tab');
    if (!tab) {
        return teams[0].name;
    }
    const id = tab.getAttribute('data-trello-id');
    const team = teams.find(e => e.id === id);
    return team.name;
}
function loadJSON(callback) {
    var data = teams;
    callback(data);
}
/**
* Get the dev list as an array from
* the input set in the corresponding textarea.
* @returns the dev list.
*/
const getDevList = () => {
    const items = document.querySelectorAll('.dev.column li');
    const res = [...items].reduce((prev, cur, i, arr) => {
        const input = cur.querySelector('.name-label');
        prev.push(input.getAttribute('for'));
        // if (input.checked){
        //     prev.push(input.value);
        // }
        return prev;
    }, []);
    return res;
}
function initDevList() {
    const ul = document.querySelector('.dev.column');
    ul.innerHTML = '';
    loadJSON((data) => {
        const devs = data.find(e => e.name === getTeam()).devs;
        currentTeam = devs;
        Object.entries(devs).forEach(([trigram, e]) => {
            const li = document.createElement('li');
            li.setAttribute('data-user-id', e.trello);
            const div = document.createElement('div');
            div.classList.add('label');
            div.setAttribute('id', trigram);
            const label = document.createElement('label');
            label.classList.add('name-label');
            label.setAttribute('for', trigram);
            label.textContent = e.name;
            const chk = document.createElement('input');
            chk.setAttribute('value', trigram);
            chk.setAttribute('id', trigram);
            chk.setAttribute('type', 'checkbox');
            chk.checked = getBoolFromStorage(trigram);
            chk.addEventListener('change', chkChangeHandler)

            li.append(div);
            div.append(label);
            li.append(chk);
            ul.append(li);
            if (!chk.checked) {
                li.classList.add('off');
            }
            currentTeam[trigram].tab = li;
        });
    });
}
const chkChangeHandler = (e) => {
    const target = e.target,
        id = target.getAttribute('value');
    currentTeam[id].present = target.checked;
    var tab = currentTeam[id].tab;
    if (target.checked) {
        tab.classList.remove('off');
        setBoolToStorage(id, 'true');
    }
    else {
        tab.classList.add('off');
        setBoolToStorage(id, 'false');
    }
}
//#region Constants
const SQRT_PI = Math.sqrt(Math.PI);
const COLORS = ['#6867AC', '#A267AC', '#CE7BB0', '#FFBCD1', '#705089', '#A267AC', '#CE7BB0', '#ef628c', '#a83f5d', '#af1642'];
//#endregion

//#region Global variables
let pickerRadius;
let devList = [];
let $canvas;
let ctx;
let startTimestamp;
let iMessage = 0;
//#endregion


//#region Utils
/**
 * Get the single DOM element corresponding to an id.
 * @param {string} id DOM identifier.
 * @returns An HTML element.
 */
const $ = id => document.getElementById(id);

/**
* Error function.
* see https://www.wolframalpha.com/input/?i=1%2F2+sqrt%28%CF%80%29+erf%28x%29
* and https://en.wikipedia.org/wiki/Error_function#Numerical_approximations
* @param {number} x Input
* @returns Error function of input.
*/
const erf = x => {
    // save the sign of x
    var sign = (x >= 0) ? 1 : -1;
    x = Math.abs(x);

    // constants
    var a1 = 0.254829592;
    var a2 = -0.284496736;
    var a3 = 1.421413741;
    var a4 = -1.453152027;
    var a5 = 1.061405429;
    var p = 0.3275911;

    // A&S formula 7.1.26
    var t = 1.0 / (1.0 + p * x);
    var y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return sign * y; // erf(-x) = -erf(x);
}

/**
 * Get a random number into 2 numbers included in the interval.
 * cf. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_number_between_two_values
 * @param {number} min 
 * @param {*} max 
 * @returns 
 */
const rand = (min, max) => Math.random() * (max - min) + min;

/**
 * Add a message to the corresponding area.
 * @param {string} txt Message text.
 * @param {*} type Message type ('success' / 'warning' / 'error').
 */
const addMessage = (txt, type) => {
    const msgId = 'message-' + iMessage;
    $('messages').innerHTML += `<div id='${msgId}' class='message message-${type}'>${txt}</div>`;
    setTimeout(() => {
        const $msg = $(msgId);
        $msg.parentNode.removeChild($msg);
    }, 3000);
    iMessage++;
}

/**
 * Compare elements of an old array and of a new one (possibly not in the same order).
 * It returns an object that contains:
 *  - a flag indicating if both arrays are similar (areIdentical)
 *  - a list of new items (addedItems)
 *  - a list of items no longer present (removedItems)
 * @param {T[]} oldArray 
 * @param {T[]} newArray 
 * @returns an object describing the comparison.
 */
const compareArrays = (oldArray, newArray) => {
    const result = {
        areIdentical: true,
        addedItems: [],
        removedItems: []
    };

    // Check for removed items
    for (const elt1 of oldArray) {
        const idx2 = newArray.indexOf(elt1);
        if (idx2 === -1) {
            result.removedItems.push(elt1);
            result.areIdentical = false;
        }
    }

    // Check for new items
    for (const elt2 of newArray) {
        const idx1 = oldArray.indexOf(elt2);
        if (idx1 === -1) {
            result.addedItems.push(elt2);
            result.areIdentical = false;
        }
    }

    return result;
}

const replaceArrayInplace = (oldArray, newArray) => {
    oldArray.length = newArray.length;
    for (let i = 0; i < oldArray.length; i++)
        oldArray[i] = newArray[i];
}
//#endregion


//#region Canvas utilities
/**
 * Initialize a canvas context to draw things in this canvas.
 */
const initCanvasContext = () => {
    $canvas = $('picker');
    ctx = $canvas.getContext('2d');
    pickerRadius = $canvas.width / 2;
}

/**
 * Draw a wedge area.
 * @param {number} i Position of the region in the list.
 * @param {string} dev Developer trigram.
 * @param {number} n Number of regions to draw.
 * @param {string} color Color code.
 * @param {number} deltaStartAngle Adds a start angle offset to rotate the wheel.
 */
const drawCircularArea = (i, dev, n, color, deltaStartAngle) => {
    const baseStartAngle = deltaStartAngle - Math.PI / 2;
    const startAngle = baseStartAngle + 2 * Math.PI * i / n - Number.EPSILON;
    const endAngle = baseStartAngle + 2 * Math.PI * (i + 1) / n;

    ctx.beginPath();
    ctx.moveTo(pickerRadius, pickerRadius);
    ctx.arc(pickerRadius, pickerRadius, pickerRadius, startAngle, endAngle);
    ctx.closePath();

    ctx.fillStyle = color;
    ctx.globalAlpha = .75;
    ctx.fill();

    ctx.save();
    ctx.translate(pickerRadius, pickerRadius);
    ctx.rotate((startAngle + endAngle) / 2 + Math.PI / 2);
    ctx.font = "bold 19px Segoe UI";
    ctx.fontWeight = 600;
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    // ctx.fillRect(-25, - 3 * pickerRadius / 4 - 16, 50, 22);
    // ctx.fillStyle = '#111';
    ctx.fillText(dev, 0, - 3 * pickerRadius / 4);
    ctx.restore();
}

/**
 * Draw the rule to pick a developer and the circle at the center of the wheel.
 */
const drawPickerRule = () => {
    ctx.beginPath();
    ctx.arc(pickerRadius, pickerRadius, 6, 0, 2 * Math.PI);
    ctx.closePath();

    ctx.fillStyle = '#333';
    ctx.fill();

    ctx.strokeStyle = '#333';
    ctx.beginPath();
    ctx.moveTo(pickerRadius, pickerRadius);
    ctx.lineTo(pickerRadius, 0);
    ctx.stroke();
}

/**
 * Create a diagram for developers
 * in the corresponding area.
 * @param {string[]} devList List of developer's trigram.
 * @param {number} deltaStartAngle Adds a start angle offset to rotate the wheel.
 */
const createDiagram = (devList, deltaStartAngle = 0) => {
    const nbDevs = devList.length;
    devList.forEach((dev, i) => {
        const index = i;//(i * 7) % COLORS.length;        
        drawCircularArea(i, getDevName(dev), nbDevs, COLORS[index], deltaStartAngle);
    });
}

/**
 * Redraw the whole canvas (wheel / dev trigrams / picker).
 * @param {string[]} devList List of developer trigrams.
 * @param {number} deltaStartAngle Delta start angle for the wheel.
 */
const redrawAll = (devList, deltaStartAngle = 0) => {
    ctx.clearRect(0, 0, pickerRadius * 2, pickerRadius * 2);
    createDiagram(devList, deltaStartAngle);
    drawPickerRule();
}


//#region Dev utilities
let colorIndex = 0;
const fonts = ['ancient', 'romantice', 'magic-retro', 'xantegrode-signature', 'typewriter']
const colors = ['green', 'yellow', 'orange', 'red', 'pink', 'blue', 'white'];
const setDevAsCurrent = dev => {
    const txtDevCurrent = document.getElementById('txtDevCurrent');
    explodeParticles(dev.tab, 'white');
    txtDevCurrent.textContent = `${getDevName(dev.trigram)}`;
    currentTeam[dev.trigram].done = true;
    selectedDev = dev;
    startDevTimer(dev.trigram);
    document.title = `${dev.trigram} - Scrum picker`;
}

var countdown;
stopTimer = false;
const startCountDown = () => {
    var countDownDate = addMinutes(new Date(), 15).getTime();
    // Update the count down every 1 second
    var countdown = setInterval(function () {
        // Get today's date and time
        var now = new Date().getTime();
        // Find the distance between now and the count down date
        var distance = countDownDate - now;
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTime(minutes, seconds);
        stopTimer = stopTimer | (minutes === 0 && seconds === 0);
        if (stopTimer) {
            clearInterval(countdown);
        }
    }, 1000);
}
const addMinutes = (date, minutes) => {
    return new Date(date.getTime() + minutes * 60000);
}
const devSpeakingTime = {};
const startDevTimer = (dev) => {
    devSpeakingTime[dev] = new Date();
}
const stopDevTimer = (dev) => {
    if (dev == null) {
        return;
    }
    var endDate = new Date();
    var distance = endDate.getTime() - devSpeakingTime[dev.trigram].getTime();
    var container = document.querySelector(`.label[id="${dev.trigram}"]`);
    var timeDiv = document.createElement('span');
    currentTeam[dev.trigram].time = distance;
    timeDiv.classList.add('time-speaking');
    timeDiv.appendChild(document.createTextNode(dateTostring(distance)));
    container.after(timeDiv)
}
const dateTostring = (distance) => {
    // Time calculations for days, hours, minutes and seconds        
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    // Display the result in the element with id="demo"
    let txt = '';
    if (minutes > 0) {
        txt = `${minutes}m `;
    }
    txt += `${seconds}s`;
    return txt;
}
/**
 * Run the wheel and pick a developer.
 */
var isPicking = false;
const pickDev = () => {
    if (isPicking) {
        return;
    }
    isPicking = true;
    stopTimer = false;
    //generate list of dev to pick, who are presend and not done
    let devsToPick = Object.entries(currentTeam).filter(e => e[1].present && !e[1].done).map(v => v[1]);
    let allDevs = Object.entries(currentTeam).filter(e => e[1].present).map(v => v[1]);

    //si aucun dev n'as commencé, starCountDown
    if (devsToPick.length === allDevs.length) {
        startCountDown();
    }


    if (devsToPick.length === 0) {

        rewardUser();

        const btn = document.getElementById('btnPick');
        if (btn.getAttribute('fini') === 'finito') {
            const txtDevCurrent = document.getElementById('txtDevCurrent');
            txtDevCurrent.textContent = null;
            const img = document.createElement('img');
            img.src = './images/fuck.png';
            img.style.width = '150px';
            txtDevCurrent.after(img);
            btn.disabled = true;
            return;
        }
        else {
            stopDevTimer(selectedDev);
        }
        btn.setAttribute('fini', 'finito')

        isPicking = false;
        stopTimer = true;
        return;
    }
    stopDevTimer(selectedDev);

    if (devsToPick.length === 1) {
        isPicking = false;
        updateCurrentDev(devsToPick[0]);
        setDevAsCurrent(devsToPick[0]);
        return;
    }
    let isStopped = false;
    const t = allDevs.length * 3
    const totalSteps = Math.floor(rand(t, t + allDevs.length));
    let currentStep = 0;
    const pointMap = generatePointMap(totalSteps, 3500)
    let devIndex = 0;
    let colorIndex = 0;
    const pickDevInterval = () => {
        if (isStopped) {
            isPicking = false;
            updateCurrentDev(devsToPick[devIndex]);
            setDevAsCurrent(devsToPick[devIndex]);
        } else {
            devIndex = (devIndex + 1) % devsToPick.length;
            updateCurrentDev(devsToPick[devIndex]);

            const txtDevCurrent = document.getElementById('txtDevCurrent');
            txtDevCurrent.setAttribute('data-color', colors[colorIndex]);
            colorIndex = (colorIndex + 1) % colors.length;

            const prevTime = pointMap[currentStep];
            const nextTime = pointMap[currentStep + 1];
            const interval = prevTime - nextTime;
            currentStep++;
            isStopped = currentStep === totalSteps - 1;

            setTimeout(pickDevInterval, interval);
        }
    };
    pickDevInterval();

}

function easeOutQuad(t) {
    return t * (2 - t);
}

function rewardUser() {
    //get the least speaking dev
    let leastSpeakingDev = null;
    let leastSpeakingTime = Number.MAX_VALUE;
    Object.entries(currentTeam).forEach(([trigram, dev]) => {
        if (dev.time < leastSpeakingTime && dev.present) {
            leastSpeakingTime = dev.time;
            leastSpeakingDev = dev;
        }
    });

    //reward the dev
    leastSpeakingDev.tab.classList.add('winner');
}

function generatePointMap(count, length) {
    const pointMap = [];
    i = count;

    while (i > 0) {
        let x = i / count;
        let y = easeOutQuad(x) * length;
        pointMap.push(y);
        i--;
    }
    return pointMap;

}

// Utility function to clear the 'selected' class from all developer list items
function clearSelectedDevs() {
    document.querySelectorAll('.dev.column li.selected').forEach(li => {
        li.classList.remove('selected');
    });
}
// Function to update the UI for the current developer
function updateCurrentDev(dev) {
    const txtDevCurrent = document.getElementById('txtDevCurrent');
    const fontIndex = getRandomInt(fonts.length);
    const font = fonts[fontIndex];

    clearSelectedDevs();
    txtDevCurrent.setAttribute('data-font', font);
    txtDevCurrent.textContent = dev.trigram;
    dev.tab.classList.add('selected');
}

const toPascalCase = (sentence) => sentence
    .split(' ')
    .map(word => word[0]
        .toUpperCase()
        .concat(word.slice(1)))
    .join('');

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
const getDevName = (dev) => {
    if (dev.toLowerCase() === 'mbo')
        return 'Chaton';
    return dev;
}
//#endregion


const resetPicker = () => {
    stopTimer = true;
    devList = getDevList();
    remainingDevs = [...devList];
    pickedDevs = [];

    currentTeam = teams[0].devs;
    initDevList();
    document.title = `Scrum dev picker`;
    // redrawAll(remainingDevs);
    setTime('15', '0');
    if (typeof lists !== 'undefined') {
        lists = [];
    }
    document.querySelectorAll('.dev.column li.selected').forEach(li => {
        li.classList.remove('selected')
    })
}

const captureKey = evt => {
    if (evt.key === 'Enter')
        $('btnPick').click();
}

/**
 * Register events for the page.
 */
const initEvents = () => {
    $('btnPick').addEventListener('click', pickDev);
    $('btnReset').addEventListener('click', () => document.location.reload());
    $('btnAdd').addEventListener('click', addDev);
    document.addEventListener('keypress', captureKey);
}

function addDev() {
    let name = prompt("Who are we adding?");
    if (name === null) {
        return;
    }
    name = name.toLowerCase();
    if (name.length === 0) {
        return;
    }
    currentTeam[name] = { 'trigram': name, 'name': toPascalCase(name), 'present': true, 'tab': null, 'done': false, 'time': 0 };
    initDevList();
}

const initCauchyStatus = () => {
    fetch(`${apiUrl}/branch/status`,
        {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(r => r.json())
        .then(s => {
            const img = document.getElementById('cauchyStatusImg');
            let icon = 'locked'
            if (s === true) {
                icon = 'opened'
            }
            img.setAttribute('src', `images/delorean-${icon}.png`);
            img.classList.remove('hidden')
        })
}
/**
 * Start point of the application.
 */
const init = () => {
    myminute = jQuery(".clock .flipper:nth-child(1) div:not(.new) .text");
    mysecond = jQuery(".clock .flipper:nth-child(2) div:not(.new) .text");
    initDevList();
    resetPicker();
    initEvents();
}
init();


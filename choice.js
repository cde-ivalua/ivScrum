// const apiUrl = 'https://iv-scrum-api.herokuapp.com';
// const apiUrl = 'https://localhost:5001'
const DccReminder = () => {
    const CCtab = document.querySelector('.tab.selected[data-team-id="2b139375-8dda-40ae-94d9-c4d58713ac91"]');
    const txt = document.getElementById('txtDevCurrent');
    if (!CCtab){
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
       //"trelloId": "6180fec4c1f0071005db2e8c",
       "trelloId": "NU3JyLTu",
       "devs": [
           { "trigram": "afo", "name": "Antonin", "trello": "617a5c4c59490938673593f0" },      
           { "trigram": "cda", "name": "Christophe", "trello": "5721daa1b7364971e546197a" }, 
           { "trigram": "hro", "name": "Hugo", "trello": "" },                               
           { "trigram": "ksi", "name": "Kaka", "trello": "633d8f1ea46007042dc1269c" },      
           { "trigram": "cde", "name": "Kiki", "trello": "5e69fb8126f1b17a8b9e282b" }, 
           { "trigram": "mil", "name": "Michael", "trello": "61828a4b9c03d460e173385e" },
           { "trigram": "nmi", "name": "Nicolas", "trello": "52933ef71af028a5410087b3" },            
           { "trigram": "pst", "name": "Philippe", "trello": "57357594b69d9fd7e3cf8037" },            
           { "trigram": "skf", "name": "Salim", "trello": "62dfa8865f56db0ad39af728" },            
           { "trigram": "vml", "name": "Vincent", "trello": "6182a222015f9d30b7ae7620" },  

       ]
   }
]
const getTeam = () => {
    const tab = document.querySelector('.selected.tab');
    if (!tab){
        return teams[0].name;
    }
    const id = tab.getAttribute('data-trello-id');
    const team = teams.find(e => e.id === id);
    return team.name;
}
const getStorageItem = (key) => {
    return localStorage.getItem(key);
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
        devs.forEach(e => { 
            const li = document.createElement('li');
            li.setAttribute('data-user-id', e.trello);            
            const div = document.createElement('div');
            div.classList.add('label');
            div.setAttribute('id', e.trigram);
            const label = document.createElement('label');
            label.classList.add('name-label');
            label.setAttribute('for', e.trigram);
            label.textContent = e.name;
            const chk = document.createElement('input');
            chk.setAttribute('value', e.trigram);
            chk.setAttribute('id', e.trigram);
            chk.setAttribute('data-user', e.id);
            chk.setAttribute('type', 'checkbox');
            chk.checked = e.here;   
            chk.addEventListener('change', chkChangeHandler)
            li.append(div);
            div.append(label);
            // li.append(chk);
            ul.append(li);
        })
    });    
   }
const chkChangeHandler = (e) => {
    const target = e.target,
    id = target.getAttribute('data-user');
    const data = new FormData();
    data.append('here', target.checked);
    const myHeaders = new Headers();
    myHeaders.set('Accept', 'application/json'); 
    fetch(`${apiUrl}/user/${id}/here`, 
    {
        method: 'POST',
        headers: myHeaders,
        body: data
    });
}
//#region Constants
const SQRT_PI = Math.sqrt(Math.PI);
const COLORS = ['#6867AC', '#A267AC', '#CE7BB0', '#FFBCD1', '#705089', '#A267AC', '#CE7BB0', '#ef628c', '#a83f5d','#af1642'];
//#endregion

//#region Global variables
let pickerRadius;
let devList = [];
let remainingDevs = [];
let pickedDevs = [];
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

/**
 * Rotate the wheel.
 * @param {number} timestamp Current timestamp (provided by rAF).
 * @param {*} initialSpeed Initial wheel's rotating speed.
 * @param {*} deceleration Wheel's deceleration.
 */
const rotateWheel = (timestamp, initialSpeed, deceleration) => {
    if (typeof startTimestamp === 'undefined')
        startTimestamp = timestamp;

    const elapsedTime = (timestamp - startTimestamp) / 1000;
    const sqrtDeceleration = Math.sqrt(deceleration);
    const offsetAngle = initialSpeed * SQRT_PI * erf(sqrtDeceleration * elapsedTime) / (2 * sqrtDeceleration);

    // Refresh the diagram at the new angle + the picker
    redrawAll(remainingDevs, offsetAngle);

    const currentSpeed = initialSpeed * Math.exp(-deceleration * elapsedTime * elapsedTime);

    // If the wheel is about stopped, we exit
    if (currentSpeed < 0.2) {
        startTimestamp = undefined;

        const rotatedAngleNormalized = offsetAngle % (2 * Math.PI);

        const iDev = remainingDevs.length - 1 - Math.floor(Math.abs(rotatedAngleNormalized * remainingDevs.length / (2 * Math.PI)));
        setDevAsCurrent(remainingDevs[iDev]);

        return;
    }

    window.requestAnimationFrame(timestamp => rotateWheel(timestamp, initialSpeed, deceleration));
}
//#endregion


//#region Dev utilities
let colorIndex = 0;
const fonts = ['ancient', 'romantice', 'magic-retro', 'xantegrode-signature', 'typewriter']
const colors = ['green', 'yellow', 'orange', 'red', 'pink', 'blue', 'white'];
const setDevAsCurrent = dev => {
    if(pickedDevs.length){
        stopDevTimer(pickedDevs[pickedDevs.length - 1]);
    }
    const txtDevCurrent = document.getElementById('txtDevCurrent');
    txtDevCurrent.textContent = `${getDevName(dev)}`;
    const iDev = remainingDevs.indexOf(dev);
    remainingDevs.splice(iDev, 1);
    pickedDevs.push(dev);
    startDevTimer(dev);
    document.title = `${dev} - Scrum picker`;
}

const updateDevListsIfRequired = () => {
    const newDevList = getDevList();
    const result = compareArrays(devList, newDevList);

    // If they are identical, that's ok, we continue
    if (result.areIdentical)
        return;

    // Else, we first update the current dev list with the new one.
    replaceArrayInplace(devList, newDevList);

    // Then we update the remainingDevs list
    for (const added of result.addedItems)
        remainingDevs.push(added);

    for (const removed of result.removedItems) {
        const idx = remainingDevs.indexOf(removed);
        if (idx > -1)
            remainingDevs.splice(idx, 1);
    }

    addMessage('List correctly updated', 'success');
}
var countdown;
stopTimer = false;
const startCountDown =() => {
    var countDownDate = addMinutes(new Date(), 15).getTime();
    // Update the count down every 1 second
    var countdown = setInterval(function() {
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
    return new Date(date.getTime() + minutes*60000);
}
const devSpeakingTime = {};
const startDevTimer = (dev) => {
    devSpeakingTime[dev] = new Date();
}
const stopDevTimer = (dev) => {
    var endDate = new Date();
    var distance = endDate.getTime() - devSpeakingTime[dev].getTime();
    var container = document.querySelector(`.label[id="${dev}"]`);   
    var timeDiv = document.createElement('span');  
    timeDiv.classList.add('time-speaking'); 
    timeDiv.appendChild(document.createTextNode(dateTostring(distance)));
    container.after(timeDiv)
}
const dateTostring = (distance) => {
    // Time calculations for days, hours, minutes and seconds        
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    // Display the result in the element with id="demo"
    return  minutes + "m" + seconds + "s ";
}
/**
 * Run the wheel and pick a developer.
 */
const pickDev = () => {
    stopTimer = false;
    // First, check if the list has been changed since the last run
    updateDevListsIfRequired();
    // No remaining dev to pick -> we do nothing
    if (remainingDevs.length === 0) {
        const btn = document.getElementById('btnPick');
        if (btn.getAttribute('fini') === 'finito'){
            const txtDevCurrent = document.getElementById('txtDevCurrent');
            txtDevCurrent.textContent = null;
            const img = document.createElement('img');
            img.src = './assets/icons/fuck.png';
            img.style.width = '150px';
            txtDevCurrent.after(img);
            btn.disabled = true;
            return;
        }
        btn.setAttribute('fini', 'finito')
        stopDevTimer(pickedDevs[pickedDevs.length - 1]);
        stopTimer = true;        
        return;
    }
    // If wheel is rotating, waiting for completion
    if (typeof startTimestamp !== 'undefined') {
        addMessage('The wheel is always rotating, please wait...', 'warning');
        return;
    }
    if (pickedDevs.length === 0){
        startCountDown();
    }        
    if (remainingDevs.length === 1) {
        // redrawAll(remainingDevs, Math.PI);
        setDevAsCurrent(remainingDevs[0]);
        return;
    }    
    let stop = false;
    setTimeout(() => {
        stop = true;
    }, 3500);
    let i = 0;      
    const pickDevInterval = setInterval(() => {
        document.querySelectorAll('.dev.column li.selected').forEach(li => {
            li.classList.remove('selected')
        });
        const fi = getRandomInt(fonts.length);
        const f = fonts[fi];        
        const txtDevCurrent = document.getElementById('txtDevCurrent');
        txtDevCurrent.setAttribute('data-font', f);
        txtDevCurrent.textContent = toPascalCase(remainingDevs[i]);
        document.getElementById(remainingDevs[i]).closest('li').classList.add('selected');
        if (stop){                        
            document.getElementById(remainingDevs[i]).closest('li').classList.add('selected');
            setDevAsCurrent(remainingDevs[i]);            
            clearInterval(pickDevInterval);            
        }
        else {                                                                        
            txtDevCurrent.setAttribute('data-color', colors[colorIndex]);
            colorIndex++;
            if (colorIndex === colors.length){
                colorIndex = 0;
            }
            i = getRandomInt(remainingDevs.length);
        }
    }, 200);    
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
    $('btnReset').addEventListener('click', resetPicker);    
    document.addEventListener('keypress', captureKey);
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
        if (s === true){
            icon = 'opened'
        }
        img.setAttribute('src', `assets/icons/delorean-${icon}.png`);
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


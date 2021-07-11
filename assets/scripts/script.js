/* variables needed for gameSetup() */

const svgNS = "http://www.w3.org/2000/svg"
let xCoord;
let yCoord;
let coordList = []; /* array will contain previously used coords formatted as a string with / between X and Y coords eg: ["28/74","134/42"] */
let circles = 6; /* determines how many circles will be drawn. set to 6 for now, will be automated later */
let counter; /* counter used for keeping track of how many circles have been drawn. initializing here to expand scope */
let width; /* initializing vh and vw variables to expand scope */
let height;
let gameRunning = false;

/* variables needed for gameStart() */

let currentCircle;
let record = 0;

/* variables needed for historySetup() */
let dailyAttempts = 0; /* initializing variable for history tab */
let dailyRecord = 0;
let today = new Date();
let localDate = JSON.stringify(today.toISOString().slice(0,10));
let currentHistory = [];

/* functions needed for gameSetup */

function addNumber() { /* Add relevant number to the circle elements based on the coords in the array and their index. */
    coordList.forEach(function(coords, index) {
        let coordPair = coords.split("/"); /* Take current coord pair, number before / is first in array, number after / is second in array */
        let num = document.createElementNS(svgNS, "text");
        if(index+1 < 10) {
            num.setAttribute("x", parseInt(coordPair[0])-5);
        } else {
            num.setAttribute("x", parseInt(coordPair[0])-9); /* Adjust x coordinate to take double digits into consideration */
        }
        num.setAttribute("y", parseInt(coordPair[1])+5);
        num.innerHTML = index + 1;
        $("#game-area").append(num);
    })
}

function drawCircles() { /* Draw circle elements inside SVG */ 
                        /* Code is a slightly modified version of code found on riptutorials.com (link in readme) */
    coordList.forEach(function(coords) {
        let coordPair = coords.split("/"); /* Take current coord pair, number before / is first in array, number after / is second in array */
        let circle = document.createElementNS(svgNS, "circle"); 
        circle.setAttribute("fill", "white");
        circle.setAttribute("cx", coordPair[0]); /* set x coord of circle's center to randomly generated x coord, relative to the svg element's top-left corner */
        circle.setAttribute("cy", coordPair[1]); /* set y coord of circle's center to randomly generated y coord, relative to the svg element's top-left corner */
        circle.setAttribute("r", 20); /* set circle radius to 20px */
        $("#game-area").append(circle);
    })
}

function addToArray() { /* Add coords to array after checking for collision */
    coordList.push(xCoord.toString() + "/" + yCoord.toString());
}

function collisionCheck() { /* Check for collision between new coords and existing coords in array */
    let col = false; /* initialize as FALSE to show no collision by default (needed for first coords) */
    coordList.forEach(function(coords) {
        let oldCoords = coords.split("/"); /* refresher on split function taken through w3schools.com */
        if ((xCoord >= (parseInt(oldCoords[0]) - 45)) && (xCoord <= (parseInt(oldCoords[0]) + 45)) && (yCoord >= (parseInt(oldCoords[1]) - 45)) && (yCoord <= (parseInt(oldCoords[1]) + 45))) { 
            /* This if was made by tweaking the temporary check that can be found in my js psuedo file */
            col = true;
            return col;
        }
    })
    return col;
}

function createCoords() { /* Generate coords to determine center point of circle elements */
    xCoord = Math.floor(Math.random() * (width - 40) + 20);
    yCoord = Math.floor(Math.random() * (height - 40) + 20);
}


/* functions needed for gameStart() */

function checkRecord() {
    if(circles > record) {
        record = circles;
        $("#record").html(record);
    }
    if(circles > dailyRecord) {
        dailyRecord = circles;
    }
}

function finishLevel() {
    alert("Congrats, you did it!");
    checkRecord();
    circles++;
    gameStop();
    checkRunning();
}

function gameStop() {
    $("circle").remove();
    $("text").remove();
    gameRunning = false;
    coordList = [];
}

function incrementCircle() {
    $("text").eq(currentCircle).show(); 
    currentCircle++;
}

function checkCircle(event) {
    if ($("circle").index(event.target) == currentCircle) {
        incrementCircle();
        if (currentCircle === circles) { 
            setTimeout(finishLevel,20); /* without setTimeout, the number in the last circle will not become visible on click in most cases */
        }
    } else {
        alert("Oops, you missed it!");
        circles = 6
        gameStop();
    }
}


/* localstorage functions */

function checkStorage() { /* check if localStorage has data for today */
    if (localStorage.getItem("history")) { /* TODO adjust check based on new localstorage format */
        let history = JSON.parse(localStorage.getItem("history"));
        for (let dailyData of history) {
            if (dailyData[0] === localDate) {
                dailyAttempts = parseInt(dailyData[1]);
                dailyRecord = parseInt(dailyData[2]);
                break;
            }
        }
    }
    if (localStorage.getItem("record")) {
        record = localStorage.getItem("record");
    }
} /* TODO add theme check once implemented */

function updateRecord() {
    if (!localStorage.getItem("record") || localStorage.getItem("record") < record) {
        localStorage.setItem("record", record);
    }
}

function updateHistory() {
    if (localStorage.getItem("history")){
        currentHistory = JSON.parse(localStorage.getItem("history"));
        if (currentHistory[currentHistory.length-1][0] === localDate) {
            currentHistory.pop();
        }
    }
    currentHistory.push([localDate,dailyAttempts,dailyRecord]);
    localStorage.setItem("history", JSON.stringify(currentHistory));
}

function getLocalStorageStatus() { /* taken from dev.to/zigabrencic (full link in acknowledgements) */
    try {
        // try setting an item
        localStorage.setItem("test", "test");
        localStorage.removeItem("test");
    }
    catch(e)
    {   
        // browser specific checks if local storage was exceeded
        if (e.name === "QUATA_EXCEEDED_ERR" // Chrome
            || e.name === "NS_ERROR_DOM_QUATA_REACHED" //Firefox/Safari
        ) {
            // local storage is full
            return false;
        } else {
            try{
                if(localStorage.remainingSpace === 0) {// IE
                    // local storage is full
                    return false;
                }
            }catch (e) {
                // localStorage.remainingSpace doesn't exist
            }

            // local storage might not be available
            return false;
        }
    }   
    return true;
}


/* functions needed to swap pages */

function initGame() {
    $(".main-content").html(`
        <div class="row" id="button-row">
            <button id="start-game">Start</button>
            <button id="history">History</button>
        </div>
        <svg id="game-area"></svg>
        <p id="score-text">Highest achieved number: <span id="record">${record}</span></p>
        `
    );
    historyClick();
    startClick();
}

function initHistory() {
    $(".main-content").html(`
        <div class="row" id="button-row">
            <div class="dropdown periodic">
                <button class="btn btn-dark dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Day
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <li class="dropdown-item active" id="day">Day</li>
                    <li class="dropdown-item" id="week">Week</li>
                    <li class="dropdown-item" id="month">Month</li>
                </div>
            </div>
            <button id="game">Game</button>
        </div>
        <canvas id="chart-area"></canvas>
        `
    );
    gameClick();
    periodicClick();
}

/* function callers */

function checkRunning() {
    if(!gameRunning) {
        gameSetup(circles);
        if(circles === 6) {
            dailyAttempts++;;
        }
    } else {
        alert("A game has already been started, please finish the game before starting a new one.");
    }
}

function gameSetup(circles) { /* main function that calls other functions in order when setting up the game */
    width = $("#game-area").width();
    height = $("#game-area").height();
    for (counter = 1; counter <= circles; counter++) {
        createCoords();
        if (collisionCheck()) {
            --counter;
        } else {
            addToArray();
        }   
    }
    drawCircles();
    addNumber();
    setupGameClick();
    gameRunning = true;
}

function gameStart() { /* main function that calls other functions in order when player is ready to attempt a solve */
    $("circle").first().unbind();
    $("text").first().unbind();
    currentCircle = 1
    $("text").not(":first()").hide(); /* Hide all numbers except the first */
    startGameClick();
}

/* Event listeners */

function startClick() {
    $("#start-game").click(function() { /* start game event listener */
        checkRunning();
    })
}

function historyClick() {
    $("#history").click(function() {
        initHistory();
    })
}

function gameClick() {
    $("#game").click(function() {
        initGame();
    })
}

function setupGameClick() { /* add event listener to 1st circle and number */
    $("circle").first().css("cursor","pointer").click(function() { /* Add click listener to circle with number 1 to start the game */
        gameStart();
    })
    $("text").css("font-weight","bold").first().css("cursor","pointer").click(function() { /* Add click listener to number 1 to start the game, this will cover the entire circle, instead of the circle excluding the number */
        gameStart();
    })
}

function startGameClick() {
    $("circle").not(":first()").css("cursor","pointer").click(function(event) { /* add event listeners to all circles except the first after the first has been clicked */
        checkCircle(event);
    })
}

function periodicClick() {
    $(".periodic .dropdown-menu .dropdown-item").click(function() {
        $(".periodic button").html($(this).html());
        $(".periodic .dropdown-menu .dropdown-item").removeClass("active");
        $(this).addClass("active");
        /* TODO add function to setup graph based on periodicity in dropdown (look into chartjs) */
    })
}

function pageClose() { /* update history and record upon closing the page */
    window.addEventListener("beforeunload", function() {
        if (localStorage){
            updateHistory();
            updateRecord();
        }
    });
}

$(document).ready(function() { /* call functions to initialize all needed variables based on history, and update html */
    if (!getLocalStorageStatus()) {
        alert("It appears your localStorage is unavailable, or full. This page uses localStorage to store previous records and a full play history but is not required to play.");
    }
    checkStorage(); 
    initGame();
    pageClose();
});
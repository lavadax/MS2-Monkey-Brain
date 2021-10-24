// Variables needed for gameSetup()

const svgNS = "http://www.w3.org/2000/svg";
let xCoord;
let yCoord;
/* Array will contain previously used coords formatted as a string 
with / between X and Y coords eg: ["28/74","134/42"] */
let coordList = []; 
let circles = 5; // determines how many circles will be drawn.
let width; // initializing vh and vw variables to expand scope
let height;
let gameRunning = false;

// Variables needed for gameStart()

let currentCircle;
let record = 0;

// Variables needed for historySetup()

let dailyAttempts = 0; // Initializing variable for history tab
let dailyRecord = 0;
// Storing current date as string to compare to dates extracted from localStorage
let localDate = new Date().toISOString().slice(0,10);
let hist = [];
let limit;
let weeks;
let months;
let labels;
let attempts;
let records;
let myChart;
let theme;

// Functions needed for gameSetup

// Add relevant number to the circle elements based on the coords in the array and their index.
function addNumber() { 
    coordList.forEach(function(coords, index) {
        // Split X and Y coordinates
        let coordPair = coords.split("/");
        // Add new text SVG element containing the number matching the circle
        let num = document.createElementNS(svgNS, "text");
        // Determine x coordinate offset based on single or double digit number
        if (index+1 < 10) {
            num.setAttribute("x", parseInt(coordPair[0])-5);
        } else {
            num.setAttribute("x", parseInt(coordPair[0])-9);
        }
        // Add Y coordinate
        num.setAttribute("y", parseInt(coordPair[1])+5);
        // Add number based on the index in the coordlist
        num.innerHTML = index + 1;
        // Add number to the SVG element
        $("#game-area").append(num);
    });
}

// Draw circle elements inside the SVG element
function drawCircles() { 
    // Code is a slightly modified version of code found on riptutorials.com (link in readme)
    coordList.forEach(function(coords) {
        let coordPair = coords.split("/");
        // Create new circle SVG element
        let circle = document.createElementNS(svgNS, "circle");
        // Add required SVG attributes (styling, coordinates, radius)
        circle.setAttribute("fill", "white");
        circle.setAttribute("cx", coordPair[0]);
        circle.setAttribute("cy", coordPair[1]);
        circle.setAttribute("r", 20);
        // Add circle to the SVG element
        $("#game-area").append(circle);
    });
}

// Check for collision between new coords and existing coords in array
function collisionCheck() {
    // initialize as false to show no collision by default
    let col = false;
    coordList.forEach(function(coords) {
        // Split X and Y coordinates
        let oldCoords = coords.split("/");
        /* This if statement was made by tweaking the temporary check that can be found in my js psuedo file 
        checks if the new X coordinate falls inside any of the older circles
        based on the coordinates of those circles and the 20px radius (+5 px for spacing) */
        let isColliding = (xCoord >= (parseInt(oldCoords[0]) - 45)) && (xCoord <= (parseInt(oldCoords[0]) + 45)) && (yCoord >= (parseInt(oldCoords[1]) - 45)) && (yCoord <= (parseInt(oldCoords[1]) + 45));
        if (isColliding) { 
            col = true;
            return col;
        }
    });
    return col;
}

/* Generate coordinates to determine center of circle elements 
numbers will fall between the confines of the SVG element by using width and height variables*/
function createCoords() {
    xCoord = Math.floor(Math.random() * (width - 40) + 20);
    yCoord = Math.floor(Math.random() * (height - 40) + 20);
}


// Functions needed for gameStart()

/* Check if the newly cleared level is an all-time record
If a new record is achieved, update the variable and html element
If a daily record is achieved, update the variable related to local storage */
function checkRecord() {
    if(circles > record) {
        record = circles;
        $("#record").html(record);
    }
    if(circles > dailyRecord) {
        dailyRecord = circles;
    }
}

/* Notify the player they completed the level
Check if a record is achieved
Increase the current level
Empty the game area
Start new game with increased difficulty */
function finishLevel() {
    alert("Congrats, you did it!");
    checkRecord();
    circles++;
    gameStop();
    checkRunning();
}

// Clear the game field and restart necessary variables
function gameStop() {
    $("circle").remove();
    $("text").remove();
    gameRunning = false;
    coordList = [];
}

/* Show the circle that matches the current circle index
Increment the current circle index */
function incrementCircle() {
    $("text").eq(currentCircle).show(); 
    currentCircle++;
}

// Check if the clicked circle is the next in line based on the index
function checkCircle(event) {
    if ($("circle").index(event.target) == currentCircle) {
        // Increase current circle if correct circle was clicked
        incrementCircle();
        if (currentCircle === circles) {
            /* Without setTimeout, the number in the last circle 
            will not become visible on click in most cases */ 
            setTimeout(finishLevel,20);
        }
        // If wrong circle was clicked, stop the game and notify the user
    } else {
        alert("Oops, you missed it!");
        circles = 5;
        gameStop();
    }
}

// Functions needed for historySetup()

/* Return a date string corresponding to that week's Monday
based on the provided date string */
function calcWeek(date) {
    // Generate new Date object based on provided date string (formatted yyyy-mm-dd)
    let currDate = new Date(parseInt(date.slice(0, 4)),
    parseInt(date.slice(5, 7)) - 1, parseInt(date.slice(8)));
    // Calculating how many days past Monday it is
    let offset = (currDate.getDay() + 6) % 7;
    // Generating new Date object corresponding to the Monday
    let start = new Date(currDate.getTime() - (offset * 86400000));
    // Extracting the mm & dd part of te date
    let monthString = (start.getMonth()+1).toString();
    let dayString = start.getDate().toString();
    // Add leading 0 to any months and dates between 1-9
    switch (monthString.length) {
        case 1:
            monthString = "0".concat(monthString);
            break;
        default:
            break;
    }
    switch (dayString.length) {
        case 1:
            dayString = "0".concat(dayString);
            break;
        default:
            break;
    }
    // Return new date string in yyy-mm-dd format
    return (`${start.getFullYear()}-${monthString}-${dayString}`);
}

/* Calculate if there's at least 7 chartable dates
If not change the amount that will be charted */
function getLimit(period) {
    limit = 7;
    let arrayLength = hist.length-1;
    switch (period) {
        case "Day":
            // If less than 7 recorded days, limit length to amount of recorded days1
            if (hist.length < 7) {
                limit = hist.length;
            }
            break;
        case "Week":
            weeks = [];
            let weekStart;
            // Iterate through localstorage history
            for (let i = arrayLength; arrayLength-i <= arrayLength; i--) {
                // Calculate the monday of the week the date falls in
                weekStart = calcWeek(hist[i][0]);
                /* If the Monday is already recorded, 
                go to the next date, otherwise record it */
                switch (weeks.indexOf(weekStart)) {
                    case -1:
                        weeks.push(weekStart);
                        break;
                    default:
                        break;
                }
                // Break out of loop when 7 weeks are recorded
                if (weeks.length === 7) { 
                    break;
                }
            }
            // Amount of chartable dates = amount of recorded Mondays
            limit = weeks.length;
            break;
        case "Month":
            months = [];
            // Iterate through localstorage history
            for (let i = arrayLength; arrayLength-i <= arrayLength; i--) {
                // Extract yyyy-mm of localstorage history
                let tempMonth = hist[i][0].slice(0,7);
                /* If the month is already recorded, 
                go to the next date, otherwise record it */
                switch (months.indexOf(tempMonth)) {
                    case -1:
                        months.push(tempMonth);
                        break;
                    default:
                        break;
                }
                // Break out of loop when 7 months are recorded
                if (months.length === 7) {
                    break;
                }
            }
            // Amount of chartable dates = amount of recorded months
            limit = months.length;
            break;
        default:
            // Error message in case the period variable is not day, week, or month
            console.log("bug in getLimit() period");
            break;
    }
}

// Extract data from history based on requested data type (index) and period
function getData(index, period) {
    let tempArray = [];
    let arrayLength = hist.length-1;
    switch (period) {
        // If period is day, extract data (attempts and records) without calculations
        case "Day":
            for (let i = arrayLength; arrayLength-i < limit; i--) {
                tempArray.push(hist[i][index]);
            }
            break;
        default:
            // Initialize temparray with 0's depending on how many dates will be charted                                                                                                                                                                                                                            
            for (let i = 0; i < limit; i++) {
                tempArray[i] = 0;
            }
            let arrayIndex;
            // index 1 = attempts, index 2 = records, anything else is an error
            switch(index) {
                case 1:
                    // Iterate through the recorded dates from localstorage
                    for (let i = arrayLength; arrayLength-i <= arrayLength; i--) {
                        // Calculate presence/index of date based on period
                        switch (period) {
                            case "Week":
                                arrayIndex = weeks.indexOf(calcWeek(hist[i][0]));
                                break;
                            case "Month":
                                arrayIndex = months.indexOf(hist[i][0].slice(0,7));
                                break;
                            default:
                                console.log("bug in getData() period");
                                break;
                        }
                        /* If the date is in the array,
                        add that day's attempts to the temporary index,
                        otherwise skip it */
                        switch (arrayIndex) {
                            default:
                                tempArray[arrayIndex] += hist[i][1];
                                break;
                            case -1:
                                break;
                        }
                    }
                    break;
                case 2:
                    // Iterate through the recorded dates from localstorage
                    for (let i = arrayLength; arrayLength-i <= arrayLength; i--) {
                        // Calculate presence/index of date based on period
                        switch (period) {
                            case "Week":
                                arrayIndex = weeks.indexOf(calcWeek(hist[i][0]));
                                break;
                            case "Month":
                                arrayIndex = months.indexOf(hist[i][0].slice(0,7));
                                break;
                            default:
                                console.log("bug in getData() period");
                                break;
                        }
                        /* If the date is in the array,
                        calculate the highest record between the new and old values */
                        switch (arrayIndex) {
                            case -1:
                                break;
                            default:
                                if (hist[i][2] > tempArray[arrayIndex]) {
                                    tempArray[arrayIndex] = hist[i][2];
                                }
                                break;
                        }
                    }
                    break;
                default:
                    // Error message in case the index variable is not 1 or 2
                    console.log("bug in getData() index");
                    break;
            }
            break;
    }
    // Reverse the array to sort the dates from earliest to latest
    return tempArray.reverse();
}

// Setup a chart with data collected through getLimit() and getData()
function setupChart() {
    // Delete pre-existing chart
    if (myChart) {
        myChart.destroy();
    }
    let configData = {
        // Set type to scatter so chart can contain both a line and bar chart
        type: "scatter",
        data: {
            labels: labels,
            datasets: [{
                type: "line",
                label: "Record",
                data: records,
                borderColor: "rgb(175,12,12)"
            }, {
                type: "bar",
                label: "Attempts",
                data: attempts,
                backgroundColor: "rgba(12,12,125,0.8)",
                borderColor: "rgb(12,12,125)",
                borderWidth: 3
            }]
        },
        options: {
            scales: { 
                y: {
                    beginAtZero: true,
                    grid: {
                        borderColor: "#354045",
                        color: "#354045"
                    },
                    ticks: {
                        color: "#354045"
                    }
                },
                x: {
                    // type needs to be explicit when using categories and specifying tick color
                    type: "category",
                    ticks: {
                        color: "#354045"
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: "#354045"
                    }
                }
            }
        }
    };
    myChart = new Chart($("#chart-area"),configData);
}

// Fill chart area with text if no previous games are recorded
function noGames() {
    let c = $("#chart-area")[0];
    let ctx = c.getContext("2d");
    ctx.font = "24px Helvetica";
    ctx.fillText("Please play a game first", 10, 50);
}

// Localstorage functions

// Extract localstorage history item into history variable
function getHistory() {
    if (localStorage.getItem("history")) {
        hist = JSON.parse(localStorage.getItem("history"));
    }
}

// Extract localstorage theme into theme variable, or set as default if it doesn't exist
function getTheme() {
    if (localStorage.getItem("theme")) {
        theme = localStorage.getItem("theme");
    } else {
        theme = "default";
    }
}

// Apply theme to html elements
function addTheme(theme) {
    let elemList = ["body","header","#settings-button","#theme-button","#help-button",".main-content","footer"];
    if ($("#history").length) {
        elemList.push("#start-game","#history","#game-area");
    } else if ($("#game").length) {
        elemList.push(".periodic","#game","#chart-area");
    }
    elemList.forEach(function(item, index, arr) {
        $(arr[index]).removeClass("default dark").addClass(theme);
    });
    // Update localstorage theme item
    updateTheme();
}

// Check if localStorage has data for today & apply theme
function checkStorage() {
    getHistory();
    getTheme();
    addTheme(theme);
    if (hist && hist.length > 0) {
        if (localStorage.getItem("record")) {
            record = localStorage.getItem("record");
        }
        for (let dailyData of hist) {
            // Update record if daily record is higher (extra check for import)
            if (dailyData[2] > record) {
                record = dailyData[2];
            }
            /* If data for today exists,
            update daily vars based on previous data, otherwise keep as 0 */
            if (dailyData[0] === localDate) {
                dailyAttempts = parseInt(dailyData[1]);
                dailyRecord = parseInt(dailyData[2]);
                break;
            }
        }
        // Return value is used to check whether intro.js should autorun or not
        localStorage.setItem("record", record);
        return false;
    } else {
        return true;
    }
} 

// Update localstorage record item if new record is higher than old record
function updateRecord() {
    if (!localStorage.getItem("record") || localStorage.getItem("record") < record) {
        localStorage.setItem("record", record);
    }
}

// Update localstorage history item
function updateHistory() {
    getHistory();
    // Check if localstorage history item exists and has at least 1 entry
    if (hist && hist.length){
        // Check if latest history item is from today
        if (hist[hist.length-1][0] === localDate) {
            hist.pop();
        }
    }
    // Add today's data to history variable, which gets placed in localstorage
    hist.push([localDate,dailyAttempts,dailyRecord]);
    localStorage.setItem("history", JSON.stringify(hist));
}

// Update localstorage theme item
function updateTheme() {
    localStorage.setItem("theme",theme);
}

/* Taken from dev.to/zigabrencic (full link in acknowledgements)
Add and remove a localstorage item & catch any potential errors */
function getLocalStorageStatus() {
    try {
        // Try setting an item
        localStorage.setItem("test", "test");
        localStorage.removeItem("test");
    }
    catch(e)
    {   
        // Browser specific checks if local storage was exceeded
        if (e.name === "QUATA_EXCEEDED_ERR" // Chrome
            || e.name === "NS_ERROR_DOM_QUATA_REACHED" //Firefox/Safari
        ) {
            // Local storage is full
            return false;
        } else {
            try{
                if(localStorage.remainingSpace === 0) {// IE
                    // Local storage is full
                    return false;
                }
            }catch (e) {
                // localStorage.remainingSpace doesn't exist
            }

            // Local storage might not be available
            return false;
        }
    }   
    return true;
}

// Functions needed to swap pages

// Initialize game page with correct buttons and svg element
function initGame() {
    $(".main-content").html(`
        <div class="row" id="button-row">
            <button id="start-game">Start</button>
            <button id="history">History</button>
        </div>
        <svg id="game-area"></svg>
        <p id="score-text">Highest achieved number:&nbsp;<span id="record">${record}</span></p>
        `
    );
    // Set up event listeners & apply theme
    historyClick();
    startClick();
    addTheme(theme);
}

// Initialize history page with correct buttons and canvas
function initHistory() {
    $(".main-content").html(`
        <div class="row" id="button-row">
            <div class="dropdown periodic">
                <button class="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Day
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item active" id="day">Day</a>
                    <a class="dropdown-item" id="week">Week</a>
                    <a class="dropdown-item" id="month">Month</a>
                </div>
            </div>
            <button id="game">Game</button>
        </div>
        <canvas id="chart-area"></canvas>
        <p id="score-text">Highest achieved number:&nbsp;<span id="record">${record}</span></p>
        `
    );
    // Set up event listeners & apply theme
    gameClick();
    periodicClick();
    addTheme(theme);
}

// introJS functions

// Start the game intro for new users, or previous users that want a reminder
function startIntro() {
    introJs().setOptions({
        steps: [{
            title: "Welcome",
            intro: "On this site you can test how good your memory is. I will quickly show you how to proceed"
        }, { 
            element: document.querySelector("#help-button"),
            intro: "If at any point you'd like to view this intro again, please click the help button"
        }, {
            element: document.querySelector("#start-game"),
            intro: "You can start the game by clicking on the start button"
            // gameSetup() is run now
        }, {
            element: document.querySelector("#game-area"),
            intro: "This will generate a number of circles in the game area, depending on the level you're on"
        }, {
            element: document.querySelector("#game-area"),
            intro: "Take your time to memorize what position the circles are in, starting at number 1 and going up one by one"
        }, {
            element: document.querySelector("#game-area"),
            intro: "Once you're ready to start, click on number 1 (We'll do this for you to continue the intro)"
            // gameStart() is run now
        }, {
            element: document.querySelector("#game-area"),
            intro: "All the other numbers are now hidden, and you have to rely on your memory to click them in the correct order"
        }]
    // Run certain functions at specific points in the intro
    }).onchange(function() {
        switch(this._currentStep) {
            // case 2 & 5 checks are in place, in case someone backtracks in the intro
            case 2:
                gameStop();
                break;
            case 3:
                // if statement in case someone backtracks from step 4 to 3
                if (!gameRunning) {
                    gameSetup(circles);
                }
                break;
            case 5:
                setupGameClick();
                currentCircle = 0;
                $("text").not(":first()").show();
                $("circle").not(":first()").unbind();
                break;
            case 6:
                gameStart();
                break;
            default:
                break;
        }
    }).onexit(function() {
        gameStop();
    }).start();
}

/* import/export functions */

// Import data into localStorage and other variables
function importData() {
    let confirm = prompt("Paste your save data below and then click OK to import your data.");
    let isValid;
    let isValidCleared;
    let importJson;
    let validRecord;
    let validTheme;
    // Return when import is empty or user clicked cancel
    if (confirm == null || confirm === "") {
        return;
    } else {
        // Very basic data validation
        isValid = confirm.charAt(0) === "[" && confirm.charAt(1) === `"` && confirm.charAt(2) === "[" && confirm.charAt(3) === "[" && confirm.charAt(4) === "\\" && confirm.charAt(5) === `"`;
        isValidCleared = confirm.charAt(0) === "[" && confirm.charAt(1) === `"` && confirm.charAt(2) === "[" && confirm.charAt(3) === "]" && confirm.charAt(4) === `"` && confirm.charAt(5) === "," && confirm.charAt(6) === "0";
        importJson = JSON.parse(confirm);
        validRecord = typeof importJson[1] === "number";
        validTheme = importJson[2] === "default" || importJson[2] === "dark";
    }
    // Update localStorage if data is valid
    if (isValid && validRecord && validTheme) {
        localStorage.setItem("history", importJson[0]);
        localStorage.setItem("record", importJson[1]);
        localStorage.setItem("theme", importJson[2]);
        dailyAttempts = 0;
        dailyRecord = 0;
        // Update local variables with localStorage data
        checkStorage();
        window.location.reload();
    // Update localStorage with empty play data if data is valid
    } else if (isValidCleared && validRecord && validTheme) {
        if (prompt('This will clear out any previous records and play history. if you want to continue, please type "I confirm" in the bo below and press OK') === "I confirm") {
            dailyAttempts = 0;
            dailyRecord = 0;
            hist = [];
            localStorage.removeItem("history");
            localStorage.removeItem("record");
            localStorage.setItem("theme", importJson[2]);
            checkStorage();
            window.location.reload();
        } else {
            alert("You've cancelled the data import.");
        }
    // Alert user that data is invalid
    } else {
        alert("The imported save was invalid.");
    }
}

// Update localstorage before extracting it for exporting to other device/browser
function exportData() {
    // Update localstorage when localstorage is available & at least 1 game was played today
        if (getLocalStorageStatus() && dailyAttempts){
            updateHistory();
            updateRecord();
        }
        // Add history, record and theme to an array for export
        let expData = JSON.stringify([JSON.stringify(hist),record,theme]);
        let message = "Please copy the below text and save this somewhere so you can import it when needed.";
        // Using prompt to notify the user so the data is already highlighted
        prompt(message, expData);
}

// Theme functions

// Set the theme dropdown item corresponding to the current theme as actve
function themeHighlight() {
    $(".themes .dropdown-menu .dropdown-item").removeClass("active");
    $("#".concat(theme)).addClass("active");
}

// Function callers

// Check if a game is alread underway
function checkRunning() {
    // Start a game if a game isn't running yet
    if (!gameRunning) {
        gameSetup(circles);
        // If the current amount of cirles is 5, add to the daily attempts
        if (circles === 5) {
            dailyAttempts++;
        }
    // Alert the user a game can't be started while one is already running
    } else {
        alert("A game has already been started, please finish the game before starting a new one.");
    }
}

// Call the required functions in order while setting up a game
function gameSetup(circles) {
    width = $("#game-area").width();
    height = $("#game-area").height();
    // Create coordinates for every circle, redoing process upon collision
    for (let i = 1; i <= circles; i++) {
        createCoords();
        if (collisionCheck()) {
            --i;
        } else {
            coordList.push(xCoord.toString() + "/" + yCoord.toString());
        }   
    }
    drawCircles();
    addNumber();
    setupGameClick();
    gameRunning = true;
}

// Manipulate the DOM when the user clicks on number 1 to attempt a solve 
function gameStart() {
    // Unbind the event handlers on the first circle & number
    $("circle").first().unbind(); 
    $("text").first().unbind();
    currentCircle = 1;
    // Hide all numbers except the first
    $("text").not(":first()").hide();
    startGameClick();
}

// Collect the required data to draw a chart & draw it
function historySetup(period) {
    if (dailyAttempts) {
        updateHistory();
    }
    getLimit(period);
    // Extract attempts and records from localstorage
    attempts = getData(1, period);
    records = getData(2, period);
    // Extract chart labels based on the period of the chart
    switch (period) {
        case "Day":
            labels = getData(0,period);
            break;
        case "Week":
            labels = weeks.reverse();
            break;
        case "Month":
            labels = months.reverse();
            break;
        // Error message in case period is not month, week or day
        default:
            console.log("bug in historySetup() period");
            break;
    }
    // Draw the chart based on the data collected above
    setupChart();
}

/* Event listeners */

// Help button event listener
function helpClick() {
    $("#help-button").click(function () {
        // If a game is running, ask user to confirm the game will be cancelled
        if(gameRunning){
            if(confirm("This will stop the current game and you'll have to start over. Are you sure?")){
                gameStop();
                initGame();
                startIntro();
            }
        } else {
            initGame();
            startIntro();
        }
    });
}

// Start game event listener
function startClick() {
    $("#start-game").click(function() {
        // Check if a game is currently running, and start game if needed
        checkRunning();
    });
}

// History button event listener
function historyClick() {
    $("#history").click(function() {
        if(gameRunning) {
            if(confirm("This will stop the current game and you'll have to start over. Are you sure?")){
                gameStop();
                initHistory();
            // If there's no recorded games yet, display text, otherwise display chart
                if (!dailyAttempts && !localStorage.getItem("history")) {
                    noGames();
                } else {
                    historySetup("Day");
                }
            }
        } else {
                initHistory();
            // If there's no recorded games yet, display text, otherwise display chart
            if (!dailyAttempts && !localStorage.getItem("history")) {
                noGames();
            } else {
                historySetup("Day");
            }
        }
    });
}

// Game button event listener
function gameClick() {
    $("#game").click(function() {
        initGame();
    });
}

// Add event listener to 1st circle and number
function setupGameClick() {
    $("circle").first().css("cursor","pointer").click(function() {
        gameStart();
    });
    $("text").css("font-weight","bold").first().css("cursor","pointer").click(function() {
        gameStart();
    });
}

// Add event listeners to all circles except the first after the first has been clicked
function startGameClick() {
    $("circle").not(":first()").css("cursor","pointer").click(function(event) {
        checkCircle(event);
    });
}

// Add event listeners to history period dropdown items
function periodicClick() {
    $(".periodic .dropdown-menu .dropdown-item").click(function() {
        let el = $(this);
        // Change period button to currently selected period
        $(".periodic button").html(el.text());
        // Set currently selected period as active dropdown item
        $(".periodic .dropdown-menu .dropdown-item").removeClass("active");
        el.addClass("active");
        // Set up history with selected period
        historySetup(el.text());
    });
}

// Add event listener to import button
function importClick() {
    $("#import").click(function() {
        importData();
    });
}

// Add event listener to export button
function exportClick() {
    $("#export").click(function() {
        exportData();
    });
}

// Add event listeners to theme dropdown items
function themeClick() {
    $(".themes .dropdown-menu .dropdown-item").click(function() {
        let el = $(this);
        theme = el.attr("id");
        // Set currently selected theme as active dropdown item
        themeHighlight();
        // Apply new theme to DOM
        addTheme(theme);
    });
}

// Update history and record upon closing the page
function pageClose() {
    window.addEventListener("beforeunload", function() {
        // Update localstorage when localstorage is available & at least 1 game was played today
        if (getLocalStorageStatus() && dailyAttempts){
            updateHistory();
            updateRecord();
            updateTheme();
        }
    });
}

// Call functions to initialize all needed variables based on history, and update html
$(document).ready(function() {
    if (!getLocalStorageStatus()) {
        alert("It appears your localStorage is unavailable, or full. This page uses localStorage to store previous records and a full play history but is not required to play.");
    }
    let firstTime = checkStorage();
    initGame();
    // Run intro if page is opened without any game history
    if (firstTime) {
        startIntro();
    }
    pageClose();
    helpClick();
    importClick();
    exportClick();
    themeClick();
    themeHighlight();
});
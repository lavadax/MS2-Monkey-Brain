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

/* functions needed for gameSetup */

function addNumber() { /* Add relevant number to the circle elements based on the coords in the array and their index. */
    coordList.forEach(function(coords, index) {
        let coordPair = coords.split("/"); /* Take current coord pair, number before / is first in array, number after / is second in array */
        let num = document.createElementNS(svgNS, "text");
        num.setAttribute("x", parseInt(coordPair[0])-5);
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

function finishLevel() {
    alert("Congrats, you did it!");
    gameStop();
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
            setTimeout(finishLevel,0); /* without setTimeout, the number in the last circle will not become visible on click, unsure why */
        }
    } else {
        alert("Oops, you missed it!");
        gameStop();
    }
}

function gameStart() { /* main function that calls other functions in order when player is ready to attempt a solve */
    $("circle").first().unbind();
    $("text").first().unbind();
    currentCircle = 1
    $("text").not(":first()").hide(); /* Hide all numbers except the first */
    $("circle").not(":first()").click(function(event) { /* add event listeners to all circles except the first after the first has been clicked */
        checkCircle(event);
    })
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
    $("circle").first().click(function() { /* Add click listener to circle with number 1 to start the game */
        gameStart();
    })
    $("text").first().click(function() { /* Add click listener to number 1 to start the game, this will cover the entire circle, instead of the circle excluding the number */
        gameStart();
    })
    gameRunning = true;
}

$("#start-game").click(function() {
    if(!gameRunning) {
        gameSetup(circles);
    } else {
        alert("A game has already been started, please finish the game before starting a new one.");
    }
})
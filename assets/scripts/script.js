const svgNS = "http://www.w3.org/2000/svg"

let xCoord;
let yCoord;
let coordList; /* array will contain previously used coords formatted as a string with / between X and Y coords eg: ["28/74","134/42"] */
function testCircle() { /* TODO: Delete when done /// As the name suggests: this is a test function that will stay as a reference until I flesh out the actual function (less alt-tabbing) */
    let circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("fill", "white");
    circle.setAttribute("cx", 40);
    circle.setAttribute("cy", 40);
    circle.setAttribute("r", 20);
    document.getElementsByTagName("svg")[0].appendChild(circle);
}

function addNumber() { /* Add relevant number to the circle elements based on the coords in the array and their index. */
                        
}

function drawCircles() { /* Draw circle elements inside SVG */ 
                        /* Code is a slightly modified version of code found on riptutorials.com (link in readme) */
    coordList.foreEach(function(coords) {
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
        if (xCoord >= (oldCoords[0] - 45) && xCoord <= (oldCoords[0] + 45) && yCoord >= (oldCoords[1] - 45) && yCoord <= (oldCoords[1] + 45)) { 
            /* This if was made by tweaking the temporary check that can be found in my js psuedo file */
            col = true;
        }
    })
    return col;
}

function createCoords() { /* Generate coords to determine center point of circle elements */
    let width = $("#game-area").width();
    let height = $("#game-area").height();
    xCoord = Math.floor(Math.random() * (width - 40) + 20);
    yCoord = Math.floor(Math.random() * (height - 40) + 20);
    if (collisionCheck()) {
        /* TODO Collision is confirmed here, decrement counter that will be set up later */
    } else {
        addToArray();
    }
}

/* TODO add main function which clears out variables at the start and calls other functions in the right order */
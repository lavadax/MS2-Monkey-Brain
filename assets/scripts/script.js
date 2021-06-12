const svgNS = "http://www.w3.org/2000/svg"

let xCoord;
let yCoord;
let coordList = [];
function testCircle() { /* TODO: Delete when done /// As the name suggests: this is a test function that will stay as a reference until I flesh out the actual function (less alt-tabbing) */
    let circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("fill", "white");
    circle.setAttribute("cx", 40);
    circle.setAttribute("cy", 40);
    circle.setAttribute("r", 20);
    document.getElementsByTagName("svg")[0].appendChild(circle);
}

function drawCircles() { /* Draw circle elements inside SVG*/ 

}

function addToArray() { /* Add coords to array after checking for collision */

}

function collisionCheck() { /* Check for collision between new coords and existing coords in array */

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

function addNumber() { /* Add relevant number to the circle elements based on the coords in the array and their index*/

}
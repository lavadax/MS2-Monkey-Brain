const svgNS = "http://www.w3.org/2000/svg"

function testCircle() { /* As the name suggests: this is a test function that will stay as a reference until I flesh out the actual function (less alt-tabbing) */
    let circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("fill", "white");
    circle.setAttribute("cx", 40);
    circle.setAttribute("cy", 40);
    circle.setAttribute("r", 20);
    document.getElementsByTagName("svg")[0].appendChild(circle);
}
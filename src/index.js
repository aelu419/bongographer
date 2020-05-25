import { evaluate } from "mathjs";

// JavaScript Document

var cats0 = []; //initial value that the cats are in right now
var cats1 = []; //final value that the cats would be in
var cats = []; //current position of each cat

var fRate = 60; //fps
var cycle = 40; //length of the transition by frame
var count = 0; //current progress by frame
var cNum = 8; //number of cats

//scope of the grapher
var xMin = -3.2,
  xMax = 3.2;
var yMin = -2.4,
  yMax = 2.4;

var drawHeight;

function fade(x) {
  return 6 * x ** 5 - 15 * x ** 4 + 10 * x ** 3; //polynomial for easing
}

function lerp(a, b, x) {
  return a * (1 - x) + b * x; //interpolation
}

function sleep(t) {
  return new Promise((resolve) => setTimeout(resolve, t));
}

function calculate(str, val) {
  return evaluate(str, { x: val });
}

function max(a, b) {
  if (a > b) {
    return a;
  } else {
    return b;
  }
}

function min(a, b) {
  if (a < b) {
    return a;
  } else {
    return b;
  }
}

//initialize
var i;
for (i = 0; i < cNum; i++) {
  cats.push(yMin);
  cats0.push(0);
  cats1.push(1);
}

//image related
var body = new Image();
body.src = "/assets/body.png";
var hand = new Image();
hand.src = "/assets/hand.png";
var handL = new Image();
handL.src = "/assets/handL.png";
var handR = new Image();
handR.src = "/assets/handR.png";
var restL = new Image();
restL.src = "/assets/restL.png";
var restR = new Image();
restR.src = "/assets/restR.png";

var bodyDown = new Image();
var handLDown = new Image();
var handRDown = new Image();
var restLDown = new Image();
var restRDown = new Image();

function conv(r, bX, bY, w, h) {
  var newX = bX + (r[0] / body.width) * w;
  var newY = bY + (r[1] / body.height) * h;

  return [newX, newY];
}

//draw one particular frame
async function draw() {
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");

  var progress = count / cycle;
  progress = fade(progress);

  context.fillStyle = "#FDFDFD"; //clear screen
  context.clearRect(0, 0, canvas.width, canvas.height);

  var bodyW = canvas.width / cNum;
  var bodyH = (body.height / body.width) * bodyW;

  var handW = (bodyW * hand.width) / body.width;
  var handH = (handW * hand.height) / hand.width;

  context.lineWidth = (6 / body.width) * bodyW;

  //axes
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(0, drawHeight);
  context.lineTo(canvas.width, drawHeight);
  context.stroke();

  cats = [];
  for (i = 0; i < cats0.length; i++) {
    cats.push(lerp(cats0[i], cats1[i], progress)); //position of each cat
  }

  for (i = 0; i < cats0.length; i += 2) {
    //base variables
    var x = lerp(xMin, xMax, i / 2 / cNum);
    var y;

    //draw cat bodies:
    //x, y, w, h
    var pX = lerp(0, canvas.width, (x - xMin) / (xMax - xMin));
    var pY;
    context.drawImage(bodyDown, pX, drawHeight, bodyW, bodyH); //bodies are draw at the very bottom

    y = cats[i];
    var pYL = lerp(0, drawHeight, 1.0 - (y - yMin) / (yMax - yMin)) - bodyH / 2;

    y = cats[i + 1];
    var pYR = lerp(0, drawHeight, 1.0 - (y - yMin) / (yMax - yMin)) - bodyH / 2;

    //console.log(y+","+pYL+", "+pYR);
    //attatchment point of paws
    var r1 = [114, 201],
      r2 = [194, 195],
      r3 = [408, 276],
      r4 = [491, 266];
    var r1h = conv(r1, pX, pYL, bodyW, bodyH), //for the current hand
      r2h = conv(r2, pX, pYL, bodyW, bodyH),
      r3h = conv(r3, pX, pYR, bodyW, bodyH),
      r4h = conv(r4, pX, pYR, bodyW, bodyH);

    var r1b = conv(r1, pX, drawHeight, bodyW, bodyH), //for the current body
      r2b = conv(r2, pX, drawHeight, bodyW, bodyH),
      r3b = conv(r3, pX, drawHeight, bodyW, bodyH),
      r4b = conv(r4, pX, drawHeight, bodyW, bodyH);

    if (isNaN(cats[i])) {
      //draw resting left arm
      context.drawImage(restLDown, pX, drawHeight, bodyW, bodyH);
    } else {
      //draw actual left arm
      context.drawImage(handLDown, pX, pYL, bodyW, bodyH);
      //arm fill
      context.beginPath();
      context.moveTo(r1h[0], r1h[1]);
      context.lineTo(r2h[0], r2h[1]);
      context.lineTo(r2b[0], r2b[1]);
      context.lineTo(r1b[0], r1b[1]);
      context.closePath();
      context.fillStyle = "white";
      context.fill();

      //arm outlines
      context.beginPath();
      context.moveTo(r1h[0], r1h[1]);
      context.lineTo(r1b[0], r1b[1]);

      context.moveTo(r2h[0], r2h[1]);
      context.lineTo(r2b[0], r2b[1]);
      context.stroke();
    }

    if (isNaN(cats[i + 1])) {
      //draw resting right arm
      context.drawImage(restRDown, pX, drawHeight, bodyW, bodyH);
    } else {
      //draw actual right arm
      context.drawImage(handRDown, pX, pYR, bodyW, bodyH);
      //arm fill
      context.beginPath();
      context.moveTo(r3h[0], r3h[1]);
      context.lineTo(r4h[0], r4h[1]);
      context.lineTo(r4b[0], r4b[1]);
      context.lineTo(r3b[0], r3b[1]);
      context.closePath();
      context.fillStyle = "white";
      context.fill();
      //arm outlines
      context.beginPath();
      context.moveTo(r3h[0], r3h[1]);
      context.lineTo(r3b[0], r3b[1]);

      context.moveTo(r4h[0], r4h[1]);
      context.lineTo(r4b[0], r4b[1]);
      context.stroke();
    }
  }

  count = count + 1;
  if (count < cycle) {
    await sleep(1000 / fRate);
    draw();
  } else {
    //cycle finished
    cats0 = cats1;
    count = 0;
  }
}

function downsize(img, w, h) {
  var tempCV = document.createElement("canvas"),
    contextCV = tempCV.getContext("2d");
  if (img.width > w * 2) {
    var wTemp = Math.floor(img.width / 2);
    var hTemp = Math.floor((wTemp * img.height) / img.width);

    tempCV.width = wTemp;
    tempCV.height = hTemp;
    contextCV.drawImage(img, 0, 0, wTemp, hTemp);

    return downsize(tempCV, w, h);
  } else {
    var wTemp = w;
    var hTemp = h;

    tempCV.width = wTemp;
    tempCV.height = hTemp;
    contextCV.drawImage(img, 0, 0, wTemp, hTemp);

    return tempCV;
  }
}

function testExpr(str) {
  try {
    calculate(str, 0);
    calculate(str, 1);
    calculate(str, -1);
  } catch (e) {
    console.log(e);
    return e.toString();
  }
  return "";
}

function displayError(msg) {
  if (msg === "") {
    document.getElementById("error").innerHTML = "";
    return;
  }
  document.getElementById("error").innerHTML = "error :3";
}

function notify() {
  //test if the input actually works
  var latex = document.getElementById("input").value;
  var err = testExpr(latex);
  displayError(err);
  if (!err === "") {
    return;
  }

  var canvas = document.getElementById("canvas");

  //downgrade images
  var ratio = canvas.width / cNum / body.width;

  bodyDown = downsize(body, body.width * ratio, body.height * ratio);
  handLDown = downsize(handL, handL.width * ratio, handL.height * ratio);
  handRDown = downsize(handR, handR.width * ratio, handR.height * ratio);
  restLDown = downsize(restL, restL.width * ratio, restL.height * ratio);
  restRDown = downsize(restR, restR.width * ratio, restR.height * ratio);

  //calculate the values for cats1
  //initialize
  cats0 = [];
  cats1 = [];

  /*
  var maxVal = 2.4,
    minVal = -2.4;

  //set bounds
  for (i = 0; i < cNum; i += 0.1) {
    x = (i / (cNum - 1)) * (xMax - xMin) + xMin;
    var y = calculate(latex, x);
    if (y > maxVal) {
      maxVal = y;
    }
    if (y < minVal) {
      minVal = y;
    }
  }*/

  // console.log(minVal + " ", maxVal);

  //yMax = min(1000, maxVal);
  //yMin = max(-1000, minVal);

  for (i = 0; i < cNum; i++) {
    cats0.push(yMin);
    cats0.push(yMin);

    var x = (i / cNum) * (xMax - xMin) + xMin;

    var bodyW = (xMax - xMin) / cNum;
    var xL = x + (bodyW * 114.0) / body.width;
    var xR = x + (bodyW * 408.0) / body.width;
    cats1.push(calculate(latex, xL));
    cats1.push(calculate(latex, xR));
  }

  //console.log(cats1);
  draw();
}

function canvasRefresh() {
  var canvas = document.getElementById("canvas");

  drawHeight = (canvas.width / 6.4) * 4.8;
  var buffer = (canvas.width / cNum / body.width) * body.height;
  canvas.height = (canvas.width / 6.4) * 4.8 + buffer;
  notify();
}

//show/hide the settings menu
function toggleSettings() {
  var table = document.getElementById("settingsTable");
  if (table.style.height == 0 || table.style.height == "0px") {
    //expand
    table.style.height = "auto";
  } else {
    //shrink
    table.style.height = "0px";
  }
}

window.toggleSettings = toggleSettings;

function updateSettings() {
  var params = document
    .getElementById("settingsTable")
    .getElementsByTagName("INPUT");

  //min cannot be larger than max, min cannot be equal to max
  if (
    params[0].value >= params[1].value ||
    params[2].value >= params[3].value
  ) {
    console.log("problematic setting");
    return;
  }

  //set parameter values
  xMin = parseFloat(params[0].value);
  xMax = parseFloat(params[1].value);
  yMin = parseFloat(params[2].value);
  yMax = parseFloat(params[3].value);
  cNum = max(1, parseFloat(Math.round(params[4].value)));

  canvasRefresh();
}

window.updateSettings = updateSettings;

window.onload = function () {
  //load the calcualtor
  var holder = document.getElementById("input");
  document.getElementById("input").value = "sin(x)";

  canvasRefresh();
  // evaluate();
};

window.onresize = canvasRefresh;
// Make the canvasRefresh available to index.html
window.canvasRefresh = canvasRefresh;

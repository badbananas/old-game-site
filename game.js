var context;
var queue;
var WIDTH = 1024;
var HEIGHT = 768;
var stage;

var countdownTimer;
var countdownNumber = 4;
var countdown3;
var countdown2;
var countdown1;
var countdown0;

var playerR;
var playerB;

//0 is up, 1 is right, 2 is down, 3 is left
var directionR = 1;
var directionB = 3;

var STARTX_R = 55;
var STARTY_R = 683;
var STARTX_B = 939;
var STARTY_B = 55;

var RECT_SIZE = 30;

var line;

//0 is ready, 1 is countdown, 2 is play, 3 is end
var gameState = 0;

window.onload = function()
{
    //create canvas
    var canvas = document.getElementById('myCanvas');
    context = canvas.getContext('2d');
    context.canvas.width = WIDTH;
    context.canvas.height = HEIGHT;
    stage = new createjs.Stage("myCanvas");

	//create queue
    queue = new createjs.LoadQueue(false);
    queue.on("complete", queueLoaded, this);

	//load assets
    queue.loadManifest([{id: 'backgroundImage', src: 'assets/background.png'},
						{id: 'redIcon', src: 'assets/redIcon.png'},
						{id: 'blueIcon', src: 'assets/blueIcon.png'},
						{id: 'countdown3', src: 'assets/countdown3.png'},
						{id: 'countdown2', src: 'assets/countdown2.png'},
						{id: 'countdown1', src: 'assets/countdown1.png'},
						{id: 'countdown0', src: 'assets/countdown0.png'}]);
    queue.load();

}

function queueLoaded(event)
{
    // Add background image
    var backgroundImage = new createjs.Bitmap(queue.getResult("backgroundImage"))
    stage.addChild(backgroundImage);
	
    createPlayers();
	
	//key control handler
	window.addEventListener("keydown", keyPress, false);
	
	stage.update();
}

function startCountdown() {
	gameState = 1;
	
	doCountdown();
	countdownTimer = setInterval(doCountdown, 1000);
}

function doCountdown() {
	countdownNumber -= 1;
	switch (countdownNumber) {
		case 3:
			countdown3 = new createjs.Bitmap(queue.getResult("countdown3"));
			countdown3.regX = 55;
			countdown3.regY = 80;
			countdown3.x = 512;
			countdown3.y = 384;
			stage.addChild(countdown3);
			break;
		case 2:
			stage.removeChild(countdown3);
			countdown2 = new createjs.Bitmap(queue.getResult("countdown2"));
			countdown2.regX = 55;
			countdown2.regY = 80;
			countdown2.x = 512;
			countdown2.y = 384;
			stage.addChild(countdown2);
			break;
		case 1:
			stage.removeChild(countdown2);
			countdown1 = new createjs.Bitmap(queue.getResult("countdown1"));
			countdown1.regX = 50;
			countdown1.regY = 80;
			countdown1.x = 512;
			countdown1.y = 384;
			stage.addChild(countdown1);
			break;
		case 0:
			stage.removeChild(countdown1);
			countdown0 = new createjs.Bitmap(queue.getResult("countdown0"));
			countdown0.regX = 177;
			countdown0.regY = 80;
			countdown0.x = 512;
			countdown0.y = 384;
			stage.addChild(countdown0);
			startGame();
			break;
		case -1:
			stage.removeChild(countdown0);
			clearInterval(countdownTimer);
	}
	stage.update();
}

function startGame() {
	gameState = 2;
	
	// Add ticker
    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener('tick', stage);
	createjs.Ticker.addEventListener('tick', tickEvent);
}

function createPlayers() {
	//create red player
	playerR = new createjs.Bitmap(queue.getResult("redIcon"));
	playerR.x = STARTX_R;
	playerR.y = STARTY_R;
	stage.addChild(playerR);
	
	//create blue player
	playerB = new createjs.Bitmap(queue.getResult("blueIcon"));
	playerB.x = STARTX_B;
	playerB.y = STARTY_B;
	stage.addChild(playerB);

}

function keyPress(event) {
	if (gameState == 0) {
		if (event.keyCode == 32) {
			startCountdown();
		}
	}
	
	if (gameState == 2) {
		//check red keys
		if (event.keyCode == 87) {
			drawRedCorner(0);
			directionR = 0;
		} else if (event.keyCode == 68) {
			drawRedCorner(1);
			directionR = 1;
		} else if (event.keyCode == 83) {
			drawRedCorner(2);
			directionR = 2;
		} else if (event.keyCode == 65) {
			drawRedCorner(3);
			directionR = 3;
		}
		
		//check blue keys
		if (event.keyCode == 38) {
			drawBlueCorner(0);
			directionB = 0;
		} else if (event.keyCode == 39) {
			drawBlueCorner(1);
			directionB = 1;
		} else if (event.keyCode == 40) {
			drawBlueCorner(2);
			directionB = 2;
		} else if (event.keyCode == 37) {
			drawBlueCorner(3);
			directionB = 3;
		}
		
		if (event.keyCode == 88) {
			endGame();
		}
	}
}

function drawRedCorner(drct) {
	if (drct != directionR) {
		var cornerX = playerR.x;
		var cornerY = playerR.y;
		switch (drct) {
			case 0:
				playerR.y -= 20;
				break;
			case 1:
				playerR.x += 20;
				break;
			case 2:
				playerR.y += 20;
				break;
			case 3:
				playerR.x -= 20;
		}
		line = new createjs.Shape();
		line.graphics.beginFill("#d10000").drawRect(cornerX+5, cornerY+5, 20, 20);
		stage.addChildAt(line, 1);
	}
}

function drawBlueCorner(drct) {
	if (drct != directionB) {
		var cornerX = playerB.x;
		var cornerY = playerB.y;
		switch (drct) {
			case 0:
				playerB.y -= 20;
				break;
			case 1:
				playerB.x += 20;
				break;
			case 2:
				playerB.y += 20;
				break;
			case 3:
				playerB.x -= 20;
		}
		line = new createjs.Shape();
		line.graphics.beginFill("#0000d1").drawRect(cornerX+5, cornerY+5, 20, 20);
		stage.addChildAt(line, 1);
	}
}

function tickEvent() {
	//move red player
	switch (directionR) {
		case 0:
			playerR.y -= 5;
			break;
		case 1:
			playerR.x += 5;
			break;
		case 2:
			playerR.y += 5;
			break;
		case 3:
			playerR.x -= 5;
	}
	
	drawRedLine();
	
	//move blue player
	switch (directionB) {
		case 0:
			playerB.y -= 5;
			break;
		case 1:
			playerB.x += 5;
			break;
		case 2:
			playerB.y += 5;
			break;
		case 3:
			playerB.x -= 5;
	}
	
	drawBlueLine();
}

function drawRedLine() {
	line = new createjs.Shape();
	switch (directionR) {
		case 0:
			line.graphics.beginFill('red').drawRect(playerR.x+5, playerR.y+25, 20, 5);
			break;
		case 1:
			line.graphics.beginFill('red').drawRect(playerR.x, playerR.y+5, 5, 20);
			break;
		case 2:
			line.graphics.beginFill('red').drawRect(playerR.x+5, playerR.y, 20, 5);
			break;
		case 3:
			line.graphics.beginFill('red').drawRect(playerR.x+25, playerR.y+5, 5, 20);
	}
	
	stage.addChildAt(line, 1);
}

function drawBlueLine() {
	line = new createjs.Shape();
	switch (directionB) {
		case 0:
			line.graphics.beginFill('blue').drawRect(playerB.x+5, playerB.y+25, 20, 5);
			break;
		case 1:
			line.graphics.beginFill('blue').drawRect(playerB.x, playerB.y+5, 5, 20);
			break;
		case 2:
			line.graphics.beginFill('blue').drawRect(playerB.x+5, playerB.y, 20, 5);
			break;
		case 3:
			line.graphics.beginFill('blue').drawRect(playerB.x+25, playerB.y+5, 5, 20);
	}
	
	stage.addChildAt(line, 1);
}

function endGame() {
	gameState = 3;
	
	createjs.Ticker.removeEventListener('tick', tickEvent);
	
}



function inherit(p){
	function f(){};
	f.prototype = p;
	return new f();
}

var consts = {
	XP: 0,
	XM: 1,
	YP: 2,
	YM: 3,
	FPS: 100,
	ENTITY_HEIGHT: 20,
	ENTITY_WIDTH: 20,
	lifes: 7,
	TIMEOUT: "Time's out.",
	PRESS_ENTER: "Press Enter to start.",
	CATCHED: "Guard caught you.",
	EASY: "easy",
	NORMAL: "normal",
	HARD: "hard",
	LEVEL_DIFFICULTS: "Difficulty:",
	INSTRUCT1: "Use key combinations. For example, to turn ",
	INSTRUCT2: "on first right turn, use Right + Up arrows",
	FPS_FONT_COLOR: "#00FF00",
	FPS_FONT: "14px tomas",
	MESSAGE_FONT_COLOR: "#000000",
	MESSAGE_FONT: "14px tomas",
	MESSAGE_BACKGROUND_COLOR: "#FFFF33",
	INFO_FONT_COLOR: "#00FF00",
	INFO_FONT: "14px tomas",
	DEFAULT_BLOCK_COLOR: "#000000",
	PLAYER_STEP: 10,
	PLAYER_FRSTEP: 55,
	FPS: 40	
};

function Entity(x, y, width, height, skin){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.skin = skin;
	this.centerX = 0;
	this.centerY = 0;
	
	this._culcCenterOfEntity();
};

Entity.prototype.draw = function(context){
	if(this.skin){
		context.drawImage(this.skin, this.x, this.y, this.width, this.height);
	}else{
		context.fillStyle = consts.DEFAULT_BLOCK_COLOR;	
		context.fillRect(this.x, this.y, this.width, this.height);
	}
};

Entity.prototype._culcCenterOfEntity = function(){
	this.centerX = this.x + this.width/2;
	this.centerY = this.y + this.height/2;
}
	
var frapsManager = {
	redrawInterval: null,
	culcFPSInterval: null,
	started: false,
	lastRedrawTime: null,
	FPS: 0, //actual value frames per seconds. refreshes every 1000 millisec	
	tbfr: null, //actual time between frame redraw
	context: null,//context where will be draw
	object: null,//object, wich will be draw
	showFPS: false,
	timeBetweenRedrawing: null,


	init: function (context, object, needCountFPS, showFPS){
		this.context = context;
		this.object = object;
		this.showFPS = showFPS;
		this.timeBetweenRedrawing = 1000/(needCountFPS ? needCountFPS : 20);// frame will try to update every this.timeBetweenRedrawing miliseconds
	},
	
	setObject: function(object){
		this.object = object;
	},

	start: function(){
		if(this.started) return;
		this.started = true;
		var self = this;
		this.redrawInterval = setInterval(function(){self.redraw();}, this.timeBetweenRedrawing);
		this.culcFPSInterval = setInterval(function(){self.culcFPS();}, 1000);
	},

/*	stop: function(){
		this.started = false;
		clearInterval(this.redrawInterval);
		clearInterval(this.culcFPSInterval);
	},
*/
	redraw: function(){
		this.clearScreen();
		this.object.draw(this.context);	
		if(this.showFPS){
			this.drawFPS();
			this.culcTbfr(); 
		}	
	},

	clearScreen: function(){
		var canvas = this.context.canvas;
		this.context.clearRect(0, 0, canvas.width, canvas.height);
	},

	//culculates time between frame redrawing in milliseconds (does not work if time will be bigger then 999 milliseconds)
	culcTbfr: function(){
		var now = Date.now();
		this.tbfr = now - this.lastRedrawTime;
		this.lastRedrawTime = now;
	},

	culcFPS: function(){
		this.FPS = 1000/this.tbfr;
	},

	drawFPS: function(){
		this.context.textBaseline = "top";
		this.context.font = consts.FPS_FONT;
		this.context.fillStyle = consts.FPS_FONT_COLOR;
		this.context.fillText("FPS: "+Math.round(this.FPS), this.context.canvas.width - 55, this.context.canvas.height - 20);
	}

}

import guardImg from './pic/guard.png';
import playerImg from './pic/player.png';
import dolarImg from './pic/dolar.png';
import finishImg from './pic/finish.png';
import masonryImg from './pic/masonry.png';
import clockImg from './pic/clock.png';
import heartImg from './pic/heart.png';
import menuImg from './pic/menu.png';
import gridImg from './pic/grid.png';

var imgLoader = {
	images: {},
	imgCount: 0,
	imgLoaded: 0,
	load: function(){
		var imgNames = ["guard","player","dolar","finish","masonry","clock","heart","menu","grid"]; 
        var imgUrls = {
            "guard": guardImg,
            "player": playerImg,
            "dolar": dolarImg,
            "finish": finishImg,
            "masonry": masonryImg,
            "clock": clockImg,
            "heart": heartImg,
            "menu": menuImg,
            "grid": gridImg
        };
		this.imgCount = imgNames.length;
		for(var i=0; i < this.imgCount; i++){
			this.images[imgNames[i]] = new Image();
			var self = this;
			this.images[imgNames[i]].onload = function(){self.onImgLoad();};
			this.images[imgNames[i]].src = imgUrls[imgNames[i]];
		}
	},
	
	onImgLoad: function(){
		this.imgLoaded++;
		if(this.imgCount == this.imgLoaded){
			this.allImgLoaded();
		}
	},
	
	getImg: function(name){
		return this.images[name];
	},
	
	allImgLoaded: function(){
		
	},
	
	deleteLoadedNames: function(imgNames){
		for(var i=0; i<imgNames.length; i++){
			if(imgNames[i] in this.images){
				imgNames.splice(i, 1);
			}
		}
	}
}

var world = {
	player: null,
	bots: null,
	blocks: null,
	dolars: null,
	finish: null,
	staticEntitys: null,//massive with pixels of drawed entities, which don't move(means dont refresh every frap)
	level: 0,//current level
	time: 0,//time which remained
	specEntity: null,
	timer: null,
	message: "",
	
	startLevel: function(number, player){
		if(!this.player){
			this.setPlayer(player);
		}
		this.staticEntitys = null;
		this.level = number;
		this.bots = this.createBots(levels[number].bots[this.player.difficult]);
		this.blocks = this.createBlocks(levels[number].blocks);
		this.dolars = this.createDolars(levels[number].dolars[this.player.difficult]);
		this.finish = this.createFinish(levels[number].finish);
		this.time = levels[number].time[this.player.difficult];
		this.player.setPosition(levels[number].playerStart[0], levels[number].playerStart[1]);	
		if("specEntity" in levels[number]){
			var seinf = levels[number].specEntity;
			this.specEntity = new Entity(seinf[0], seinf[1], seinf[2], seinf[3], imgLoader.getImg(seinf[4]));
		}
				
		//sets event on bots
		var self = this;
		var checkCollisionWithBot = function(botCenterX, botCenterY){self.checkPlayersCollisionsWithBot(botCenterX, botCenterY);};		
		for(var i = 0; i<this.bots.length; i++){
			this.bots[i].onStepped = checkCollisionWithBot;
		}	
		
		//this shows message then starts bots and timer, after hide message, in method hideMessage
		this.showMessage(consts.PRESS_ENTER);
	},
	
	stopCurLevel: function(){
		this.stopBots();
		this.stopTimer();
	},
	
	setPlayer: function(player){
		this.player = player;
		//sets event on player
		var self = this;
		player.onBeforeMove = function(x,y){return self.canMoveTo(x,y);}
		player.onMove = function(){self.checkEntityCollision();};
		player.onDead = function(){self.restartGame();}
		player.onLostLife = function(){self.restartLevel();}
	},
	
	draw: function(context){
		context.textBaseline = "top";
			
		if(this.staticEntitys == null){
			//draw static elements
			context.fillStyle = "#404040";
			context.fillRect(400, 0, context.canvas.width, context.canvas.height);
			
			context.drawImage(imgLoader.getImg("masonry"), 0, 0, 400, 400);
			
			context.drawImage(imgLoader.getImg("heart"), 405, 5, 20, 20);
			context.drawImage(imgLoader.getImg("clock"), 405, 30, 20, 20);
			
			for(var i=0; i<this.blocks.length; i++){
				this.blocks[i].draw(context);
			}
			
			context.fillStyle = consts.INFO_FONT_COLOR;
			context.font = consts.INFO_FONT;
			context.fillText("level: "+(this.level+1), context.canvas.width/2-50, 3);
			
			//gets static elements in rgb massive 
			this.staticEntitys = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
		}else{
			//puts static elements on screen 
			context.putImageData(this.staticEntitys, 0, 0);
		}
	
		//draw bots
		for(var i = 0; i < this.bots.length; i++){
			this.bots[i].draw(context);
		}
		
		//draw dolars
		for(var i=0; i<this.dolars.length; i++){
			this.dolars[i].draw(context);
		}
		
		//draw finish
		this.finish.draw(context);
		
		//draw player
		this.player.draw(context);
		
		//draw special entity
		if(this.specEntity){
			this.specEntity.draw(context);
		}
		
		
		context.fillStyle = consts.INFO_FONT_COLOR;
		context.font = consts.INFO_FONT;
		//draw time
		context.fillText(this.time,432,32);
		
		//draw lifes count
		context.fillText(this.player.lifes,432,7);
		
		//draw message
		if(this.message){
			var width = context.measureText(this.message).width + 40;
			var height = 30;
			var x = context.canvas.width/2-width/2-30;
			var y = context.canvas.height/2-height/2;
			
			context.fillStyle = consts.MESSAGE_BACKGROUND_COLOR;
			context.fillRect(x, y, width, height);
			
			context.strokeStyle = "#000000";
			context.strokeRect(x, y, width, height);
			
			context.font = consts.MESSAGE_FONT;
			context.fillStyle = consts.MESSAGE_FONT_COLOR;			
			context.fillText(this.message,x+20,y+5);
		}
	},
	
	showMessage: function(text, callback){
		this.stopTimer();
		this.stopBots();
		this.player.lockMovement();
		this.message = text; // will be drawed during next redrawing(in method draw)	
		this.callback = callback;		
	},
	
	hideMessage: function(){
		if(this.message){
			this.startBots();
			this.startTimer();
			this.player.unlockMovement();
			this.message="";
			if(typeof this.callback == "function"){
				this.callback();
			}
		}
	},
	
	//does, when pushed enter
	downENTER: function(){
		this.hideMessage();
	},
	
	restartLevel: function(){
		this.stopCurLevel();
		this.startLevel(this.level);
	},
	
	nextLevel: function(){
		this.stopCurLevel();
		this.startLevel(this.level+1);
	},
	
	restartGame: function(){
		this.stopCurLevel();
		this.player.lifes = consts.lifes;
		this.startLevel(0);
	},
		
	startTimer: function(){
		var self = this;
		this.timer = setInterval(function(){
			self.time--;
			if(self.time<=0){
				self.stopTimer();
				self.stopBots();
				self.showMessage(consts.TIMEOUT, function(){self.player.lostLife();});
			}
		},1000);
	},
	
	stopTimer: function(){
		clearInterval(this.timer);
	},
	
	startBots: function(){
		for(var i = 0; i < this.bots.length; i++){
			this.bots[i].startBot();
		}
	},
	
	stopBots: function(){
		for(var i = 0; i < this.bots.length; i++){
			this.bots[i].stopBot();
		}
	},
	
	canMoveTo: function(x, y){
		for(var i=0; i<this.blocks.length; i++){
			var block = this.blocks[i]; 
			var deadDistanceToBlock = consts.ENTITY_HEIGHT/2;
			var xlt = block.x - deadDistanceToBlock;
			var ylt = block.y - deadDistanceToBlock;
			var xrb = block.x + block.width + deadDistanceToBlock;
			var yrb = block.y + block.height + deadDistanceToBlock;
			if(x>xlt && x<xrb && y>ylt && y<yrb){
				return false;
			}
		}
		return true;
	},
	
	checkEntityCollision: function(){
		this.checkPlayersCollisionsWithBots();
		this.checkPlayersCollisionsWithDolars();
		this.checkPlayersCollisionWithFinish();
	},
	
	checkPlayersCollisionsWithBots: function(){
		for(var i = 0; i < this.bots.length; i++){
			if(this.checkCollision(this.player.centerX, this.player.centerY, this.bots[i].centerX, this.bots[i].centerY)){
				var self = this;
				this.showMessage(consts.CATCHED,function(){self.player.lostLife();});								
			}
		}
	},
	
	checkPlayersCollisionsWithBot: function(botCenterX, botCenterY){
		if(this.checkCollision(this.player.centerX, this.player.centerY, botCenterX, botCenterY)){
				var self = this;
				this.showMessage(consts.CATCHED,function(){self.player.lostLife();});								
		}
	},
	
	checkPlayersCollisionsWithDolars: function(){
		for(var i=0; i<this.dolars.length; i++){
			if(this.checkCollision(this.player.centerX, this.player.centerY, this.dolars[i].centerX, this.dolars[i].centerY)){
				this.dolars.splice(i,1);
			}
		}
	},
	
	checkPlayersCollisionWithFinish: function(){
		if(this.checkCollision(this.player.centerX, this.player.centerY, this.finish.centerX, this.finish.centerY)){
			if(this.dolars.length==0){
				this.nextLevel();
			}
		}
	},
	
	checkCollision: function(centerX, centerY, centerX2, centerY2){
		var distance = Math.sqrt(Math.pow(centerX-centerX2,2) + Math.pow(centerY-centerY2,2));
		return (distance < consts.ENTITY_HEIGHT ? true : false);
	},
	
	createBots: function(botsInf){
		var bots = new Array();
		for(var i=0;i<botsInf.length;i++){
			var inf = botsInf[i];
			bots.push(new Bot(inf[0], inf[1], consts.ENTITY_WIDTH, consts.ENTITY_HEIGHT, imgLoader.getImg("guard"), inf[2], inf[3], inf[4], inf[5], inf[6], inf[7]));
		}
		return bots;
	},
	
	createBlocks: function(blocksInf){
		var blocks = new Array();
		for(var i=0;i<blocksInf.length; i++){
			var inf = blocksInf[i];
			blocks.push(new Entity(inf[0], inf[1], inf[2], inf[3]));
		}
		return blocks;
	},
	
	createDolars: function(dolarsInf){
		var dolars = new Array();
		for(var i=0; i<dolarsInf.length; i++){
			var inf = dolarsInf[i];
			dolars.push(new Entity(inf[0], inf[1], consts.ENTITY_WIDTH, consts.ENTITY_HEIGHT, imgLoader.getImg("dolar")));
		}
		return dolars;
	},
	
	createFinish: function(finishInf){
		return new Entity(finishInf[0], finishInf[1], consts.ENTITY_WIDTH, consts.ENTITY_HEIGHT, imgLoader.getImg("finish"));
	}

}

function Bot(x, y, width, height, skin, step, frstep, x1, y1, x2, y2){
	Entity.call(this, x, y, width, height, skin);
	this.step = step;
	this.frstep = frstep;
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
	this.started = false;
	this.stepInterval = null;	
}

Bot.prototype = inherit(Entity.prototype);
Bot.prototype.constructor = Bot;

Bot.prototype.startBot = function(){
	if(this.started)return;
	this.started = true;
	this._identifyDirection();
	var self = this;
	this.stepInterval = setInterval(function(){self.doStep();}, this.frstep);
}

Bot.prototype.stopBot = function(){
	this.started = false;
	clearInterval(this.stepInterval);
}
	
Bot.prototype.doStep = function(){
	if(this.direction == consts.XP){
		if(Math.max(this.x1, this.x2) >= this.x + this.step){
			this.x += this.step;
		}else{
			this.direction = consts.XM;
		}
	}else if(this.direction == consts.XM){
		if(Math.min(this.x1, this.x2) <= this.x - this.step){
			this.x -= this.step;
		}else{
			this.direction = consts.XP;
		}
	}else if(this.direction == consts.YP){
		if(Math.max(this.y1, this.y2) >= this.y + this.step){
			this.y += this.step;
		}else{
			this.direction = consts.YM;
		}
	}else if(this.direction == consts.YM){
		if(Math.min(this.y1, this.y2) <= this.y - this.step){
			this.y -= this.step;
		}else{
			this.direction = consts.YP;
		}
	}

	this._culcCenterOfEntity();
	this.onStepped(this.centerX, this.centerY);
};

//event
Bot.prototype.onStepped = function(){
	
}

Bot.prototype._identifyDirection = function(){
	var random = !! Math.round(Math.random());
	if(this.x1 == this.x2){
		this.direction = random ? consts.YP : consts.YM;
	}else if(this.y1 == this.y2){
		this.direction = random ? consts.XP : consts.XM;
	}
};

function Player(x, y, width, height, skin, step, frstep, difficult){
	Entity.call(this, x, y, width, height, skin);
	this.step = step;
	this.frstep = frstep;
	this.difficult = difficult;
	this.lifes = consts.lifes;
	this.timerUp = null;
	this.timerDown = null;
	this.timerLeft = null;
	this.timerRight = null;
	this.lockedMovement = false;
}

Player.prototype = inherit(Entity.prototype);
Player.prototype.constructor = Player;

Player.prototype.setPosition = function(x, y){
	this.x = x;
	this.y = y;
	this._culcCenterOfEntity();
}

Player.prototype.lockMovement = function(){
	this.upUP();//stop move up
	this.upDOWN();//stop move down
	this.upLEFT();//stop move left
	this.upRIGHT();//stop move right
	this.lockedMovement = true;
}

Player.prototype.unlockMovement = function(){
	this.lockedMovement = false;
}

//start move up	when pushed up
Player.prototype.downUP = function(){
	if(this.timerUp == null && !this.lockedMovement){
		if(this.timerDown != null)this.upDOWN();
		var self = this;
		this.timerUp = setInterval(function(){
			if(self.onBeforeMove(self.centerX, self.centerY - self.step)){
				self.y -= self.step;
				self._culcCenterOfEntity();
				self.onMove();	
			}
		}, this.frstep);
	}
}

//start move down		
Player.prototype.downDOWN = function(){
	if(this.timerDown == null && !this.lockedMovement){
		if(this.timerUp!= null)this.upUP();
		var self = this;
		this.timerDown = setInterval(function(){
		if(self.onBeforeMove(self.centerX, self.centerY + self.step)){
			self.y += self.step;
			self._culcCenterOfEntity();
			self.onMove();	
		}
		}, this.frstep);
	}
}

//start move left		
Player.prototype.downLEFT = function(){
	if(this.timerLeft == null && !this.lockedMovement){
		if(this.timerRight != null)this.upRIGHT();
		var self = this;
		this.timerLeft = setInterval(function(){
			if(self.onBeforeMove(self.centerX - self.step, self.centerY)){
				self.x -= self.step;
				self._culcCenterOfEntity();
				self.onMove();		
			}
		}, this.frstep);
	}
}

//start move right		
Player.prototype.downRIGHT = function(){
	if(this.timerRight == null && !this.lockedMovement){
		if(this.timerLeft != null)this.upLEFT();
		var self = this;
		this.timerRight = setInterval(function(){
			if(self.onBeforeMove(self.centerX + self.step, self.centerY)){
				self.x += self.step;
				self._culcCenterOfEntity();
				self.onMove();;		
			}
		}, this.frstep);
	}
}

//stop move up	
Player.prototype.upUP = function(){
	clearInterval(this.timerUp);
	this.timerUp = null;
}

//stop move down		
Player.prototype.upDOWN = function(){
	clearInterval(this.timerDown);
	this.timerDown = null;
}

//stop move left		
Player.prototype.upLEFT = function(){
	clearInterval(this.timerLeft);
	this.timerLeft = null;
}

//stop move right		
Player.prototype.upRIGHT = function(){
	clearInterval(this.timerRight);
	this.timerRight = null;
}

Player.prototype.lostLife = function(){
	this.lifes--;
	if(this.lifes <= 0){
		this.onDead();
	}else{
		this.onLostLife();
	}
}

//event. must check does player can move to x, y
Player.prototype.onBeforeMove = function(x, y){
	return true;
}
//event
Player.prototype.onMove = function(){
	
}
//event
Player.prototype.onDead = function(){

}
//event
Player.prototype.onLostLife = function(){

}

var keyBoardControl = {
	listeners: new Array(),
	
	addListener: function(listener){
		this.listeners.push(listener);
	},
	
	clearListeners: function(){
		this.listeners = new Array();
	},
	
	keyDown: function(event){
		var key = event.keyCode;
		if(key == 38){
			keyBoardControl.callForAllListeners("downUP");
		}else if(key == 40){
			keyBoardControl.callForAllListeners("downDOWN");
		}else if(key == 37){
			keyBoardControl.callForAllListeners("downLEFT");
		}else if(key == 39){
			keyBoardControl.callForAllListeners("downRIGHT");
		}else if(key == 13){
			keyBoardControl.callForAllListeners("downENTER");
		}
	},
	
	keyUp: function(event){
		var key = event.keyCode;
		if(key == 38){
			keyBoardControl.callForAllListeners("upUP");
		}else if(key == 40){
			keyBoardControl.callForAllListeners("upDOWN");
		}else if(key == 37){
			keyBoardControl.callForAllListeners("upLEFT");
		}else if(key == 39){
			keyBoardControl.callForAllListeners("upRIGHT");
		}
	},
	
	callForAllListeners: function(funcName){
		//mekes copy of listeners
		var currentListeners = new Array();
		for(var i=0;i<this.listeners.length; i++){
			currentListeners.push(this.listeners[i]);
		}
		
		//uses copy for calling events
		for(var i=0;i<currentListeners.length;i++){
			var listener = currentListeners[i]; 
			if(funcName in listener && typeof listener[funcName] == "function"){
				listener[funcName]();
			}
		}
	}
}

var i = 20;

var levels = [
				{/*level 1*/
					playerStart:[20, 80],
					time:[80, 41, 27], 
					blocks:[
							[-5, 80, 1, 20],
							[19 * i, 8 * i, 1, 20],
							[0, 0, 400, 20],
							[0, 20, 80, 60],
							[80, 20, 20, 20],
							[100, 60, 20, 20],
							[120, 40, 60, 40],
							[0, 100, 80, 40],
							[10 * i, 2 * i, 4 * i, 2 * i],
							[15 * i, 2 * i, 3 * i, 2 * i],
							[19 * i, 1 * i, 1 * i, 2 * i],
							[8 * i, 4 * i, 1 * i, 1 * i],
							[10 * i, 4 * i, 1 * i, 2 * i],
							[13 * i, 4 * i, 1 * i, 4 * i],
							[18 * i, 3 * i, 2 * i, 5 * i],
							[5 * i, 5 * i, 2 * i, 2 * i],
							[8 * i, 5 * i, 2 * i, 2 * i],
							[11 * i, 5 * i, 1 * i, 4 * i],
							[14 * i, 5 * i, 4 * i, 1 * i],
							[0 * i, 7 * i, 1 * i, 13 * i],
							[15 * i, 7 * i, 2 * i, 2 * i],
							[2 * i, 8 * i, 2 * i, 3 * i],
							[5 * i, 8 * i, 3 * i, 2 * i],
							[8 * i, 8 * i, 2 * i, 1 * i],
							[9 * i, 9 * i, 8 * i, 1 * i],
							[18 * i, 9 * i, 2 * i, 5 * i],
							[1 * i, 10 * i, 1 * i, 1 * i],
							[5 * i, 10 * i, 2 * i, 5 * i],
							[11 * i, 10 * i, 2 * i, 3 * i],
							[8 * i, 11 * i, 2 * i, 2 * i],
							[14 * i, 11 * i, 3 * i, 3 * i],
							[2 * i, 12 * i, 2 * i, 1 * i],
							[2 * i, 13 * i, 1 * i, 1 * i],
							[8 * i, 13 * i, 1 * i, 1 * i],
							[17 * i, 13 * i, 1 * i, 1 * i],
							[2 * i, 14 * i, 3 * i, 1 * i],
							[7 * i, 14 * i, 2 * i, 3 * i],
							[10 * i, 14 * i, 2 * i, 4 * i],
							[13 * i, 14 * i, 3 * i, 2 * i],
							[19 * i, 14 * i, 1 * i, 5 * i],
							[17 * i, 15 * i, 1 * i, 3 * i],
							[1 * i, 16 * i, 1 * i, 4 * i],
							[3 * i, 16 * i, 3 * i, 2 * i],
							[12 * i, 17 * i, 2 * i, 1 * i],
							[15 * i, 17 * i, 2 * i, 1 * i],
							[5 * i, 18 * i, 9 * i, 2 * i],
							[2 * i, 19 * i, 3 * i, 1 * i],
							[14 * i, 19 * i, 6 * i, 1 * i]			
						   ], 
					bots:[/*x, y, step, frstep, x1, y1, x2, y2*/
						  [
							  [100, 20, 5, 60, 100, 20, 360, 20],
							  [80, 40, 5, 60, 80, 40, 80, 240]
							  
						  ],
						  [
							  [100, 20, 10, 60, 100, 20, 360, 20],
							  [80, 40, 10, 60, 80, 40, 80, 240]
						  ],
						  [
							  [100, 20, 10, 40, 100, 20, 360, 20],
							  [80, 40, 10, 40, 80, 40, 80, 240],
							  [340, 240, 6, 47, 340, 240, 340, 125]
						  ]
						 
					],
					dolars:[
						[
							[180, 80],
							[220, 80],
							[20, 180],
							[140, 260]
						],
						[
							[180, 80],
							[220, 80],
							[20, 180],
							[140, 260]
						],
						[
							[180, 80],
							[220, 80],
							[20, 180],
							[140, 260]
						],
						
					],
					finish:[375, 160]
				},
				
				{/*level 2*/
					playerStart:[0, 300],
					time:[70, 60, 28], 
					blocks:[
							[-5, 15 * i, 1, 1 * i],
							[19 * i, 11 * i, 1, 1 * i],
							[0 * i, 0 * i, 20 * i, 1 * i],
							[0 * i, 1 * i, 2 * i, 3 * i],
							[5 * i, 1 * i, 9 * i, 1 * i],
							[19 * i, 1 * i, 1 * i, 10 * i],
							[3 * i, 2 * i, 3 * i, 2 * i],
							[10 * i, 2 * i, 4 * i, 1 * i],
							[15 * i, 2 * i, 3 * i, 1 * i],
							[7 * i, 3 * i, 2 * i, 3 * i],
							[10 * i, 3 * i, 2 * i, 3 * i],
							[17 * i, 3 * i, 1 * i, 2 * i],
							[0 * i, 4 * i, 1 * i, 11 * i],
							[13 * i, 4 * i, 3 * i, 2 * i],
							[2 * i, 5 * i, 5 * i, 1 * i],
							[2 * i, 6 * i, 1 * i, 2 * i],
							[5 * i, 6 * i, 2 * i, 6 * i],
							[8 * i, 6 * i, 1 * i, 3 * i],
							[14 * i, 6 * i, 5 * i, 3 * i],
							[3 * i, 7 * i, 1 * i, 1 * i],
							[9 * i, 7 * i, 1 * i, 2 * i],
							[11 * i, 7 * i, 2 * i, 3 * i],
							[2 * i, 9 * i, 2 * i, 3 * i],
							[18 * i, 9 * i, 1 * i, 2 * i],
							[7 * i, 10 * i, 1 * i, 2 * i],
							[9 * i, 10 * i, 8 * i, 1 * i],
							[8 * i, 11 * i, 2 * i, 1 * i],
							[11 * i, 11 * i, 1 * i, 3 * i],
							[15 * i, 11 * i, 2 * i, 2 * i],
							[13 * i, 12 * i, 1 * i, 4 * i],
							[18 * i, 12 * i, 2 * i, 5 * i],
							[2 * i, 13 * i, 2 * i, 2 * i],
							[5 * i, 13 * i, 2 * i, 2 * i],
							[8 * i, 13 * i, 2 * i, 2 * i],
							[1 * i, 14 * i, 1 * i, 1 * i],
							[10 * i, 14 * i, 2 * i, 1 * i],
							[14 * i, 14 * i, 4 * i, 1 * i],
							[8 * i, 15 * i, 1 * i, 1 * i],
							[10 * i, 15 * i, 1 * i, 1 * i],
							[0 * i, 16 * i, 4 * i, 4 * i],
							[5 * i, 16 * i, 1 * i, 1 * i],
							[6 * i, 16 * i, 3 * i, 2 * i],
							[10 * i, 16 * i, 4 * i, 2 * i],
							[15 * i, 16 * i, 3 * i, 2 * i],
							[19 * i, 17 * i, 1 * i, 3 * i],
							[4 * i, 18 * i, 1 * i, 2 * i],
							[5 * i, 19 * i, 14 * i, 1 * i]										
						   ], 
					bots:[/*x, y, step, frstep, x1, y1, x2, y2*/
						  [
							  [100, 360, 5, 65, 100, 360, 360, 360],
							  [200, 240, 5, 65, 200, 240, 40, 240],
							  [20, 235, 5, 65, 20, 235, 20, 80]
							  
						  ],
						  [
							  [100, 360, 10, 60, 100, 360, 360, 360],
							  [200, 240, 5, 60, 200, 240, 40, 240],
							  [20, 235, 7, 60, 20, 235, 20, 80]
						  ],
						  [
							  [100, 360, 9, 50, 100, 360, 360, 360],
							  [200, 240, 10, 40, 200, 240, 40, 240],
							  [20, 235, 10, 55, 20, 235, 20, 80],
							  [80, 120, 8, 55, 80, 120, 80, 230]
						  ]
						 
					],
					dolars:[
						[
							[360, 340],
							[360, 340],
							[20, 260],
							[60, 120],
							[220, 300]
						],
						[
							[360, 340],
							[360, 340],
							[20, 260],
							[60, 120],
							[220, 300]
						],
						[
							[360, 340],
							[360, 340],
							[20, 260],
							[60, 120],
							[220, 300]
						],
						
					],
					finish:[370, 11 * i]
				},
				
				{/*level 3*/
					playerStart:[0 * i, 13 * i],
					time:[65, 50, 40], 
					blocks:[
							[-5, 13 * i, 1, 1 * i],
							[260, 390, 1 * i, 1],
							[0 * i, 0 * i, 20 * i, 1 * i],
							[0 * i, 1 * i, 2 * i, 4 * i],
							[5 * i, 1 * i, 4 * i, 1 * i],
							[15 * i, 1 * i, 2 * i, 1 * i],
							[19 * i, 1 * i, 1 * i, 19 * i],
							[3 * i, 2 * i, 1 * i, 2 * i],
							[10 * i, 2 * i, 4 * i, 1 * i],
							[16 * i, 2 * i, 1 * i, 4 * i],
							[17 * i, 2 * i, 1 * i, 1 * i],
							[4 * i, 3 * i, 5 * i, 1 * i],
							[13 * i, 3 * i, 2 * i, 3 * i],
							[6 * i, 4 * i, 1 * i, 10 * i],
							[8 * i, 4 * i, 4 * i, 2 * i],
							[18 * i, 4 * i, 1 * i, 6 * i],
							[0 * i, 5 * i, 1 * i, 8 * i],
							[3 * i, 5 * i, 2 * i, 2 * i],
							[15 * i, 5 * i, 1 * i, 1 * i],
							[1 * i, 6 * i, 2 * i, 3 * i],
							[7 * i, 7 * i, 5 * i, 1 * i],
							[13 * i, 7 * i, 5 * i, 1 * i],
							[4 * i, 8 * i, 2 * i, 2 * i],
							[10 * i, 8 * i, 2 * i, 3 * i],
							[13 * i, 8 * i, 2 * i, 3 * i],
							[13 * i, 8 * i, 2 * i, 1 * i],
							[16 * i, 8 * i, 2 * i, 1 * i],
							[7 * i, 9 * i, 2 * i, 2 * i],
							[2 * i, 10 * i, 1 * i, 2 * i],
							[15 * i, 10 * i, 2 * i, 1 * i],
							[3 * i, 11 * i, 2 * i, 1 * i],
							[16 * i, 11 * i, 1 * i, 3 * i],
							[18 * i, 11 * i, 1 * i, 4 * i],
							[1 * i, 12 * i, 2 * i, 1 * i],
							[7 * i, 12 * i, 2 * i, 1 * i],
							[10 * i, 12 * i, 5 * i, 1 * i],
							[4 * i, 13 * i, 2 * i, 1 * i],
							[10 * i, 13 * i, 1 * i, 1 * i],
							[14 * i, 13 * i, 1 * i, 1 * i],
							[0 * i, 14 * i, 5 * i, 2 * i],
							[8 * i, 14 * i, 3 * i, 1 * i],
							[12 * i, 14 * i, 1 * i, 1 * i],
							[5 * i, 15 * i, 4 * i, 1 * i],
							[12 * i, 15 * i, 3 * i, 2 * i],
							[16 * i, 15 * i, 3 * i, 1 * i],
							[0 * i, 16 * i, 1 * i, 4 * i],
							[5 * i, 16 * i, 1 * i, 2 * i],
							[10 * i, 16 * i, 2 * i, 1 * i],
							[2 * i, 17 * i, 2 * i, 2 * i],
							[7 * i, 17 * i, 2 * i, 1 * i],
							[14 * i, 17 * i, 4 * i, 3 * i],
							[8 * i, 18 * i, 5 * i, 1 * i],
							[18 * i, 18 * i, 1 * i, 2 * i],
							[1 * i, 19 * i, 12 * i, 1 * i]								
						   ], 
					bots:[/*x, y, step, frstep, x1, y1, x2, y2*/
						  [
							  [260, 280, 5, 75, 260, 280, 340, 280],
							  [140, 220, 5, 85, 140, 220, 210, 220],
							  [240, 200, 5, 65, 240, 200, 240, 60]
						  ],
						  [
							  [260, 280, 5, 65, 260, 280, 340, 280],
							  [140, 220, 5, 55, 140, 220, 210, 220],
							  [240, 200, 8, 60, 240, 200, 240, 60]
						  ],
						  [
							  [260, 280, 6, 55, 260, 280, 340, 280],
							  [140, 220, 6, 55, 140, 220, 210, 220],
							  [240, 200, 10, 50, 240, 200, 240, 60]
						  ]
						 
					],
					dolars:[
						[
							[5 * i, 14 * i],
							[7 * i, 18 * i],
							//[15 * i, 8 * i],
							[17 * i, 1 * i]
						],
						[
							[5 * i, 14 * i],
							[7 * i, 18 * i],
							[15 * i, 8 * i],
							[17 * i, 1 * i]
						],
						[
							[5 * i, 14 * i],
							[7 * i, 18 * i],
							[15 * i, 8 * i],
							[17 * i, 1 * i]
						],
						
					],
					finish:[260, 375]
				},
				
				{/*level 4*/
					playerStart:[0, 120],
					time:[70, 50, 40], 
					blocks:[
							[260, 0, 1 * i, 1],
							[-5, 120, 1, 1 * i],
							[0 * i, 0 * i, 13 * i, 1 * i],
							[14 * i, 0 * i, 6 * i, 2 * i],
							[0 * i, 1 * i, 1 * i, 5 * i],
							[2 * i, 1 * i, 2 * i, 2 * i],
							[8 * i, 1 * i, 5 * i, 1 * i],
							[5 * i, 2 * i, 1 * i, 3 * i],
							[7 * i, 2 * i, 2 * i, 1 * i],
							[14 * i, 2 * i, 4 * i, 1 * i],
							[19 * i, 2 * i, 1 * i, 18 * i],
							[10 * i, 3 * i, 5 * i, 1 * i],
							[1 * i, 4 * i, 4 * i, 2 * i],
							[6 * i, 4 * i, 3 * i, 1 * i],
							[12 * i, 4 * i, 3 * i, 1 * i],
							[16 * i, 4 * i, 3 * i, 1 * i],
							[8 * i, 5 * i, 3 * i, 1 * i],
							[12 * i, 5 * i, 1 * i, 1 * i],
							[4 * i, 6 * i, 3 * i, 1 * i],
							[10 * i, 6 * i, 1 * i, 2 * i],
							[14 * i, 6 * i, 1 * i, 1 * i],
							[16 * i, 6 * i, 1 * i, 4 * i],
							[18 * i, 5 * i, 1 * i, 4 * i],
							[0 * i, 7 * i, 3 * i, 1 * i],
							[6 * i, 7 * i, 3 * i, 1 * i],
							[11 * i, 7 * i, 4 * i, 1 * i],
							[0 * i, 8 * i, 1 * i, 12 * i],
							[2 * i, 8 * i, 3 * i, 1 * i],
							[6 * i, 8 * i, 1 * i, 8 * i],
							[2 * i, 9 * i, 1 * i, 1 * i],
							[7 * i, 9 * i, 2 * i, 2 * i],
							[10 * i, 9 * i, 2 * i, 4 * i],
							[13 * i, 9 * i, 2 * i, 4 * i],
							[15 * i, 9 * i, 1 * i, 1 * i],
							[4 * i, 10 * i, 2 * i, 2 * i],
							[18 * i, 10 * i, 1 * i, 6 * i],
							[1 * i, 11 * i, 2 * i, 3 * i],
							[16 * i, 11 * i, 2 * i, 1 * i],
							[7 * i, 12 * i, 3 * i, 1 * i],
							[15 * i, 12 * i, 3 * i, 1 * i],
							[3 * i, 13 * i, 2 * i, 2 * i],
							[8 * i, 14 * i, 4 * i, 2 * i],
							[13 * i, 14 * i, 4 * i, 1 * i],
							[1 * i, 15 * i, 1 * i, 5 * i],
							[13 * i, 15 * i, 1 * i, 3 * i],
							[14 * i, 15 * i, 1 * i, 2 * i],
							[16 * i, 15 * i, 1 * i, 4 * i],
							[3 * i, 16 * i, 6 * i, 1 * i],
							[3 * i, 17 * i, 1 * i, 1 * i],
							[10 * i, 17 * i, 2 * i, 1 * i],
							[17 * i, 17 * i, 1 * i, 1 * i],
							[5 * i, 18 * i, 4 * i, 1 * i],
							[15 * i, 18 * i, 1 * i, 1 * i],
							[2 * i, 19 * i, 17 * i, 1 * i]
						   ], 
					bots:[/*x, y, step, frstep, x1, y1, x2, y2*/
							  [
								 // [260, 100, 5, 70, 260, 100, 340, 100],
								  [180, 125, 5, 80, 180, 125, 180, 215],
								  [240, 340, 5, 75, 240, 340, 240, 165]
							  ],
							  [
								  [260, 100, 10, 70, 260, 100, 340, 100],
								  [180, 125, 8, 70, 180, 125, 180, 215],
								  [240, 340, 8, 65, 240, 340, 240, 165]
							  ],
							  [
								  [260, 100, 6, 55, 260, 100, 340, 100],
								  [180, 125, 9, 65, 180, 125, 180, 215],
								  [240, 340, 5, 55, 240, 340, 240, 165],
								  [140, 260, 10, 55, 140, 260, 280, 260]	
							  ]
							 
						  ],
					dolars:[
						[
							[17*i, 18*i],
							[5*i, 5*i],
							[15*i, 11*i],
							[18*i, 2*i]
						],
						[
							[17*i, 18*i],
							[5*i, 5*i],
							[18*i, 2*i]
						],
						[
							[17*i, 18*i],
							[5*i, 5*i],
							[15*i, 11*i]
						],
						
					],
					finish:[260, 0]
				},
				
				{/*level 5*/
					playerStart:[200, 260],
					time:[300, 200, 100], 
					blocks:[
							[160, 240, 10, 80],
							[160, 240, 80, 10],
							[240, 240, 10, 80],
							[160, 320, 90, 10]										
						   ], 
					bots:[
						  [ ],
						  [ ],
						  [ ]						 
						  ],
					dolars:[
							  [ ],
							  [ ],
							  [ ]						 
						  ],
					finish:[-20,20],
					specEntity:[160, 240, 90, 90, "grid"]
				}
				
				
		];

var menu = {
	selectedDufficult : 1,
		
	draw: function(context){
		//draw background
		context.drawImage(imgLoader.getImg("menu"), 0, 0, context.canvas.width, context.canvas.height);
		
		//draw selector
		context.fillStyle = "#FFFF33";
		context.fillRect(140,240+35*this.selectedDufficult, 15, 15);
		
		//draw difficult levels
		context.textBaseline = "top";
		context.fillStyle = "#000000";
		context.font = "30px tomas"
		context.fillText(consts.LEVEL_DIFFICULTS, 130, 195);
		context.fillText(consts.EASY, 170, 230);
		context.fillText(consts.NORMAL, 170, 265);
		context.fillText(consts.HARD, 170, 300);
		
		context.font = "11px tomas"
		context.fillText(consts.INSTRUCT1, 40, 355);
		context.fillText(consts.INSTRUCT2, 40, 366);
	},
	
	//does when pressed down
	downDOWN: function(){
		if(this.selectedDufficult + 1 <= 2)
			this.selectedDufficult++;
	},
	
	//does when pressed up
	downUP: function(){
		if(this.selectedDufficult - 1 >= 0)
			this.selectedDufficult--;
	},
	
	//does when pressed enter
	downENTER: function(){// start Game
		var player = new Player(0, 0,consts.ENTITY_WIDTH, consts.ENTITY_HEIGHT,imgLoader.getImg("player"), consts.PLAYER_STEP, consts.PLAYER_FRSTEP, this.selectedDufficult);
		
		keyBoardControl.clearListeners();		
		keyBoardControl.addListener(player);
		keyBoardControl.addListener(world);

		frapsManager.setObject(world);
		
		world.startLevel(0, player);		
	}

}

window.onload = function(){
	imgLoader.allImgLoaded = function(){
		startGame();
	}
	imgLoader.load();

}

function startGame(){
	document.onkeydown = keyBoardControl.keyDown;
	document.onkeyup = keyBoardControl.keyUp;		
	
	var context = document.getElementById("canv").getContext("2d");
	keyBoardControl.addListener(menu);		
	frapsManager.init(context, menu, consts.FPS, true);
	frapsManager.start();
}
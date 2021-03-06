var game_scale = 1;
var gameport = document.getElementById("gameport");

var renderer = PIXI.autoDetectRenderer(800, 700, {backgroundColor: 0x3344ee});
gameport.appendChild(renderer.view);

var stage = new PIXI.Container();
stage.x = -100;
stage.y = -1700;
stage.scale.x = game_scale;
stage.scale.y = game_scale;

var GRAVITY = 10;
var JUMP = -10;

var player;
var test;
var platforms = []; //This array will store all of the platforms in a level
var platform;
var numPlatforms = 2; //This will change depending on the level
var ground;
var hero;
var text;
var enemy_object;
var enemy;

//HUD elements
var HUD = new PIXI.Container();
HUD.x = 100;
HUD.y = 1700;
HUD.interactive = true;
var heart1;
var heart2;
var heart3;
var heartCount = 3;
var isHit = false;

//Game Over Screen elements
var gameOverScreen;
var gO_Count = 0;
var gO_boolean = false;
var backButton;

//Main Menu Screen elements
var mainMenu;
var startButton;
var levelMenu;

//Collision detection code
isIntersecting = function(r1, r2) {
        return !(r2.x-4 > (r1.x-4 + r1.width-4)  || 
           (r2.x-4 + r2.width-4 ) < r1.x-4 || 
           r2.y-4 > (r1.y-4 + r1.height-4) ||
           (r2.y-4 + r2.height-4) < r1.y-4);
}

function adjustCamera(){

}

window.addEventListener("keydown", function (e) {
  e.preventDefault();

  	if (gO_boolean == false){
  		if (e.keyCode == 65){//This is the A key
  			player.vx = -4;
  		}
		else if (e.keyCode == 68){//This is the D key
			player.vx = 4;
		}
		else if (e.keyCode == 32){//This is the SPACE key
			jump();
		}	
		console.log(e.keyCode);
	}
});

window.addEventListener("keyup", function (e) {
  e.preventDefault();

  	if (e.keyCode == 65){//This is the A key
  		player.vx = 0;
  	}
	else if (e.keyCode == 68){//This is the D key
		player.vx = 0;
	}	
	console.log(e.keyCode);
	
});

function jump(){
	if (player.vy == 0){
		player.vy += JUMP;
	}
}	

function checkCameraBounds(){
	if (stage.x + player.x > 600){
		stage.x += -4;
		HUD.x += 4;
	}
	if (stage.x + player.x < 100){
		stage.x += 4;
		HUD.x -= 4;
	}
}

function move(){
	player.y += player.vy;
	player.x += player.vx;
}

function checkDamage(){
	if (isIntersecting(player, enemy)){
		player.x = player.x - 15;
		player.y = player.y - 15;
		var new_x = player.x - 100;
		var new_y = player.y - 25;
		createjs.Tween.get(player.position).to({x: new_x, y: new_y}, 100, createjs.Ease.bounceOut);
		if (heartCount == 3){
			heart3.alpha = 0;
		}
		else if (heartCount == 2){
			heart2.alpha = 0;
		}
		else if (heartCount == 1){
			heart1.alpha = 0;
			gO_boolean = true;
			new_x = player.x - 500;
			new_y = player.y + 1000;
			createjs.Tween.get(player.position).to({x: new_x, y: new_y}, 5000);
		}
		heartCount--;
	}
}
function quitToMenu(e){
	mainmenu.alpha = 1;
}
function goToLevelSelect(e){
	mainMenu.alpha = 0;
	startButton.alpha = 0;
}
function gameOver(){
	gO_Count++;
	if (gO_Count > 200){
		gameOverScreen.alpha = 1;
		backButton.alpha = 1;
	}

}
checkFalling = function(verticalForce){

	for (var j in platforms){
		ground = platforms[j];
		if (verticalForce >= 0){
			if (isIntersecting(player, ground)){
				player.vy = 0;
				text.text = "array #" + j;
				return;
			}
			else{
				player.vy = GRAVITY;
			}
		}
	}
}

var testmap = "test_level.json";

PIXI.loader
	.add("mainMenu", "mainmenu.png")
	.add("startButton", "startbutton.png")
	.add("levelMenu", "levelselectscreen.png")
	.add("backButton", "backbutton.png")
	.add("gOScreen", "gameover_screen.png")
	.add("heart", "heart.png")
	.add("map_json", testmap)
	.add("tileset", "tileset1.png")
	.add("player", "main_character1.png")
	.add("enemy", "lightbulb.png")
	.load(ready);

function ready(){

	//World initialization
	let tu = new TileUtilities(PIXI);
	let world = tu.makeTiledWorld("map_json", "tileset1.png");
	stage.addChild(world);

	//Platform initialization
	for (var i = 1; i <= numPlatforms; i++){
		platforms.push(world.getObject("ground" + i));
	}

	//Enemy initialization
	enemy_object = world.getObject("enemy");
	enemy = new PIXI.Sprite(PIXI.loader.resources.enemy.texture);
	enemy.x = enemy_object.x;
	enemy.x = enemy_object.x;
	enemy.y = enemy_object.y;
	enemy.width = 50;
	enemy.height = 50;
	enemy.anchor.x = 0.0;
	enemy.anchor.y = 0.0;

	//HUD initialization
	heart1 = new PIXI.Sprite(PIXI.loader.resources.heart.texture);
	heart1.x = 10;
	heart1.y = 10;
	HUD.addChild(heart1);
	heart2 = new PIXI.Sprite(PIXI.loader.resources.heart.texture);
	heart2.x = 60;
	heart2.y = 10;
	HUD.addChild(heart2);
	heart3 = new PIXI.Sprite(PIXI.loader.resources.heart.texture);
	heart3.x = 110;
	heart3.y = 10;
	HUD.addChild(heart3);

	//Player initialization
	hero = world.getObject("hero");
	player = new PIXI.Sprite(PIXI.loader.resources.player.texture);
	player.x = hero.x;
	player.y = hero.y;
	player.width = 60;
	player.height = 116;
	player.anchor.x = 0.0;
	player.anchor.y = 0.0;
	player.vy = GRAVITY;
	player.vx = 0;

	ground = platforms[0];
	var entity_layer = world.getObject("player");
	entity_layer.addChild(player);
	entity_layer.addChild(enemy);
	stage.addChild(HUD);
	
	text = new PIXI.Text('',{font : '40px Arial', fill : 0x000000, align : 'center'});
	text.x = 50;
	text.y = 100;
	HUD.addChild(text);
	
	//Main Menu Screen initialization
	mainMenu = new PIXI.Sprite(PIXI.loader.resources.mainMenu.texture);
	mainMenu.x = 0;
	mainMenu.y = 0;
	mainMenu.alpha = 0;
	HUD.addChild(mainMenu);
	/*
	startButton = new PIXI.Sprite(PIXI.loader.resources.startButton.texture);
	startButton.x = 500;
	startButton.y = 500;
	startButton.interactive = true;
	startButton.on('mousedown', goToLevelSelect);
	HUD.addChild(startButton);
	*/
	//Game Over Screen initialization
	gameOverScreen = new PIXI.Sprite(PIXI.loader.resources.gOScreen.texture);
	gameOverScreen.x = 0;
	gameOverScreen.y = 0;
	gameOverScreen.alpha = 0;
	HUD.addChild(gameOverScreen);

	backButton = new PIXI.Sprite(PIXI.loader.resources.backButton.texture);
	backButton.x = 500;
	backButton.y = 500;
	backButton.alpha = 0;
	backButton.interactive = true;
	backButton.on('mousedown', quitToMenu);
	HUD.addChild(backButton);


	animate();
}

function loadLevelOne(){
	
}

var jumpCount = 0;
var isHitCount = 0;
function animate() {
	requestAnimationFrame(animate);
	renderer.render(stage);

	if (gO_boolean == false){
		checkDamage();
		checkFalling(player.vy);
		checkCameraBounds();
		move();
	}
	if (gO_boolean == true){
		gameOver();
	}

	if (player.vy < 0){//Then the player is jumping
		if (jumpCount > 40){
			player.vy = GRAVITY;
			jumpCount = 0;
		}
		jumpCount++;
	}


}

var game_scale = 1;
var gameport = document.getElementById("gameport");

var renderer = PIXI.autoDetectRenderer(800, 700, {backgroundColor: 0x3344ee});
gameport.appendChild(renderer.view);

var stage = new PIXI.Container();
stage.x = 0;
stage.y = 0;
stage.scale.x = game_scale;
stage.scale.y = game_scale;

var GRAVITY = 10;
var JUMP = -10;

//Player elements
var player = new PIXI.Container();
var standingSprite;
var walkingSprite;
var frames = [];

//World elements
var exit_object;
var levelExit;
var world;
var test;
var barriers = [];
var barrier;
var numBarriers = 1;
var platforms = []; //This array will store all of the platforms in a level
var platform;
var numPlatforms = 2; //This will change depending on the level
var ground;
var hero;
var text;

//Enemy elements
var numEnemies = 2;
var enemy_object;
var enemies = [];
var enemy;

//Game Over Screen elements
var gameOverScreen;
var GO_Screen_Containter = new PIXI.Container();
var gO_Count = 0;
var gO_boolean = false;
var backButton;

//Level Win Screen elements
var levelWinScreen;
var LW_Screen_Container = new PIXI.Container();

//Main Menu Screen elements
var mainMenu;
var MMenu_Container = new PIXI.Container();
var startButton;

//Level Select Screen elements
var LMenu_Container = new PIXI.Container();
var levelMenu;
var gameStart = false;
var L1Button;

//HUD elements
var HUD = new PIXI.Container();
HUD.x = 0;
HUD.y = 0;
HUD.interactive = true;
stage.addChild(HUD);
var heart1;
var heart2;
var heart3;
var heartCount = 3;
var isHit = false;

//Collision detection code
isIntersecting = function(r1, r2) {
        return !(r2.x-4 > (r1.x-4 + r1.width-4)  || 
           (r2.x-4 + r2.width-4 ) < r1.x-4 || 
           r2.y-4 > (r1.y-4 + r1.height-4) ||
           (r2.y-4 + r2.height-4) < r1.y-4);
}

function adjustCamera(){

}

changeAnimation = function(direction, state){
	if (direction == "left" && state == "on"){
		walkingSprite.play();
		if (walkingSprite.scale.x != -1){
			walkingSprite.scale.x = -1;
			walkingSprite.anchor.x = 1;
		}
		player.addChild(walkingSprite);
		player.removeChild(standingSprite);
	}
	if (direction == "right" && state == "on"){
		walkingSprite.play();
		if (walkingSprite.scale.x != 1){
			walkingSprite.scale.x = 1;
			walkingSprite.anchor.x = 0;
		}
		player.addChild(walkingSprite);
		player.removeChild(standingSprite);
	}
	if (direction == "left" && state == "off"){
		walkingSprite.stop();
		if (standingSprite.scale.x != -1){
			standingSprite.scale.x = -1;
			standingSprite.anchor.x = 1;
		}
		player.addChild(standingSprite);
		player.removeChild(walkingSprite);
	}
	if (direction == "right" && state == "off"){
		walkingSprite.stop();
		if (standingSprite.scale.x != 1){
			standingSprite.scale.x = 1;
			standingSprite.anchor.x = 0;
		}
		player.addChild(standingSprite);
		player.removeChild(walkingSprite);
	}
}

window.addEventListener("keydown", function (e) {
  e.preventDefault();

  	if (gO_boolean == false){
  		if (e.keyCode == 65){//This is the A key
  			player.vx = -4;
  			changeAnimation("left", "on");
  		}
		else if (e.keyCode == 68){//This is the D key
			player.vx = 4;
			changeAnimation("right", "on");
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
  		changeAnimation("left", "off");
  	}
	else if (e.keyCode == 68){//This is the D key
		player.vx = 0;
		changeAnimation("right", "off");
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
	if (stage.y + player.y < 100){
		stage.y += 4;
		HUD.y -= 4;
	}
	if (stage.y + player.y > 450){
		stage.y += -4;
		HUD.y += 4;
	}
}

function checkBarriers(){
	for (var i in barriers){
		barrier = barriers[i]
		if (isIntersecting(player, barrier)){
			if(player.x > barrier.x){
				player.x = player.x + 10;
			}
			else {
				player.x = player.x - 10;
			}
		}
	}
}

function move(){
	player.y += player.vy;
	player.x += player.vx;
}

function checkDamage(){

	if (gameStart == true){
		for (var i in enemies){
			enemy = enemies[i];
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
				}
				heartCount--;
			}
		}
	}
}
function quitGame(e){
	gameStart = false;
	stage.removeChild(world);
	HUD.removeChild(GO_Screen_Containter);
	HUD.removeChild(LW_Screen_Container);
	HUD.addChild(MMenu_Container);
}
function quitToMenu(e){
	HUD.removeChild(MMenu_Container);
	HUD.addChild(MMenu_Container);
}
function levelSelection(e){
	HUD.removeChild(MMenu_Container);//Remove the main menu elements
	HUD.addChild(LMenu_Container);//Add the level selection elements
}

function gameOver(){
	HUD.addChild(GO_Screen_Containter);
}
function levelWin(){
	HUD.addChild(LW_Screen_Container);
}
checkFalling = function(verticalForce){

	for (var j in platforms){
		ground = platforms[j];
		if (verticalForce >= 0){
			if (isIntersecting(player, ground)){
				player.vy = 0;
				return;
			}
			else{
				player.vy = GRAVITY;
			}
		}
	}
}


function levelOneInit(e){
	numBarriers = 39;
	numPlatforms = 42;
	PIXI.loader.reset();
	HUD.removeChild(LMenu_Container);
	PIXI.loader
		.add("heart", "heart.png")
		.add("map_json", "level_one.json")
		.add("tileset", "tileset1.png")
		.add("player", "main_character1.png")
		.add("enemy", "lightbulb.png")
		.add("levelexit", "exitdoor.png")
		.load(levelOne);
}

PIXI.loader
	.add("mainMenu", "mainmenu.png")
	.add("startButton", "startbutton.png")
	.add("levelMenu", "levelselectscreen.png")
	.add("L1_Button", "L1_Button.png")
	.add("backButton", "backbutton.png")
	.add("gOScreen", "gameover_screen.png")
	.add("levelWin", "levelWinScreen.png")
	.add("amishwalk", "amishwalk.json")
	.load(ready);

function ready(){

	for (var i = 1; i <= 26; i++){
		frames.push(PIXI.Texture.fromFrame("main_character" + i + ".png"))
	}

	walkingSprite = new PIXI.extras.MovieClip(frames);
	walkingSprite.animationSpeed = 1;
	walkingSprite.x = 0;
	walkingSprite.y = 0;
	walkingSprite.play();
	
	//Main Menu Screen initialization
	mainMenu = new PIXI.Sprite(PIXI.loader.resources.mainMenu.texture);
	mainMenu.x = 0;
	mainMenu.y = 0;
	mainMenu.alpha = 1;
	MMenu_Container.addChild(mainMenu);
	
	startButton = new PIXI.Sprite(PIXI.loader.resources.startButton.texture);
	startButton.x = 300;
	startButton.y = 500;
	startButton.alpha = 1;
	startButton.interactive = true;
	startButton.on('click', levelSelection);
	MMenu_Container.addChild(startButton);
	HUD.addChild(MMenu_Container);

	//Game Over Screen initialization
	gameOverScreen = new PIXI.Sprite(PIXI.loader.resources.gOScreen.texture);
	gameOverScreen.x = 0;
	gameOverScreen.y = 0;

	returnButton = new PIXI.Sprite(PIXI.loader.resources.backButton.texture);
	returnButton.x = 600;
	returnButton.y = 50;
	returnButton.interactive = true;
	returnButton.on('click', quitGame);

	GO_Screen_Containter.addChild(gameOverScreen);
	GO_Screen_Containter.addChild(returnButton);

	//Level Select Screen initialization
	levelMenu = new PIXI.Sprite(PIXI.loader.resources.levelMenu.texture);
	levelMenu.x = 0;
	levelMenu.y = 0;

	backButton = new PIXI.Sprite(PIXI.loader.resources.backButton.texture);
	backButton.x = 600;
	backButton.y = 50;
	backButton.interactive = true;
	backButton.on('click', quitToMenu);

	L1Button = new PIXI.Sprite(PIXI.loader.resources.L1_Button.texture);
	L1Button.x = 100;
	L1Button.y = 300;
	L1Button.interactive = true;
	L1Button.on('click', levelOneInit);

	LMenu_Container.addChild(levelMenu);
	LMenu_Container.addChild(L1Button);
	LMenu_Container.addChild(backButton);

	//Level Win Screen initialization
	levelWinScreen = new PIXI.Sprite(PIXI.loader.resources.levelWin.texture);
	levelWinScreen.x = 0;
	levelWinScreen.y = 0;

	goToMenuButton = new PIXI.Sprite(PIXI.loader.resources.backButton.texture);
	goToMenuButton.x = 600;
	goToMenuButton.y = 50;
	goToMenuButton.interactive = true;
	goToMenuButton.on('click', quitGame);

	LW_Screen_Container.addChild(levelWinScreen);
	LW_Screen_Container.addChild(goToMenuButton);

	animate();
}

function levelOne(){

	player.removeChild(standingSprite);
	//Initialize game parameters
	heartCount = 3;
	gO_boolean = false;
	stage.x = -100;
	stage.y = -1700;
	gameStart = true;

	//World initialization
	let tu = new TileUtilities(PIXI);
	world = tu.makeTiledWorld("map_json", "tileset1.png");
	stage.addChild(world);

	//Platform initialization
	for (var i = 1; i <= numPlatforms; i++){
		platforms.push(world.getObject("ground" + i));
	}

	//Barrier initialization
	for (var k = 1; k <= numBarriers; k++){
		barriers.push(world.getObject("barrier" + k));
	}

	//Player initialization
	hero = world.getObject("hero");
	standingSprite = new PIXI.Sprite(PIXI.loader.resources.player.texture);
	player.x = hero.x;
	player.y = hero.y;
	player.width = 60;
	player.height = 116;
	player.vy = GRAVITY;
	player.vx = 0;
	player.addChild(standingSprite);


	//Enemy initialization
	for (var j = 1; j <= numEnemies; j++){
		enemies.push(world.getObject("enemy" + j));
	}

	//enemy = new PIXI.Sprite(PIXI.loader.resources.enemy.texture);
	//enemy.x = enemy_object.x;
	//enemy.y = enemy_object.y;
	//enemy.width = 50;
	//enemy.height = 50;
	//enemy.anchor.x = 0.0;
	//enemy.anchor.y = 0.0;

	//Level Exit initialization
	exit_object = world.getObject("levelExit");
	levelExit = new PIXI.Sprite(PIXI.loader.resources.levelexit.texture);
	levelExit.x = exit_object.x;
	levelExit.y = exit_object.y;
	levelExit.width = 100;
	levelExit.height = 150;
	levelExit.anchor.x = 0.0;
	levelExit.anchor.y = 0.0;

	//HUD initialization
	heart1 = new PIXI.Sprite(PIXI.loader.resources.heart.texture);
	heart1.x = 10;
	heart1.y = 10;
	heart1.alpha = 1;
	HUD.addChild(heart1);
	heart2 = new PIXI.Sprite(PIXI.loader.resources.heart.texture);
	heart2.x = 60;
	heart2.y = 10;
	heart2.alpha = 1;
	HUD.addChild(heart2);
	heart3 = new PIXI.Sprite(PIXI.loader.resources.heart.texture);
	heart3.x = 110;
	heart3.y = 10;
	heart3.alpha = 1;
	HUD.addChild(heart3);

	ground = platforms[0];
	var entity_layer = world.getObject("player");
	entity_layer.addChild(levelExit);
	entity_layer.addChild(walkingSprite);
	entity_layer.addChild(player);
	entity_layer.addChild(enemy);


	//HUD.x = -stage.x;
	//HUD.y = -stage.y;

}

var jumpCount = 0;
var isHitCount = 0;
function animate() {
	requestAnimationFrame(animate);
	renderer.render(stage);

	if (gameStart == true){
		checkDamage();
		checkFalling(player.vy);
		checkCameraBounds();
		checkBarriers();
		move();

		if (isIntersecting(player, levelExit)){
			levelWin();
		}
		if (player.vy < 0){//Then the player is jumping
			if (jumpCount > 30){
				player.vy = GRAVITY;
				jumpCount = 0;
			}
			jumpCount++;
		}
		if (gO_boolean == true){
			gameOver();
		}
	}

}

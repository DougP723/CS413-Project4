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
	}
	if (stage.x + player.x < 100){
		stage.x += 4;
	}
}

function move(){
	player.y += player.vy;
	player.x += player.vx;
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

PIXI.loader
	.add("map_json", "test_level.json")
	.add("tileset", "tileset1.png")
	.add("player", "main_character1.png")
	.load(ready);

function ready(){

	let tu = new TileUtilities(PIXI);
	let world = tu.makeTiledWorld("map_json", "tileset1.png");
	stage.addChild(world);

	for (var i = 1; i <= numPlatforms; i++){
		platforms.push(world.getObject("ground" + i));
	}

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

	text = new PIXI.Text('',{font : '40px Arial', fill : 0x000000, align : 'center'});
	text.x = 100;
	text.y = 1700;
	entity_layer.addChild(text);

	animate();
}

var jumpCount = 0;
function animate() {
	requestAnimationFrame(animate);
	renderer.render(stage);

	checkFalling(player.vy);
	checkCameraBounds();
	move();

	if (player.vy < 0){//Then the player is jumping
		if (jumpCount > 40){
			player.vy = GRAVITY;
			jumpCount = 0;
		}
		jumpCount++;
	}
}

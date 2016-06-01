var gameport = document.getElementById("gameport");

var renderer = PIXI.autoDetectRenderer(600, 600, {backgroundColor: 0x3344ee});
gameport.appendChild(renderer.view);

var stage = new PIXI.Container();

var texture = PIXI.Texture.fromImage("main_character1.png");

var sprite = new PIXI.Sprite(texture);

sprite.anchor.x = 0.5;
sprite.anchor.y = 0.5;
sprite.position.x = 200;
sprite.position.y = 200;
sprite.vy = 1;

stage.addChild(sprite);

function animate() {
	requestAnimationFrame(animate);
	renderer.render(stage);
	sprite.position.y += sprite.vy;
}
animate();
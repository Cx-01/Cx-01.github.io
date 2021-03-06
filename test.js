      
      //Breakout game test


var game = new Phaser.Game(960, 720, Phaser.Auto, "Breakout");
game.transparent=true;

var gameState= {};

gameState.load = function(){};
gameState.load.prototype = {
  preload: function() {
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.setShowAll();
    window.addEventListener('resize', function () {
    this.game.scale.refresh();
    });
    this.game.scale.refresh();

    //Background
    this.game.load.image('background', 'img/background2.png');

    //lines
    this.game.load.image('line', 'img/lines.png');

    //paddle
    this.game.load.image('paddle', 'img/paddle.png');

    //wall
    this.game.load.image('wall', 'img/wall.png');

    //brik
    this.game.load.image('brick', 'img/brik3.png');

    //balle
    this.game.load.image('balle', 'img/balle.png');

    //life
    this.game.load.image('life', 'img/life.png');
    
    //arrow
    this.game.load.image('arrow', 'img/canon.png');

    //lazer
    this.game.load.image('lazer', 'img/lazer.png'); 


    //son balle une fois les briques toucher
    this.game.load.audio('hitBrick', 'sounds/hit.wav');    

  },//preload

  create: function() {
   game.state.start('main');
   }
  };//gameState.load.prototype

var balleOnPaddle = true;

var vie = 4;
var scoreText;
var introText;

var lazer;
var lazers;
var lazerTime = 0;
var cursors ;


gameState.main= function(){};
gameState.main.prototype={
  create: function() {

    //activer arcade physics
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    // check les collisions aux murs sauf celui du bottom-> on perd une vie
    this.game.physics.arcade.checkCollision.up = true;
    this.game.physics.arcade.checkCollision.down = false;

    // crée une variable pour les touches
    //this.cursor = game.input.keyboard.createCursorKeys();

    //son balle -> brique
    this.hitBrick = this.game.add.audio('hitBrick');
   
    //créer le background à l'état de sprite
    this.background = this.game.add.tileSprite(0,0,960,720, 'background');
    this.background.width = this.game.width; 
    this.background.height = this.game.height;

    //vie
    this.liveIcons = this.add.group();
      for (var x = 0; x < 1 ; x++)
      { 
        for (var y = 0; y < 4; y++){
           var lifeIcon = this.liveIcons.create (915 + (x * 50), 250 + (y * 50), 'life' );
        }
       
      }


    //canon
    this.arrow = this.game.add.sprite(250, 160, 'arrow');
    //this.game.physics.arcade.enable(this.arrow);
    //this.arrow.body.immovable = true;
    this.arrow.anchor.setTo(0.5, 0.5); 

    /*/lazer a faire
    this.lazer = this.game.add.sprite(250,160,'lazer');
    this.lazer.width = this.lazer.width/1.5;
    this.lazer.height = this.lazer.height/1.5;
    this.lazer.anchor.setTo(0.5, 0.5);
    this.physics.arcade.enable(this.lazer);
    this.lazer.body.velocity.y= 50;*/

    //lazer
    lazers = game.add.group();
    lazers.enableBody = true;
    lazers.physicsBodyType = Phaser.Physics.ARCADE;
     //  All 40 of them
    lazers.createMultiple(50, 'lazer');
    lazers.setAll('anchor.x', 0.5);
    lazers.setAll('anchor.y', 0.5);
    //lazers.setAll('onOutOfBoundsKill', true);
    //lazers.setAll('checkWorldBounds', true);
    
    this.line = this.game.add.sprite(0,0, 'line');

    this.wall = this.game.add.sprite(210, 120, 'wall');
    this.game.physics.arcade.enable(this.wall);
    this.wall.body.immovable = true;

    //paddle
    this.paddle = this.game.add.sprite(this.game.world.centerX, 650, 'paddle');
    this.game.physics.arcade.enable(this.paddle);
    this.paddle.body.immovable = true;
    this.paddle.anchor.setTo(0.5, 0.5);
    this.paddle.body.collideWorldBounds = true;

    //brick
    //this.brick = this.game.add.sprite(430,50,'brick');
    this.brick = this.game.add.group();
    this.brick.enableBody = true;
    this.brick.physicsBodyType = Phaser.Physics.ARCADE;


      var bricks;

      for (var y = 0; y < 2; y++)// nombre de colonne en y
      {
          for (var x = 0; x < 9; x++) // nombre de colonne en x
          {
              bricks = this.
              brick.create(80 + (x * 90), 50 + (y * 30), 'brick' );// Position et espacement(y*nbre) des brick
              bricks.body.bounce.set(1);
              bricks.body.immovable = true;
          }
      }

      var bricks1;

      for (var y = 0; y < 3; y++)// nombre de colonne en y
      {
          for (var x = 0; x < 5; x++) // nombre de colonne en x
          {
              bricks1 = this.
              brick.create(440 + (x * 90), 125 + (y * 30), 'brick' );// Position et espacement des brick
              bricks1.body.bounce.set(1);
              bricks1.body.immovable = true;
          }
      }

      var bricks2;

      for (var y = 0; y < 2; y++)// nombre de colonne en y
      {
          for (var x = 0; x < 9; x++) // nombre de colonne en x
          {
              bricks2 = this.
              brick.create(80 + (x * 90), 230 + (y * 30), 'brick' );// Position et espacement des brick
              bricks2.body.bounce.set(1);
              bricks2.body.immovable = true;
          }
      }

      var bricks3;

      for (var y = 0; y < 3; y++)// nombre de colonne en y
      {
          for (var x = 0; x < 6; x++) // nombre de colonne en x
          {
              bricks3 = this.
              brick.create(80 + (x * 90), 310 + (y * 30), 'brick' );// Position et espacement des brick
              bricks3.body.bounce.set(1);
              bricks3.body.immovable = true;
          }
      }

    //balle 
    this.balle = this.game.add.sprite(430,625, 'balle'); 
    this.game.physics.arcade.enableBody(this.balle);
    this.balle.anchor.setTo(0.5);
    //this.balle.body.velocity.x = 300;
    //this.balle.body.velocity.y = 300;

    this.balle.body.collideWorldBounds = true,
    this.balle.body.bounce.set(1);
    this.balle.checkWorldBounds = true;
    this.game.input.onTap.add(this.releaseBall, this);

    this.balle.events.onOutOfBounds.add(this.ballePerdu, this);

    this.score = 0;
    this.scoreText = this.game.add.text(10, 340, '0', { font: "20px arial", fill: "#00ffe4", align: "center" });
    introText = this.game.add.text(350, 470, ' Click to start ', { font: "30px arial", fill: "#ffffff", align: "center" });
    //introText.anchor.setTo(0.5, 0.5);


    /*//  Game input
    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);*/

  },//create

  releaseBall: function(){
     if (balleOnPaddle)
      {
        balleOnPaddle = false;
        this.balle.body.velocity.y = -300;
        this.balle.body.velocity.x = -75;
        introText.visible = false;
      }

      //qd la balle part le son marche ==>ok
      /*if ( this.releaseBall = true){
        this.hitBrick.play();
      }*/

  },//re

  update: function(){

      //répétition du background
      //this.background.tilePosition.x += 0.2; //le nombre est pour la vitesse

      this.arrow.rotation = this.game.physics.arcade.angleBetween(this.arrow, this.balle);

      //mouvemet via la souris 
      this.paddle.position.x = this.game.input.mousePointer.x; // positionne le padlle en x et suit la souris sans quitter l'axe x donné

      if (this.paddle.x < 50) //pert au paddle de pas dépasser l'écran du jeu ( a voir si pas autre méthode)
        {
          this.paddle.x = 50;
        }
      else if (this.paddle.x > this.game.width - 50)
       {
          this.paddle.x = this.game.width - 50;
       }

      //balle sur la pallette
      if (balleOnPaddle)
      {
        this.balle.body.x = this.paddle.x -10; //définit la position la balle sur la pallette 
      }

      //balle et la pallete 'collision'
      this.game.physics.arcade.collide(this.paddle, this.balle,this.paddleHit, null, this); // je devrai ajouter 1 nvelle fonction comme this.hit mais avc la balle et la palette
      //balle et la pallete 'collision'
      this.game.physics.arcade.collide(this.balle, this.wall);
      // Collision de la balle et brick==> hit function
      this.game.physics.arcade.collide(this.balle, this.brick, this.hit, null, this);
      this.game.physics.arcade.overlap(this.balle, this.life,this.onOutOfBounds, this.viePerdu, null,this);
      
      if (this.score ==690){
       this.restart();
      }

     /* if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
      {
        this.feuxLazer;
      }*/

  },//update

  paddleHit: function(paddle, balle){

    //le sens du mouvement de la balle , vers la gauche ou vers la droite + augmentation de la vitesse ( test)
    if (this.balle.position.x < this.paddle.body.x + 50){
      this.balle.body.velocity.x += -150 * 1.1;
    }
    else if (this.balle.position.x > this.paddle.body.x - 50){
      this.balle.body.velocity.x += 150 * 1.1;
    }

  },//paddleHit

  hit: function(balle, brick) {
      //Qd a balle touches les briques
      brick.kill();
      //test--> essaye d'activer un son qd la balle touche les briques --> ok
      if (this.balle.event = brick.kill() ){
        this.hitBrick.play();
      }

      this.score += 10;
      this.scoreText.text = this.score;
  },//hit

  ballePerdu: function(){
   var lifeIcon = this.liveIcons.getFirstAlive();
    if (lifeIcon) {
      lifeIcon.destroy();
    }

    if (this.liveIcons.countLiving() <= 0) {
       this.gameOver(), this.restart();
    }
    else
    {
      balleOnPaddle = true;
      this.balle.reset(this.paddle.body.x + 25, this.paddle.y - 25);
    }

  },//balleperdu

  gameOver: function() {
    this.balle.body.velocity.setTo(0, 0);
    introText.text = 'Game Over!';
    introText.visible = true;
    this.liveIcons.destroy();
  },

  restart: function() {
    balleOnPaddle = true;
    game.state.start('main');
  }

};//Protoype

game.state.add('load', gameState.load);
game.state.add('main', gameState.main);
// Il ne reste plus qu'à lancer l'état "load"
game.state.start('load');
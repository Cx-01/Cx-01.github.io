var game = new Phaser.Game(960, 720, Phaser.CANVAS, "Breakout");
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
    this.game.load.image('paddle', 'img/paddle2.png');

    //wall
    this.game.load.image('wall', 'img/wall.png');

    //brik
    this.game.load.image('brick', 'img/brik3.png');

    //balle
    this.game.load.image('balle', 'img/balle2.png');

    //life
    this.game.load.image('life', 'img/life.png');
    
    //canon
    this.game.load.image('canon', 'img/canon.png');

    this.game.load.image('bouton', 'img/bouton.png');

    this.game.load.image('retry', 'img/retry.png');

    this.game.load.image('lazer', 'img/lazer.png');

    //particule
    this.game.load.image('particule', 'img/particule.png'); 

    //son: balle --> brique
    this.game.load.audio('hitBrick', 'sounds/hit.mp3');    

    //son: balle --> paddle
    this.game.load.audio('hitPaddle', 'sounds/paddle-hit.mp3');    

    //son: vie-perdue
    this.game.load.audio('viePerdu', 'sounds/live.mp3');  
  },//preload

  create: function() {
   game.state.start('main');
   }
  };//gameState.load.prototype

var balleOnPaddle = true;
var scoreText;
var introText;

/*var lazer;
var lazers;
var lazerTime = 0;
var cursors ;*/


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

    //sons
    this.hitBrick = this.game.add.audio('hitBrick');
    this.hitPaddle = this.game.add.audio('hitPaddle');
    this.viePerdu = this.game.add.audio('viePerdu');

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
    this.canon = this.game.add.sprite(250, 160, 'canon');
    //this.game.physics.arcade.enable(this.arrow);
    //this.arrow.body.immovable = true;
    this.canon.anchor.setTo(0.5, 0.5); 

    //bouton start et retry
    this.button = game.add.button(380, 440,'bouton', function(){;game.state.start('MainState');}, this);
    this.button.inputEnabled = true;
    this.button.events.onInputDown.add(this.releaseBall, this);

    this.retry = game.add.button(380, 440,'retry', function(){;game.state.start('MainState');}, this);
    this.retry.inputEnabled = true;
    this.retry.visible = false;


    /*/lazer a faire
    this.lazer = this.game.add.sprite(250,160,'lazer');
    this.lazer.width = this.lazer.width/1.5;
    this.lazer.height = this.lazer.height/1.5;
    this.lazer.anchor.setTo(0.5, 0.5);
    this.physics.arcade.enable(this.lazer);
    this.lazer.body.velocity.y= 50;*/

    this.particule = this.game.add.emitter(0, 0 ,500); // dans update, je le positionne prés de la balle , le 3ieme est pour le nombre de sprite à émettre
    this.particule.makeParticles('particule');

    /*/lazer
    lazers = game.add.group();
    lazers.enableBody = true;
    lazers.physicsBodyType = Phaser.Physics.ARCADE;
     //  All 40 of them
    lazers.createMultiple(50, 'lazer');
    lazers.setAll('anchor.x', 0.5);
    lazers.setAll('anchor.y', 0.5);
    lazers.setAll('onOutOfBoundsKill', true);
    lazers.setAll('checkWorldBounds', true);*/
    
    //ligne->rose
    this.line = this.game.add.sprite(0,0, 'line');

    //wall -> autour du canon
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
    this.balle = this.game.add.sprite(430,626, 'balle'); 
    this.game.physics.arcade.enableBody(this.balle);
    this.balle.anchor.setTo(0.5);
    //this.balle.body.velocity.x = 300;
    //this.balle.body.velocity.y = 300;

    this.balle.body.collideWorldBounds = true,
    this.balle.body.bounce.set(1);
    this.balle.checkWorldBounds = true;
    //this.game.input.onTap.add(this.releaseBall, this);

    this.balle.events.onOutOfBounds.add(this.ballePerdu, this);

    this.score = 0;
    this.scoreText = this.game.add.text(10, 340, '0', { font: "21px verdana", fill: "#00ffe4", align: "center" });
    //introText = this.game.add.text(350, 470, ' Click to start ', { font: "30px verdana", fill: "#ffffff", align: "center" });
    //introText.anchor.setTo(0.5, 0.5);
    
  },//create

  releaseBall: function(){
     if (balleOnPaddle)
      {
        balleOnPaddle = false;
        this.balle.body.velocity.y = -300;
        this.balle.body.velocity.x = -75;
        this.button.visible =false;
        this.game.input.onTap.add(this.releaseBall, this);
        //introText.visible = false;
      }
  },//releaseBall

  update: function(){

      //répétition et mouvemenbt du background
      //this.background.tilePosition.x += 0.2; //le nombre est pour la vitesse

      this.canon.rotation = this.game.physics.arcade.angleBetween(this.canon, this.balle);

      this.particule.x = this.balle.x ;
      this.particule.y = this.balle.y ;
      this.particule.start(true, 700, null , 1.5); // si vrai-> émetteur de sprite, durée--> fin de vie, null --> ne pas supprimé, nbre de sprite à émettre?

      //test ---> triche 
      /*if(balleOnPaddle = true){
      this.particule.start(true, 700, null , 2);
      }*/

      //this.lazer.rotation = this.game.physics.arcade.angleBetween(this.lazer, this.balle);

      //mouvemet via la souris 
      this.paddle.position.x = this.game.input.mousePointer.x; // positionne le padlle en x et suit la souris sans quitter l'axe x donné

      if (this.paddle.x < 50) //empeche au paddle de pas dépasser l'écran du jeu ( a voir si pas autre méthode)
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
        this.balle.body.x = this.paddle.x -10; //définit la position la balle sur le paddle
      }

      //balle et la pallete 'collision'
      this.game.physics.arcade.collide(this.paddle, this.balle,this.paddleHit, null, this); // je devrai ajouter 1 nvelle fonction comme this.hit mais avc la balle et paddle-->ok
      //balle et mur 'collision'
      this.game.physics.arcade.collide(this.balle, this.wall);
      // Collision de la balle et brick==> hit function
      this.game.physics.arcade.collide(this.balle, this.brick, this.hit, null, this);

      // Une fois tt les briques detruites et le score obtenu game over
      if (this.score ==690){
       this.gameOver();
      }

  }, //update

  paddleHit: function(paddle, balle){

    //le sens du mouvement de la balle , vers la gauche ou vers la droite + augmentation de la vitesse ( test)
    if (this.balle.position.x < this.paddle.body.x + 50){
      this.balle.body.velocity.x += -150 * 1.1;
    }
    else if (this.balle.position.x > this.paddle.body.x - 50){
      this.balle.body.velocity.x += 150 * 1.1;
    }

    // son: balle->paddle
    if ( this.balle.event = this.paddleHit){
      this.hitPaddle.play();
      this.hitPaddle.volume = 0.4;
    }

  },//paddleHit

  hit: function(balle, brick) {
      //Qd a balle touches les briques
      brick.kill();
      //test--> essaye d'activer un son qd la balle touche les briques --> ok
      if (this.balle.event = brick.kill() ){
        this.hitBrick.play();
        this.hitBrick.volume = 0.05;
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
       this.gameOver();
       //this.retry.events.onInputDown.add(this.restart, this);
    }
    else
    {
      balleOnPaddle = true;
      this.balle.reset(this.paddle.body.x + 25, this.paddle.y - 24);
    }

    if (this.balleperdu = true){
      this.viePerdu.play();
      this.viePerdu.volume = 0.05;
    }

  },//balleperdu

  gameOver: function() {
    this.balle.body.velocity.setTo(0, 0);
    this.retry.events.onInputDown.add(this.restart, this);
    this.retry.visible =true;
    //introText.visible = true;
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
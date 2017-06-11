module platformer {

  export class GameState extends Phaser.State {

    //* Game Entities
    private m_player: platformer.Player;

    //* Game Tilemap
    private m_levelGrassOne: Phaser.Tilemap;

    //* Game Layer
    private m_groundLayer: Phaser.TilemapLayer;
    private m_backgroundLayer: Phaser.TilemapLayer;

    //* Game Sprites
    private m_background: Phaser.TileSprite;

    //* Game Text
    private m_playerLivesText: Phaser.BitmapText;

    //* Game Variables
    private m_numberOfEnemies: number;

    /*
     * FIRST FUNCTION CALLED WHEN THE STATE STARTS UP
     * ROUTE THE GAME AWAY TO ANOTHER STATE IF NECESSARY, PREPARE VARIABLES OR OBJECTS
     */
    init() {

      //* This will create an instance of the requested physics simulation.
      //* Phaser.Physics.Arcade is running by default, but all others need activating directly.
      //* The following physics systems are available: P2JS, NINJA, BOX2D
      //* this.physics.startSystem(Phaser.Physics.ARCADE);

      this.m_player = null;
      this.m_levelGrassOne = null;
      this.m_groundLayer = null;
      this.m_backgroundLayer = null;
      this.m_background = null;
      this.m_playerLivesText = null;
    }

    /*
     * IS CALLED AFTER INIT()
     * USE THIS TO LOAD YOUR GAME ASSETS. DON'T CREATE OBJECTS HERE IF THEY REQUIRE ASSETS
     */
    preload(): void {
      this.load.spritesheet('player', 'assets/sprites/player.png', 20, 20);

      this.load.tilemap('tilemap', 'assets/levels/levelGrassOne.json', null, Phaser.Tilemap.TILED_JSON);
      this.load.image('tiles', 'assets/tilesheets/tilesheetGrass.png');

      this.load.image('background', 'assets/levels/background.png');

      this.load.bitmapFont('platformerFont', 'assets/font/platformerFont.png', 'assets/font/platformerFont.xml');

    }

    /*
     * LOADUPDATE() IS CALLED DURING LOADER PROCESS -> AFTER PRELOAD()
     * ONLY HAPPENS IF ASSETS LOAD UP IN PRELOAD() METHOD
     */
    loadUpdate() { }

    /*
     * LOADRENDER() IS CALLED DURING LOADER PROCESS -> AFTER LOADUPDATE()
     * ONLY HAPPENS IF ASSETS LOAD UP IN PRELOAD() METHOD
     * IN CONTRAST TO RENDER() YOU MUST HERE BE SURE THE ASSETS EXISTS
     */
    loadRender() { }

    /*
     * CREATE() IS CALLED AFTER PRELOAD()
     * CREATE YOUR OBJECTS HERE
     */
    create(): void {

      //* Init the Arcade Physics systems
      this.physics.startSystem(Phaser.Physics.ARCADE);

      //* Init background
      this.m_background = this.add.tileSprite(0, 0, 640, 200, 'background');
      this.m_background.fixedToCamera = true;

      this.initTilemapWithLayers();

      //* Create the player
      this.m_player = new Player(this.game, 20, 80);

      //* Create the texts
      this.m_playerLivesText = this.game.add.bitmapText(10, 185, "platformerFont", "LIVES: " + this.m_player.getPlayerLives(), 10);
      this.m_playerLivesText.fixedToCamera = true;

      this.scale.setUserScale(2.5, 2.5);
      this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
      Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);


    }

    initTilemapWithLayers() {
      /**
       *  Add the tilemap and tileset image. The first parameter in addTilesetImage
       *  is the name you gave the tilesheet when importing it into Tiled, the second
       *  is the key to the asset in Phaser
       */
      this.m_levelGrassOne = this.game.add.tilemap('tilemap');
      this.m_levelGrassOne.addTilesetImage('tilesheetGrass', 'tiles');

      /**
       * Add both the background and ground layers.
       * We won't be doing anything with the GroundLayer though.
       */
      this.m_backgroundLayer = this.m_levelGrassOne.createLayer('BackgroundLayer');
      this.m_groundLayer = this.m_levelGrassOne.createLayer('GroundLayer');

      //* Before you can use the collide function you need to set what tiles can collide
      this.m_levelGrassOne.setCollisionBetween(21, 22, true, 'GroundLayer');

      //* Change the world size to match the size of this layer
      this.m_groundLayer.resizeWorld();
    }

    /*
     * UPDATE() IS CALLED DURING THE CORE GAME LOOP
     * AFTER debug, physics, plugins and the Stage have had their preUpdate methods called.
     * BEFORE Stage, Tweens, Sounds, Input, Physics, Particles and Plugins have had their postUpdate methods called.
     */
    update(): void {
      this.collisionCheck();
      this.backgroundMovement();
      this.checkPlayerState();
    }

    collisionCheck(): void {
      //* Make the sprite collide with the ground layer
      this.physics.arcade.collide(this.m_player, this.m_groundLayer, this.playerGroundCollision);
    }

    playerGroundCollision(_player): void {
      _player.setPlayerJumping(false);
    }

    backgroundMovement(): void {
      if (this.m_player.body.velocity.x > 0) {
          this.m_background.tilePosition.x -= 0.5;
      }

      else if (this.m_player.body.velocity.x < 0) {
          this.m_background.tilePosition.x += 0.5;
      }
    }

    checkPlayerState(): void {
      if (this.m_player.getPlayerState() == m_playerStates.DEAD) {

        if (this.m_player.getPlayerLives() > 0) {
          this.m_player.setPlayerLives(this.m_player.getPlayerLives() - 1);
          this.m_playerLivesText.kill();
          this.m_playerLivesText = this.game.add.bitmapText(10, 185, "platformerFont", "LIVES: " + this.m_player.getPlayerLives(), 10);
          this.m_playerLivesText.fixedToCamera = true;
        }

        else {
          /* PLAYER IS DEAD -> GAME OVER */
        }
      }
    }

    /*
     * PRERENDER() IS CALLED AFTER ALL GAME OBJECTS HAVE BEEN UPDATED, BUT BEFORE ANY RENDERING TAKES PLACE
     */
    preRender() { }

    /*
     * NEARLY ALL OBJECTS IN PHASER RENDER AUTOMATICALLY
     * RENDER() IS CALLED AFTER THE GAME RENDERER AND PLUGINS HAVE RENDERED, SO HERE DO FINAL POST-PRECESSING STYLE EFFECTS
     * HAPPENS BEFORE POSTRENDER()
     */
    render() {
      // this.game.debug.body(this.player);
      // this.game.debug.body(this.enemy);
      // this.game.debug.body(this.player.getSword());
    }

    /*
     * PAUSED() WILL BE CALLED IF THE CORE GAME LOOP IS PAUSED
     */
    paused() { }

    /*
     * PAUSEUPDATE() IS CALLED WHILE THE GAME IS PAUSED INSTEAD OF PREUPDATE, UPDATE AND POSTUPDATE
     */
    pauseUpdate() { }

    /*
     * IF GAME IS SET TO SCALEMODE RESIZE, THEN BROWSER WILL CALL RESIZE() EACH TIME RESIZE HAPPENS
     */
    resize() { }

    /*
     * RESUMED() IS CALLED WHEN THE CORE GAME LOOP RESUMES FROM A PAUSED STATE
     */
    resumed() { }

    /*
     * SHUTDOWN() WILL BE CALLED WHEN THE STATE IS SHUTDOWN (i.e. YOU SWITCH TO ANOTHER STATE FROM THIS ONE)
     */
    shutdown() {;
    }

  }
}

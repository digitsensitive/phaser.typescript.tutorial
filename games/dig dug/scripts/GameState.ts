module digDug {

  export class GameState extends Phaser.State {

    //* Game Entities
    private m_player: digDug.Player;
    private m_enemy: digDug.Enemy;
    private m_enemies: digDug.GroupGenerator;

    //* Game Landscape
    private m_land: Phaser.BitmapData;
    private m_background: Phaser.Sprite;

    //* Game Text
    private m_playerHealth: Phaser.Text;

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

      this.m_player = this.m_enemy = this.m_enemies = null;
      this.m_land = this.m_background = null;
      this.m_playerHealth = null;
      this.m_numberOfEnemies = 10;

    }

    /*
     * IS CALLED AFTER INIT()
     * USE THIS TO LOAD YOUR GAME ASSETS. DON'T CREATE OBJECTS HERE IF THEY REQUIRE ASSETS
     */
    preload() {
      this.load.spritesheet('player', 'assets/sprites/player.png', 21, 21);
      this.load.spritesheet('shoot', 'assets/sprites/shoot.png', 42, 21);
      this.load.spritesheet('enemy', 'assets/sprites/enemy.png', 21, 21);

      this.load.image('land', 'assets/levels/land.png');
      this.load.image('background', 'assets/levels/background2.png');

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
    create() {

      //* Create the landscape (background and land)
      this.m_background = this.add.sprite(0, 0, 'background');
      this.m_background.scale.setTo(20, 20);

      this.m_land = this.add.bitmapData(800, 600);

      //* Draws the given Phaser.Sprite, Phaser.Image or Phaser.Text
      //* to this BitmapData at the coordinates specified.
      //* BLENDMODES:
      //* source-over, source-in, source-out, source-atop, destination-over,
      //* destination-in, destination-out, destination-atop, xor, lighter,
      //* multiply, screen, overlay, darken, lighten, color-dodge, color-burn,
      //* hard-light, soft-light, difference, exclusion, hue, saturation, color,
      //* luminosity
      this.m_land.draw('land', 0, 0, null, null);

      //* This re-creates the BitmapData.imageData from the current context
      this.m_land.update();
      this.m_land.addToWorld();

      //* Create the player and the enemies
      this.m_player = new Player(this.game, this.world.centerX, 129);
      this.m_enemies = new GroupGenerator(this.game);

          for (var x = 0; x < this.m_numberOfEnemies; x++)
          {
            this.m_enemy = this.m_enemies.add(new Enemy(this.game, Math.floor(Math.random() * 700) + 100, Math.floor(Math.random() * 500) + 100));
          }

      //* Create the texts
      this.m_playerHealth = this.game.add.text(10, 500, "Health: " + this.m_player.getPlayerHealth(), { font: "20px Arial", fill: "#FFFFFF", align: "center" });

    }

    /*
     * UPDATE() IS CALLED DURING THE CORE GAME LOOP
     * AFTER debug, physics, plugins and the Stage have had their preUpdate methods called.
     * BEFORE Stage, Tweens, Sounds, Input, Physics, Particles and Plugins have had their postUpdate methods called.
     */
    update() {

      //* Check Collision Player vs. Terrain
      this.checkCollisionPlayerAndTerrain();

      //* Check Collision Player vs. Enemies
      this.game.physics.arcade.overlap(this.m_player, this.m_enemies, this.playerEnemyHit, null, this);

      //* Check Collision Sword vs. enemies
      //* Only when the Sword is actually activated
      if (this.m_player.getSword().getActivation()) {
        this.game.physics.arcade.overlap(this.m_player.getSword(), this.m_enemies, this.attackHitEnemy, null, this);
      }
    }

    checkCollisionPlayerAndTerrain() {

      //* Check if the player is moving horizontal
      if (this.m_player.body.velocity.x != 0) {

        //* Check if the player is moving left or right
        if (this.m_player.body.velocity.x < 0) {
          var x = Math.floor(this.m_player.x - 12);
        }

        else {
          var x = Math.floor(this.m_player.x + 12);
        }

        var y = Math.floor(this.m_player.y);

      }

      //* Check if the player is moving vertical
      if (this.m_player.body.velocity.y != 0) {

        //* Check if the player is moving up or down
        if (this.m_player.body.velocity.y < 0) {
          var y = Math.floor(this.m_player.y - 12);
        }

        else {
          var y = Math.floor(this.m_player.y + 12);
        }

        var x = Math.floor(this.m_player.x);

      }

      //* Get the color of the pixel at x, y including its alpha value
      //* Returns an object with red, green and blue values
      var rgba = this.m_land.getPixelRGB(x, y);

      //* Only if the alpha value is greater than 0, than destroy BitmapData
      if (rgba.a > 0)
      {
        //* Player boolean set to true
        this.m_player.setStatusCollideWithTerrain(true);

        this.m_land.blendDestinationOut();

        this.m_land.clear(x - 20, y - 20, 40, 40);

        // Destroy Effect
        this.m_land.clear(
          x - 20 - Math.floor(Math.random() * 15) + 1,
          y - 20 - Math.floor(Math.random() * 15) + 1,
          Math.floor(Math.random() * 8) + 5,
          Math.floor(Math.random() * 8) + 5);
        this.m_land.clear(
          x + 20 - Math.floor(Math.random() * 15) + 1,
          y + 20 - Math.floor(Math.random() * 15) + 1,
          Math.floor(Math.random() * 8) + 5,
          Math.floor(Math.random() * 8) + 5);

        this.m_land.blendReset();

        this.m_land.update();
      }

    }

    playerEnemyHit(_player, _enemy) {
      if (_player.getCurrentState() == playerStates.ALIVE) {
        _player.setCurrentState(playerStates.HIT);
        _player.setPlayerHealth(_player.getPlayerHealth() - 10.0);
        this.m_playerHealth.destroy();
        this.m_playerHealth = this.game.add.text(10, 500, "Health: " + this.m_player.getPlayerHealth(), { font: "20px Arial", fill: "#FFFFFF", align: "center" });
      }
    }

    attackHitEnemy(_player, _enemy) {
      if (_enemy.getCurrentState() == enemyStates.ALIVE) {
        _enemy.setEnemyHealth(_enemy.getEnemyHealth() - 10.0);
        _enemy.setCurrentState(enemyStates.PARALYSED);
        _enemy.setParalysedTimer(30.0);
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
    shutdown() {
      this.m_land.destroy();
    }

  }
}

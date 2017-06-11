module spriteClass {

  export class GameState extends Phaser.State {

    player: spriteClass.Player;

    /*
     * first function called when the state starts up
     * route the game away to another State is necessary, prepare variables or objects
     */
    init() {
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
    }

    /*
     * is called after init()
     * use this to load your game assets. don't create objects here if they require assets
     */
    preload() {
      this.game.load.image('player', 'assets/sprites/playerGreen.png');
    }

    /*
     * loadUpdate() is called during loader process -> after preload()
     * only happens if assets load up in preload() method
     */
    loadUpdate() { }

    /*
     * loadRender() is called during loader process -> after loadUpdate()
     * only happens if assets load up in preload() method
     * in contrast to render() you must here be sure the assets exist
     */
    loadRender() { }

    /*
     * create() is called after preload()
     * create your objects here
     */
    create() {
      this.player = new Player(this.game, this.game.world.centerX, this.game.world.centerY);
    }

    /*
     * update() is called during the core game loop
     * AFTER debug, physics, plugins and the Stage have had their preUpdate methods called.
     * BEFORE Stage, Tweens, Sounds, Input, Physics, Particles and Plugins have had their postUpdate methods called.
     */
    update() { }

    /*
     * preRender() is called after all game objects have been updated, but before any rendering takes place
     */
    preRender() { }

    /*
     * nearly all objects in Phaser render automatically
     * render() is called AFTER the game renderer and plugins have rendered, so here do final post-precessing style effects
     * happens before postRender()
     */
    render() { }

    /*
     * paused() will be called if the core game loop is paused
     */
    paused() { }

    /*
     * pauseUpdate() is called while the game is paused instead of preUpdate, update and postUpdate
     */
    pauseUpdate() { }

    /*
     * if game is set to scalemode RESIZE, then browser will call resize() each time resize happens.
     */
    resize() { }

    /*
     * resumed() is called when the core game loop resumes from a paused state
     */
    resumed() { }

    /*
     * shutdown() will be called when the State is shutdown (i.e. you switch to another state from this one).
     */
    shutdown() { }

  }
}

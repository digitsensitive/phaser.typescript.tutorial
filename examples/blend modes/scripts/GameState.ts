module blendModes {

  export class GameState extends Phaser.State {

    //* Sprites
    private m_sprite: Phaser.Sprite;
    private m_sprite2: Phaser.Sprite;

    private m_currentBlendMode: PIXI.blendModes;
    private m_textBlendMode: Phaser.Text;

    /*
     * FIRST FUNCTION CALLED WHEN THE STATE STARTS UP
     * ROUTE THE GAME AWAY TO ANOTHER STATE IF NECESSARY, PREPARE VARIABLES OR OBJECTS
     */
    init() {
      this.m_sprite = this.m_sprite2 = null;
      this.m_currentBlendMode = PIXI.blendModes.NORMAL;
    }

    /*
     * IS CALLED AFTER INIT()
     * USE THIS TO LOAD YOUR GAME ASSETS. DON'T CREATE OBJECTS HERE IF THEY REQUIRE ASSETS
     */
    preload() {
      this.load.image('sprite1', 'assets/sprite1.png');
      this.load.image('sprite2', 'assets/sprite2.png');
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

      this.stage.backgroundColor = "#4488AA";

      this.m_sprite = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'sprite1');
      this.m_sprite.anchor.setTo(0.5, 0.5);
      this.m_sprite.blendMode = this.m_currentBlendMode;

      this.m_sprite2 = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'sprite2');
      this.m_sprite2.anchor.setTo(0.5, 0.5);
      this.m_sprite2.blendMode = this.m_currentBlendMode;
      this.m_sprite2.scale.setTo(3);

      this.m_textBlendMode = this.game.add.text(10, 10, "BlendMode: " + this.m_currentBlendMode, { font: "20px Arial", fill: "#FFFFFF", align: "center" });


    }

    /*
     * UPDATE() IS CALLED DURING THE CORE GAME LOOP
     * AFTER debug, physics, plugins and the Stage have had their preUpdate methods called.
     * BEFORE Stage, Tweens, Sounds, Input, Physics, Particles and Plugins have had their postUpdate methods called.
     */
    update() {
      if (this.game.input.keyboard.downDuration(Phaser.Keyboard.UP, 100) ) {
        if (this.m_sprite2.blendMode > 16) {
          this.m_sprite2.blendMode = 16;
        }

        else {
          this.m_sprite2.blendMode += 1;
        }

        this.m_currentBlendMode = this.m_sprite2.blendMode;

        this.m_textBlendMode.destroy();
        this.m_textBlendMode = this.game.add.text(10, 10, "BlendMode: " + this.m_currentBlendMode, { font: "20px Arial", fill: "#FFFFFF", align: "center" });

      }

      if (this.game.input.keyboard.downDuration(Phaser.Keyboard.DOWN, 100)) {
        if (this.m_sprite2.blendMode < 0) {
          this.m_sprite2.blendMode = 0;
        }

        else {
          this.m_sprite2.blendMode -= 1;
        }

        this.m_currentBlendMode = this.m_sprite2.blendMode;

        this.m_textBlendMode.destroy();
        this.m_textBlendMode = this.game.add.text(10, 10, "BlendMode: " + this.m_currentBlendMode, { font: "20px Arial", fill: "#FFFFFF", align: "center" });

      }

      this.m_sprite2.position.x = this.game.input.mousePointer.x;
      this.m_sprite2.position.y = this.game.input.mousePointer.y;
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
      this.m_sprite.destroy();
      this.m_sprite2.destroy();
    }

  }
}

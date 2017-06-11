module platformer {

    export enum m_playerStates {
      ALIVE,
      DEAD
    }

    /**
     * Sprite: A Game Object with a texture, capable of running animation, input events and physics.
     *
     */

    /**
     * destroy() ->
     *    destroys the game objects
     * kill() ->
     *    kills a game object. a killed Game Object has its alive, exists and visible properties all set to false.
     *    killing a game object is a way for you to quickly recycle it in an object pool
     *    it doesn't destroy the object or free it up from memory.
     *    if you don't need this Game Object any more you should call destroy instead.
     * reset() ->
     *     resets the game object
     * revive() ->
     *    brings a dead game object back to life
     */

    export class Player extends Phaser.Sprite {

      /* VARIABLES */
      private m_walkingSpeed: number;
      private m_currentState: any;
      private m_playerLives: number;
      private m_isJumping: boolean;
      private m_gravityForce: number;

      /* INPUT */
      private m_moveLeftKey: Phaser.Key;
      private m_moveRightKey: Phaser.Key;
      private m_jumpKey: Phaser.Key;

      /* ANIMATION */
      private playerAnimations: Phaser.Animation[] = [];

      /* FUNCTIONS */
      public getPlayerState(): number { return this.m_currentState; }
      public setPlayerState(state: number): void { this.m_currentState = state; }
      public getPlayerLives(): number { return this.m_playerLives; }
      public setPlayerLives(lives: number): void { this.m_playerLives = lives; }
      public getPlayerJumping(): boolean { return this.m_isJumping; }
      public setPlayerJumping(jump: boolean): void { this.m_isJumping = jump; }

        constructor(game: Phaser.Game, x: number, y: number, key?: string, frame?: string | number) {

            super(game, x, y, 'player', 0);

            /*
             * VARIABLES
             */
            this.m_walkingSpeed = 100;
            this.m_currentState = m_playerStates.ALIVE;
            this.m_playerLives = 3;
            this.m_isJumping = false;

            /*
             * SPRITE GENERAL
             */
            this.anchor.setTo(0.5, 0.5);

            /*
             * SPRITE ANIMATIONS
             */
            this.playerAnimations.push(this.animations.add('walkLeft', [4, 5], 8, true));
            this.playerAnimations.push(this.animations.add('walkRight', [2, 3], 8, true));
            this.playerAnimations.push(this.animations.add('idle', [0, 1], 8, true));

            /*
             * PHYSICS
             */
            game.physics.arcade.enable(this);
            this.m_gravityForce = 200;
            this.body.bounce.y = 0.2;
            this.body.gravity.y = 1500;
            this.body.setSize(20, 20);


            /*
             * INPUT
             */
            this.m_moveLeftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
            this.m_moveRightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
            this.m_jumpKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

            /*
             * OTHER
             */
            game.camera.follow(this, 1);

            // finally add the new object to the game and return it
            game.add.existing(this);

        }

        /*
         * automatically called by world.preUpdate
         * somehow update() does not work when this is activated
         */
        // preUpdate() { }

        /*
         * update() is called immediately after preUpdate and before postUpdate
         * remember if this Game Object has any children you should call update on those too.
         */
        update() {

          /* Check which state the player is currenty in */
          this.checkCurrentState();

          /* Check if the player falls down of the screen */
          this.checkIfOutOfBorders();
        }

        checkCurrentState(): void {
          if (this.m_currentState == m_playerStates.DEAD) {
            this.resetPlayer();
          }

          else if (this.m_currentState == m_playerStates.ALIVE) {
            this.movement();
            this.jumping();
          }
        }

        checkIfOutOfBorders(): void {
          if (this.body.position.y > 200 + this.height/2) {
            this.m_currentState = m_playerStates.DEAD;
          }
        }

        movement(): void {
          if (this.m_moveLeftKey.isDown) {
            this.body.velocity.x = -this.m_walkingSpeed;
            this.animations.play('walkLeft');
          }

          else if (this.m_moveRightKey.isDown) {
            this.body.velocity.x = this.m_walkingSpeed;
            this.animations.play('walkRight');
          }

          else {
            this.animations.play('idle');
            this.body.velocity.x = 0;
          }
        }

        jumping(): void {
          if (this.m_jumpKey.isDown && !this.m_isJumping) {
            this.body.velocity.y = -320;
            this.m_isJumping = true;
          }
        }

        resetPlayer(): void {
          this.body.position.x = 20;
          this.body.position.y = 80;
          this.body.velocity.x = this.body.velocity.y = 1;
          this.m_currentState = m_playerStates.ALIVE;
          this.m_isJumping = false;
        }


        /*
         * internal method called by the world postUpdate cycle
         * somehow update() does not work when this is activated
         */
        // postUpdate() { }

    }

}

module digDug {

    export enum playerStates {
      ALIVE,
      HIT,
      DEAD
    }

    export enum lookingDirection {
      LEFT,
      RIGHT,
      DOWN,
      UP
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

      private sword: digDug.Sword;
      private isCollidingWithTerrain: boolean = false;
      private walkingSpeed: number = 100.0;
      private movingHorizontaly: boolean = false;
      private movingVerticaly: boolean = false;
      private keyHorizontalyPressed: boolean = false;
      private keyVerticalyPressed: boolean = false;
      private timerSinceCollidingWithTerrain: number = 10.0;
      private playerHealth: number = 40.0;
      private healthText: any;
      private currentState: any;
      private currentLookingDirection: any;
      private isShooting: boolean = false;
      private hitCountdown: number = 20.0;

      private playerAnimations: Phaser.Animation[] = [];

      public getStatusCollideWithTerrain(): boolean { return this.isCollidingWithTerrain; }
      public setStatusCollideWithTerrain(collide: boolean): void { this.isCollidingWithTerrain = collide; }
      public getSword(): digDug.Sword { return this.sword; }

      public getPlayerHealth(): number { return this.playerHealth; }
      public setPlayerHealth(health: number): void { this.playerHealth = health; }

      public getCurrentState(): any { return this.currentState; }
      public setCurrentState(state: any): void { this.currentState = state; }

        constructor(game: Phaser.Game, x: number, y: number, key?: string, frame?: string | number) {

            super(game, x, y, 'player', 0);


            this.currentState = playerStates.ALIVE;
            this.isShooting = false;

            /*
             * SPRITE CONTROL
             */
            this.anchor.setTo(0.5, 0.5);
            this.scale.set(2);

            /*
             * CHILD
             */
             this.sword = new Sword(game, 50, 0);
             this.addChild(this.sword);

            /*
             * PHYSICS CONTROL
             */


             this.playerAnimations.push(this.animations.add('walkLeft', [3,4], 10, true));
             this.playerAnimations.push(this.animations.add('chopLeft', [8,9], 10, true));
             this.playerAnimations.push(this.animations.add('walkRight', [1,2], 10, true));
             this.playerAnimations.push(this.animations.add('chopRight', [6,7], 10, true));
             this.playerAnimations.push(this.animations.add('walkDown', [0], 10, true));
             this.playerAnimations.push(this.animations.add('chopDown', [5], 10, true));
             this.playerAnimations.push(this.animations.add('walkUp', [0], 10, true));
             this.playerAnimations.push(this.animations.add('chopUp', [5], 10, true));
             this.playerAnimations.push(this.animations.add('idle', [0], 10, true));

            // enable the physics for the player
            game.physics.enable(this, Phaser.Physics.ARCADE);

            // set player body physics parameters
            this.body.collideWorldBounds = true;
            this.body.maxVelocity.set(100);
            this.body.setSize(21, 21);

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

          this.checkCollisionWithTerrain();

          if (!this.isShooting && this.currentState != playerStates.HIT) {
            this.movement();
          }

          if (this.currentState == playerStates.HIT) {
            this.hitCountdown -= 0.2;
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;

            if (this.hitCountdown < 0) {
              this.hitCountdown = 20.0;
              this.currentState = playerStates.ALIVE;
            }
          }

          this.shooting();

          this.game.world.wrap(this, 16);

          this.sword.update();

          if (this.playerHealth <= 0) {
            this.currentState = playerStates.DEAD;
            this.kill();
          }

        }

        checkCollisionWithTerrain() {
          if (this.isCollidingWithTerrain) {
            this.body.maxVelocity.set(60);

            if (this.timerSinceCollidingWithTerrain >= 0) {
              this.timerSinceCollidingWithTerrain -= 0.2;
            }

            else {
              this.isCollidingWithTerrain = false;
              this.timerSinceCollidingWithTerrain = 10.0;
            }
          }

          else {
            this.body.maxVelocity.set(100);
          }
        }

        movement() {
          if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) &&
            this.keyVerticalyPressed != true) {
            this.body.velocity.x -= this.walkingSpeed;

            if (this.isCollidingWithTerrain) {
              this.play('chopLeft');
            }
            else {
              this.play('walkLeft');
            }

            this.currentLookingDirection = lookingDirection.LEFT;
            this.keyHorizontalyPressed = true;
          }

          else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) &&
            this.keyVerticalyPressed != true) {
            this.body.velocity.x += this.walkingSpeed;

            if (this.isCollidingWithTerrain) {
              this.play('chopRight');
            }
            else {
              this.play('walkRight');
            }

            this.currentLookingDirection = lookingDirection.RIGHT;
            this.keyHorizontalyPressed = true;
          }

          else if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN) &&
            this.keyHorizontalyPressed != true) {
            this.body.velocity.y += this.walkingSpeed;

            if (this.isCollidingWithTerrain) {
              this.play('chopDown');
            }
            else {
              this.play('walkDown');
            }

            this.currentLookingDirection = lookingDirection.DOWN;
            this.keyVerticalyPressed = true;
          }

          else if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP) && this.position.y > 129 &&
            this.keyHorizontalyPressed != true) {
            this.body.velocity.y -= this.walkingSpeed;

            if (this.isCollidingWithTerrain) {
              this.play('chopUp');
            }
            else {
              this.play('walkUp');
            }

            this.currentLookingDirection = lookingDirection.UP;
            this.keyVerticalyPressed = true;
          }

          else {
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
            this.keyHorizontalyPressed = false;
            this.keyVerticalyPressed = false;
          }
        }

        shooting() {
          if (this.game.input.keyboard.downDuration(Phaser.Keyboard.X, 100) &&
            (this.currentLookingDirection == lookingDirection.LEFT ||
            this.currentLookingDirection == lookingDirection.RIGHT)) {

            this.sword.setActivation(true);
            this.isShooting = true;
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;

            if (this.currentLookingDirection == lookingDirection.LEFT) {
              this.sword.position.set(-30, 0);
            }

            else if (this.currentLookingDirection == lookingDirection.RIGHT) {
            this.sword.position.set(30, 0);
            }

          }

          else {
            this.sword.setActivation(false);
            this.isShooting = false;
          }
        }

        /*
         * internal method called by the world postUpdate cycle
         * somehow update() does not work when this is activated
         */
        // postUpdate() { }

    }

}

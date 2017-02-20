module digDug {

    export enum enemyStates {
      ALIVE,
      PARALYSED,
      REACTIVATE,
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

    export class Enemy extends Phaser.Sprite {

      private isCollidingWithTerrain: boolean = false;
      private walkingSpeed: number = 100.0;
      private enemyHealth: number = 40.0;
      private currentState: any;
      private paralysedTimer: number = 10.0;
      private blowFactor: number;
      private healthText: any;
      private m_circleForHealthText: any;

      private enemyAnimations: Phaser.Animation[] = [];

      public getStatusCollideWithTerrain(): boolean { return this.isCollidingWithTerrain; }
      public setStatusCollideWithTerrain(collide: boolean): void { this.isCollidingWithTerrain = collide; }

      public getEnemyHealth(): number { return this.enemyHealth; }
      public setEnemyHealth(health: number): void { this.enemyHealth = health; }

      public getCurrentState(): any { return this.currentState; }
      public setCurrentState(state: any): void { this.currentState = state; }

      public getParalysedTimer(): number { return this.paralysedTimer; }
      public setParalysedTimer(timer: number): void { this.paralysedTimer = timer; }

        constructor(game: Phaser.Game, x: number, y: number, key?: string, frame?: string | number) {

            super(game, x, y, 'enemy', 0);

            /*
             * VARIABLES
             */
            this.currentState = enemyStates.ALIVE;
            this.blowFactor = 2;

            this.m_circleForHealthText = game.add.graphics(0, 0);

            /*
             * SPRITE CONTROL
             */
            this.anchor.setTo(0.5, 0.5);
            this.scale.set(this.blowFactor);
            this.checkWorldBounds = true;

            /*
             * ANIMATIONS
             */

            this.enemyAnimations.push(this.animations.add('fly', [0, 1], 10, true));
            this.enemyAnimations.push(this.animations.add('hit', [2, 3], 10, true));


            this.healthText = this.game.add.text(this.position.x + 5, this.position.y + 5, "" + this.enemyHealth, { font: "12px Arial", fill: "#000000", align: "center" });


            /*
             * PHYSICS CONTROL
             */

            // enable the physics for the player
            game.physics.enable(this, Phaser.Physics.ARCADE);

            // set player body physics parameters
            this.body.collideWorldBounds = true;
            this.body.bounce.set(1);
            this.body.maxVelocity.set(150);
            this.body.setSize(21, 21);
            this.body.velocity.x = Math.floor(Math.random() * 721) - 360;
            this.body.velocity.y = Math.floor(Math.random() * 721) - 360;
            this.body.velocity.normalize();
            this.body.velocity.x = this.body.velocity.x * this.walkingSpeed;
            this.body.velocity.y = this.body.velocity.y * this.walkingSpeed;


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

          if (this.currentState != enemyStates.DEAD) {
            this.healthUpdate();
          }

          if (this.currentState == enemyStates.ALIVE) {
            this.scale.set(2);
            this.animations.play('fly');
          }

          else if (this.currentState == enemyStates.PARALYSED) {
            this.body.velocity.x = this.body.velocity.y = 0;
            this.paralysedTimer -= 1.0;
            var blowFactor = (1 / (this.enemyHealth / 10)) * 8;

            if (blowFactor > 5) {
              blowFactor = 5;
            }
            this.scale.set(blowFactor);
            this.animations.play('hit');

            if (this.paralysedTimer <= 0) {
              this.currentState = enemyStates.REACTIVATE;
            }
          }

          else if (this.currentState == enemyStates.REACTIVATE) {
            this.body.velocity.x = Math.floor(Math.random() * 721) - 360;
            this.body.velocity.y = Math.floor(Math.random() * 721) - 360;
            this.body.velocity.normalize();
            var blowFactor = (1 / (this.enemyHealth / 10)) * 8;

            if (blowFactor > 5) {
              blowFactor = 5;
            }

            this.body.velocity.x = this.body.velocity.x * this.walkingSpeed * blowFactor/2;
            this.body.velocity.y = this.body.velocity.y * this.walkingSpeed * blowFactor/2;

            this.scale.set(blowFactor);
            this.animations.play('fly');

            this.currentState = enemyStates.ALIVE;
          }


          if (this.enemyHealth <= 0) {
            this.currentState = enemyStates.DEAD;
            this.destroy();
            this.healthText.destroy();
            this.m_circleForHealthText.destroy();
          }


        }

        healthUpdate() {

          this.m_circleForHealthText.clear();
          //this.m_circleForHealthText = this.game.add.graphics(0, 0);
          this.m_circleForHealthText.lineStyle(3, 0xffd900, 1);
          this.m_circleForHealthText.beginFill(0xFF0000, 1);
          this.m_circleForHealthText.drawCircle(this.position.x + 12, this.position.y + 12, 20);

          this.healthText.destroy();
          this.healthText = this.game.add.text(this.position.x + 5, this.position.y + 5, "" + this.enemyHealth, { font: "12px Arial", fill: "#FFFFFF", align: "center" });

        }

        /*
         * internal method called by the world postUpdate cycle
         * somehow update() does not work when this is activated
         */
        // postUpdate() { }

    }

}

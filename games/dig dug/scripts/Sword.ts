module digDug {

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

    export class Sword extends Phaser.Sprite {

      private isActive: boolean;

      public getActivation(): boolean { return this.isActive; }
      public setActivation(active: boolean) { this.isActive = active; }

        constructor(game: Phaser.Game, x: number, y: number, key?: string, frame?: string | number) {

            super(game, x, y, 'shoot', 0);

            /*
             * VARIABLES
             */
            this.isActive = false;

            /*
             * SPRITE CONTROL
             */
            this.scale.set(1);
            this.anchor.setTo(0.5, 0.5);

            // enable the physics for the player
            game.physics.enable(this, Phaser.Physics.ARCADE);

            // set player body physics parameters
            this.body.setSize(84, 21);

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
          this.visible = this.isActive;
        }

        /*
         * internal method called by the world postUpdate cycle
         * somehow update() does not work when this is activated
         */
        // postUpdate() { }

    }

}

module spriteClass {

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

        constructor(game: Phaser.Game, x: number, y: number, key?: string, frame?: string | number) {

            super(game, x, y, 'player', 0);

            /*
             * SPRITE CONTROL
             */
            this.anchor.setTo(0.5, 0.5);
            this.scale.set(3);

            /*
             * INPUT CONTROL
             */

            // this will enable input for the sprite/object
            this.inputEnabled = true

            // the input properties can only be accessed if inputEnabled is set to true
            this.input.draggable = true;

            /*
             * PHYSICS CONTROL
             */

            // enable the physics for the player
            game.physics.enable(this, Phaser.Physics.ARCADE);

            // set player body physics parameters
            this.body.setSize(84, 12, 0, 0);
            this.body.drag.set(70);
            this.body.maxVelocity.set(800);

            // finally add the new object to the game and return it
            game.add.existing(this);

        }

        /*
         * automatically called by world.preUpdate
         */
        preUpdate() { }

        /*
         * update() is called immediately after preUpdate and before postUpdate
         * remember if this Game Object has any children you should call update on those too.
         */
        update() {

            if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                this.body.velocity.x += -20;
            }

            else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                this.body.velocity.x += 20;
            }

            else if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
                this.body.velocity.y += 20;
            }

            else if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
                this.body.velocity.y -= 20;
            }

            else {
                this.body.velocity.x = 0;
                this.body.velocity.y = 0;
            }

            this.game.world.wrap(this, 16);


        }

        /*
         * internal method called by the world postUpdate cycle
         */
        postUpdate() { }

    }

}

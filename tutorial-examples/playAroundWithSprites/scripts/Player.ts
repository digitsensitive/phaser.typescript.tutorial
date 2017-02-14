module phaserSprite {

    // ** here we have to use the capabilities of Phase.Sprite, the constructor must be identical for required fields
    // Sprite: A Game Object with a texture, capable of running animation, input events and physics.
    // #

    export class Player extends Phaser.Sprite {

        constructor(game: Phaser.Game, x: number, y: number, key?: string, frame?: string | number) {

            super(game, x, y, 'player', 0);

            // ** set player sprite parameters
            this.anchor.setTo(0.5, 0.5);
            this.scale.set(3);

            // ** set player body physics

            // enable the physics for the player: this
            game.physics.enable(this, Phaser.Physics.ARCADE);

            // set player body physics parameters

            this.body.setSize(84, 12, 0, 0);
            this.body.drag.set(70);
            this.body.maxVelocity.set(800);

            game.add.existing(this);

        }

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

        render() {

        }

    }

}

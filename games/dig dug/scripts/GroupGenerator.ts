module digDug {

  export class GroupGenerator extends Phaser.Group {

      constructor(game: Phaser.Game) {

          super(game);

          this.enableBody = true;
          this.physicsBodyType = Phaser.Physics.ARCADE;

          game.add.existing(this);

      }

  }

}

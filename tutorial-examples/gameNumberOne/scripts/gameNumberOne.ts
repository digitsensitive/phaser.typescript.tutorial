/// <reference path="../lib/typings/phaser.d.ts"/>

class gameNumberOne {

  private logo: Phaser.Sprite;
  private game: Phaser.Game;

  	constructor(width: number, height: number) {
      this.game = new Phaser.Game(width, height, Phaser.AUTO, 'gameNumberOne', { preload: this.preload, create: this.create });
    }

    preload(): void {
      this.game.load.image('logo', 'assets/sprites/phaser2.png');
    }

    create(): void {
      this.logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
      this.logo.anchor.setTo(0.5, 0.5);
    }


}

window.onload = () => {
  var game = new gameNumberOne(800, 600);
}

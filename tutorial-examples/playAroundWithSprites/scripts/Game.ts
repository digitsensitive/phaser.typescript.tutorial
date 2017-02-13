/// <reference path="../lib/typings/phaser.d.ts"/>

module PlayAroundWithSprites {

  export class Game extends Phaser.Game {

    /**
     * [Constructor of the main game class]
     * @param  {number|string}      width  [width of game screen]
     * @param  {number|string}      height [height of game screen]
     * @param  {boolean}            transparent [description]
     * @param  {boolean}            antialias   [antialias on/off]
     * @return {[type]}                [description]
     */
  	constructor(width: number | string, height: number | string, transparent: boolean, antialias: boolean) {
  		super(width,
        height,
        Phaser.AUTO,
        'playAroundWithSprites',
        null,
        transparent,
        antialias);

      this.state.add('GameContent', GameContent, false);

      this.state.start('GameContent');
    }
  }
}

// when the page has finished loading, create our game
window.onload = () => {
  var game = new PlayAroundWithSprites.Game(800, 600, false, false);
}

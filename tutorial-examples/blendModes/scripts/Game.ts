/// <reference path="../lib/typings/phaser.d.ts"/>

interface IGameConstructor {
  width: string | number,
  height: string | number,
  renderer?: number,
  parent: string,
  state?: any,
  transparent?: boolean,
  antialias?: boolean,
  physicsConfig?: any
}

module blendModes {

  export class Game extends Phaser.Game {

    constructor(aParams: IGameConstructor) {
  		super(aParams.width,
        aParams.height,
        aParams.renderer,
        aParams.parent,
        aParams.state,
        aParams.transparent,
        aParams.antialias,
        aParams.physicsConfig);

      /* Phaser.StateManager.add -> Create GameState State */
      this.state.add('GameState', GameState, false);

      /* Load up the GameState State */
      this.state.start('GameState');
    }
  }
}

// when the page has finished loading, create our game
window.onload = () => {
  var game = new blendModes.Game({
    width: 635,
    height: 545,
    renderer: Phaser.AUTO,
    parent: 'blendModes',
    transparent: false,
    antialias: false
  });
}

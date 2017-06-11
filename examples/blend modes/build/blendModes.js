var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var blendModes;
(function (blendModes) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game(aParams) {
            var _this = _super.call(this, aParams.width, aParams.height, aParams.renderer, aParams.parent, aParams.state, aParams.transparent, aParams.antialias, aParams.physicsConfig) || this;
            _this.state.add('GameState', blendModes.GameState, false);
            _this.state.start('GameState');
            return _this;
        }
        return Game;
    }(Phaser.Game));
    blendModes.Game = Game;
})(blendModes || (blendModes = {}));
window.onload = function () {
    var game = new blendModes.Game({
        width: 635,
        height: 545,
        renderer: Phaser.AUTO,
        parent: 'blendModes',
        transparent: false,
        antialias: false
    });
};
var blendModes;
(function (blendModes) {
    var GameState = (function (_super) {
        __extends(GameState, _super);
        function GameState() {
            return _super.apply(this, arguments) || this;
        }
        GameState.prototype.init = function () {
            this.m_sprite = this.m_sprite2 = null;
            this.m_currentBlendMode = PIXI.blendModes.NORMAL;
        };
        GameState.prototype.preload = function () {
            this.load.image('sprite1', 'assets/sprite1.png');
            this.load.image('sprite2', 'assets/sprite2.png');
        };
        GameState.prototype.loadUpdate = function () { };
        GameState.prototype.loadRender = function () { };
        GameState.prototype.create = function () {
            this.stage.backgroundColor = "#4488AA";
            this.m_sprite = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'sprite1');
            this.m_sprite.anchor.setTo(0.5, 0.5);
            this.m_sprite.blendMode = this.m_currentBlendMode;
            this.m_sprite2 = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'sprite2');
            this.m_sprite2.anchor.setTo(0.5, 0.5);
            this.m_sprite2.blendMode = this.m_currentBlendMode;
            this.m_sprite2.scale.setTo(3);
            this.m_textBlendMode = this.game.add.text(10, 10, "BlendMode: " + this.m_currentBlendMode, { font: "20px Arial", fill: "#FFFFFF", align: "center" });
        };
        GameState.prototype.update = function () {
            if (this.game.input.keyboard.downDuration(Phaser.Keyboard.UP, 100)) {
                if (this.m_sprite2.blendMode > 16) {
                    this.m_sprite2.blendMode = 16;
                }
                else {
                    this.m_sprite2.blendMode += 1;
                }
                this.m_currentBlendMode = this.m_sprite2.blendMode;
                this.m_textBlendMode.destroy();
                this.m_textBlendMode = this.game.add.text(10, 10, "BlendMode: " + this.m_currentBlendMode, { font: "20px Arial", fill: "#FFFFFF", align: "center" });
            }
            if (this.game.input.keyboard.downDuration(Phaser.Keyboard.DOWN, 100)) {
                if (this.m_sprite2.blendMode < 0) {
                    this.m_sprite2.blendMode = 0;
                }
                else {
                    this.m_sprite2.blendMode -= 1;
                }
                this.m_currentBlendMode = this.m_sprite2.blendMode;
                this.m_textBlendMode.destroy();
                this.m_textBlendMode = this.game.add.text(10, 10, "BlendMode: " + this.m_currentBlendMode, { font: "20px Arial", fill: "#FFFFFF", align: "center" });
            }
            this.m_sprite2.position.x = this.game.input.mousePointer.x;
            this.m_sprite2.position.y = this.game.input.mousePointer.y;
        };
        GameState.prototype.preRender = function () { };
        GameState.prototype.render = function () {
        };
        GameState.prototype.paused = function () { };
        GameState.prototype.pauseUpdate = function () { };
        GameState.prototype.resize = function () { };
        GameState.prototype.resumed = function () { };
        GameState.prototype.shutdown = function () {
            this.m_sprite.destroy();
            this.m_sprite2.destroy();
        };
        return GameState;
    }(Phaser.State));
    blendModes.GameState = GameState;
})(blendModes || (blendModes = {}));

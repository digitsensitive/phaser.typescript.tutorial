var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var phaserSprite;
(function (phaserSprite) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game(width, height, transparent, antialias) {
            var _this = _super.call(this, width, height, Phaser.AUTO, 'phaserSprite', null, transparent, antialias) || this;
            _this.state.add('GameContent', phaserSprite.GameContent, false);
            _this.state.start('GameContent');
            return _this;
        }
        return Game;
    }(Phaser.Game));
    phaserSprite.Game = Game;
})(phaserSprite || (phaserSprite = {}));
window.onload = function () {
    var game = new phaserSprite.Game(800, 600, false, false);
};
var phaserSprite;
(function (phaserSprite) {
    var GameContent = (function (_super) {
        __extends(GameContent, _super);
        function GameContent() {
            return _super.apply(this, arguments) || this;
        }
        GameContent.prototype.init = function () {
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
        };
        GameContent.prototype.preload = function () {
            this.game.load.image('player', 'assets/sprites/playerGreen.png');
        };
        GameContent.prototype.loadUpdate = function () { };
        GameContent.prototype.loadRender = function () { };
        GameContent.prototype.create = function () {
            this.player = new phaserSprite.Player(this.game, this.game.world.centerX, this.game.world.centerY);
        };
        GameContent.prototype.update = function () { };
        GameContent.prototype.preRender = function () { };
        GameContent.prototype.render = function () { };
        GameContent.prototype.paused = function () { };
        GameContent.prototype.pauseUpdate = function () { };
        GameContent.prototype.resize = function () { };
        GameContent.prototype.resumed = function () { };
        GameContent.prototype.shutdown = function () { };
        return GameContent;
    }(Phaser.State));
    phaserSprite.GameContent = GameContent;
})(phaserSprite || (phaserSprite = {}));
var phaserSprite;
(function (phaserSprite) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(game, x, y, key, frame) {
            var _this = _super.call(this, game, x, y, 'player', 0) || this;
            _this.anchor.setTo(0.5, 0.5);
            _this.scale.set(3);
            game.physics.enable(_this, Phaser.Physics.ARCADE);
            _this.body.setSize(84, 12, 0, 0);
            _this.body.drag.set(70);
            _this.body.maxVelocity.set(800);
            game.add.existing(_this);
            return _this;
        }
        Player.prototype.update = function () {
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
        };
        Player.prototype.render = function () {
        };
        return Player;
    }(Phaser.Sprite));
    phaserSprite.Player = Player;
})(phaserSprite || (phaserSprite = {}));

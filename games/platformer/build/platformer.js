var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var platformer;
(function (platformer) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game(aParams) {
            var _this = _super.call(this, aParams.width, aParams.height, aParams.renderer, aParams.parent, aParams.state, aParams.transparent, aParams.antialias, aParams.physicsConfig) || this;
            _this.state.add('GameState', platformer.GameState, false);
            _this.state.start('GameState');
            return _this;
        }
        return Game;
    }(Phaser.Game));
    platformer.Game = Game;
})(platformer || (platformer = {}));
window.onload = function () {
    var game = new platformer.Game({
        width: 320,
        height: 200,
        renderer: Phaser.CANVAS,
        parent: 'platformer',
        transparent: false,
        antialias: false
    });
};
var platformer;
(function (platformer) {
    var GameState = (function (_super) {
        __extends(GameState, _super);
        function GameState() {
            return _super.apply(this, arguments) || this;
        }
        GameState.prototype.init = function () {
            this.m_player = null;
            this.m_levelGrassOne = null;
            this.m_groundLayer = null;
            this.m_backgroundLayer = null;
            this.m_background = null;
            this.m_playerLivesText = null;
        };
        GameState.prototype.preload = function () {
            this.load.spritesheet('player', 'assets/sprites/player.png', 20, 20);
            this.load.tilemap('tilemap', 'assets/levels/levelGrassOne.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.image('tiles', 'assets/tilesheets/tilesheetGrass.png');
            this.load.image('background', 'assets/levels/background.png');
            this.load.bitmapFont('platformerFont', 'assets/font/platformerFont.png', 'assets/font/platformerFont.xml');
        };
        GameState.prototype.loadUpdate = function () { };
        GameState.prototype.loadRender = function () { };
        GameState.prototype.create = function () {
            this.physics.startSystem(Phaser.Physics.ARCADE);
            this.m_background = this.add.tileSprite(0, 0, 640, 200, 'background');
            this.m_background.fixedToCamera = true;
            this.initTilemapWithLayers();
            this.m_player = new platformer.Player(this.game, 20, 80);
            this.m_playerLivesText = this.game.add.bitmapText(10, 185, "platformerFont", "LIVES: " + this.m_player.getPlayerLives(), 10);
            this.m_playerLivesText.fixedToCamera = true;
            this.scale.setUserScale(2.5, 2.5);
            this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
            Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
        };
        GameState.prototype.initTilemapWithLayers = function () {
            this.m_levelGrassOne = this.game.add.tilemap('tilemap');
            this.m_levelGrassOne.addTilesetImage('tilesheetGrass', 'tiles');
            this.m_backgroundLayer = this.m_levelGrassOne.createLayer('BackgroundLayer');
            this.m_groundLayer = this.m_levelGrassOne.createLayer('GroundLayer');
            this.m_levelGrassOne.setCollisionBetween(21, 22, true, 'GroundLayer');
            this.m_groundLayer.resizeWorld();
        };
        GameState.prototype.update = function () {
            this.collisionCheck();
            this.backgroundMovement();
            this.checkPlayerState();
        };
        GameState.prototype.collisionCheck = function () {
            this.physics.arcade.collide(this.m_player, this.m_groundLayer, this.playerGroundCollision);
        };
        GameState.prototype.playerGroundCollision = function (_player) {
            _player.setPlayerJumping(false);
        };
        GameState.prototype.backgroundMovement = function () {
            if (this.m_player.body.velocity.x > 0) {
                this.m_background.tilePosition.x -= 0.5;
            }
            else if (this.m_player.body.velocity.x < 0) {
                this.m_background.tilePosition.x += 0.5;
            }
        };
        GameState.prototype.checkPlayerState = function () {
            if (this.m_player.getPlayerState() == platformer.m_playerStates.DEAD) {
                if (this.m_player.getPlayerLives() > 0) {
                    this.m_player.setPlayerLives(this.m_player.getPlayerLives() - 1);
                    this.m_playerLivesText.kill();
                    this.m_playerLivesText = this.game.add.bitmapText(10, 185, "platformerFont", "LIVES: " + this.m_player.getPlayerLives(), 10);
                    this.m_playerLivesText.fixedToCamera = true;
                }
                else {
                }
            }
        };
        GameState.prototype.preRender = function () { };
        GameState.prototype.render = function () {
        };
        GameState.prototype.paused = function () { };
        GameState.prototype.pauseUpdate = function () { };
        GameState.prototype.resize = function () { };
        GameState.prototype.resumed = function () { };
        GameState.prototype.shutdown = function () {
            ;
        };
        return GameState;
    }(Phaser.State));
    platformer.GameState = GameState;
})(platformer || (platformer = {}));
var platformer;
(function (platformer) {
    var m_playerStates;
    (function (m_playerStates) {
        m_playerStates[m_playerStates["ALIVE"] = 0] = "ALIVE";
        m_playerStates[m_playerStates["DEAD"] = 1] = "DEAD";
    })(m_playerStates = platformer.m_playerStates || (platformer.m_playerStates = {}));
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(game, x, y, key, frame) {
            var _this = _super.call(this, game, x, y, 'player', 0) || this;
            _this.playerAnimations = [];
            _this.m_walkingSpeed = 100;
            _this.m_currentState = m_playerStates.ALIVE;
            _this.m_playerLives = 3;
            _this.m_isJumping = false;
            _this.anchor.setTo(0.5, 0.5);
            _this.playerAnimations.push(_this.animations.add('walkLeft', [4, 5], 8, true));
            _this.playerAnimations.push(_this.animations.add('walkRight', [2, 3], 8, true));
            _this.playerAnimations.push(_this.animations.add('idle', [0, 1], 8, true));
            game.physics.arcade.enable(_this);
            _this.m_gravityForce = 200;
            _this.body.bounce.y = 0.2;
            _this.body.gravity.y = 1500;
            _this.body.setSize(20, 20);
            _this.m_moveLeftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
            _this.m_moveRightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
            _this.m_jumpKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            game.camera.follow(_this, 1);
            game.add.existing(_this);
            return _this;
        }
        Player.prototype.getPlayerState = function () { return this.m_currentState; };
        Player.prototype.setPlayerState = function (state) { this.m_currentState = state; };
        Player.prototype.getPlayerLives = function () { return this.m_playerLives; };
        Player.prototype.setPlayerLives = function (lives) { this.m_playerLives = lives; };
        Player.prototype.getPlayerJumping = function () { return this.m_isJumping; };
        Player.prototype.setPlayerJumping = function (jump) { this.m_isJumping = jump; };
        Player.prototype.update = function () {
            this.checkCurrentState();
            this.checkIfOutOfBorders();
        };
        Player.prototype.checkCurrentState = function () {
            if (this.m_currentState == m_playerStates.DEAD) {
                this.resetPlayer();
            }
            else if (this.m_currentState == m_playerStates.ALIVE) {
                this.movement();
                this.jumping();
            }
        };
        Player.prototype.checkIfOutOfBorders = function () {
            if (this.body.position.y > 200 + this.height / 2) {
                this.m_currentState = m_playerStates.DEAD;
            }
        };
        Player.prototype.movement = function () {
            if (this.m_moveLeftKey.isDown) {
                this.body.velocity.x = -this.m_walkingSpeed;
                this.animations.play('walkLeft');
            }
            else if (this.m_moveRightKey.isDown) {
                this.body.velocity.x = this.m_walkingSpeed;
                this.animations.play('walkRight');
            }
            else {
                this.animations.play('idle');
                this.body.velocity.x = 0;
            }
        };
        Player.prototype.jumping = function () {
            if (this.m_jumpKey.isDown && !this.m_isJumping) {
                this.body.velocity.y = -320;
                this.m_isJumping = true;
            }
        };
        Player.prototype.resetPlayer = function () {
            this.body.position.x = 20;
            this.body.position.y = 80;
            this.body.velocity.x = this.body.velocity.y = 1;
            this.m_currentState = m_playerStates.ALIVE;
            this.m_isJumping = false;
        };
        return Player;
    }(Phaser.Sprite));
    platformer.Player = Player;
})(platformer || (platformer = {}));

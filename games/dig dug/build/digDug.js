var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var digDug;
(function (digDug) {
    var CollisionManager = (function () {
        function CollisionManager(game) {
            this.m_game = game;
        }
        CollisionManager.prototype.update = function () {
        };
        return CollisionManager;
    }());
    digDug.CollisionManager = CollisionManager;
})(digDug || (digDug = {}));
var digDug;
(function (digDug) {
    var enemyStates;
    (function (enemyStates) {
        enemyStates[enemyStates["ALIVE"] = 0] = "ALIVE";
        enemyStates[enemyStates["PARALYSED"] = 1] = "PARALYSED";
        enemyStates[enemyStates["REACTIVATE"] = 2] = "REACTIVATE";
        enemyStates[enemyStates["DEAD"] = 3] = "DEAD";
    })(enemyStates = digDug.enemyStates || (digDug.enemyStates = {}));
    var Enemy = (function (_super) {
        __extends(Enemy, _super);
        function Enemy(game, x, y, key, frame) {
            var _this = _super.call(this, game, x, y, 'enemy', 0) || this;
            _this.isCollidingWithTerrain = false;
            _this.walkingSpeed = 100.0;
            _this.enemyHealth = 40.0;
            _this.paralysedTimer = 10.0;
            _this.enemyAnimations = [];
            _this.currentState = enemyStates.ALIVE;
            _this.blowFactor = 2;
            _this.m_circleForHealthText = game.add.graphics(0, 0);
            _this.anchor.setTo(0.5, 0.5);
            _this.scale.set(_this.blowFactor);
            _this.checkWorldBounds = true;
            _this.enemyAnimations.push(_this.animations.add('fly', [0, 1], 10, true));
            _this.enemyAnimations.push(_this.animations.add('hit', [2, 3], 10, true));
            _this.healthText = _this.game.add.text(_this.position.x + 5, _this.position.y + 5, "" + _this.enemyHealth, { font: "12px Arial", fill: "#000000", align: "center" });
            game.physics.enable(_this, Phaser.Physics.ARCADE);
            _this.body.collideWorldBounds = true;
            _this.body.bounce.set(1);
            _this.body.maxVelocity.set(150);
            _this.body.setSize(21, 21);
            _this.body.velocity.x = Math.floor(Math.random() * 721) - 360;
            _this.body.velocity.y = Math.floor(Math.random() * 721) - 360;
            _this.body.velocity.normalize();
            _this.body.velocity.x = _this.body.velocity.x * _this.walkingSpeed;
            _this.body.velocity.y = _this.body.velocity.y * _this.walkingSpeed;
            game.add.existing(_this);
            return _this;
        }
        Enemy.prototype.getStatusCollideWithTerrain = function () { return this.isCollidingWithTerrain; };
        Enemy.prototype.setStatusCollideWithTerrain = function (collide) { this.isCollidingWithTerrain = collide; };
        Enemy.prototype.getEnemyHealth = function () { return this.enemyHealth; };
        Enemy.prototype.setEnemyHealth = function (health) { this.enemyHealth = health; };
        Enemy.prototype.getCurrentState = function () { return this.currentState; };
        Enemy.prototype.setCurrentState = function (state) { this.currentState = state; };
        Enemy.prototype.getParalysedTimer = function () { return this.paralysedTimer; };
        Enemy.prototype.setParalysedTimer = function (timer) { this.paralysedTimer = timer; };
        Enemy.prototype.update = function () {
            if (this.currentState != enemyStates.DEAD) {
                this.healthUpdate();
            }
            if (this.currentState == enemyStates.ALIVE) {
                this.scale.set(2);
                this.animations.play('fly');
            }
            else if (this.currentState == enemyStates.PARALYSED) {
                this.body.velocity.x = this.body.velocity.y = 0;
                this.paralysedTimer -= 1.0;
                var blowFactor = (1 / (this.enemyHealth / 10)) * 8;
                if (blowFactor > 5) {
                    blowFactor = 5;
                }
                this.scale.set(blowFactor);
                this.animations.play('hit');
                if (this.paralysedTimer <= 0) {
                    this.currentState = enemyStates.REACTIVATE;
                }
            }
            else if (this.currentState == enemyStates.REACTIVATE) {
                this.body.velocity.x = Math.floor(Math.random() * 721) - 360;
                this.body.velocity.y = Math.floor(Math.random() * 721) - 360;
                this.body.velocity.normalize();
                var blowFactor = (1 / (this.enemyHealth / 10)) * 8;
                if (blowFactor > 5) {
                    blowFactor = 5;
                }
                this.body.velocity.x = this.body.velocity.x * this.walkingSpeed * blowFactor / 2;
                this.body.velocity.y = this.body.velocity.y * this.walkingSpeed * blowFactor / 2;
                this.scale.set(blowFactor);
                this.animations.play('fly');
                this.currentState = enemyStates.ALIVE;
            }
            if (this.enemyHealth <= 0) {
                this.currentState = enemyStates.DEAD;
                this.destroy();
                this.healthText.destroy();
                this.m_circleForHealthText.destroy();
            }
        };
        Enemy.prototype.healthUpdate = function () {
            this.m_circleForHealthText.clear();
            this.m_circleForHealthText.lineStyle(3, 0xffd900, 1);
            this.m_circleForHealthText.beginFill(0xFF0000, 1);
            this.healthText.destroy();
        };
        return Enemy;
    }(Phaser.Sprite));
    digDug.Enemy = Enemy;
})(digDug || (digDug = {}));
var digDug;
(function (digDug) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game(aParams) {
            var _this = _super.call(this, aParams.width, aParams.height, aParams.renderer, aParams.parent, aParams.state, aParams.transparent, aParams.antialias, aParams.physicsConfig) || this;
            _this.state.add('GameState', digDug.GameState, false);
            _this.state.start('GameState');
            return _this;
        }
        return Game;
    }(Phaser.Game));
    digDug.Game = Game;
})(digDug || (digDug = {}));
window.onload = function () {
    var game = new digDug.Game({
        width: 800,
        height: 600,
        renderer: Phaser.AUTO,
        parent: 'digDug',
        transparent: false,
        antialias: false
    });
};
var digDug;
(function (digDug) {
    var GameState = (function (_super) {
        __extends(GameState, _super);
        function GameState() {
            return _super.apply(this, arguments) || this;
        }
        GameState.prototype.init = function () {
            this.m_player = this.m_enemy = this.m_enemies = null;
            this.m_land = this.m_background = null;
            this.m_playerHealthText = null;
            this.m_numberOfEnemies = 10;
        };
        GameState.prototype.preload = function () {
            this.load.spritesheet('player', 'assets/sprites/player.png', 21, 21);
            this.load.spritesheet('shoot', 'assets/sprites/shoot.png', 42, 21);
            this.load.spritesheet('enemy', 'assets/sprites/enemy.png', 21, 21);
            this.load.image('land', 'assets/levels/land.png');
            this.load.image('background', 'assets/levels/background2.png');
        };
        GameState.prototype.loadUpdate = function () { };
        GameState.prototype.loadRender = function () { };
        GameState.prototype.create = function () {
            this.m_background = this.add.sprite(0, 0, 'background');
            this.m_background.scale.setTo(20, 20);
            this.m_land = this.add.bitmapData(800, 600);
            this.m_land.smoothed = false;
            this.m_land.draw('land', 0, 0, 800, 600);
            this.m_land.update();
            this.m_land.addToWorld(0, 0, 0, 0, 1, 1);
            this.m_player = new digDug.Player(this.game, this.world.centerX, 350);
            this.m_enemies = new digDug.GroupGenerator(this.game);
            for (var x = 0; x < this.m_numberOfEnemies; x++) {
                this.m_enemy = this.m_enemies.add(new digDug.Enemy(this.game, Math.floor(Math.random() * 700) + 100, Math.floor(Math.random() * 500) + 100));
            }
            this.m_playerHealthText = this.game.add.text(10, 500, "Health: " + this.m_player.getPlayerHealth(), { font: "20px Arial", fill: "#FFFFFF", align: "center" });
        };
        GameState.prototype.update = function () {
            this.collisionCheck();
        };
        GameState.prototype.collisionCheck = function () {
            this.checkCollisionPlayerAndTerrain();
            this.game.physics.arcade.overlap(this.m_player, this.m_enemies, this.playerEnemyHit, null, this);
            if (this.m_player.getSword().getActivation()) {
                this.game.physics.arcade.overlap(this.m_player.getSword(), this.m_enemies, this.attackHitEnemy, null, this);
            }
        };
        GameState.prototype.checkCollisionPlayerAndTerrain = function () {
            if (this.m_player.body.velocity.x != 0) {
                if (this.m_player.body.velocity.x < 0) {
                    var x = Math.floor(this.m_player.x - 12);
                }
                else {
                    var x = Math.floor(this.m_player.x + 12);
                }
                var y = Math.floor(this.m_player.y);
            }
            if (this.m_player.body.velocity.y != 0) {
                if (this.m_player.body.velocity.y < 0) {
                    var y = Math.floor(this.m_player.y - 12);
                }
                else {
                    var y = Math.floor(this.m_player.y + 12);
                }
                var x = Math.floor(this.m_player.x);
            }
            var rgba = this.m_land.getPixelRGB(x, y);
            if (rgba.a > 0) {
                this.m_player.setStatusCollideWithTerrain(true);
                this.m_land.blendDestinationOut();
                this.m_land.clear(x - 20, y - 20, 40, 40);
                this.m_land.clear(x - 20 - Math.floor(Math.random() * 15) + 1, y - 20 - Math.floor(Math.random() * 15) + 1, Math.floor(Math.random() * 8) + 5, Math.floor(Math.random() * 8) + 5);
                this.m_land.clear(x + 20 - Math.floor(Math.random() * 15) + 1, y + 20 - Math.floor(Math.random() * 15) + 1, Math.floor(Math.random() * 8) + 5, Math.floor(Math.random() * 8) + 5);
                this.m_land.blendReset();
                this.m_land.update();
            }
        };
        GameState.prototype.playerEnemyHit = function (_player, _enemy) {
            if (_player.getCurrentState() == digDug.playerStates.ALIVE) {
                _player.setCurrentState(digDug.playerStates.HIT);
                _player.setPlayerHealth(_player.getPlayerHealth() - 10.0);
                this.m_playerHealthText.destroy();
                this.m_playerHealthText = this.game.add.text(10, 500, "Health: " + this.m_player.getPlayerHealth(), { font: "20px Arial", fill: "#FFFFFF", align: "center" });
            }
        };
        GameState.prototype.attackHitEnemy = function (_player, _enemy) {
            if (_enemy.getCurrentState() == digDug.enemyStates.ALIVE) {
                _enemy.setEnemyHealth(_enemy.getEnemyHealth() - 10.0);
                _enemy.setCurrentState(digDug.enemyStates.PARALYSED);
                _enemy.setParalysedTimer(30.0);
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
            this.m_land.destroy();
        };
        return GameState;
    }(Phaser.State));
    digDug.GameState = GameState;
})(digDug || (digDug = {}));
var digDug;
(function (digDug) {
    var GroupGenerator = (function (_super) {
        __extends(GroupGenerator, _super);
        function GroupGenerator(game) {
            var _this = _super.call(this, game) || this;
            _this.enableBody = true;
            _this.physicsBodyType = Phaser.Physics.ARCADE;
            game.add.existing(_this);
            return _this;
        }
        return GroupGenerator;
    }(Phaser.Group));
    digDug.GroupGenerator = GroupGenerator;
})(digDug || (digDug = {}));
var digDug;
(function (digDug) {
    var playerStates;
    (function (playerStates) {
        playerStates[playerStates["ALIVE"] = 0] = "ALIVE";
        playerStates[playerStates["HIT"] = 1] = "HIT";
        playerStates[playerStates["DEAD"] = 2] = "DEAD";
    })(playerStates = digDug.playerStates || (digDug.playerStates = {}));
    var lookingDirection;
    (function (lookingDirection) {
        lookingDirection[lookingDirection["LEFT"] = 0] = "LEFT";
        lookingDirection[lookingDirection["RIGHT"] = 1] = "RIGHT";
        lookingDirection[lookingDirection["DOWN"] = 2] = "DOWN";
        lookingDirection[lookingDirection["UP"] = 3] = "UP";
    })(lookingDirection = digDug.lookingDirection || (digDug.lookingDirection = {}));
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(game, x, y, key, frame) {
            var _this = _super.call(this, game, x, y, 'player', 0) || this;
            _this.isCollidingWithTerrain = false;
            _this.walkingSpeed = 100.0;
            _this.movingHorizontaly = false;
            _this.movingVerticaly = false;
            _this.keyHorizontalyPressed = false;
            _this.keyVerticalyPressed = false;
            _this.timerSinceCollidingWithTerrain = 10.0;
            _this.playerHealth = 40.0;
            _this.isShooting = false;
            _this.hitCountdown = 20.0;
            _this.playerAnimations = [];
            _this.currentState = playerStates.ALIVE;
            _this.isShooting = false;
            _this.anchor.setTo(0.5, 0.5);
            _this.scale.set(2);
            _this.sword = new digDug.Sword(game, 50, 0);
            _this.addChild(_this.sword);
            _this.playerAnimations.push(_this.animations.add('walkLeft', [3, 4], 10, true));
            _this.playerAnimations.push(_this.animations.add('chopLeft', [8, 9], 10, true));
            _this.playerAnimations.push(_this.animations.add('walkRight', [1, 2], 10, true));
            _this.playerAnimations.push(_this.animations.add('chopRight', [6, 7], 10, true));
            _this.playerAnimations.push(_this.animations.add('walkDown', [0], 10, true));
            _this.playerAnimations.push(_this.animations.add('chopDown', [5], 10, true));
            _this.playerAnimations.push(_this.animations.add('walkUp', [0], 10, true));
            _this.playerAnimations.push(_this.animations.add('chopUp', [5], 10, true));
            _this.playerAnimations.push(_this.animations.add('idle', [0], 10, true));
            game.physics.enable(_this, Phaser.Physics.ARCADE);
            _this.body.collideWorldBounds = true;
            _this.body.maxVelocity.set(100);
            _this.body.setSize(21, 21);
            game.add.existing(_this);
            return _this;
        }
        Player.prototype.getStatusCollideWithTerrain = function () { return this.isCollidingWithTerrain; };
        Player.prototype.setStatusCollideWithTerrain = function (collide) { this.isCollidingWithTerrain = collide; };
        Player.prototype.getSword = function () { return this.sword; };
        Player.prototype.getPlayerHealth = function () { return this.playerHealth; };
        Player.prototype.setPlayerHealth = function (health) { this.playerHealth = health; };
        Player.prototype.getCurrentState = function () { return this.currentState; };
        Player.prototype.setCurrentState = function (state) { this.currentState = state; };
        Player.prototype.update = function () {
            this.checkCollisionWithTerrain();
            if (!this.isShooting && this.currentState != playerStates.HIT) {
                this.movement();
            }
            if (this.currentState == playerStates.HIT) {
                this.hitCountdown -= 0.2;
                this.body.velocity.x = 0;
                this.body.velocity.y = 0;
                if (this.hitCountdown < 0) {
                    this.hitCountdown = 20.0;
                    this.currentState = playerStates.ALIVE;
                }
            }
            this.shooting();
            this.game.world.wrap(this, 16);
            this.sword.update();
            if (this.playerHealth <= 0) {
                this.currentState = playerStates.DEAD;
                this.kill();
            }
        };
        Player.prototype.checkCollisionWithTerrain = function () {
            if (this.isCollidingWithTerrain) {
                this.body.maxVelocity.set(60);
                if (this.timerSinceCollidingWithTerrain >= 0) {
                    this.timerSinceCollidingWithTerrain -= 0.2;
                }
                else {
                    this.isCollidingWithTerrain = false;
                    this.timerSinceCollidingWithTerrain = 10.0;
                }
            }
            else {
                this.body.maxVelocity.set(100);
            }
        };
        Player.prototype.movement = function () {
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) &&
                this.keyVerticalyPressed != true) {
                this.body.velocity.x -= this.walkingSpeed;
                if (this.isCollidingWithTerrain) {
                    this.play('chopLeft');
                }
                else {
                    this.play('walkLeft');
                }
                this.currentLookingDirection = lookingDirection.LEFT;
                this.keyHorizontalyPressed = true;
            }
            else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) &&
                this.keyVerticalyPressed != true) {
                this.body.velocity.x += this.walkingSpeed;
                if (this.isCollidingWithTerrain) {
                    this.play('chopRight');
                }
                else {
                    this.play('walkRight');
                }
                this.currentLookingDirection = lookingDirection.RIGHT;
                this.keyHorizontalyPressed = true;
            }
            else if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN) &&
                this.keyHorizontalyPressed != true) {
                this.body.velocity.y += this.walkingSpeed;
                if (this.isCollidingWithTerrain) {
                    this.play('chopDown');
                }
                else {
                    this.play('walkDown');
                }
                this.currentLookingDirection = lookingDirection.DOWN;
                this.keyVerticalyPressed = true;
            }
            else if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP) && this.position.y > 350 &&
                this.keyHorizontalyPressed != true) {
                this.body.velocity.y -= this.walkingSpeed;
                if (this.isCollidingWithTerrain) {
                    this.play('chopUp');
                }
                else {
                    this.play('walkUp');
                }
                this.currentLookingDirection = lookingDirection.UP;
                this.keyVerticalyPressed = true;
            }
            else {
                this.body.velocity.x = 0;
                this.body.velocity.y = 0;
                this.keyHorizontalyPressed = false;
                this.keyVerticalyPressed = false;
            }
        };
        Player.prototype.shooting = function () {
            if (this.game.input.keyboard.downDuration(Phaser.Keyboard.X, 100) &&
                (this.currentLookingDirection == lookingDirection.LEFT ||
                    this.currentLookingDirection == lookingDirection.RIGHT)) {
                this.sword.setActivation(true);
                this.isShooting = true;
                this.body.velocity.x = 0;
                this.body.velocity.y = 0;
                if (this.currentLookingDirection == lookingDirection.LEFT) {
                    this.sword.position.set(-30, 0);
                }
                else if (this.currentLookingDirection == lookingDirection.RIGHT) {
                    this.sword.position.set(30, 0);
                }
            }
            else {
                this.sword.setActivation(false);
                this.isShooting = false;
            }
        };
        return Player;
    }(Phaser.Sprite));
    digDug.Player = Player;
})(digDug || (digDug = {}));
var digDug;
(function (digDug) {
    var Sword = (function (_super) {
        __extends(Sword, _super);
        function Sword(game, x, y, key, frame) {
            var _this = _super.call(this, game, x, y, 'shoot', 0) || this;
            _this.isActive = false;
            _this.scale.set(1);
            _this.anchor.setTo(0.5, 0.5);
            game.physics.enable(_this, Phaser.Physics.ARCADE);
            _this.body.setSize(84, 21);
            game.add.existing(_this);
            return _this;
        }
        Sword.prototype.getActivation = function () { return this.isActive; };
        Sword.prototype.setActivation = function (active) { this.isActive = active; };
        Sword.prototype.update = function () {
            this.visible = this.isActive;
        };
        return Sword;
    }(Phaser.Sprite));
    digDug.Sword = Sword;
})(digDug || (digDug = {}));

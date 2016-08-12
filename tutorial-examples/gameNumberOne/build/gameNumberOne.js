var gameNumberOne = (function () {
    function gameNumberOne(width, height) {
        this.game = new Phaser.Game(width, height, Phaser.AUTO, 'gameNumberOne', { preload: this.preload, create: this.create });
    }
    gameNumberOne.prototype.preload = function () {
        this.game.load.image('logo', 'assets/sprites/phaser2.png');
    };
    gameNumberOne.prototype.create = function () {
        this.logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        this.logo.anchor.setTo(0.5, 0.5);
    };
    return gameNumberOne;
}());
window.onload = function () {
    var game = new gameNumberOne(800, 600);
};

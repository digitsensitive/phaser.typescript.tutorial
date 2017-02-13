var playAroundWithSprites = (function () {
    function playAroundWithSprites(width, height) {
        this.game = new Phaser.Game(width, height, Phaser.AUTO, 'playAroundWithSprites', { preload: this.preload, create: this.create });
    }
    playAroundWithSprites.prototype.preload = function () {
        this.game.load.image('logo', 'assets/sprites/phaser2.png');
    };
    playAroundWithSprites.prototype.create = function () {
        this.logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        this.logo.anchor.setTo(0.5, 0.5);
    };
    return playAroundWithSprites;
}());
window.onload = function () {
    var game = new playAroundWithSprites(800, 600);
};

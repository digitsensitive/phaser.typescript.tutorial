var basicSetup = (function () {
    function basicSetup(width, height) {
        this.game = new Phaser.Game(width, height, Phaser.AUTO, 'basicSetup', { preload: this.preload, create: this.create });
    }
    basicSetup.prototype.preload = function () {
        this.game.load.image('phaserImage', 'assets/sprites/phaser.png');
    };
    basicSetup.prototype.create = function () {
        this.phaserImage = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'phaserImage');
        this.phaserImage.anchor.setTo(0.5, 0.5);
    };
    return basicSetup;
}());
window.onload = function () {
    var game = new basicSetup(800, 600);
};

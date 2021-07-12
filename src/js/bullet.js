import * as data from "../json/*.json"

class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, bulletName, target) {
        super(scene, x, y, bulletName, target);
        var bulletData = data[bulletName];
        this.name = bulletData.name;
        this.texture = bulletName;
        this.speed = bulletData.speed;
        this.damage = bulletData.damage;
        this.target = target

        scene.add.existing(this);
        var newBullet = scene.physics.add.existing(this);
        newBullet.body.debugShowBody = false;
        newBullet.body.debugShowVelocity = false;
    }
}
module.exports = Bullet
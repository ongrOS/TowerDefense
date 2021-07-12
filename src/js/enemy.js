import * as data from "../json/*.json"

class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, enemyName) {
        super(scene, x, y, enemyName);
        var enemyData = data[enemyName];
        console.log(enemyData)
        this.name = enemyData.name;
        this.texture = enemyName;
        this.damage = enemyData.damage;
        this.speed = enemyData.speed;
        this.scale = enemyData.scale;
        this.health = enemyData.health;
        scene.add.existing(this);
        var newEnemy = scene.physics.add.existing(this);
        newEnemy.body.debugShowBody = false;
    }
}

module.exports = Enemy

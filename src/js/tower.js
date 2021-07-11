import * as data from "../json/*.json"

class Tower extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, towerName) {
        super(scene, x, y, towerName);
        var towerData = data[towerName];
        this.name = towerData.name;
        this.texture = towerName;
        this.type = towerData.type;
        this.projectile = towerData.projectile;
        this.scale = towerData.scale;
        this.range = towerData.range;
        this.currentCD = 0;
        this.enemiesInRange = new Set();
        this.cooldown = towerData.cooldown * 60;
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }
}

module.exports = Tower

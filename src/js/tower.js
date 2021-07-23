import images from '../assets/*.png';
const Bullet = require("./bullet.js")


class Tower extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, towerData) {
        super(scene, x, y, towerData);

        this.setTexture(towerData.name)
        this.name = towerData.name;
        this.type = towerData.type;
        this.projectile = towerData.projectile;
        this.projectileSpeed = towerData.projectile_speed;
        this.projectileDuration = towerData.projectile_duration;
        this.accuracy = towerData.accuracy;
        this.damage = towerData.damage;
        this.scale = towerData.scale;
        this.range = towerData.range;
        this.currentCD = 0;
        this.cooldown = towerData.cooldown * 60;
        this.scene = scene;
        scene.add.existing(this);
        var newTower = scene.physics.add.existing(this);
        newTower.body.debugShowBody = false;
    }

    update(time, delta) {
        this.attackEnemies(this.scene.registry.managers['bullets'], this.scene.registry.managers['enemies'])
    }
    attackEnemies(bullets, enemies) {
        for (const enemy of enemies.children.entries) {
            if (Phaser.Math.Distance.Between(enemy.x, enemy.y, this.x, this.y) <= this.range) {
                if (this.currentCD == 0) {
                    if (this.projectile !== null) {
                        bullets.add(new Bullet(this.scene, this, enemy))
                    }
                    else if (this.type == "stationary-aoe") {
                        // setting tint is only temp solution until aoe animation is implemented
                        this.setTint(0xfc0303);
                        this.areaAttack()
                    }
                    this.currentCD += 1;
                }
            }
        }
        if (this.currentCD != 0) {
            this.currentCD += 1;
        }
        if (this.currentCD == this.cooldown) {
            this.currentCD = 0;
            // remove tint to show aoe tower is off cooldown
            this.clearTint();
        }
    }

    areaAttack() {
        for (const enemy of this.scene.registry.managers['enemies'].children.entries) {
            if (Phaser.Math.Distance.Between(enemy.x, enemy.y, this.x, this.y) <= this.range) {
                enemy.takeDamage(this.damage)
            }
        }
    }

}
module.exports = Tower

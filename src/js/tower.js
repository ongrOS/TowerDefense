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
        this.damage = towerData.damage;
        this.scale = towerData.scale;
        this.range = towerData.range;
        this.currentCD = 0;
        this.enemiesInRange = new Set();
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
            if (
                Phaser.Math.Distance.Between(enemy.x, enemy.y, this.x, this.y) <= this.range
            ) {
                if (this.currentCD == 0) {
                    bullets.add(new Bullet(this.scene, this, enemy))
                    this.currentCD += 1;
                }
                this.setTint(0xfc0303);
                this.enemiesInRange.add(enemy);
            } else {
                this.enemiesInRange.delete(enemy);
            }
        }
        if (this.enemiesInRange.size == 0) {
            this.clearTint();
        }
        if (this.currentCD != 0) {
            this.currentCD += 1;
        }
        if (this.currentCD == this.cooldown) {
            this.currentCD = 0;
        }
    }

    // this currently isnt being used
    bulletLanded(enemy, bullet) {
        enemy.takeDamage(bullet.damage)
        console.log("bulletlanded")
        console.log(enemy.health)
        bullet.destroy(true);
        if (enemy.health <= 0) {
            this.scene.registry.managers.towers.children.iterate(function (tower) {
                tower.enemiesInRange.delete(enemy);
            });
            enemy.destroy(true);

            this.scene.registry.managers.bullets.children.iterate(function (bullet) {
                if (bullet.dest == enemy) {
                    bullet.destroy(true);
                }
            });
        }
    }
}

module.exports = Tower

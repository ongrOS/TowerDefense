import images from '../assets/*.png';
const Bullet = require("./bullet.js")

class Tower extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, towerData) {
        super(scene, x, y, towerData);

        // dynamically load in tower sprite
        scene.load.image('towerSprite', images[towerData.name])
        scene.load.start()
        scene.load.once(Phaser.Loader.Events.COMPLETE, () => {
            // texture loaded so use instead of the placeholder
            this.setTexture('towerSprite')
        })
        this.name = towerData.name;
        this.type = towerData.type;
        this.projectile = towerData.projectile;
        this.scale = towerData.scale;
        this.range = towerData.range;
        this.currentCD = 0;
        this.enemiesInRange = new Set();
        this.cooldown = towerData.cooldown * 60;
        this.scene = scene
        scene.add.existing(this);
        var newTower = scene.physics.add.existing(this);
        newTower.body.debugShowBody = false;
    }

    update(time, delta) {
        this.attackEnemies(null, this.scene.registry.managers['enemies'])
    }

    attackEnemies(bullets, enemies) {
        for (const enemy of enemies.children.entries) {
            if (
                Phaser.Math.Distance.Between(enemy.x, enemy.y, this.x, this.y) <= this.range
            ) {
                if (this.currentCD == 0) {
                    console.log("attack");
                    // let newBullet = bullets.add(new Bullet(this.scene, this.x, this.y, this.projectile, enemy))
                    // this.scene.physics.add.overlap(enemy, newBullet, this.bulletLanded, null, this);
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

    bulletLanded(enemy, bullet) {
        enemy.health -= bullet.damage;
        bullet.destroy(true);
        if (enemy.health <= 0) {
            this.scene.registry.groups.towers.children.iterate(function (tower) {
                tower.enemiesInRange.delete(enemy);
            });
            enemy.destroy(true);

            this.scene.registry.groups.bullets.children.iterate(function (bullet) {
                if (bullet.dest == enemy) {
                    bullet.destroy(true);
                }
            });
        }
    }
}

module.exports = Tower

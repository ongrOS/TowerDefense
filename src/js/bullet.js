import images from '../assets/*.png';

class Bullet extends Phaser.GameObjects.Sprite {   // What is the difference between using Physics.Arcade and GameObjects?

    constructor(scene, parent, target) {
        super(scene, parent, target);
        // dynamically load in tower sprite
        // scene.load.image('bulletSprite', images[parent.projectile])
        this.setTexture(parent.projectile)
        this.scene = scene;
        this.parent = parent;
        this.x = parent.x;
        this.y = parent.y;
        this.behavior = parent.type;
        this.speed = parent.projectileSpeed;
        this.damage = parent.damage;
        this.target = target;
        this.duration = parent.projectileDuration;
        this.depth = 1;
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    // TODO: Getters and setters

    // Alternative way of handling lifespan to handling it in the scene update()
    // preUpdate() {
    //     this.duration -= 10;
    //     if (this.duration < 1) {
    //         this.destroy();
    //     }
    // }
    update(time, delta) {
        if (this.behavior == "homing") {
            this.scene.physics.moveToObject(
                this,
                this.target,
                this.speed
            );
        }
        this.checkCollision();
        this.duration -= 1;
        if (this.duration < 1) {
            this.destroy();
        }
    }

    checkCollision() {
        if (Phaser.Math.Distance.Between(this.target.x, this.target.y, this.x, this.y) <= 20) {
            if (this.target.active) {
                this.target.takeDamage(this.damage)
                if (this.target.isDead) {
                    this.parent.enemiesInRange.delete(this.target)
                }
                this.scene.registry.managers["bullets"].remove(this, true, true)
            }
        }
    }
}

module.exports = Bullet;
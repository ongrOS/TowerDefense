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

        // Get angle to target ("direction") using trigonometry
        this.updateDirection()
    }

    updateDirection () {
        this.direction = this.getAngleToTarget()
        this.xSpeed = Math.sign(this.target.y - this.y) * this.speed
        this.ySpeed = Math.sign(this.target.y - this.y) * this.speed
    }

    getAngleToTarget() {
        let oppositeSide = this.target.x - this.x;
        let adjacentSide = this.target.y - this.y;
        let angle = Math.atan(oppositeSide / adjacentSide)
        return angle;
    }

    // TODO: Getters and setters

    // Alternative way of handling lifespan to handling it in the scene update()
    // preUpdate() {
    //     this.duration -= 10
    //     if (this.duration < 1) {
    //         this.destroy();
    //     }
    // }
    update(time, delta) {
        if (this.behavior == "homing" && this.target.active) {
            this.updateDirection()
        }

        let targetPosition = {
            x: this.x + (this.xSpeed * Math.sin(this.direction)),
            y: this.y + (this.ySpeed * Math.cos(this.direction))
        };
        
        this.scene.physics.moveToObject(this, targetPosition, this.speed)
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
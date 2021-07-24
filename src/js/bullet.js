class Bullet extends Phaser.GameObjects.Sprite {   
    constructor(scene, parent, target) {
        super(scene, parent, target);

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
        this.stopTargeting = false
        this.depth = 1;

        // Adds bullet to scene
        scene.add.existing(this);
        scene.registry.bullets.add(this);

        // Get angle to target ("direction") using trigonometry
        this.updateDirection();
    }

    // TODO: Getters and Setters

    updateDirection() {
        // Introduces 'randomness' into bullet direction. Set tower accuracy to 1.0 for no randomness
        this.direction = this.getAngleToTarget() + Phaser.Math.FloatBetween(this.parent.accuracy - 1, 1 - this.parent.accuracy);
        this.xSpeed = Math.sign(this.target.y - this.y) * this.speed
        this.ySpeed = Math.sign(this.target.y - this.y) * this.speed
    }

    getAngleToTarget() {
        let oppositeSide = this.target.x - this.x;
        let adjacentSide = this.target.y - this.y;
        let angle = Math.atan(oppositeSide / adjacentSide);
        return angle;
    }

    update() {
        if (this.behavior == "homing" && this.target.active) {
            this.updateDirection()
        }


        if (!this.stopTargeting || this.behavior != "non-homing") {
            let targetPosition = {
                x: this.x + (this.xSpeed * Math.sin(this.direction)),
                y: this.y + (this.ySpeed * Math.cos(this.direction))
            };
            this.scene.physics.moveToObject(this, targetPosition, this.speed)
            this.stopTargeting = true;
        }
        this.checkCollision(this);
        this.duration -= 1;
        if (this.duration < 1) {
            this.destroy();
        }
    }

    checkCollision() {
        switch (this.behavior) {
            case "homing":
                if (Phaser.Math.Distance.Between(this.target.x, this.target.y, this.x, this.y) <= 20) {
                    if (this.target.active) {
                        this.target.takeDamage(this.damage);
                        this.scene.registry.bullets.remove(this, true, true);
                    }
                }
                break;
            case "non-homing":
                this.scene.registry.enemies.children.iterate(function (enemy) {
                    if (enemy !== undefined) {
                        if (Phaser.Math.Distance.Between(enemy.x, enemy.y, this.x, this.y) <= 30) {
                            if (enemy.active) {
                                enemy.takeDamage(this.damage);
                            }
                            this.scene.registry.bullets.remove(this, true, true);
                        }
                    }
                });
                break;
        }
    }
}
module.exports = Bullet;
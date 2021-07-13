class Enemy extends Phaser.Physics.Arcade.Sprite {
    // Initialization
    constructor(scene, x, y, enemyData) {        
        // Sprite
        super(scene, x, y, enemyName);
        this.scale = enemyData.scale;

        // Private Attributes
        this._name = enemyData.name;
        this._health = enemyData.health;
        this._damage = enemyData.damage;
        this._speed = enemyData.speed;
        
        // Instantiation into the game world    
        scene.add.existing(this);
        var newEnemy = scene.physics.add.existing(this);
        newEnemy.body.debugShowBody = false;
    }

    // Getters
    get name() {
        return this._name;
    }

    get health() {
        return this._health;
    }

    get damage() {
        return this._damage;
    }

    get speed() {
        return this._speed;
    }

    // Public Methods
    checkIsDead() {
        return this._health <= 0 ? true : false;
    }

    takeDamage(damageValue) {
        this._health -= damageValue;
        if (this.checkIsDead()) this.die();
    }

    die() {
        // TODO: death animation ?
        this.destroy(true);
    }

}

module.exports = Enemy

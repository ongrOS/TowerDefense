import * as data from "../data/*.json"
const Enemy = require("./enemy.js")

class EnemyManager {
    constructor(scene) {
        this._scene = scene
        this._children = scene.physics.add.group({ classType: Enemy, runChildUpdate: true });
        scene.registry.managers['enemies'] = this._children;
    }

    addEnemy(x, y, enemyName, path) {
        var enemyData = data[enemyName];
        let newEnemy = new Enemy(this._scene, x, y, enemyData)
        this._children.add(newEnemy);
        return newEnemy;
    }

    addToPath(scene, path, enemyName) {
        let enemy = this.addEnemy(path.startX, path.startY, enemyName)
        var f = { t: 0, vec: new Phaser.Math.Vector2() };
        scene.tweens.add({
            targets: f,
            t: 1,
            ease: "Linear",
            duration: 5000 / enemy.speed,
            yoyo: false,
            repeat: 0
        });
        enemy.path = path
        enemy.follower = f;
    }

    get children() {
        return this._children
    }
}


module.exports = EnemyManager
import * as data from "../json/*.json"
const Enemy = require("./enemy.js")

class EnemyManager {
    constructor(scene) {
        this._scene = scene
        this._children = scene.physics.add.group({ classType: Enemy, runChildUpdate: true });
        scene.registry.managers['enemies'] = this._children;
    }

    addEnemy(x, y, enemyName) {
        var enemyData = data[enemyName];
        this._children.add(new Enemy(this._scene, x, y, enemyData));
    }

    get children() {
        return this._children
    }
}


module.exports = EnemyManager
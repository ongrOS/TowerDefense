import * as data from "../json/*.json"
const Tower = require("./tower.js")

class TowerManager {
    constructor(scene) {
        this._scene = scene
        this._children = scene.physics.add.group({ classType: Tower, runChildUpdate: true });
    }

    addTower(x, y, towerName) {
        var towerData = data[towerName];
        this._children.add(new Tower(this._scene, x, y, towerData));
    }

    get children() {
        return this._children
    }
}


module.exports = TowerManager
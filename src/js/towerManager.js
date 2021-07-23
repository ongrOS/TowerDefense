import * as data from "../data/*.json"
const Tower = require("./tower.js")

class TowerManager {
    constructor(scene) {
        this._scene = scene
        this._children = scene.physics.add.group({ classType: Tower, runChildUpdate: true });
    }

    addTower(x, y, towerName) {
        var towerData = data[towerName];
        let newTower = new Tower(this._scene, x, y, towerData)
        let rangeDisplay;
        this._children.add(newTower);
        this._scene.registry.managers["towers"] = this._children
        newTower.setInteractive();
        newTower.on("pointerover", function (pointer) {
            rangeDisplay = newTower.scene.add.circle(newTower.x, newTower.y, newTower.range)
            rangeDisplay.setStrokeStyle(2, 0xfc0303)
        });
        newTower.on("pointerout", function (pointer) {
            rangeDisplay.destroy();
        });
        newTower.on("pointerdown", function (pointer) {
            newTower.scene.towerStats.damage.setText("Damage: " + newTower.damage)
            newTower.scene.towerStats.range.setText("Range: " + newTower.range)
            newTower.scene.towerStats.attackSpeed.setText("Cooldown: " + newTower.cooldown / 60.0)
        });
    }

    get children() {
        return this._children
    }
}


module.exports = TowerManager
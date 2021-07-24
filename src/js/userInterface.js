const CELL_SIZE = 54;
const CELL_OFFSET = CELL_SIZE / 2;

class UserInterface {
    constructor(scene) {
        this._scene = scene;
        this.placeholder = null;
        this.create();
    }

    create() {
        UI = this
        // Sidebar UI
        // In current config, this starts at x = 594, and extends to the right
        UI.sidebar = this._scene.add.rectangle(729, 300, 270, 600, 0x474c59);
        UI._scene.towerStats = this._scene.add.rectangle(729, 550, 270, 300, 0x272c59)
        UI._scene.towerStats.damage = this._scene.add.text(620, 420, "Damage")
        UI._scene.towerStats.range = this._scene.add.text(620, 460, "Range")
        UI._scene.towerStats.attackSpeed = this._scene.add.text(620, 500, "Attack Speed")


        // Tower Placement Preview
        this.addToUI(650, 150, "basic_tower")
        this.addToUI(750, 150, "rapid_tower")
        this.addToUI(650, 250, "aoe_tower")


        // Player Health
        this._scene.add.text(674, 50, "Health: ");
        this._healthDisplay = this._scene.add.text(754, 50, this._scene.registry.get('base_health'));

        // Updates display of health when health changes
        this._scene.registry.events.on('changedata', this.updateHealth, this);
    }

    // Triggered when health value changes
    updateHealth(parent, key, data){
        this._healthDisplay.setText(data);
    }



    update() {
        //console.log("MouseX: " + String(this._scene.game.input.mousePointer.worldX) + " MouseY: " + String(this._scene.game.input.mousePointer.worldY))
        // Snap tower preview to grid
        if (this.placeholder !== null) {
            this.placeholder.x = Math.floor(this._scene.game.input.mousePointer.worldX / CELL_SIZE) * CELL_SIZE + CELL_OFFSET
            this.placeholder.y = Math.floor(this._scene.game.input.mousePointer.worldY / CELL_SIZE) * CELL_SIZE + CELL_OFFSET
        }

        // Update player health info
        //this._healthDisplay.setText(this._scene.registry.health);
    }

    addToUI(x, y, towerName) {
        var tower_select = this._scene.add.sprite(x, y, towerName).setInteractive();
        tower_select.on("pointerdown", function (pointer) {

            UI.placeholder = UI._scene.add.sprite(x, y, towerName).setInteractive();
            UI.placeholder.scale = 1;
            UI.placeholder.alpha = 0.5;
            UI.placeholder.on("pointerdown", function (pointer) {
                if (UI.placeholder.x <= (UI.sidebar.x - UI.sidebar.geom.centerX)) {  // Stops towers from being placed out of bounds on sidebar
                    var newTowerX = Math.floor(UI.placeholder.x / CELL_SIZE) * CELL_SIZE + CELL_OFFSET
                    var newTowerY = Math.floor(UI.placeholder.y / CELL_SIZE) * CELL_SIZE + CELL_OFFSET
                    UI._scene.addTower(newTowerX, newTowerY, towerName);
                    if (!UI._scene.shiftKey.isDown) UI.placeholder.destroy(true);
                }
                else {
                    UI.placeholder.destroy(true);
                }
            });
        });
    }

}

module.exports = UserInterface

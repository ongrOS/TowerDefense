CELL_SIZE = 54
CELL_OFFSET = CELL_SIZE / 2

class UserInterface {
    constructor(level) {
        this.level = level
        this.placeholder = null
    }

    create() {
        UI = this
        // Sidebar UI
        // In current config, this starts at x = 594, and extends to the right
        UI.sidebar = this.level.add.rectangle(729, 300, 270, 600, 0x474c59);
        UI.level.towerStats = this.level.add.rectangle(729, 550, 270, 300, 0x272c59)
        UI.level.towerStats.damage = this.level.add.text(620, 420, "Damage")
        UI.level.towerStats.range = this.level.add.text(620, 460, "Range")
        UI.level.towerStats.attackSpeed = this.level.add.text(620, 500, "Attack Speed")


        // Tower Placement Preview
        this.addToUI(650, 150, "basic_tower")
        this.addToUI(750, 150, "rapid_tower")
        this.addToUI(650, 250, "aoe_tower")


        // Player Health
        this.level.add.text(674, 50, "Health: ");
        this.healthDisplay = this.level.add.text(754, 50, this.level.player.health)
    }

    update() {
        //console.log("MouseX: " + String(this.level.game.input.mousePointer.worldX) + " MouseY: " + String(this.level.game.input.mousePointer.worldY))
        // Snap tower preview to grid
        if (this.placeholder !== null) {
            this.placeholder.x = Math.floor(this.level.game.input.mousePointer.worldX / CELL_SIZE) * CELL_SIZE + CELL_OFFSET
            this.placeholder.y = Math.floor(this.level.game.input.mousePointer.worldY / CELL_SIZE) * CELL_SIZE + CELL_OFFSET
        }

        // Update player health info
        this.healthDisplay.setText(this.level.player.health);
    }

    addToUI(x, y, towerName) {
        var tower_select = this.level.add.sprite(x, y, towerName).setInteractive();
        tower_select.on("pointerdown", function (pointer) {

            UI.placeholder = UI.level.add.sprite(x, y, towerName).setInteractive();
            UI.placeholder.scale = 1;
            UI.placeholder.alpha = 0.5;
            UI.placeholder.on("pointerdown", function (pointer) {
                if (UI.placeholder.x <= (UI.sidebar.x - UI.sidebar.geom.centerX)) {  // Stops towers from being placed out of bounds on sidebar
                    var newTowerX = Math.floor(UI.placeholder.x / CELL_SIZE) * CELL_SIZE + CELL_OFFSET
                    var newTowerY = Math.floor(UI.placeholder.y / CELL_SIZE) * CELL_SIZE + CELL_OFFSET
                    UI.level.addTower(newTowerX, newTowerY, towerName);
                    if (!UI.level.shiftKey.isDown) UI.placeholder.destroy(true);
                }
                else {
                    UI.placeholder.destroy(true);
                }
            });
        });
    }

}

module.exports = UserInterface

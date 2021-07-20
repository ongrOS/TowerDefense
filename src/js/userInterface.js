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
        let sidebar = this.level.add.rectangle(1188, 0, 1188, 1080, 0x474c59);

        // Tower Placement Preview
        var tower_select = this.level.add.sprite(726, 216, "basic_tower").setInteractive();
        tower_select.on("pointerdown", function (pointer) {
    
            UI.placeholder = UI.level.add.sprite(1000, 300, "basic_tower").setInteractive();
            UI.placeholder.scale = 1;
            UI.placeholder.alpha = 0.5;
            UI.placeholder.on("pointerdown", function (pointer) {
                var newTowerX = Math.floor(UI.placeholder.x / CELL_SIZE) * CELL_SIZE + CELL_OFFSET
                var newTowerY = Math.floor(UI.placeholder.y / CELL_SIZE) * CELL_SIZE + CELL_OFFSET
                UI.level.addTower(newTowerX, newTowerY, "basic_tower");
                if (!UI.level.shiftKey.isDown) UI.placeholder.destroy(true);
            });
        });

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
}

module.exports = UserInterface

const CELL_SIZE = 54;
const CELL_OFFSET = CELL_SIZE / 2;

// Theme colors (reused colors)
const PRIMARY_COLOR = '0x949494';
const STROKE_COLOR = 'black';
const FOOTER_COLOR = 'white';
const CREDITS_COLOR = 'yellow';

class UserInterface {
    constructor(scene) {
        this._scene = scene;
        this.placeholder = null;

        // UI region
        this.hud = this._scene.add.rectangle(959, 639, 958, 98, PRIMARY_COLOR).setOrigin(1, 1);
        this.hud.setStrokeStyle(2, 0xcbc9c9);

        // Credits Value
        this.credits_value = this._scene.add.text(20, 550, this._scene.registry.get('credits'), {
            fontFamily: 'Verdana',
            fontSize: '36px',
            fontStyle: 'bold',
            color: CREDITS_COLOR,
            stroke: STROKE_COLOR,
            strokeThickness: '4'
        });

        // Credits Footer
        this.health_footer = this._scene.add.text(25, 600, "Credits", { 
            fontFamily: 'Verdana',
            fontSize: '16px',
            fontStyle: 'bold',
            color: FOOTER_COLOR,
            stroke: STROKE_COLOR,
            strokeThickness: '2'
        });

        // ---------------------
        // Tower icons & footers
        // ---------------------
        this.addTothis(150, 580, "basic_tower");
        this.tower1_footer = this.health_footer = this._scene.add.text(130, 610, "100", { 
            fontFamily: 'Verdana',
            fontSize: '16px',
            fontStyle: 'normal',
            color: CREDITS_COLOR,
            stroke: STROKE_COLOR,
            strokeThickness: '2'
        });

        this.addTothis(220, 580, "rapid_tower");
        this.tower2_footer = this.health_footer = this._scene.add.text(205, 610, "200", { 
            fontFamily: 'Verdana',
            fontSize: '16px',
            fontStyle: 'normal',
            color: CREDITS_COLOR,
            stroke: STROKE_COLOR,
            strokeThickness: '2'
        });
        
        this.addTothis(290, 580, "aoe_tower");
        this.tower3_footer = this.health_footer = this._scene.add.text(275, 610, "250", { 
            fontFamily: 'Verdana',
            fontSize: '16px',
            fontStyle: 'normal',
            color: CREDITS_COLOR,
            stroke: STROKE_COLOR,
            strokeThickness: '2'
        });
        // -----------------------

        //this._scene.towerStats = this._scene.add.rectangle(729, 550, 1, 1, 0x272c59);
        this.damage = this._scene.add.text(620, 420, "Damage");
        this.range = this._scene.add.text(620, 460, "Range");
        this.attackSpeed = this._scene.add.text(620, 500, "Attack Speed");
        this.activeButton = false;       

        // Health Value
        this.health_value = this._scene.add.text(865, 550, this._scene.registry.get('base_health'), {
            fontFamily: 'Verdana',
            fontSize: '36px',
            fontStyle: 'bold',
            color: 'red',
            stroke: STROKE_COLOR,
            strokeThickness: '4'
        });

        // Health Footer
        this.health_footer = this._scene.add.text(860, 600, "Health", { 
            fontFamily: 'Verdana',
            fontSize: '16px',
            fontStyle: 'bold',
            color: FOOTER_COLOR,
            stroke: STROKE_COLOR,
            strokeThickness: '2'
        });

        // Updates display of health when health changes
        this._scene.registry.events.on('changedata', this.updateValues, this);

    }

    // Triggered when health or credit values change
    // Not sure how efficient this really is
    updateValues(parent, key, data) {
        switch(key){
            case 'base_health':
                this.health_value.setText(data);
                break;
            case 'credits':
                this.credits_value.setText(data);
                break;
        }
        
    }

    update() {
        //console.log("MouseX: " + String(this._scene.game.input.mousePointer.worldX) + " MouseY: " + String(this._scene.game.input.mousePointer.worldY))
        // Snap tower preview to grid
        if (this.placeholder !== null) {
            this.placeholder.x = Math.floor(this._scene.game.input.mousePointer.worldX / CELL_SIZE) * CELL_SIZE + CELL_OFFSET
            this.placeholder.y = Math.floor(this._scene.game.input.mousePointer.worldY / CELL_SIZE) * CELL_SIZE + CELL_OFFSET
        }
    }

    addTothis(x, y, towerName) {
        var tower_select = this._scene.add.sprite(x, y, towerName).setInteractive();
        tower_select.on("pointerdown", function (pointer) {

            this.placeholder = this._scene.add.sprite(x, y, towerName).setInteractive();
            this.placeholder.scale = 1;
            this.placeholder.alpha = 0.5;
            this.placeholder.on("pointerdown", function (pointer) {
                if (this.placeholder.x <= (this.sidebar.x - this.sidebar.geom.centerX)) {  // Stops towers from being placed out of bounds on sidebar
                    var newTowerX = Math.floor(this.placeholder.x / CELL_SIZE) * CELL_SIZE + CELL_OFFSET
                    var newTowerY = Math.floor(this.placeholder.y / CELL_SIZE) * CELL_SIZE + CELL_OFFSET
                    var newTower = this._scene.addTower(newTowerX, newTowerY, towerName);
                    // Shows tower stats when selecting tower.
                    newTower.on("pointerdown", function (pointer) {
                        this._scene.towerStats.damage.setText("Damage: " + newTower.damage)
                        this._scene.towerStats.range.setText("Range: " + newTower.range)
                        this._scene.towerStats.attackSpeed.setText("Cooldown: " + newTower.cooldown / 60.0)
                        // Adds upgradeButton to this if tower is not at max rank
                        if (newTower.rank < 3 && !this.activeButton) {
                            this.addUpgradeButton(newTower)
                            this.activeButton = newTower
                        }
                        // If another upgradeButton already exists in this, remove it and add new one
                        else if (this.activeButton !== newTower && newTower.rank < 3) {
                            this.upgradeButton.destroy()
                            this.addUpgradeButton(newTower)
                            this.activeButton = newTower
                        }
                    });
                    if (!this._scene.shiftKey.isDown) this.placeholder.destroy(true);
                }
                else {
                    this.placeholder.destroy(true);
                }
            });
        });
    }

    addUpgradeButton(tower) {
        this.upgradeButton = this._scene.add.rectangle(700, 550, 100, 50, 0x46cf6b).setInteractive()
        this.upgradeButton.on("pointerdown", function (pointer) {
            // remove button if tower is fully upgraded(rank 3)
            if (tower.upgrade() >= 2) {
                this.upgradeButton.destroy()
                this.activeButton = false
            }
            // Update tower stats display
            this._scene.towerStats.damage.setText("Damage: " + tower.damage)
            this._scene.towerStats.range.setText("Range: " + tower.range)
            this._scene.towerStats.attackSpeed.setText("Cooldown: " + tower.cooldown / 60.0)
        });
    }

}

module.exports = UserInterface

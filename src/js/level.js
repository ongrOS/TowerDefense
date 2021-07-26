import images from '../assets/*.png';
import backgroundImages from '../assets/backgrounds/*.png';

const UserInterface = require("./userInterface.js");
const TowerManager = require("./towerManager.js");
const EnemyManager = require("./enemyManager.js");
const Bullet = require("./bullet.js");
const Tower = require("./tower.js");
const Enemy = require("./enemy.js");

class LevelScene extends Phaser.Scene {
    // Initialization
    constructor(levelData) {
        super({ key: levelData.name });

        // Private scene properties
        this._levelData = levelData;
    }

    init() {
        // Scene's registry data
        this.registry.set('credits', this._levelData.startingCredits);
        this.registry.set('base_health', 20);
    }

    preload() {
        // Scene object images
        for (const spriteName in images) {
            this.load.image(spriteName, images[spriteName]);
        }

        // Background Image
        var bgImageName = this._levelData.background;
        this.load.image('levelBg', backgroundImages[bgImageName])

    }

    create() {
        // World Properties
        this.physics.world.setBounds(0, 0, this._levelData.width, this._levelData.height);

        // Background
        this.add.image(270, 270, 'levelBg');

        // Physics groups
        // NOTE: These physics groups were added indirectly by manager classes, but since
        // the scene owns the physics group, they should be created here.
        this.registry.bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
        this.registry.towers = this.physics.add.group({ classType: Tower, runChildUpdate: true });
        this.registry.enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });

        // Controls
        this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        // Initialize Managers
        this._userInterface = new UserInterface(this);
        this._enemyManager = new EnemyManager(this, this._levelData.waveData);
        this._towerManager = new TowerManager(this);

        // Use Level Data to populate level
        // - spawn base
        // - create path from points, pass path to wave manager?
        let graphics = this.add.graphics();
        graphics.lineStyle(2, 0xffffff, 1);

        let path = this.add.path();
        for (var i = 0; i < this._levelData.path.length; i++) {
            var lineData = this._levelData.path[i]
            path.add(new Phaser.Curves.Line(lineData));
            if (i == 0) {
                path.startX = lineData[0];
                path.startY = lineData[1];
            }
        }
        // DEBUG: path.draw(graphics);

        this._enemyManager.addToPath(this, path, "test_enemy");

        // Spawn an enemy manually
        this.input.keyboard.on('keydown-A', () => {
            this._enemyManager.addToPath(this, path, "test_enemy")
        }, this);
    }

    update() {
        this._userInterface.update();
    }

    // Actions
    nextWave() {
        WaveManager.nextWave()
    }

    addTower(x, y, towerName) {
        return this._towerManager.addTower(x, y, towerName)
    }
}

export default LevelScene;

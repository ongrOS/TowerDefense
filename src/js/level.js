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

        // Wave Data
        this._waveData = this._levelData.waveData
        this._currentWaveIndex = -1
        this._currentWave = this._waveData[this._currentWaveIndex]
        this._waveCount = this._waveData.length
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
        this.path = path
        // DEBUG: path.draw(graphics);
        // -------------------------
        // DEBUG Tools
        // -------------------------
        // Spawn an enemy manually
        this.input.keyboard.on('keydown-A', () => {
            //this._enemyManager.addToPath(this, path, "test_enemy")
            this.nextWave()
        }, this);

        // Click on a spot to print x/y coordinates to console.
        this.input.on('pointerdown', function (pointer) {
            console.log(pointer.x, pointer.y);
        });

        // Increase credits
        this.input.keyboard.on('keydown-C', () => {
            this.registry.set('credits', this.registry.get('credits') + 1000);
        }, this);
    }

    update() {
        this._userInterface.update();
    }

    // Actions
    nextWave() {
        this._currentWaveIndex += 1;
        if (this._currentWaveIndex < this._waveCount) {
            this.startWave(this._currentWaveIndex)
            console.log("Starting Wave: " + String(this._currentWaveIndex))
        } else {
            // DEBUG, reset waves
            this._currentWaveIndex = -1
            this.nextWave()
        }
    }

    addTower(x, y, towerName) {
        return this._towerManager.addTower(x, y, towerName)
    }

    // Wave Functions
    startWave(waveNumber) {
        var waveRecord = this._waveData[waveNumber]
        for (const wave of waveRecord) {
            var enemyCount = wave[0] - 1
            var enemyType = wave[1]
            var spawnDelay = wave[2]
            var waveTimer = this.time.addEvent({
                delay: spawnDelay,
                callback: this._enemyManager.addToPath,
                args: [this, this.path, enemyType],
                callbackScope: this._enemyManager,
                repeat: enemyCount
            })
        }
    }


}

export default LevelScene;

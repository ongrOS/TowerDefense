import images from '../assets/*.png';
import backgroundImages from '../assets/backgrounds/*.png';
// Import Dependencies
const UserInterface = require("./userInterface.js");
const TowerManager = require("./towerManager.js")
const EnemyManager = require("./enemyManager.js")
const Bullet = require("./bullet.js")

class LevelScene extends Phaser.Scene {
    // Initialization
    constructor(levelData) {
        // Scene
        super({ key: levelData.name });

        // Private Attributes
        this._levelData = levelData;

        // Player Resources
        this._playerCredits = levelData.startingCredits;
        this._playerHealth = 100;
    }

    preload() {
        // Enemy and Tower Sprites
        for (const spriteName in images) {
            this.load.image(spriteName, images[spriteName])
        }

        // Background Image
        var bgImageName = this._levelData.background
        this.load.image('levelBg', backgroundImages[bgImageName])
    
    }

    create() {
        this.add.image(270, 270, 'levelBg')
        // Player
        this.player = {
            health: 20
        }

        // World Properties
        this.physics.world.setBounds(0, 0, this._levelData.width, this._levelData.height);
        this.registry.groups = {};
        this.registry.managers = {};

        // Initialize Managers
        this._userInterface = new UserInterface(this);
        this._userInterface.create()

        this._enemyManager = new EnemyManager(this, this._levelData.waveData);
        this._towerManager = new TowerManager(this);

        // Use Level Data to populate level
        // - spawn base
        // - create path from points, pass path to wave manager?
        let bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
        this.registry.managers["bullets"] = bullets;

        let graphics = this.add.graphics();
        graphics.lineStyle(2, 0xffffff, 1);

        let path = this.add.path();
        console.log(this._levelData.path)
        for (var i = 0; i < this._levelData.path.length; i++) {
            var lineData = this._levelData.path[i]
            path.add(new Phaser.Curves.Line(lineData));
        }
        //path.draw(graphics);


        this._enemyManager.addToPath(this, path, "test_enemy");

        this.input.keyboard.on('keydown-A', () => {

        this._enemyManager.addToPath(this, path, "test_enemy")

        }, this);
    }

    update() {
        this._userInterface.update()
    }

    // Actions
    nextWave() {
        WaveManager.nextWave()
    }

    addTower(x, y, towerName) {
        this._towerManager.addTower(x, y, towerName)
    }
}

export default LevelScene;

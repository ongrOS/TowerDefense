// Import Dependencies
const UserInterface;
const WaveManager;
const TowerManager;

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

    create() {
        // World Properties
        this.physics.world.setBounds(0, 0, levelData.width, levelData.height);
        this.registry.groups = {};

        // Initialize Managers
        this._userInterface = new UserInterface(this);
        this._waveManager = new WaveManager(this, levelData.waveData);
        this._towerManager = new this.TowerManager(this);

        // Use Level Data to populate level
        // - spawn base
        // - create path from points, pass path to wave manager?
    }

    update() {

    }

    // Actions
    nextWave() {
        WaveManager.nextWave()
    }

    buyTower(towerName, position) {
        TowerManager.buyTower(towerName, position)
    }
}

export default LevelScene;

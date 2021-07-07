class LevelOneScene extends Phaser.Scene {
  constructor(){
    super({key:"Level1"});  // Inherits parent attributes
  }

  init(){
    
  }

  preload(){
    
  }

  create(){
    this.add.text(50, 50, "Level 1");
  }

  update(){

  }
}

export default LevelOneScene;
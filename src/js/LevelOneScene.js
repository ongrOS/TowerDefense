import images from '../assets/*.png';

class LevelOneScene extends Phaser.Scene {
  constructor(){
    super({key:"Level1"}); 
  }

  preload(){
    console.table(images);
    this.load.image('bullet', images.bullet);
  }

  create(){
    // World properties
    this.physics.world.setBounds(0, 0, 800, 600);

    // Static/dynamic object groups
    let bullets = this.physics.add.group();

    // Image/object placement
    this.add.text(50, 50, "Sample text");
    this.physics.add.sprite(100, 100, 'bullet');
  }

  update(){
    
  }
}

export default LevelOneScene;
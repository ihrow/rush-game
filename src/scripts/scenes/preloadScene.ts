export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    this.load.image('tilemap', 'assets/tilemap.png')
  }

  create() {
    this.scene.start('MainMenu')
  }
}

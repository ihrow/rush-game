export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  create() {
    this.scene.start('MainMenu')
  }
}

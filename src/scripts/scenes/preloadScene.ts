export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    this.load.image('tilemap', 'assets/tilemap.png')
  }

  create() {
    const level = localStorage.getItem('level') || '1'
    const isGameCompleted = localStorage.getItem('isGameCompleted') === 'true'
    this.scene.start('MainMenu', { level, isGameCompleted })
  }
}

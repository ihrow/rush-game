export default class MainGame extends Phaser.Scene {
  constructor() {
    super({ key: 'MainGame' })
  }

  create() {
    this.add.text(0, 0, 'MainGame', { fontSize: '48px', color: '#000000' })
  }
}

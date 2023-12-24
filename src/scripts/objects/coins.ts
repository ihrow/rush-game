export default class Coins extends Phaser.GameObjects.Text {
  coins: number
  constructor(scene, coins) {
    super(scene, 10, 10, 'Coins: 0', { color: 'black', fontSize: '16px' })
    scene.add.existing(this)
    this.setOrigin(0)
    this.coins = coins
  }

  public increment() {
    this.coins++
    this.update()
  }

  public update() {
    this.setText(`Coins: ${this.coins}`)
  }
}

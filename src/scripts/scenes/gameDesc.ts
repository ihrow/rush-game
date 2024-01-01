export default class GameDesc extends Phaser.Scene {
  constructor() {
    super({ key: 'GameDesc' })
  }

  preload() {
    this.load.image('tilemap', 'assets/tilemap.png')
  }

  create() {
    this.add.text(120, 0, 'Specification', { fontSize: '24px', color: '#000000' })

    this.add.text(0, 50, 'Controls:', { fontSize: '13px', color: '#000000' })
    this.add.text(0, 70, '- Left Arrow (A) or Right Arrow (D): Move player left or right.', {
      fontSize: '13px',
      color: '#000000'
    })
    this.add.text(0, 90, '- Spacebar: Player jumps.', { fontSize: '13px', color: '#000000' })
    this.add.text(0, 110, 'Monsters:', { fontSize: '13px', color: '#000000' })
    this.add.text(0, 130, '- Jump on monster heads to defeat them.', {
      fontSize: '13px',
      color: '#000000'
    })
    this.add.text(0, 150, 'Keys and Doors:', { fontSize: '13px', color: '#000000' })
    this.add.text(0, 170, '- Find keys on platforms and proceed to the new levels.', {
      fontSize: '13px',
      color: '#000000'
    })
    this.add.text(0, 200, 'Thank you for playing Rush!', { fontSize: '13px', color: '#000000' })

    const back = this.add
      .text(210, 230, 'Back', {
        fontSize: '13px',
        color: '#000000',
        padding: {
          left: 12.5,
          right: 12.5,
          top: 7.5,
          bottom: 7.5
        }
      })
      .setInteractive()

    back.on('pointerup', () => {
      this.scene.start('MainMenu')
    })

    back.on('pointerover', () => {
      back.setBackgroundColor('#ff69b4')
    })

    back.on('pointerout', () => {
      back.setBackgroundColor('#ffffff')
    })
  }
}

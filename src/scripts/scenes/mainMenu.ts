import Phaser from 'phaser'

export default class MainMenu extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenu' })
  }

  init() {}

  preload() {
    this.load.image('logo', '../assets/img/rush-logo.png')
  }

  create() {
    const { width, height } = this.scale

    this.add.image(width * 0.5, height * 0.3, 'logo')

    const playButton = this.add
      .text(width * 0.5, height * 0.45, 'Play', {
        fontSize: '48px',
        color: '#000000',
        backgroundColor: '#ffffff',
        padding: {
          left: 15,
          right: 15,
          top: 10,
          bottom: 10
        }
      })
      .setOrigin(0.5, 0.4)
      .setInteractive()

    const selectLevelButton = this.add
      .text(width * 0.5, height * 0.55, 'Select Level', {
        fontSize: '48px',
        color: '#000000',
        backgroundColor: '#ffffff',
        padding: {
          left: 15,
          right: 15,
          top: 10,
          bottom: 10
        }
      })
      .setOrigin(0.5, 0.4)
      .setInteractive()

    playButton.on('pointerover', () => {
      playButton.setBackgroundColor('#ff69b4')
    })

    playButton.on('pointerout', () => {
      playButton.setBackgroundColor('#ffffff')
    })

    selectLevelButton.on('pointerover', () => {
      selectLevelButton.setBackgroundColor('#ff69b4')
    })

    selectLevelButton.on('pointerout', () => {
      selectLevelButton.setBackgroundColor('#ffffff')
    })

    playButton.on('pointerup', () => {
      this.scene.start('MainGame', { level: 6 })
    })

    selectLevelButton.on('pointerup', () => {
      this.scene.start('SelectLevel')
    })
  }

  update() {}
}

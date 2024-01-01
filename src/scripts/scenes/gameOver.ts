export default class GameOver extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOver' })
  }

  preload() {}

  create() {
    const { width, height } = this.scale
    const gameOverText = this.add.text(width * 0.345, height * 0.2, 'Game Over', {
      fontSize: '24px',
      color: '#000000',
      backgroundColor: '#ffffff',
      padding: {
        left: 12.5,
        right: 12.5,
        top: 7.5,
        bottom: 7.5
      },
      align: 'center',
      fixedWidth: 160
    })

    const mainMenuButton = this.add
      .text(width * 0.345, height * 0.45, 'Play Again', {
        fontSize: '20px',
        color: '#000000',
        backgroundColor: '#ffffff',
        padding: {
          left: 12.5,
          right: 12.5,
          top: 7.5,
          bottom: 7.5
        },
        align: 'center',
        fixedWidth: 160
      })
      .setInteractive()

    const level = localStorage.getItem('level') || '1'

    mainMenuButton.on('pointerdown', () => {
      this.scene.start('MainGame', { level })
    })

    mainMenuButton.on('pointerover', () => {
      mainMenuButton.setBackgroundColor('#ff69b4')
    })

    mainMenuButton.on('pointerout', () => {
      mainMenuButton.setBackgroundColor('#ffffff')
    })

    this.input.keyboard.on('keydown-ENTER', () => {
      this.scene.start('MainGame', { level })
    })
  }
}

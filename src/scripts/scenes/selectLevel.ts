export default class SelectLevel extends Phaser.Scene {
  constructor() {
    super({ key: 'SelectLevel' })
  }

  create() {
    const levels = [1, 2, 3, 4, 5]
    const { width, height } = this.scale
    levels.forEach((level, index) => {
      const levelButton = this.add
        .text(width * (0.3 + index * 0.1), height * 0.5, `${level}`, {
          fontSize: '36px',
          color: '#000000',
          backgroundColor: '#ffffff',
          padding: {
            left: 30,
            right: 30,
            top: 20,
            bottom: 20
          }
        })
        .setOrigin(0.5, 0.4)
        .setInteractive()

      levelButton.on('pointerover', () => {
        levelButton.setBackgroundColor('#ff69b4')
      })

      levelButton.on('pointerout', () => {
        levelButton.setBackgroundColor('#ffffff')
      })

      levelButton.on('pointerdown', () => {
        this.scene.start('MainGame', { level })
      })
    })

    const backButton = this.add
      .text(width * 0.5, height * 0.8, 'Back', {
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

    backButton.on('pointerover', () => {
      backButton.setBackgroundColor('#ff69b4')
    })
    backButton.on('pointerout', () => {
      backButton.setBackgroundColor('#ffffff')
    })

    backButton.on('pointerdown', () => {
      this.scene.start('MainMenu')
    })
  }
}

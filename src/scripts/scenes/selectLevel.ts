export default class SelectLevel extends Phaser.Scene {
  level: number
  isGameCompleted: boolean

  constructor() {
    super({ key: 'SelectLevel' })
  }

  init(data) {
    this.level = data.level
    this.isGameCompleted = data.isGameCompleted
  }

  create() {
    const levels = [1, 2, 3, 4, 5]
    const { width, height } = this.scale
    levels.forEach((level, index) => {
      const levelButton = this.add
        .text(width * (0.3 + index * 0.11), height * 0.5, `${level}`, {
          fontSize: '24px',
          color: '#808080',
          backgroundColor: '#ffffff',
          padding: {
            left: 20,
            right: 20,
            top: 10,
            bottom: 10
          }
        })
        .setOrigin(0.5, 0.4)

      if (this.isGameCompleted || level == this.level) {
        levelButton.setInteractive()
        levelButton.setColor('#000000')
      }

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
        fontSize: '24px',
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

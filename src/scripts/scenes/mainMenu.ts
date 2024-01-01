import Phaser from 'phaser'

export default class MainMenu extends Phaser.Scene {
  level: number
  isGameCompleted: boolean

  constructor() {
    super({ key: 'MainMenu' })
  }

  init(data) {
    this.level = data.level
    this.isGameCompleted = data.isGameCompleted
  }

  preload() {
    this.load.image('logo', 'assets/img/logo.png')
  }

  create() {
    const { width, height } = this.scale

    const logo = this.add.image(Math.floor(width * 0.5), Math.floor(height * 0.25), 'logo')
    logo.scale = 0.2

    const playButton = this.add
      .text(width * 0.333, height * 0.38, 'Play', {
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
      .setInteractive()

    const aboutButton = this.add
      .text(width * 0.5, height * 0.85, 'About', {
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
      .setOrigin(0.5, 0.4)
      .setInteractive()

    const selectLevelButton = this.add
      .text(width * 0.5, height * 0.65, 'Select Level', {
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
      .setOrigin(0.5, 0.4)
      .setInteractive()

    //@ts-ignore
    WebFont.load({
      google: {
        families: ['VT323']
      },
      active: () => {
        playButton.setFontFamily('VT323')
        selectLevelButton.setFontFamily('VT323')
        aboutButton.setFontFamily('VT323')
      }
    })

    playButton.on('pointerover', () => {
      playButton.setBackgroundColor('#ff69b4')
    })

    playButton.on('pointerout', () => {
      playButton.setBackgroundColor('#ffffff')
    })

    aboutButton.on('pointerover', () => {
      aboutButton.setBackgroundColor('#ff69b4')
    })

    aboutButton.on('pointerout', () => {
      aboutButton.setBackgroundColor('#ffffff')
    })

    selectLevelButton.on('pointerover', () => {
      selectLevelButton.setBackgroundColor('#ff69b4')
    })

    selectLevelButton.on('pointerout', () => {
      selectLevelButton.setBackgroundColor('#ffffff')
    })

    playButton.on('pointerup', () => {
      this.scene.start('MainGame', { level: this.level })
    })

    selectLevelButton.on('pointerup', () => {
      this.scene.start('SelectLevel', { isGameCompleted: this.isGameCompleted })
    })

    aboutButton.on('pointerup', () => {
      this.scene.start('GameDesc')
    })
  }

  update() {}
}

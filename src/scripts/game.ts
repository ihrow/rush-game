import 'phaser'
import MainMenu from './scenes/mainMenu'
import PreloadScene from './scenes/preloadScene'
import SelectLevel from './scenes/selectLevel'
import MainGame from './scenes/mainGame'

const DEFAULT_WIDTH = 486
const DEFAULT_HEIGHT = 270
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  backgroundColor: '#ffffff',
  scene: [PreloadScene, MainMenu, SelectLevel, MainGame],
  pixelArt: true,
  width: DEFAULT_WIDTH,
  height: DEFAULT_HEIGHT,
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH,
    zoom: 2
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 500 }
    }
  }
}

export const game = new Phaser.Game(config)

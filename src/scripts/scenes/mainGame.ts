import Coin from '../objects/coins'
export default class MainGame extends Phaser.Scene {
  player: Phaser.Physics.Arcade.Sprite
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  canJump: boolean
  keyCollected: boolean
  coinText: Coin
  level: number

  constructor() {
    super({ key: 'MainGame' })
  }

  init(data) {
    if (data.level) {
      this.level = data.level
    }
  }

  preload() {
    this.load.image('background', 'assets/background.png')

    this.load.tilemapTiledJSON('level1', 'assets/data/level1.json')
    this.load.tilemapTiledJSON('level2', 'assets/data/level2.json')
    this.load.tilemapTiledJSON('level3', 'assets/data/level3.json')
    this.load.tilemapTiledJSON('level4', 'assets/data/level4.json')
    this.load.tilemapTiledJSON('level5', 'assets/data/level5.json')

    this.load.spritesheet('player', 'assets/character.png', {
      frameWidth: 24,
      frameHeight: 24
    })

    this.load.spritesheet('tilemap_copy', 'assets/tilemap.png', {
      frameWidth: 18,
      frameHeight: 18,
      spacing: 1
    })

    this.cursors = this.input.keyboard.createCursorKeys()
  }

  create() {
    const cameraWidth = this.cameras.main.width
    const cameraHeight = this.cameras.main.height
    const bg = this.add.image(0, 0, 'background').setOrigin(0, 0)
    bg.setScale(Math.max(cameraWidth / bg.width, cameraHeight / bg.height))
    this.coinText = new Coin(this, 0)

    const map = this.make.tilemap({ key: `level${this.level}` })
    const tileset = map.addTilesetImage('tilemap', 'tilemap')
    const layer = map.createLayer('World', tileset, 0, 0)
    layer.setCollision(new Array(100).fill(0).map((_, i) => i + 1))

    /** TRAMPOLINE */
    this.anims.create({
      key: 'trampoline',
      frames: this.anims.generateFrameNumbers('tilemap_copy', { start: 107, end: 108 }),
      frameRate: 2,
      repeat: -1
    })

    const trampoline = this.physics.add.staticGroup()
    const trampolineLayer = map.getObjectLayer('Trampoline')
    if (trampolineLayer) {
      trampolineLayer.objects.forEach(tramp => {
        trampoline
          .get(tramp.x! + tramp.width! / 2, tramp.y! - tramp.height! / 2, 'tilemap_copy', 107)
          .anims.play('trampoline', true)
      })
    }

    /** KEYS */

    const keys = this.physics.add.staticGroup()
    const keysLayer = map.getObjectLayer('Keys')
    keysLayer.objects.forEach(key => {
      keys.get(key.x! + key.width! / 2, key.y! - key.height! / 2, 'tilemap_copy', 27)
    })

    /** DOOR */
    const door = this.physics.add.staticGroup()
    const doorLayer = map.getObjectLayer('Door')
    door.get(
      doorLayer.objects[0].x! + doorLayer.objects[0].width! / 2,
      doorLayer.objects[0].y! - doorLayer.objects[0].height! / 2,
      'tilemap_copy',
      150
    )
    door.get(
      doorLayer.objects[1].x! + doorLayer.objects[1].width! / 2,
      doorLayer.objects[1].y! - doorLayer.objects[1].height! / 2,
      'tilemap_copy',
      110
    )

    /** COINS */
    const coins = this.physics.add.staticGroup()
    const coinsLayer = map.getObjectLayer('Coins')
    this.anims.create({
      key: 'coin',
      frames: this.anims.generateFrameNumbers('tilemap_copy', { start: 151, end: 152 }),
      frameRate: 5,
      repeat: -1
    })
    coinsLayer.objects.forEach(coin => {
      coins.get(coin.x! + coin.width! / 2, coin.y! - coin.height! / 2, 'tilemap_copy', 151).anims.play('coin', true)
    })

    this.player = this.physics.add.sprite(30, 250, 'player')
    this.player.setCollideWorldBounds(true)

    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('player', { start: 4, end: 4 }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'running',
      frames: this.anims.generateFrameNumbers('player', { start: 4, end: 5 }),
      frameRate: 10,
      repeat: -1
    })

    this.cursors.space.on('down', () => {
      if (this.canJump) {
        this.player.setVelocityY(-270)
      }
    })

    /** COLLISIONS */
    this.physics.add.collider(this.player, layer)

    this.physics.add.overlap(this.player, keys, (player, key) => {
      this.keyCollected = true
      key.destroy()
    })

    this.physics.add.overlap(this.player, coins, (player, coin) => {
      coin.destroy()
      this.coinText.increment()
    })

    this.physics.add.overlap(this.player, door, (player, door) => {
      if (this.keyCollected) {
        this.loadNextLevel()
      }
    })

    this.physics.add.overlap(this.player, trampoline, (player, trampoline) => {
      if (player.body.y < trampoline.body.y - trampoline.body.height) {
        this.player.setVelocityY(-500)
      }
    })

    /** BACK */
    const back = this.add
      .text(400, 10, 'Back', {
        fontSize: '12px',
        color: '#000000',
        backgroundColor: '#ffffff',
        padding: {
          left: 12.5,
          right: 12.5,
          top: 7.5,
          bottom: 7.5
        },
        align: 'center'
      })
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.start('MainMenu')
      })

    back.on('pointerover', () => {
      back.setBackgroundColor('#ff69b4')
    })

    back.on('pointerout', () => {
      back.setBackgroundColor('#ffffff')
    })
  }

  loadNextLevel() {
    this.level++
    this.keyCollected = false

    if (this.level > 5) {
      localStorage.setItem('isGameCompleted', 'true')
      localStorage.setItem('level', '1')
      this.level = 1
      this.scene.start('MainMenu', { level: this.level, isGameCompleted: true })
      return
    }
    localStorage.setItem('level', this.level.toString())
    this.scene.start('MainGame', { level: this.level })
  }

  resize() {
    const { width, height } = this.scale
    this.cameras.resize(width, height)
  }

  update() {
    const SPEED = 150
    this.canJump = this.player.body.blocked.down
    if (!this.cursors || !this.player) return
    if (this.cursors.right.isDown) {
      this.player.anims.play('running', true)
      this.player.flipX = true
      this.player.setVelocityX(SPEED)
    } else if (this.cursors.left.isDown) {
      this.player.anims.play('running', true)
      this.player.flipX = false
      this.player.setVelocityX(-SPEED)
    } else {
      this.player.flipX = false
      this.player.anims.play('idle', true)
      this.player.setVelocityX(0)
    }
  }
}

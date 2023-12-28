import Coin from '../objects/coins'
export default class MainGame extends Phaser.Scene {
  player: Phaser.Physics.Arcade.Sprite
  enemies: Phaser.Physics.Arcade.Sprite[]
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  canJump: boolean
  keyCollected: boolean
  coinText: Coin
  level: number
  helpText: Phaser.GameObjects.Text

  constructor() {
    super({ key: 'MainGame' })
  }

  init(data) {
    if (data.level) {
      this.level = data.level
    } else {
      this.level = parseInt(localStorage.getItem('level') || '1')
    }
    this.enemies = []
  }

  preload() {
    this.load.image('background', 'assets/background.png')

    this.load.tilemapTiledJSON('level1', 'assets/data/level1.json')
    this.load.tilemapTiledJSON('level2', 'assets/data/level2.json')
    this.load.tilemapTiledJSON('level3', 'assets/data/level3.json')
    this.load.tilemapTiledJSON('level4', 'assets/data/level4.json')
    this.load.tilemapTiledJSON('level5', 'assets/data/level5.json')

    this.load.spritesheet('characters', 'assets/character.png', {
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

    /** SIGN */
    const signGroup = this.physics.add.staticGroup()
    const signLayer = map.getObjectLayer('Signs')
    if (signLayer) {
      signLayer.objects.forEach(sign => {
        signGroup.get(sign.x! + sign.width! / 2, sign.y! - sign.height! / 2, 'tilemap_copy', 85)
      })
    }

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

    this.player = this.physics.add.sprite(30, 250, 'characters')
    this.player.setCollideWorldBounds(true)

    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('characters', { start: 4, end: 4 }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'running',
      frames: this.anims.generateFrameNumbers('characters', { start: 4, end: 5 }),
      frameRate: 10,
      repeat: -1
    })

    this.cursors.space.on('down', () => {
      if (this.canJump) {
        this.player.setVelocityY(-270)
      }
    })

    /** Walls */
    const walls = this.physics.add.staticGroup()
    const wallLayer = map.getObjectLayer('Walls')
    if (wallLayer) {
      wallLayer.objects.forEach(wall => {
        walls.get(wall.x! + wall.width! / 2, wall.y! - wall.height! / 2, 'tilemap_copy', 1)
      })
    }
    walls.setVisible(false)

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

    this.helpText = this.add.text(-999, 70, 'Use arrow keys to move and space to jump', {
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

    this.physics.add.overlap(this.player, signGroup, (player, sign) => {
      this.helpText.x = 30
    })

    /** ENEMY */
    this.anims.create({
      key: 'enemy',
      frames: this.anims.generateFrameNumbers('characters', { start: 18, end: 19 }),
      frameRate: 5,
      repeat: -1
    })

    this.anims.create({
      key: 'enemy_dead',
      frames: this.anims.generateFrameNumbers('characters', { start: 20, end: 20 }),
      frameRate: 5,
      repeat: -1
    })

    if (this.level == 1) {
      this.enemies = []
    } else if (this.level == 2) {
      this.enemies = [this.physics.add.sprite(300, 140, 'characters')]
    } else if (this.level == 3) {
      this.enemies = [this.physics.add.sprite(100, 80, 'characters')]
    } else if (this.level == 4) {
      this.enemies = [this.physics.add.sprite(100, 80, 'characters')]
    } else if (this.level == 5) {
      this.enemies = [this.physics.add.sprite(300, 150, 'characters'), this.physics.add.sprite(90, 80, 'characters')]
    }

    this.enemies.forEach(enemy => {
      enemy.setCollideWorldBounds(true)
      enemy.anims.play('enemy', true)
      enemy.setVelocityX(50)
      enemy.flipX = true
      this.physics.add.collider(enemy, layer)
      this.physics.add.collider(enemy, walls)

      this.physics.add.overlap(this.player, enemy, (player, enemy) => {
        if (player.body.touching.down && enemy.body.touching.up) {
          //@ts-ignore
          enemy.anims.play('enemy_dead', true)
          //@ts-ignore
          enemy.setVelocityX(0)
          //@ts-ignore
          enemy.setVelocityY(-200)
          enemy.setData('isDead', true)
          setTimeout(() => {
            enemy.destroy()
          }, 1000)
        } else {
          if (enemy.getData('isDead')) return
          this.displayModalGameOver()
        }
      })
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

  displayModalGameOver() {
    this.scene.start('GameOver')
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
    this.scene.restart({ level: this.level })
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

    this.enemies.forEach(enemy => {
      if (enemy.getData('isDead')) return
      if (enemy.body?.blocked.right) {
        enemy.flipX = false
        enemy.setVelocityX(-50)
      } else if (enemy.body?.blocked.left) {
        enemy.flipX = true
        enemy.setVelocityX(50)
      }
    })

    //if playeer not touching sign
    if (this.player.body.touching.none) {
      this.helpText.x = -999
    }
  }
}

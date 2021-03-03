function initPaddle () {
    paddle = sprites.create(img`
        1 1 1 1 
        1 1 1 1 
        1 1 1 1 
        1 1 1 1 
        1 1 1 1 
        1 1 1 1 
        1 1 1 1 
        1 1 1 1 
        1 1 1 1 
        1 1 1 1 
        1 1 1 1 
        1 1 1 1 
        1 1 1 1 
        1 1 1 1 
        1 1 1 1 
        1 1 1 1 
        `, SpriteKind.Player)
    paddle.setPosition(8, 60)
    controller.moveSprite(paddle, 0, 100)
    paddle.setFlag(SpriteFlag.StayInScreen, true)
}
info.onCountdownEnd(function () {
    music.powerUp.play()
    if (info.score() > info.player2.score()) {
        game.splash("Player 1 wins!", "Score: " + info.score())
    } else if (info.score() < info.player2.score()) {
        game.splash("Player 2 wins!", "Score: " + info.player2.score())
    } else {
        game.splash("Draw")
    }
    game.reset()
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Projectile, function (sprite, otherSprite) {
    otherSprite.vx = -1.1 * otherSprite.vx
    otherSprite.vy = 1.1 * otherSprite.vy
    music.playTone(494, music.beat(BeatFraction.Half))
})
function initBall () {
    projectile = sprites.createProjectileFromSprite(img`
        1 1 1 1 
        1 1 1 1 
        1 1 1 1 
        1 1 1 1 
        `, paddle, randint(50, 75), randint(25, 50))
    projectile.x += 3
    projectile.setFlag(SpriteFlag.BounceOnWall, true)
    projectile.setFlag(SpriteFlag.ShowPhysics, false)
}
function initBackground () {
    picture = image.create(scene.screenWidth(), scene.screenHeight())
    for (let index = 0; index <= scene.screenHeight(); index++) {
        if (index % 6 < 4) {
            picture.setPixel(scene.screenWidth() / 2, index, 1)
        }
    }
    scene.setBackgroundImage(picture)
}
function initAdversary () {
    adversary = sprites.create(img`
        1 1 1 1 
        1 1 1 1 
        1 1 1 1 
        1 1 1 1 
        1 1 1 1 
        1 1 1 1 
        1 1 1 1 
        1 1 1 1 
        1 1 1 1 
        1 1 1 1 
        1 1 1 1 
        1 1 1 1 
        1 1 1 1 
        1 1 1 1 
        1 1 1 1 
        1 1 1 1 
        `, SpriteKind.Player)
    adversary.setPosition(152, 60)
    adversary.setFlag(SpriteFlag.StayInScreen, true)
    if (twoPlayer) {
        controller.player2.moveSprite(adversary, 0, 100)
    }
}
let adversary: Sprite = null
let picture: Image = null
let projectile: Sprite = null
let paddle: Sprite = null
let twoPlayer = false
game.splash("Pong", "by me")
twoPlayer = false
if (game.ask("Two players - A", "One player - B")) {
    twoPlayer = true
}
initBackground()
initPaddle()
initAdversary()
initBall()
info.setScore(0)
info.player2.setScore(0)
info.startCountdown(60)
game.onUpdate(function () {
    if (!(twoPlayer)) {
        if (projectile.x > scene.screenWidth() / 2) {
            if (projectile.y > adversary.y) {
                adversary.y += 2
            } else {
                adversary.y += -2
            }
        }
    }
})
game.onUpdate(function () {
    if (projectile.x > adversary.right) {
        info.changeScoreBy(1)
        music.jumpUp.play()
        projectile.setPosition(paddle.x + 3, paddle.y)
        projectile.setVelocity(randint(50, 75), randint(25, 50))
    } else if (projectile.x < paddle.left) {
        info.player2.changeScoreBy(1)
        music.jumpDown.play()
        projectile.setPosition(adversary.x - 3, adversary.y)
        projectile.setVelocity(randint(-75, -50), randint(25, 50))
    }
})

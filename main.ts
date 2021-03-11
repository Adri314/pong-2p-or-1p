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
    if (score1 > score2) {
        game.splash("Player 1 wins!", "Score: " + score1)
    } else if (score1 < score2) {
        game.splash("Player 2 wins!", "Score: " + score2)
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
let score2 = 0
let score1 = 0
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
info.startCountdown(60)
score1 = 0
score2 = 0
let showScore1 = textsprite.create(convertToText(score1))
showScore1.setMaxFontHeight(16)
showScore1.setPosition(40, 16)
let showScore2 = textsprite.create(convertToText(score2))
showScore2.setMaxFontHeight(16)
showScore2.setPosition(120, 16)
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
        score1 += 1
        showScore1.setText(convertToText(score1))
        music.jumpUp.play()
        projectile.setPosition(paddle.x + 3, paddle.y)
        projectile.setVelocity(randint(50, 75), randint(25, 50))
    } else if (projectile.x < paddle.left) {
        score2 += 1
        showScore2.setText(convertToText(score2))
        music.jumpDown.play()
        projectile.setPosition(adversary.x - 3, adversary.y)
        projectile.setVelocity(randint(-75, -50), randint(25, 50))
    }
})

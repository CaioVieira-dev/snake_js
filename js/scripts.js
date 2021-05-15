const board = document.querySelector('body');
const field = document.querySelector('main')

let id = 0;
let timerId;

board.addEventListener("keydown", keyListener);
const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("snakejs:games")) || []
    },
    set(games) {
        localStorage.setItem("snakejs:games", JSON.stringify(Scoreboard.leaderboard))
    }
}

const Scoreboard = {
    leaderboard: Storage.get(),
    sortHighscores() {
        Scoreboard.leaderboard.sort(function (a, b) { return b.score - a.score })
    },
    saveScore(event) {
        event.preventDefault();
        let playerName = document.querySelector("#playerName").value;
        document.querySelector('#playerName').value = "";
        if (playerName == "") { playerName = "Convidado" }
        let score = {
            player: playerName,
            score: Number(document.querySelector("#score span").innerHTML)
        };
        Scoreboard.leaderboard.push(score);
        Scoreboard.showLeaderboard()
        Scoreboard.hideForm();
        App.initGame()

    },
    showLeaderboard() {
        Scoreboard.sortHighscores()
        Scoreboard.resetTable()
        Scoreboard.leaderboard.forEach(Scoreboard.constructTable)
    },
    resetTable() {
        document.querySelector("#leaderboard tbody").innerHTML = "";
    },
    constructTable(game) {
        const tr = document.createElement("tr")
        tr.innerHTML = `
            <td>${game.player}</td>
            <td>${game.score}</td>
        `;
        document.querySelector("#leaderboard tbody").appendChild(tr);
    },
    showForm() {
        document.querySelector("form").classList.remove("hide")
    },
    hideForm() {
        document.querySelector("form").classList.add("hide")
    }
}

const App = {
    initGame() {
        id = 0;
        Player.size = 1;
        document.querySelector('main').innerHTML = `<div id="fruit"></div>
        <div id="player" dir="0" lastDir="0"></div>`

        Player.setY("48%");
        Player.setX("48%");
        Storage.set(Scoreboard.leaderboard);
        createNewFruit();
        startGameLoop();
    },
    pauseGame(interval) {
        clearInterval(interval);
    },
    unPause() {
        startGameLoop();
    },
    state: "running"
}
const Configs = {
    toggleConfigs() {
        if (document.querySelector("aside").style.display == "block") {
            document.querySelector("aside").style.display = "none"
            App.unPause()
            App.state = "running"
        } else {
            document.querySelector("aside").style.display = "block"
            App.pauseGame(timerId)
            App.state = "paused"
        }
    },
    setup() {
        document.querySelector(".configButton p i").addEventListener('click', Configs.toggleConfigs)
        document.querySelector("aside h3 span").addEventListener('click', Configs.toggleConfigs)
        document.querySelector("#up").addEventListener('click', () => { document.querySelector("#up").setAttribute("clicked", "true") })
        document.querySelector("#down").addEventListener('click', () => { document.querySelector("#down").setAttribute("clicked", "true") })
        document.querySelector("#left").addEventListener('click', () => { document.querySelector("#left").setAttribute("clicked", "true") })
        document.querySelector("#right").addEventListener('click', () => { document.querySelector("#right").setAttribute("clicked", "true") })
        document.querySelector("#pause").addEventListener('click', () => { document.querySelector("#pause").setAttribute("clicked", "true") })

        document.querySelector("#reduceSpeed").addEventListener('click', Configs.speedDown)
        document.querySelector("#increaseSpeed").addEventListener('click', Configs.speedUp)
    },
    rebindKey(key, newKey) {
        switch (key) {
            case 'up':
                Configs.keyUp = newKey.code

                break;
            case 'down':
                Configs.keyDown = newKey.code
                break;
            case 'left':
                Configs.keyLeft = newKey.code
                break;
            case 'right':
                Configs.keyRight = newKey.code
                break;
            case 'pause':
                Configs.keyPause = newKey.code
                break;
        }
        console.log(newKey)
    },
    speedUp() {
        if (Configs.gameSpeed == 5) {
            return
        }
        if (Configs.gameSpeed == 0) {
            document.querySelector("#reduceSpeed").classList.remove("__disabled")
            document.querySelector("#reduceSpeed").classList.add("__cursor_pointer")
        }
        Configs.gameSpeed++;
        document.querySelector("#gameSpeed").innerHTML = Configs.gameSpeed;
        if (Configs.gameSpeed == 5) {
            document.querySelector("#increaseSpeed").classList.add("__disabled")
            document.querySelector("#increaseSpeed").classList.remove("__cursor_pointer")
        }
    },
    speedDown() {
        if (Configs.gameSpeed == 0) {
            return
        }
        if (Configs.gameSpeed == 5) {
            document.querySelector("#increaseSpeed").classList.remove("__disabled")
            document.querySelector("#increaseSpeed").classList.add("__cursor_pointer")
        }
        Configs.gameSpeed--;
        document.querySelector("#gameSpeed").innerHTML = Configs.gameSpeed;
        if (Configs.gameSpeed == 0) {
            document.querySelector("#reduceSpeed").classList.add("__disabled")
            document.querySelector("#reduceSpeed").classList.remove("__cursor_pointer")
        }
    },

    keyUp: "KeyW",
    keyRight: "KeyD",
    keyDown: "KeyS",
    keyLeft: "KeyA",
    keyPause: "Escape",
    gameSpeed: 5

}
function startGameLoop() {
    let time = 650 - (Configs.gameSpeed * 100)
    timerId = setInterval(() => {
        playerMove()

    }, time);
}

const Player = {
    id: document.querySelector('#player'),
    x: document.querySelector('#player').style.left,
    y: document.querySelector('#player').style.top,
    getX() {
        let xValue = document.querySelector('#player').style.left
        return xValue
    },
    getY() {
        let yValue = document.querySelector('#player').style.top
        return yValue
    },
    setX(newX) {
        document.querySelector('#player').style.left = newX
    },
    setY(newY) {
        document.querySelector('#player').style.top = newY
    },
    size: 1,
    // dir: 0, //1 cima, 2 direita, 3 baixo, 4 esquerda, 0 not started
}
//console.log(document.querySelector('#player').style)
const Fruit = {
    id: document.querySelector('#player'),
    x: document.querySelector('#fruit').style.left,
    y: document.querySelector('#fruit').style.top,
    getX() {
        let xValue = document.querySelector('#fruit').style.left
        return xValue
    },
    getY() {
        let yValue = document.querySelector('#fruit').style.top
        return yValue
    },
    setX(newX) {
        document.querySelector('#fruit').style.left = newX
    },
    setY(newY) {
        document.querySelector('#fruit').style.top = newY
    },
}
function increaseSize(posX, posY) {
    let bodyPart = document.createElement('div');
    bodyPart.classList.add("playerBody");
    bodyPart.style.top = posY;
    bodyPart.style.left = posX;
    bodyPart.id = 'id_' + id;
    id++;
    bodyPart.setAttribute("dir", 0);
    bodyPart.setAttribute("lastDir", 0);
    bodyPart.setAttribute("wait", Player.size);

    field.appendChild(bodyPart)

}
function moveBody() {
    //console.log("id=", id)
    for (let i = 0; i <= id; i++) {
        //console.log(document.querySelector(`#id_${i}`));

        if (document.querySelector(`#id_${i}`)) {

            let part = document.querySelector(`#id_${i}`)
            //se for a primeira parte do corpo
            //ela segue a cabeça
            if (document.querySelector(`#id_${i}`) == document.querySelector(`#id_0`)) {
                //se a parte acabou de ser criada
                //ela não tem direção
                //nesse caso dir = 0
                if (part.getAttribute("dir") == 0) {
                    //se não tem direção pegue a do player
                    part.setAttribute("dir", document.querySelector("#player").getAttribute("dir"))
                } else {
                    //caso tenha direção
                    //atualize e vá para proxima posição
                    part.setAttribute("lastDir", part.getAttribute("dir"))

                    //console.log(part.getAttribute("dir"))

                    let partTop = Number(part.style.top.replace("%", ""))
                    let partLeft = Number(part.style.left.replace("%", ""))
                    //console.log(part.style.top)

                    if (part.getAttribute("dir") == 1) {
                        part.style.top = `${partTop - 2}%`

                    }
                    if (part.getAttribute("dir") == 2) {
                        part.style.left = `${partLeft + 2}%`
                        //console.log(`${partLeft + 2}%`)
                    }
                    if (part.getAttribute("dir") == 3) {
                        part.style.top = `${partTop + 2}%`
                    }
                    if (part.getAttribute("dir") == 4) {
                        part.style.left = `${partLeft - 2}%`
                    }
                    part.setAttribute("dir", document.querySelector("#player").getAttribute("dir"))
                }
                continue;
            }

            if (part.getAttribute("dir") == 0) {
                //se não tem direção pegue a do player
                if (part.getAttribute("wait") > 2) {
                    let updateWait = Number(part.getAttribute("wait")) - 1;
                    part.setAttribute("wait", updateWait)
                    continue;
                }
                part.setAttribute("dir", document.querySelector(`#id_${i - 1}`).getAttribute("lastDir"))
            } else {
                //caso tenha direção
                //atualize e vá para proxima posição

                // console.log(part.getAttribute("dir"))


                part.setAttribute("lastDir", part.getAttribute("dir"))

                let partTop = Number(part.style.top.replace("%", ""))
                let partLeft = Number(part.style.left.replace("%", ""))
                //console.log(part.style.top)

                if (part.getAttribute("dir") == 1) {
                    part.style.top = `${partTop - 2}%`

                }
                if (part.getAttribute("dir") == 2) {
                    part.style.left = `${partLeft + 2}%`
                    //console.log(`${partLeft + 2}%`)
                }
                if (part.getAttribute("dir") == 3) {
                    part.style.top = `${partTop + 2}%`
                }
                if (part.getAttribute("dir") == 4) {
                    part.style.left = `${partLeft - 2}%`
                }
                part.setAttribute("dir", document.querySelector(`#id_${i - 1}`).getAttribute("lastDir"))

            }


        }
    }
}
function moveHead() {
    //console.log('head')
    let actualPositionX = Player.getX();
    let actualPositionY = Player.getY();
    if (document.querySelector("#player").getAttribute("dir") == 1) {
        let actualPosition = Number(Player.getY().replace("%", ""))
        //player.style.top = actualPosition - 2 < 0 ? player.style.top : `${actualPosition - 2}%`
        //if (actualPosition - 2 < 0) { ""/*perder jogo*/ } else {
        Player.setY(`${actualPosition - 2}%`);
        document.querySelector("#player").setAttribute("lastDir", 1)

        if (colidedWithFruit()) {
            increaseSize(actualPositionX, actualPositionY, document.querySelector("#player").getAttribute("dir"))
        }

    }
    if (document.querySelector("#player").getAttribute("dir") == 4) {
        let actualPosition = Number(Player.getX().replace("%", ""))
        //player.style.left = actualPosition - 2 < 0 ? player.style.left : `${actualPosition - 2}%`
        //if (actualPosition - 2 < 0) { ""/*perder jogo*/ } else {
        Player.setX(`${actualPosition - 2}%`)
        document.querySelector("#player").setAttribute("lastDir", 4)

        if (colidedWithFruit()) {
            increaseSize(actualPositionX, actualPositionY, document.querySelector("#player").getAttribute("dir"))
        }


    }
    if (document.querySelector("#player").getAttribute("dir") == 3) {
        let actualPosition = Number(Player.getY().replace("%", ""))
        //player.style.top = actualPosition + 2 > 98 ? player.style.top : `${actualPosition + 2}%`
        //if (actualPosition + 2 > 98) { ""/*perder jogo*/ } else {
        Player.setY(`${actualPosition + 2}%`)

        document.querySelector("#player").setAttribute("lastDir", 3)
        if (colidedWithFruit()) {
            increaseSize(actualPositionX, actualPositionY, document.querySelector("#player").getAttribute("dir"))
        }

    }
    if (document.querySelector("#player").getAttribute("dir") == 2) {
        let actualPosition = Number(Player.getX().replace("%", ""))
        //player.style.left = actualPosition + 2 > 98 ? player.style.left : `${actualPosition + 2}%`
        //if (actualPosition + 2 > 98) { ""/*perder jogo*/ } else {
        Player.setX(`${actualPosition + 2}%`)

        document.querySelector("#player").setAttribute("lastDir", 2)
        if (colidedWithFruit()) {
            increaseSize(actualPositionX, actualPositionY, document.querySelector("#player").getAttribute("dir"))
        }


    }
    if (isGameOver()) {
        //game over
        App.pauseGame(timerId);
        Scoreboard.showForm();
    }

}
function isGameOver() {
    if (Number(Player.getX().replace("%", "")) < 0 ||
        Number(Player.getX().replace("%", "")) > 98 ||
        Number(Player.getY().replace("%", "")) < 0 ||
        Number(Player.getY().replace("%", "")) > 98) {
        return true
    }
    for (let i = 0; i < field.childElementCount; i++) {
        if (field.children.item(i).id == "player" || field.children.item(i).id == "fruit") {
            continue
        }
        let elementX = field.children.item(i).style.left
        let elementY = field.children.item(i).style.top
        //console.log("elementX:", elementX, "\n", Player.getX())
        //console.log(Player.getX() == elementX && Player.getY == elementY)
        if (Player.getX() == elementX && Player.getY() == elementY) {
            //console.log(field.children.item(i).id)
            return true
        }
    }
    return false;
}

function playerMove() {
    //console.log(field.childNodes)
    //console.log("move")
    moveHead()
    moveBody()
}
function createNewFruit() {

    let randomX = Math.floor(Math.random() * 49) * 2;
    let randomY = Math.floor(Math.random() * 49) * 2;

    for (let i = 0; i < field.childElementCount; i++) {
        if (field.children.item(i).style.top == `${randomY}%` && field.children.item(i).style.left == `${randomX}%`)
            createNewFruit()
    }


    Fruit.setX(`${randomX}%`)
    Fruit.setY(`${randomY}%`)


}
function colidedWithFruit() {
    if (Player.getY() == Fruit.getY() && Fruit.getX() == Player.getX()) {
        Player.size += 1;
        document.querySelector('#score span').innerHTML = (Player.size - 1) * 10;
        createNewFruit();
        return true
        //console.log('colidiu')
    }
    return false;
}
function keyListener(e) {
    // console.log(e.code)
    // let actualPositionX = Player.getX();
    // let actualPositionY = Player.getY();

    if (document.querySelector("aside").style.display != "block") {
        if (e.code == Configs.keyPause) {
            if (App.state == "running") {
                App.state = "paused"
                App.pauseGame(timerId)
            }
            else {
                App.unPause()
                App.state = 'running'
            }
        }
    }
    if (e.code == Configs.keyUp) {

        // let actualPosition = Number(Player.getY().replace("%", ""))
        //player.style.top = actualPosition - 2 < 0 ? player.style.top : `${actualPosition - 2}%`
        //if (actualPosition - 2 < 0) { ""/*perder jogo*/ } else {
        //    Player.setY(`${actualPosition - 2}%`);

        if (document.querySelector("#player").getAttribute("lastDir") != 3) {
            document.querySelector("#player").setAttribute("dir", 1)
        }



        /*
        if (colidedWithFruit()) {
            increaseSize(actualPositionX, actualPositionY, Player.dir)
        }
        playerMove();
        */


        //}

    }
    if (e.code == Configs.keyLeft) {
        // let actualPosition = Number(Player.getX().replace("%", ""))
        //player.style.left = actualPosition - 2 < 0 ? player.style.left : `${actualPosition - 2}%`
        // if (actualPosition - 2 < 0) { ""/*perder jogo*/ } else {
        //     Player.setX(`${actualPosition - 2}%`)
        if (document.querySelector("#player").getAttribute("lastDir") != 2) {
            document.querySelector("#player").setAttribute("dir", 4);
        }

        //     if (colidedWithFruit()) {
        //         increaseSize(actualPositionX, actualPositionY, Player.dir)
        //     }
        //    playerMove();

        //}
    }
    if (e.code == Configs.keyDown) {
        //  let actualPosition = Number(Player.getY().replace("%", ""))
        //player.style.top = actualPosition + 2 > 98 ? player.style.top : `${actualPosition + 2}%`
        //  if (actualPosition + 2 > 98) { ""/*perder jogo*/ } else {
        //    Player.setY(`${actualPosition + 2}%`)
        if (document.querySelector("#player").getAttribute("lastDir") != 1) {
            document.querySelector("#player").setAttribute("dir", 3)
        }
        //    if (colidedWithFruit()) {
        //        increaseSize(actualPositionX, actualPositionY, Player.dir)
        //    }
        //    playerMove();
        //  }
    }
    if (e.code == Configs.keyRight) {
        //let actualPosition = Number(Player.getX().replace("%", ""))
        //player.style.left = actualPosition + 2 > 98 ? player.style.left : `${actualPosition + 2}%`
        //if (actualPosition + 2 > 98) { ""/*perder jogo*/ } else {
        //    Player.setX(`${actualPosition + 2}%`)
        if (document.querySelector("#player").getAttribute("lastDir") != 4) {
            document.querySelector("#player").setAttribute("dir", 2)
        }
        //   if (colidedWithFruit()) {
        //       increaseSize(actualPositionX, actualPositionY, Player.dir)
        //   }
        //  playerMove();

        //   }
    }

    const up = document.querySelector("#up")
    const down = document.querySelector("#down")
    const left = document.querySelector("#left")
    const right = document.querySelector("#right")
    const pause = document.querySelector("#pause")

    if (up.getAttribute("clicked") == "true") {
        up.setAttribute("clicked", "false")
        up.innerHTML = e.key.toUpperCase()
        document.querySelector("#label_input_up").innerHTML = e.key.toUpperCase()
        Configs.rebindKey("up", e)
    }
    if (down.getAttribute("clicked") == "true") {
        down.setAttribute("clicked", "false")
        down.innerHTML = e.key.toUpperCase()
        document.querySelector("#label_input_down").innerHTML = e.key.toUpperCase()
        Configs.rebindKey("down", e)

    }
    if (left.getAttribute("clicked") == "true") {
        left.setAttribute("clicked", "false")
        left.innerHTML = e.key.toUpperCase()
        document.querySelector("#label_input_left").innerHTML = e.key.toUpperCase()
        Configs.rebindKey("left", e)

    }
    if (right.getAttribute("clicked") == "true") {
        right.setAttribute("clicked", "false")
        right.innerHTML = e.key.toUpperCase()
        document.querySelector("#label_input_right").innerHTML = e.key.toUpperCase()
        Configs.rebindKey("right", e)

    }
    if (pause.getAttribute("clicked") == "true") {
        pause.setAttribute("clicked", "false")
        pause.innerHTML = e.code.toUpperCase()
        document.querySelector("#label_input_pause").innerHTML = e.code.toUpperCase()
        Configs.rebindKey("pause", e)
    }
}

document.querySelector('#score span').innerHTML = (Player.size - 1) * 10

Scoreboard.showLeaderboard();
Configs.setup();
App.initGame();

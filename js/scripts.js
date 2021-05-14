const board = document.querySelector('body');
const field = document.querySelector('main')

let id = 0;
let timerId;
board.addEventListener("keydown", keyListener);
const App = {
    initGame() {
        Player.setY("0%");
        Player.setX("10%");

        Fruit.setY("0%");
        Fruit.setX("14%");
        startGameLoop();
    },
    pauseGame(interval) {
        clearInterval(interval);
    }
}

function startGameLoop() {
    timerId = setInterval(() => {
        playerMove()

    }, 150);
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
    dir: 0, //1 cima, 2 direita, 3 baixo, 4 esquerda, 0 not started
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
                    part.setAttribute("dir", Player.dir)
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
                    part.setAttribute("dir", Player.dir)
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


    if (Player.dir == 1) {
        let actualPosition = Number(Player.getY().replace("%", ""))
        //player.style.top = actualPosition - 2 < 0 ? player.style.top : `${actualPosition - 2}%`
        //if (actualPosition - 2 < 0) { ""/*perder jogo*/ } else {
        Player.setY(`${actualPosition - 2}%`);

        if (colidedWithFruit()) {
            increaseSize(actualPositionX, actualPositionY, Player.dir)
        }

    }


    if (Player.dir == 4) {
        let actualPosition = Number(Player.getX().replace("%", ""))
        //player.style.left = actualPosition - 2 < 0 ? player.style.left : `${actualPosition - 2}%`
        //if (actualPosition - 2 < 0) { ""/*perder jogo*/ } else {
        Player.setX(`${actualPosition - 2}%`)

        if (colidedWithFruit()) {
            increaseSize(actualPositionX, actualPositionY, Player.dir)
        }


    }


    if (Player.dir == 3) {
        let actualPosition = Number(Player.getY().replace("%", ""))
        //player.style.top = actualPosition + 2 > 98 ? player.style.top : `${actualPosition + 2}%`
        //if (actualPosition + 2 > 98) { ""/*perder jogo*/ } else {
        Player.setY(`${actualPosition + 2}%`)

        if (colidedWithFruit()) {
            increaseSize(actualPositionX, actualPositionY, Player.dir)
        }

    }

    if (Player.dir == 2) {
        let actualPosition = Number(Player.getX().replace("%", ""))
        //player.style.left = actualPosition + 2 > 98 ? player.style.left : `${actualPosition + 2}%`
        //if (actualPosition + 2 > 98) { ""/*perder jogo*/ } else {
        Player.setX(`${actualPosition + 2}%`)

        if (colidedWithFruit()) {
            increaseSize(actualPositionX, actualPositionY, Player.dir)
        }


    }

    if (isGameOver()) {
        //game over
        App.pauseGame(timerId);
        alert("fim de jogo")
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
            console.log('corpoa')
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

    if (e.code == "Escape") {
        App.pauseGame(timerId)
    }
    if (e.code == "KeyW") {

        // let actualPosition = Number(Player.getY().replace("%", ""))
        //player.style.top = actualPosition - 2 < 0 ? player.style.top : `${actualPosition - 2}%`
        //if (actualPosition - 2 < 0) { ""/*perder jogo*/ } else {
        //    Player.setY(`${actualPosition - 2}%`);

        if (Player.dir != 3) {
            Player.dir = 1;
        }


        /*
        if (colidedWithFruit()) {
            increaseSize(actualPositionX, actualPositionY, Player.dir)
        }
        playerMove();
        */


        //}

    }
    if (e.code == "KeyA") {
        // let actualPosition = Number(Player.getX().replace("%", ""))
        //player.style.left = actualPosition - 2 < 0 ? player.style.left : `${actualPosition - 2}%`
        // if (actualPosition - 2 < 0) { ""/*perder jogo*/ } else {
        //     Player.setX(`${actualPosition - 2}%`)
        if (Player.dir != 2) {
            Player.dir = 4;
        }

        //     if (colidedWithFruit()) {
        //         increaseSize(actualPositionX, actualPositionY, Player.dir)
        //     }
        //    playerMove();

        //}
    }

    if (e.code == "KeyS") {
        //  let actualPosition = Number(Player.getY().replace("%", ""))
        //player.style.top = actualPosition + 2 > 98 ? player.style.top : `${actualPosition + 2}%`
        //  if (actualPosition + 2 > 98) { ""/*perder jogo*/ } else {
        //    Player.setY(`${actualPosition + 2}%`)
        if (Player.dir != 1) {
            Player.dir = 3;
        }
        //    if (colidedWithFruit()) {
        //        increaseSize(actualPositionX, actualPositionY, Player.dir)
        //    }
        //    playerMove();
        //  }
    }
    if (e.code == "KeyD") {
        //let actualPosition = Number(Player.getX().replace("%", ""))
        //player.style.left = actualPosition + 2 > 98 ? player.style.left : `${actualPosition + 2}%`
        //if (actualPosition + 2 > 98) { ""/*perder jogo*/ } else {
        //    Player.setX(`${actualPosition + 2}%`)
        if (Player.dir != 4) {
            Player.dir = 2;
        }
        //   if (colidedWithFruit()) {
        //       increaseSize(actualPositionX, actualPositionY, Player.dir)
        //   }
        //  playerMove();

        //   }
    }
}

document.querySelector('#score span').innerHTML = (Player.size - 1) * 10


App.initGame();

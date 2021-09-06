let gameBoard;

window.onload = () => {
    let fieldContainer = document.getElementById("field-container");
    
    gameBoard = new Board_2048();
    gameBoard.Show(fieldContainer);
    gameBoard.AddRandom(Board_2048.INITIAL_TILES);
}


window.onkeydown = (e) => {
    if(gameBoard.IsOnAnimation()) return;
    let change = false;
    switch(e.code) {
        case "ArrowLeft":
            change = gameBoard.SlideAllToLeft();
            break;
        case "ArrowRight":
            change = gameBoard.SlideAllToRight();
            break;
        case "ArrowUp":
            change = gameBoard.SlideAllToUp();
            break;
            case "ArrowDown":
            change = gameBoard.SlideAllToDown();
            break;
        default:
            return;
    }
    if(change) gameBoard.AddRandom(1);
}
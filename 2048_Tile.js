class Tile_2048 {

    //----- STATIC FIELDS -----

    static NEWTILE_ANIMATION_KEYFRAME = [ 
        { opacity: 0, transform: "scale(0)"  },
        { opacity: 1, transform: "scale(1)" } 
    ];

    static NEWTILE_ANIMATION_KEYFRAME_PROPERTIES = {
        duration: 200,
        iterations: 1,
        delay: 100,
        fill: "backwards"
    }

    static MOVEMENTTILE_ANIMATION_KEYFRAME_PROPERTIES = {
        duration: 100,
        iterations: 1,
        fill: "backwards"
    } 

    static MERGEDTILE_ANIMATION_KEYFRAME = [ 
        { transform: "scale(1.2)"  },
        { transform: "scale(1)" } 
    ];

    static MERGEDTILE_ANIMATION_KEYFRAME_PROPERTIES = {
        duration: 200,
        iterations: 1
    }

    static PROBABILITY_FOUR_VALUE = 0.05;


    //----- CONSTRUCTOR -----

    constructor(value, row, column) {
        this._value = value;
        this._row = row;
        this._column = column;
        this.Initialize();
    }

    //----- METHODS -----

    static GetMovementKeyFrame(differenceRows, differenceCols, dimensionGrid) {
        return [
            { transform: "translate(0px, 0px)" },
            { transform: "translate(" + (differenceCols * dimensionGrid) + "px, " + (differenceRows * dimensionGrid) + "px)" }
        ]
    }

    Initialize() {
        this._tileDiv = document.createElement("div");

        this._tileDiv.className = "tile value-" + this._value;

        this._tileDiv.innerText = this._value;

        this._tileDiv.style.gridRow = (this._row + 1) + "/ span 1";
        this._tileDiv.style.gridColumn = (this._column + 1) + "/ span 1";
    }

    Slide(directionRow, directionColumn, gameBoard) {
        //this -> movementTile
        //tileToRemove = -> other

        let tileToRemove = null;

        let initialRow = this._row;
        let initialColumn = this._column;

        while(true) {
            let nextRow = this._row + directionRow;
            let nextColumn = this._column + directionColumn;
            if(Board_2048.IsOutOfRange(nextRow) || Board_2048.IsOutOfRange(nextColumn)) break;

            let nextTile = gameBoard._board[nextRow][nextColumn];
            if(nextTile != null && this._value != nextTile._value) break;

            if(nextTile != null && this._value == nextTile._value) {
                tileToRemove = nextTile;
            }

            gameBoard._board[this._row][this._column] = null;
        
            this._row = nextRow;
            this._column = nextColumn;
            
            gameBoard._board[this._row][this._column] = this;
        }

        let dimensionGrid = Board_2048.BOARD_DIMENSION / Board_2048.GRID_DIMENSION;
        let movementAnimation = this.AnimateMovement(initialRow, initialColumn, dimensionGrid);

        if(tileToRemove != null) {
            gameBoard.MergeTiles(this, tileToRemove, movementAnimation);
        }

        return (initialRow != this._row || initialColumn != this._column);
        

    }

    AnimateMovement(initialRow, initialColumn, dimensionGrid) {
        let differenceRows = this._row - initialRow;
        let differenceCols = this._column - initialColumn;
        
        let movementKeyFrame = Tile_2048.GetMovementKeyFrame(differenceRows, differenceCols, dimensionGrid);
        let movement = this._tileDiv.animate(movementKeyFrame, Tile_2048.MOVEMENTTILE_ANIMATION_KEYFRAME_PROPERTIES);
        
        movement.onfinish = () => {
            this._tileDiv.style.gridRow = (this._row + 1) + " / span 1";
            this._tileDiv.style.gridColumn = (this._column + 1) + " / span 1";
        }
        return movement;
    }

}
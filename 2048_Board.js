class Board_2048 {

    //----- STATIC FIELDS -----

    static GRID_DIMENSION = 4;

    static BOARD_DIMENSION = 500;

    static INITIAL_TILES = 2;

    //----- CONSTRUCTOR -----

    constructor() {
        this.Initialize();
    }

    //----- METHODS -----

    static IsOutOfRange(value) { return (value < 0) || (value >= Board_2048.GRID_DIMENSION); }

    Initialize() {
        this._board = [];
        this._score = 0;

        for(let row = 0; row < Board_2048.GRID_DIMENSION; row++) {

            this._board[row] = [];

            for(let column = 0; column < Board_2048.GRID_DIMENSION; column++) {

                this._board[row][column] = null;

            }

        }
    }

    Show(container) {
        this._boardDiv = document.createElement("div");

        this._boardDiv.className = "board-2048";

        container.appendChild(this._boardDiv);

        this._boardDiv.style.width = this._boardDiv.style.height = Board_2048.BOARD_DIMENSION + "px";

        this._boardDiv.style.gridTemplateRows = "repeat(" + Board_2048.GRID_DIMENSION + ", 1fr)";
        this._boardDiv.style.gridTemplateColumns = "repeat(" + Board_2048.GRID_DIMENSION + ", 1fr)";

        for(let row = 0; row < Board_2048.GRID_DIMENSION; row++) {

            for(let column = 0; column < Board_2048.GRID_DIMENSION; column++) {

                let backgroundTile = document.createElement("div");
                backgroundTile.className = "tile value-background";

                backgroundTile.style.gridRow = (row + 1) + "/ span 1";
                backgroundTile.style.gridColumn = (column + 1) + "/ span 1";

                this._boardDiv.appendChild(backgroundTile);

            }

        }
    }

    CreateRandomTile() {
        let spots = this.GetEmptySpots();
        if(spots.length == 0) return null;

        let rndValue = (Math.random() < Tile_2048.PROBABILITY_FOUR_VALUE) ? 4 : 2;
        let rndSpot = spots[Math.floor(Math.random() * spots.length)];
        return new Tile_2048(rndValue, rndSpot.Row, rndSpot.Column);
    }

    SpawnTile(tile) {
        this._board[tile._row][tile._column] = tile;
        this._boardDiv.appendChild(tile._tileDiv);

        tile._tileDiv.animate(Tile_2048.NEWTILE_ANIMATION_KEYFRAME, Tile_2048.NEWTILE_ANIMATION_KEYFRAME_PROPERTIES);
    }

    MergeTiles(tileOne, tileTwo, animation) {
        let mergedTile = new Tile_2048(tileTwo._value * 2, tileTwo._row, tileTwo._column);
        this._board[tileOne._row][tileOne._column] = mergedTile;
        this._score += mergedTile._value;


        animation.onfinish = () => {
            this._boardDiv.removeChild(tileOne._tileDiv);
            this._boardDiv.removeChild(tileTwo._tileDiv);

            this._boardDiv.appendChild(mergedTile._tileDiv);
            
            mergedTile._tileDiv.animate(Tile_2048.MERGEDTILE_ANIMATION_KEYFRAME, Tile_2048.MERGEDTILE_ANIMATION_KEYFRAME_PROPERTIES);
        }

    }

    AddRandom(n) {
        for(let i = 0; i < n; i++) {
            let rndTile = this.CreateRandomTile();
            if(rndTile) this.SpawnTile(rndTile);
        }
    }

    GetEmptySpots() {
        let spotList = [];
        for(let row = 0; row < Board_2048.GRID_DIMENSION; row++) {
            for(let col = 0; col < Board_2048.GRID_DIMENSION; col++) {
                if(this._board[row][col] == null) spotList.push({"Row": row, "Column": col});
            }
        }
        return spotList;
    }

    SlideAllToLeft() {
        const DIRECTION_ROW = 0;
        const DIRECTION_COL = -1;
        
        let changes = false;

        for(let col = 0; col < Board_2048.GRID_DIMENSION; col++) {
            for(let row = 0; row < Board_2048.GRID_DIMENSION; row++) {
                
                let t = this._board[row][col];
                if(t != null) {
                    let slideCtrl = t.Slide(DIRECTION_ROW, DIRECTION_COL, this);
                    changes =  changes || slideCtrl;
                }

            }
        }

        return changes;
    }
        
    SlideAllToRight() {
        const DIRECTION_ROW = 0;
        const DIRECTION_COL = +1;

        let changes = false;

        for(let col = Board_2048.GRID_DIMENSION - 1; col >= 0; col--) {
            for(let row = 0; row < Board_2048.GRID_DIMENSION; row++) {

                let t = this._board[row][col];
                if(t != null) {
                    let slideCtrl = t.Slide(DIRECTION_ROW, DIRECTION_COL, this);
                    changes =  changes || slideCtrl;
                }
            
            }

        }

        return changes;
        
    }
        
    SlideAllToUp() {
        const DIRECTION_ROW = -1;
        const DIRECTION_COL = 0;

        let changes = false;

        for(let row = 0; row < Board_2048.GRID_DIMENSION; row++) {
            for(let col = 0; col < Board_2048.GRID_DIMENSION; col++) {
                
                let t = this._board[row][col];
                if(t != null) {
                    let slideCtrl = t.Slide(DIRECTION_ROW, DIRECTION_COL, this);
                    changes =  changes || slideCtrl;
                }

            }
        }

        return changes;
    }
        
    SlideAllToDown() {
        const DIRECTION_ROW = +1;
        const DIRECTION_COL = 0;

        let changes = false;

        for(let row = Board_2048.GRID_DIMENSION - 1; row >= 0; row--) {
            for(let col = 0; col < Board_2048.GRID_DIMENSION; col++) {
        
                let t = this._board[row][col];
                if(t != null) changes = t.Slide(DIRECTION_ROW, DIRECTION_COL, this) || changes;
                        
            }
        }

        return changes;
    }

    Restart() {
        let parent = this._boardDiv.parentNode;
        this._boardDiv.remove();
        this.Initialize();
        this.Show(parent);
        this.AddRandom(INITIAL_TILES);
    }

    IsOnAnimation() {
        for(let row = 0; row < Board_2048.GRID_DIMENSION; row++) {
            for(let column = 0; column < Board_2048.GRID_DIMENSION; column++) {
                let t = this._board[row][column];
                if(t && t._tileDiv.getAnimations() != 0) return true;
            }
        }
        return false;
    }
}
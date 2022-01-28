function WindowGrid()
{  
    this.cells = [];
    this.columnRows = [3,3];
    this.cellSize = 0.25;
    this.gridDim = 43;
    this.spritesCounter = 0;
    this.enableGrid = 1;

    this.gridArray = new Array(this.gridDim);
    for (var i = 0; i < this.gridArray.length; i++) {
        this.gridArray[i] = new Array(this.gridDim);
    }

    this.gridVisualizer = new JitterObject("jit.gl.gridshape", gGlobal.worldName);
    this.gridVisualizer.poly_mode = [1,1];
    this.gridVisualizer.gridmode = 0;
    this.gridVisualizer.color = [1,0,0,1];
    this.gridVisualizer.dim = [this.gridDim, this.gridDim];
    this.gridVisualizer.scale = this.cellSize * (this.gridDim-1) * 0.5;
    this.gridVisualizer.shape = "plane";
    this.gridVisualizer.depth_enable = 0;
    this.gridVisualizer.layer = -1;

    this.ShowGrid = function(val)
    {
        this.gridVisualizer.enable = val;
        this.enableGrid = val;
    }

    this.PlaceSprite = function(mouse, button)
    {   
        print("button ", button)
        if (button)
        {
            print("Sprite selected "+gPathImgSelected)

            if (this.enableGrid) 
            {    
                var integerCoords = [Math.floor(mouse[0]*(1/this.cellSize)), Math.floor((mouse[1])*(1/this.cellSize))];
                var coords = [(integerCoords[0] / (1/this.cellSize))+this.cellSize*0.5,
                              (integerCoords[1] / (1/this.cellSize))+this.cellSize*0.5]; 

                integerCoords[0] += Math.floor(this.gridDim/2);
                integerCoords[1] += Math.floor(this.gridDim/2);

                print("integer coords "+integerCoords)
                if (this.gridArray[integerCoords[0]][integerCoords[1]] != null)
                {   
                    this.gridArray[integerCoords[0]][integerCoords[1]].Destroy();
                    this.gridArray[integerCoords[0]][integerCoords[1]] = null;
                    this.spritesCounter--;
                }
                if (!max.shiftkeydown && gPathImgSelected != null)
                {
                    this.gridArray[integerCoords[0]][integerCoords[1]] = this.CreateSprite(coords);
                    this.gridArray[integerCoords[0]][integerCoords[1]].LoadImage(gPathImgSelected);
                    this.spritesCounter++;    
                }
            }
        }
        print("how many sprites "+this.spritesCounter);
    }

    this.CreateSprite = function(coords)
    {   
        var sprite = 
        {
            gridShape: new JitterObject("jit.gl.videoplane", gGlobal.worldName),
            texture: new JitterObject("jit.gl.texture", gGlobal.worldName),

            LoadImage: function(imagePath)
            {
                this.texture.read(imagePath);
                this.gridShape.texture = this.texture.name;
            },
            Destroy: function()
            {
                this.gridShape.freepeer();
                this.texture.freepeer();
            }
        }

        sprite.gridShape.scale = this.cellSize/2;
        sprite.gridShape.position = [coords[0], coords[1], 0];
        sprite.gridShape.interp = 0;
        sprite.gridShape.dim = [2,2];
        sprite.gridShape.color = [1,1,1,1];
        sprite.gridShape.preserve_aspect = 0;
        sprite.texture.filter = "none";
        return sprite;
    }

    this.ClearSprites = function()
    {
        for (var x in this.gridArray)
        {   
            for (var y in this.gridArray[x])
            {   
                if (this.gridArray[x][y] != null)
                {
                    this.gridArray[x][y].Destroy();
                    this.gridArray[x][y] = null;
                }
            }
        }
        this.spritesCounter = 0;
    }

    this.Destroy = function()
    {   
        print("Cleaning Grid");
        this.ClearSprites();
        this.gridVisualizer.freepeer();
    }
}

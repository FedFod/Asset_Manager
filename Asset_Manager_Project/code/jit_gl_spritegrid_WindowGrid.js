function WindowGrid()
{  
    this.cells = [];
    this.columnRows = [3,3];

    this.FillCellsArray = function()
    {   
        for (var i=0; i<this.columnRows[0]; i++)
        {
            for (var j=0; j<this.columnRows[1]; j++)
            {
                var sprite = 
                {
                    gridShape: new JitterObject("jit.gl.gridshape", gGlobal.worldName),
                    texture: new JitterObject("jit.gl.texture", gGlobal.worldName)
                }

                this.InitSprite(sprite, [i,j]);
                this.cells.push(sprite);
            }
        }
    }

    this.CheckIfCellClicked = function(mouse, button)
    {   
        print("button ", button)
        if (button)
        {
            for (var cell in this.cells)
            {   
                var cellC = this.cells[cell].gridShape.position;
                var cellSc = this.cells[cell].gridShape.scale;
                var isInside = (mouse[0]>(cellC[0]-cellSc[0]) && mouse[0]<(cellC[0]+cellSc[0]) 
                                && mouse[1]>(cellC[1]-cellSc[1]) && mouse[1]<(cellC[1]+cellSc[1]));

                print(gPathImgSelected)
                if (isInside && gPathImgSelected != null) 
                {      
                    var gridShape = this.cells[cell].gridShape;
                    var texture = this.cells[cell].texture;

                    // if (gridShape.isClicked)
                    // {
                    //     gridShape.isClicked = 0;
                    //     gridShape.poly_mode = [1,1];
                    //     gridShape.color = [1, 0, 0, 1];
                    // }
                    // else 
                    // {
                    gridShape.poly_mode = [0,0];
                    gridShape.color = [1, 1, 1, 1];
                    gridShape.isClicked = 1;
                    texture.read(gPathImgSelected);
                    print(gPathImgSelected)
                    gridShape.texture = texture.name;
                    // }
                    break;
                } 
            }
        }
    }

    this.InitSprite = function(sprite, coords)
    {   
        sprite.gridShape.scale = [1/this.columnRows[0], 1/this.columnRows[1], 1];
        var xCoord = ((coords[0] / this.columnRows[0]) * 2 -1) + sprite.gridShape.scale[0];
        var yCoord = ((coords[1] / this.columnRows[1]) * 2 -1) + sprite.gridShape.scale[1];
        sprite.gridShape.position = [xCoord, yCoord, 0];
        sprite.gridShape.gridmode = 0;
        sprite.gridShape.shape = "plane";
        sprite.gridShape.poly_mode = [1,1];
        sprite.gridShape.dim = [2,2];
        sprite.gridShape.color = [1,0,0,1];
    }

    this.Destroy = function()
    {   
        print("Cleaning Grid");
        for (var cell in this.cells)
        {
            this.cells[cell].gridShape.freepeer();
            this.cells[cell].texture.freepeer();
        }
    }
}

function callfun(event)
{
    if (event.eventname == "mouse")
    {
        print(event.args);
    }
    print("callback "+event.args);
}
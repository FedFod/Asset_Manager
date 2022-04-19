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

    // this.node = new JitterObject("jit.gl.node", gWorldGrabber.GetWorldName());
    // // this.node.fsaa = 1;
    // this.node.capture = 1;
    // this.node.erase_color = [0,0,0,0];
    // FF_Utils.Print("node name "+this.node.name)

    this.node = {};
    this.node.name = gWorldGrabber.GetWorldName();

    // this.camera = new JitterObject("jit.gl.camera");
    // this.camera.drawto = this.node.name;
    // this.camera.ortho = 1;
    // this.camera.lens_angle = 60;

    // this.vp = new JitterObject("jit.gl.videoplane", gWorldGrabber.GetWorldName());
    // this.vp.transform_reset = 2;
    // this.vp.texture = this.node.out_name;
    // this.vp.blend_enable = 1;
    // this.vp.depth_enable = 0;
    // this.vp.layer = 0;
    // this.vp.interp = 0;

    this.sketch = new JitterObject("jit.gl.sketch", this.node.name);

    this.gridVisualizer = new JitterObject("jit.gl.gridshape", this.node.name);
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

    this.PlaceGLSprite = function(windowMouse, button)
    {   
        // FF_Utils.Print("button ", button)
        if (button && this.enableGrid)
        {   
            var spriteSelected = gMaxSpritesGrid.GetSpriteSelectedImgPath();
            var mouse = this.GetMouseWorldPosition(windowMouse);
            FF_Utils.Print("Sprite selected "+spriteSelected)

            var int_x_coord = Math.floor(mouse[0]*(1/this.cellSize));
            var int_y_coord = Math.floor((mouse[1])*(1/this.cellSize));
            var coords = [(int_x_coord / (1/this.cellSize))+this.cellSize*0.5,
                          (int_y_coord / (1/this.cellSize))+this.cellSize*0.5]; 

            int_x_coord += Math.floor(this.gridDim/2);
            int_y_coord += Math.floor(this.gridDim/2);

            if (this.gridArray[int_x_coord][int_y_coord] != null &&
                this.gridArray[int_x_coord][int_y_coord] != 'undefined')
            {   
                this.gridArray[int_x_coord][int_y_coord].Destroy();
                this.gridArray[int_x_coord][int_y_coord] = null;
                this.spritesCounter--;
            }
            if (!max.shiftkeydown && spriteSelected != null)
            {
                this.gridArray[int_x_coord][int_y_coord] = this.CreateGLSprite(coords);
                this.gridArray[int_x_coord][int_y_coord].LoadImage(spriteSelected);
                this.spritesCounter++;    
            }
            FF_Utils.Print("how many sprites "+this.spritesCounter);
        }
    }

    this.CreateGLSprite = function(coords)
    {   
        var sprite =    
        {
            gridShape: new JitterObject("jit.gl.videoplane", this.node.name),
            texture: new JitterObject("jit.gl.texture", this.node.name),
            body: new JitterObject("jit.phys.body"),

            LoadImage: function(imagePath)
            {
                this.texture.read(imagePath);
                this.gridShape.texture = this.texture.name;
            },
            Destroy: function()
            {
                this.gridShape.freepeer();
                this.texture.freepeer();
                this.body.freepeer();
            }
        }

        sprite.gridShape.scale = this.cellSize/2;
        sprite.gridShape.position = [coords[0], coords[1], 0];
        sprite.gridShape.interp = 0;
        sprite.gridShape.dim = [2,2];
        sprite.gridShape.color = [1,1,1,1];
        sprite.gridShape.preserve_aspect = 0;
        sprite.gridShape.blend_enable = 1;
        
        sprite.texture.filter = "none";

        sprite.body.position = sprite.gridShape.position.slice();
        sprite.body.shape = "cube";
        sprite.body.worldname = gCollisions.GetPhysName();
        sprite.body.scale = sprite.gridShape.scale.slice();
        sprite.body.kinematic = 1;
        FF_Utils.Print("physname "+sprite.body.worldname)

        return sprite;
    }

    this.Zoom = function(val)
    {
        this.camera.lens_angle = val+60;
    }

    this.GetMouseWorldPosition = function(mouse)
    {
        return (this.sketch.screentoworld(mouse));
    }


    this.ClearGLSprites = function()
    {   
        FF_Utils.Print("Cleaning GL sprites")
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
        FF_Utils.Print("Cleaning Grid");
        this.ClearGLSprites();
        this.gridVisualizer.freepeer();
        this.sketch.freepeer();

        // this.node.freepeer();
        // this.vp.freepeer();
        // this.camera.freepeer();
    }
}

function Sprite(patcher, filePath)
{
    this.p = patcher;
    this.vp = null;
    this.texture = null;
    this.matrix = new JitterMatrix();

    this.CreateSprite = function(filePath)
    {
        this.vp = this.p.newdefault(700,500, "jit.gl.texture");
        this.texture = this.p.newdefault(700,520,"jit.gl.videoplane");
        this.matrix.importmovie(filePath);
        this.texture.jit_matrix(this.matrix.name);
        this.p.connect(this.vp, 0, this.texture, 0);
        this.texture.bang();
    }

    this.CreateSprite(filePath);

    this.Destroy = function()
    {
        this.vp.freepeer();
        this.texture.freepeer();
        this.matrix.freepeer();
    }
}

function ObjectAllocator(patcher)
{
    this.p = patcher;
    this.GridPatcherPosition = [];

    this.AllocateObject = function(pos, type, filePath)
    {   
        if (gGlobal.spriteGridExists)
        {   
            print("SpriteGrid exists")
            this.GridPatcherRect = gGlobal.GetGridBPatcherRect();
            print("pos "+pos, "rect "+this.GridPatcherRect)
            if (gCommon.CheckIfInside(pos, this.GridPatcherRect))
            {   
                switch (type) 
                {
                    case "image":
                        this.AllocateSprite(filePath);
                        break;
                    case "sound":

                        break;
                    default:
                        break;
                }
            }
        }
    }

    this.AllocateSprite = function(filePath)
    {   
        gGlobal.isNewSprite = 1;
        gGlobal.spritePaths.push(filePath);
    }
}
function MaxSpritesGrid(gP, gPP)
{
    this.spriteObjects = [];
    this.p = gP;
    this.pp = gPP;
    this.spriteSize = [50, 50];

    this.folder = null;
    this.filePaths = [];
    this.imgFilePaths = [];
    this.folderPath = null;
    this.titleSize = 25;
    this.textHeight = 20;
    this.yOffset = 5;
    this.xOffset = 10;
    this.yOffsetFromTitle = 10;

    this.spriteSelectedID = -1;
    this.spriteSelectedImagePath = null;

    this.chooser = new Chooser(gP);

    this.moviePlayer = null;

    this.CreateTitleBar = function()
    {   
        this.titlePanel = this.pp.newdefault(0,0, "panel");
        this.titlePanel.varname="spritegrid_titlePanel";
        this.titlePanel.rounded(0);
        this.pp.script("sendbox", this.titlePanel.varname, "patching_rect", [0,0, 1000, 20]);

        this.title = this.pp.newdefault(10, 0, "comment");
        this.title.varname = "spritegrid_title";
        this.pp.script("sendbox", this.title.varname, "patching_rect", [10,0, 1000, 20]);
        this.title.textcolor(1,1,1,1);
        this.pp.script("bringtofront", this.title.varname);
    }

    this.ResizeTitleBar = function(xSize)
    {
        this.pp.script("sendbox", this.titlePanel.varname, "patching_rect", [0,0, xSize+10, 20]); 
    }

    this.CreateTitleBar();

    this.SetSpriteSelected = function(ID)
    {   
        for (var sprite in this.spriteObjects)
        {
            this.spriteObjects[sprite].Highlight(false);
        }
        this.spriteSelectedID = ID;
        var selSpr = this.spriteObjects[ID];
        selSpr.Highlight(true);
        this.spriteSelectedImagePath = selSpr.GetImagePath(); // si può togliere?

        this.chooser.AssignToSprite(selSpr);

        selSpr.PlayMovie();

        this.title.set("\""+this.spriteSelectedImagePath+"\""+ "    " + selSpr.GetFileDim()[0] + " x "+selSpr.GetFileDim()[1]);
    }

    this.GetSpriteSelectedImgPath = function()
    {
        return this.spriteSelectedImagePath;
    }

    this.LoadFolder = function(path)
    {   
        FF_Utils.Print("called LoadFolder")

        this.DestroySprites();

        this.folderPath = path;
        this.filePaths = [];
        this.folder = new Folder(path);
        this.folder.typelist = [];

        // this.chooser.LoadFolder(path);
        
        while (!this.folder.end)
        {   
            FF_Utils.Print(this.folder.filename)
            if (this.folder.filename.length > 0)
            {
                this.filePaths.push(path+this.folder.filename);
            }
            this.folder.next();
        }
    }

    this.SortFolder = function()
    {   
        FF_Utils.Print("called SortFolder")

        this.imgFilePaths = [];
        // FF_Utils.Print("length file paths "+this.filePaths.length)

        for (var file in this.filePaths)
        {   
            this.imgFilePaths.push(this.filePaths[file]);
        }
    }

    this.CreatePatcherSprites = function()
    {   
        // this.DestroySprites();

        for (var i=0; i<this.imgFilePaths.length; i++)
        {
            var path = this.imgFilePaths[i];
            this.spriteObjects.push(new Sprite(i, this.p, path, this.spriteSize, this.textHeight));
        }
    }

    this.CalcSpritePosition = function(index, currPos)
    {
        var BPWidth  = gBPSize[0];
        var spriteWidth = this.spriteObjects[index].GetWidth();
        var newPos = currPos; // reference array
  
        if ((newPos[0]+spriteWidth+this.xOffset) > BPWidth)   
        {   
            newPos[0] = this.xOffset;
            newPos[1] += this.spriteSize[1]+this.yOffset+this.textHeight+4;
        }
        this.spriteObjects[index].SetPosition(newPos);
        newPos[0] += spriteWidth+this.xOffset;
    }

    this.RepositionSprites = function()
    {   
        FF_Utils.Print("reposition sprites")
        var newPos = [this.xOffset, this.yOffsetFromTitle];
        for (var sprite in this.spriteObjects)
        {   
            this.CalcSpritePosition(sprite, newPos);
        }   
    }

    this.DestroySprites = function()
    {
        for (var obj in this.spriteObjects)
        {
            (this.spriteObjects[obj].Destroy());
        }
        this.spriteObjects = [];
        this.imgFilePaths = [];
    }

    this.Destroy = function()
    {   
        FF_Utils.Print("Cleaning: Max Sprite Grid")
        this.DestroySprites();
        this.chooser.Destroy();
        this.p.remove(this.title);
    }
}


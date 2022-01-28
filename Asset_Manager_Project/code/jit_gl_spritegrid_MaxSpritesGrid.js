function MaxSpritesGrid(gP)
{
    this.spriteObjects = [];
    this.p = gP;
    this.latestPos = [0, 25];
    this.BPatcherSize = [88, 50];

    this.folder = null;
    this.filePaths = [];
    this.folderPath = null;

    this.LoadFolder = function(path)
    {   
        print("called LoadFolder")
        this.folderPath = path;
        this.filePaths = [];
        this.folder = new Folder(path);
        this.folder.typelist = [];
        
        while (!this.folder.end)
        {
            if (this.folder.filename.length > 0)
            {
                this.filePaths.push(path+this.folder.filename);
            }
            this.folder.next();
        }
    }

    this.SortFolder = function()
    {   
        print("called SortFolder")

        this.Destroy();

        for (var file in this.filePaths)
        {   
            var filePath = this.filePaths[file]
            var extension = filePath.split('.').pop();
            for (var type in gCommon.FileTypes)
            {   
                var fileType = gCommon.FileTypes[type];
                for (var index in fileType)
                {   
                    var ext = fileType[index];
                    if (extension == ext)
                    {
                        switch (type) 
                        {
                            case "image":
                                this.AddSprite(this.filePaths[file]);
                                break;
                            // case "sound":
                            //     this.filesArray.push(new Image("SpeakerIcon.png"));
                            //     this.filesArray[this.filesArray.length-1].scale([60,60]);
                            //     this.filesArray[this.filesArray.length-1].filePath = filePath;
                            //     this.filesArray[this.filesArray.length-1].type = "sound";
                            //     break;
                            default:
                                print("no type found");
                        }
                        break;
                    }
                }
            }
        }
    }

    this.AddSprite = function(imgPath)
    {   
        this.CalcNewPos();
        this.spriteObjects.push(new Sprite(this.p, imgPath, this.latestPos, this.BPatcherSize));
    }

    this.CalcNewPos = function()
    {   
        var BPHeight = this.p.box.rect[3] - this.p.box.rect[1];
        var BPWidth  = this.p.box.rect[2] - this.p.box.rect[0];
        var rows = Math.floor(BPHeight / (this.BPatcherSize[1]+5));
        var columns = Math.floor(BPWidth / (this.BPatcherSize[0]+5));
        print("rows columns "+rows, columns)

        this.latestPos[0] = ((this.spriteObjects.length) % columns) * (this.BPatcherSize[0]+5);
        this.latestPos[1] = Math.floor((this.spriteObjects.length) / columns) * (this.BPatcherSize[1]+5)+25;
        print("latest pos "+this.latestPos)

    }

    this.Destroy = function()
    {
        for (var obj in this.spriteObjects)
        {
            (this.spriteObjects[obj].Destroy());
        }
        this.spriteObjects = [];
        this.latestPos = [0, 25];
    }
}
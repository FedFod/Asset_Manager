function FolderManager()
{   
    this.folder = null;
    this.filePaths = [];
    this.imageFiles = [];
    this.audioFiles = [];
    this.filesArray = [];

    this.imageSize = [70, 50];
    this.elementsOffset = [20,25];
    this.offsetFromEdge = [10,10];

    this.mg = new MGraphics(gJSUISize[0], gJSUISize[1]);
    this.mg.relative_coords = 0;
    this.mg.autofill = 0;

    this.offScreenBuffer = null;
    this.selectedFile = {};
    this.bgImage = new Image("imageBG.png");
    this.bgImage.scale(this.imageSize);

    this.folderSize = [0,0];
    this.nameTextSize = [0,0];
    this.scrollBarOffset = 0;

    this.columnsRows = [1,1];

    this.LoadFolder = function(path)
    {   
        print("called LoadFolder")
        this.filePaths = [];
        this.folder = new Folder(path);
        this.folder.typelist = [];
        
        while (!this.folder.end)
        {
            if (this.folder.filename.length > 0)
            {
                this.filePaths.push(path+this.folder.filename);
                // print(this.filePaths[this.filePaths.length-1]);
            }
            this.folder.next();
        }
    }

    this.SortFolder = function()
    {   
        print("called SortFolder")

        this.DestroyFiles();

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
                                this.filesArray.push(new Image(this.filePaths[file]));
                                this.filesArray[this.filesArray.length-1].scale(this.imageSize);
                                this.filesArray[this.filesArray.length-1].filePath = filePath;
                                this.filesArray[this.filesArray.length-1].type = "image";
                                break;
                            case "sound":
                                this.filesArray.push(new Image("SpeakerIcon.png"));
                                this.filesArray[this.filesArray.length-1].scale([60,60]);
                                this.filesArray[this.filesArray.length-1].filePath = filePath;
                                this.filesArray[this.filesArray.length-1].type = "sound";
                                break;
                            default:
                                print("no type found");
                        }
                        break;
                    }
                }
            }
        }
    }

    this.DisplayFolder = function()
    {   
        print("called DisplayFolder")
        print("how many files "+this.filesArray.length)

        this.InitMG();
        this.FreeOffScreenBuffer();

        this.CalcColumnRows();

        for (var i=0; i<this.filesArray.length; i++)
        {   
            var xPos = (i%this.columnsRows[0])*(this.imageSize[0]+this.elementsOffset[0])+this.offsetFromEdge[0];
            var yPos = Math.floor(i/this.columnsRows[0])*(this.imageSize[1]+this.elementsOffset[1])+gContainer.GetTopBorderHeight()+this.offsetFromEdge[1];

            var file = this.filesArray[i];

            this.mg.identity_matrix();
            this.mg.translate(xPos, yPos-this.scrollBarOffset);
            this.DrawBGImage(file);
            this.DrawFileName(file);
            this.mg.image_surface_draw(file);
            file.imgRect = [xPos, yPos-this.scrollBarOffset, this.imageSize[0], this.imageSize[1]];
        }
        this.offScreenBuffer = new Image(this.mg);
    }

    this.CalcColumnRows = function()
    {
        this.columnsRows[0] = Math.floor(gJSUISize[0] / (this.imageSize[0]+this.elementsOffset[0]));
        this.columnsRows[0] = Math.max(0, this.columnsRows[0]);

        this.columnsRows[1] = Math.ceil(this.filesArray.length / this.columnsRows[0]);
        print(this.columnsRows);
    }

    this.CalcFolderSize = function()
    {
        this.folderSize = [this.columnsRows[0]*(this.imageSize[0]+this.elementsOffset[0])+this.offsetFromEdge[0],
                          this.columnsRows[1]*(this.imageSize[1]+this.elementsOffset[1])+gContainer.GetTopBorderHeight()+this.offsetFromEdge[1]];
    }

    this.DrawFileName = function(file)
    {   
        this.mg.set_font_size(11);
        this.mg.select_font_face("Arial");
        this.mg.set_source_rgba([1,1,1,1]);
        var string = file.filePath.replace(/^.*[\\\/]/, '');
        this.nameTextSize = this.mg.text_measure(string);
        if (this.nameTextSize[0] > this.imageSize[0])
        {
            var numOfChars = Math.floor(this.imageSize[0]/5.6);
            string = string.slice(0, numOfChars-3);
            string+="...";
        }
        this.mg.move_to(0, this.imageSize[1]+this.nameTextSize[1]);
        this.mg.text_path(string);
        this.mg.fill();
    }

    this.DrawBGImage = function(obj)
    {
        if (obj.type == "image")
        {
            this.mg.image_surface_draw(this.bgImage);
        } 
    }

    this.DrawOffScreenBuffer = function(mg)
    {   
        if (this.offScreenBuffer != null)
        {
            mg.image_surface_draw(this.offScreenBuffer);
        }
    }

    this.DrawSelectedHighlight = function(mainMG)
    {
        mainMG.set_source_rgba(0.14, 0.362069, 0.6, 1.);
        mainMG.rectangle_rounded(this.selectedFile.rect[0], this.selectedFile.rect[1]+this.imageSize[1], this.imageSize[0], 15, 10, 10);
        mainMG.fill();
        // this.offScreenBuffer = new Image(this.mg);
    }

    this.SetScrollBarOffset = function(offset)
    {
        this.scrollBarOffset = offset;
    }

    this.CheckIfClicked = function(mousePos)
    {   
        var isClicked = false;
        for (var i=0; i<this.filesArray.length; i++)
        {
            var imgRect = this.filesArray[i].imgRect;
            if (gCommon.CheckIfInside(mousePos, imgRect))
            {
                // print(this.filesArray[i].filePath)
                this.selectedFile.filePath = this.filesArray[i].filePath;
                this.selectedFile.type = this.filesArray[i].type;
                this.selectedFile.rect = imgRect;
                isClicked = true;
                break;
            }
        }
        if (!isClicked)
        {
            this.ResetClicked();
        }
    }

    this.ResetClicked = function()
    {
        this.selectedFile.filePath = null;
        this.selectedFile.type = null;
        this.selectedFile.rect = null;
    }

    this.GetFolderSize = function()
    {
        return this.folderSize;
    }

    this.DestroyFiles = function()
    {   
        print("Called DestroyFiles");

        for (var image in this.filesArray)
        {
            this.filesArray[image].freepeer();
        }
        this.filesArray = [];
    }

    this.FreeOffScreenBuffer = function()
    {   
        if (this.offScreenBuffer != null)
        {   
            this.offScreenBuffer.freepeer();
            this.offScreenBuffer = null;
        }
    }

    this.InitMG = function()
    {
        if (this.mg != null)
        {
            this.mg.freepeer();
        }  
        this.mg = new MGraphics(gJSUISize[0], gJSUISize[1]);
        this.mg.relative_coords = 0;
        this.mg.autofill = 0;
    }

    this.Destroy = function()
    {
        this.DestroyFiles();
        this.FreeOffScreenBuffer();
        this.ResetClicked();
        print("Everything freed");
    }
}

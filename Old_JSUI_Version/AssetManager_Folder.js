function FolderManager()
{   
    this.folder = null;
    this.filePaths = [];
    this.folderPath = null;
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
        FF_Utils.Print("called LoadFolder")
        this.folderPath = path;
        this.filePaths = [];
        this.folder = new Folder(path);
        this.folder.typelist = [];
        
        while (!this.folder.end)
        {
            if (this.folder.filename.length > 0)
            {
                this.filePaths.push(path+this.folder.filename);
                // FF_Utils.Print(this.filePaths[this.filePaths.length-1]);
            }
            this.folder.next();
        }

        gChooser.LoadFolder(path);
    }

    this.SortFolder = function()
    {   
        FF_Utils.Print("called SortFolder")

        this.DestroyImages();

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
                                FF_Utils.Print("no type found");
                        }
                        break;
                    }
                }
            }
        }
    }

    this.DisplayFolder = function()
    {   
        FF_Utils.Print("called DisplayFolder")
        FF_Utils.Print("how many files "+this.filesArray.length)

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
            // this.DrawFileName(file);
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
        FF_Utils.Print("Asset manager columns and rows: "+this.columnsRows);
    }

    this.CalcFolderSize = function()
    {   
        this.CalcColumnRows();

        this.folderSize = [this.columnsRows[0]*(this.imageSize[0]+this.elementsOffset[0])+this.offsetFromEdge[0],
                          this.columnsRows[1]*(this.imageSize[1]+this.elementsOffset[1])+gContainer.GetTopBorderHeight()+this.offsetFromEdge[1]];
    }

    this.DrawFileNames = function(mainMG)
    {      
        mainMG.identity_matrix();
        for (var i=0; i<this.filesArray.length; i++)
        {
            var file = this.filesArray[i];
            mainMG.set_font_size(13);
            mainMG.select_font_face("Arial");
            mainMG.set_source_rgba([1,1,1,1]);
            var string = this.GetFileNameFromPath(file.filePath);
            this.nameTextSize = this.mg.text_measure(string);
            if (this.nameTextSize[0] > this.imageSize[0])
            {
                var numOfChars = Math.floor(this.imageSize[0]/5.6);
                string = string.slice(0, numOfChars-3);
                string+="...";
            }
            mainMG.move_to(file.imgRect[0], file.imgRect[1]+this.imageSize[1]+this.nameTextSize[1]);
            mainMG.text_path(string);
            mainMG.fill();
        }
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
            // mg.identity_matrix();
            // mg.translate(0, gContainer.GetTopBorderHeight());
            mg.image_surface_draw(this.offScreenBuffer);
        }
    }

    this.DrawSelectedHighlight = function(mainMG)
    {   
        mainMG.identity_matrix();
        mainMG.set_source_rgba(0.14, 0.362069, 0.6, 1.);
        mainMG.rectangle_rounded(this.selectedFile.rect[0], this.selectedFile.rect[1]+this.imageSize[1]+2.5, this.imageSize[0], 15, 10, 10);
        mainMG.fill();
    }

    this.SetScrollBarOffset = function(offset)
    {
        this.scrollBarOffset = offset;
    }

    this.GetFileNameFromPath = function(path)
    {
        return path.replace(/^.*[\\\/]/, '');
    }

    this.CheckIfClicked = function(mousePos)
    {   
        var isClicked = false;
        for (var i=0; i<this.filesArray.length; i++)
        {
            var imgRect = this.filesArray[i].imgRect.slice();
            var testRect =imgRect.slice();
            testRect[3] += this.nameTextSize[1];
            if (gCommon.CheckIfInside(mousePos, testRect))
            {
                this.selectedFile.filePath = this.filesArray[i].filePath;
                this.selectedFile.type = this.filesArray[i].type;
                this.selectedFile.rect = imgRect;
                isClicked = true;
                gChooser.SetChooserPosition(imgRect, this.imageSize);
                gChooser.SetChooserFile(this.GetFileNameFromPath(this.filesArray[i].filePath));
                break;
            }
        }
        if (!isClicked)
        {
            this.ResetClicked();
            gChooser.DeselectItem();
        }
    }

    this.ResetClicked = function()
    {
        this.selectedFile.filePath = null;
        this.selectedFile.type = null;
        this.selectedFile.rect = null;
    }

    this.GetFolderPath = function()
    {
        return this.folderPath;
    }

    this.GetFolderSize = function()
    {
        return this.folderSize;
    }

    this.DestroyImages = function()
    {   
        FF_Utils.Print("Called DestroyFiles");

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
        this.DestroyImages();
        this.FreeOffScreenBuffer();
        this.ResetClicked();
        FF_Utils.Print("Everything freed");
    }
}

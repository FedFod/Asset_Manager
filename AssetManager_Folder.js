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
    this.mg = null;
    this.offScreenBuffer = null;
    this.selectedFile = {};
    this.bgImage = new Image("imageBG.png");
    this.bgImage.scale(this.imageSize);

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
        print("how many files "+this.filesArray.length)

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

        var columns = Math.floor(gJSUISize[0] / (this.imageSize[0]+this.elementsOffset[0]));
        print("columns "+columns)
        for (var i=0; i<this.filesArray.length; i++)
        {   
            var xPos = (i%columns)*(this.imageSize[0]+this.elementsOffset[0])+this.offsetFromEdge[0];
            var yPos = Math.floor(i/columns)*(this.imageSize[1]+this.elementsOffset[1])+gContainer.GetTopBorder()+this.offsetFromEdge[1];
            
            var file = this.filesArray[i];

            this.mg.identity_matrix();
            this.mg.translate(xPos, yPos);
            this.DrawBGImage(file);
            this.DrawFileName(file);
            this.mg.image_surface_draw(file);
            file.imgRect = [xPos, yPos, xPos+this.imageSize[0], yPos+this.imageSize[1]];
        }
        this.offScreenBuffer = new Image(this.mg);
    }

    this.DrawFileName = function(file)
    {   
        // this.mg.identity_matrix();
        this.mg.set_font_size(11);
        this.mg.select_font_face("Arial");
        this.mg.set_source_rgba([1,1,1,1]);
        var string = file.filePath.replace(/^.*[\\\/]/, '');
        var textMeasure = this.mg.text_measure(string);
        if (textMeasure[0] > this.imageSize[0])
        {
            
        }
        this.mg.move_to(0, this.imageSize[1]+textMeasure[1]);
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

    this.CheckIfClicked = function(mousePos)
    {
        for (var i=0; i<this.filesArray.length; i++)
        {
            var imgRect = this.filesArray[i].imgRect;
            if (gCommon.CheckIfInside(mousePos, imgRect))
            {
                print(this.filesArray[i].filePath)
                this.selectedFile.filePath = this.filesArray[i].filePath;
                this.selectedFile.type = this.filesArray[i].type;
                break;
            }
        }
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
        print("Everything freed");
    }
}

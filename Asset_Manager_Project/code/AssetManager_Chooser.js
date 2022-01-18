function Chooser(patcher)
{   
    this.p = patcher;
    this.chooser = this.p.getnamed("assetchooser");
    this.chooser.autopopulate(1);
    this.p.script("sendbox",this.chooser.varname,"bgcolor", [0,0,0,0]);
    this.p.script("sendbox",this.chooser.varname,"stripecolor", [0,0,0,0]);
    this.p.script("sendbox",this.chooser.varname,"textcolor", [0,0,0,0]);
    this.p.script("sendbox",this.chooser.varname,"useselectioncolor", 1);
    this.p.script("sendbox",this.chooser.varname,"selectioncolor", [0.2, 0.7, 1, 0.3]);

    this.Test = function()
    {   
        print(this.chooser.maxclass)
        // this.chooser.send("test111")
        this.chooser.message("test3");
    }

    this.LoadFolder = function(folderPath)
    {
        this.chooser.message("filekind");
        this.chooser.message("collection");
        this.chooser.message("prefix", folderPath);
    }

    this.SetChooserPosition = function(textPos, imageSize)
    {   
        if (this.chooser)
        {   
            this.p.script("sendbox",this.chooser.varname,"patching_rect", [textPos[0]+box.rect[0], textPos[1]+box.rect[1]+imageSize[1], imageSize[0]+15, 20]);
        }
    }

    this.SetChooserFile = function(fileName)
    {
        this.chooser.message(fileName);
    }

    this.DeselectItem = function()
    {
        this.chooser.deselect();
    }
}
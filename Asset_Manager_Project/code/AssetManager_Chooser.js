function Chooser(parentPatcher)
{   
    this.p = parentPatcher;
    this.spriteBorderSize = 2;

    this.chooser = this.p.getnamed("assetchooser");
    if (!this.chooser)
    {
        this.chooser = this.p.newdefault(0,0,"chooser");
        this.chooser.varname = "assetchooser";
    }
    if (this.chooser)
    {   
        FF_Utils.Print("IS CHOOSER")
        this.chooser.autopopulate(1);
        this.p.script("sendbox",this.chooser.varname,"bgcolor", [0,0,0,0]);
        this.p.script("sendbox",this.chooser.varname,"stripecolor", [0,0,0,0]);
        this.p.script("sendbox",this.chooser.varname,"textcolor", [0,0,0,0]);
        this.p.script("sendbox",this.chooser.varname,"useselectioncolor", 1);
        this.p.script("sendbox",this.chooser.varname,"selectioncolor", [0.0, 0.0, 0, 0.]);
        this.p.script("sendbox",this.chooser.varname,"ignoreclick", 0);
        this.chooser.fontsize(27);
        this.chooser.clear();
    }

    this.Test = function()
    {   
        FF_Utils.Print(this.chooser.maxclass)
        // this.chooser.send("test111")
        this.chooser.message("test3");
    }

    this.AssignToSprite = function(sprite)
    {
        var selectedImgPath = sprite.GetImagePath();
        this.SetChooserElement(selectedImgPath);
        this.SetChooserPosition(sprite.GetRect().slice(0, 2), sprite.GetRect().slice(2, 4));
    }

    this.SetChooserElement = function(element)
    {
        this.chooser.clear();
        this.chooser.append(element);
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
            this.p.script("sendbox",this.chooser.varname,"patching_rect", [textPos[0], textPos[1], imageSize[0]+this.spriteBorderSize, imageSize[1]+this.spriteBorderSize*2]);
            //this.p.script("bringtofront", this.chooser.varname);
            this.p.script("sendtoback", this.chooser.varname);
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

    this.Destroy = function()
    {
        FF_Utils.Print("Cleaning chooser");
        this.p.remove(this.chooser);
    }
}
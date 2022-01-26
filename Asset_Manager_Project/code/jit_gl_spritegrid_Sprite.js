function Sprite(patcher, yPos, imgPath)
{   
    this.p = patcher;

    this.spriteBP = this.p.newdefault(0, yPos, "bpatcher", "jit.gl.sprite.maxpat", "@args", ["drawto "+gGlobal.worldName, "",
                    "file_path "+imgPath]);

    this.spriteBP.varname = "Sprite_";

    this.receiver = this.spriteBP.subpatcher().getnamed("sprite_receiver");

    var rectangle = [0, yPos, 88, 50];
    this.p.script("sendbox", this.spriteBP.varname, "patching_rect", rectangle.slice());

    this.Destroy = function()
    {   
        print("Removing BP sprite");
        this.p.remove(this.spriteBP);
    }

}
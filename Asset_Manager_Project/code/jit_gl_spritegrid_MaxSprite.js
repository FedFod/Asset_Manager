function Sprite(patcher, imgPath, position, patcherSize)
{   
    this.p = patcher;
    this.BPatcherSize = patcherSize;

    this.spriteBP = this.p.newdefault(position[0], position[1], "bpatcher", "jit.gl.sprite.maxpat", "@args", ["drawto "+gGlobal.worldName, "",
                    "file_path "+imgPath]);

    this.spriteBP.varname = "Sprite_";

    this.receiver = this.spriteBP.subpatcher().getnamed("sprite_receiver");

    var rectangle = [position[0], position[1], this.BPatcherSize[0], this.BPatcherSize[1]];
    this.p.script("sendbox", this.spriteBP.varname, "patching_rect", rectangle.slice());

    this.Destroy = function()
    {   
        print("Removing BP sprite");
        this.p.remove(this.spriteBP);
    }

}
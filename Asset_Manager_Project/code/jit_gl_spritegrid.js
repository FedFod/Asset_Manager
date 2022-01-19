autowatch = 1;

var gP = this.patcher;
var gPP = this.patcher.parentpatcher;
var gCurrentYPos = 20;
var gSpriteObjects = [];

gGlobal = new Global("AssetManager");
gGlobal.spriteGridExists = 1;
gGlobal.spritePaths = [];

gGlobal.spriteGridBPObj = gPP.getnamed("jit_gl_spritegrid");

var tsk = new Task(CheckIfNewSprite, this);
tsk.interval = 200;
tsk.repeat();

// PUBLIC FUNCTIONS ---------------
function clear()
{
    for (var obj in gSpriteObjects)
    {
        gP.remove(gSpriteObjects[obj]);
    }
    gSpriteObjects = [];
    gCurrentYPos = 20;
}

// PRIVATE FUNCTIONS --------------
function CheckIfNewSprite()
{   
    // print(gGlobal.spritePaths.length);
    if (gGlobal.isNewSprite)
    {
        gSpriteObjects.push(gP.newdefault(0, gCurrentYPos, "bpatcher", "jit.gl.sprite.maxpat", "@args", ["drawto "+gGlobal.worldName, "",
                                         "file_path "+gGlobal.spritePaths[gGlobal.spritePaths.length-1]]));
        gSpriteObjects[gSpriteObjects.length-1].varname = "Sprite_";

        var rectangle = [0, gCurrentYPos, 88, 50];
        gP.script("sendbox", gSpriteObjects[gSpriteObjects.length-1].varname, "patching_rect", rectangle.slice());
        gCurrentYPos+=55;
        gGlobal.isNewSprite = 0;
    }
}
CheckIfNewSprite.local = 1;

gGlobal.GetGridBPatcherRect = function()
{   
    var rect = [gGlobal.spriteGridBPObj.rect[0],gGlobal.spriteGridBPObj.rect[1],
                gGlobal.spriteGridBPObj.rect[2] - gGlobal.spriteGridBPObj.rect[0],
                gGlobal.spriteGridBPObj.rect[3] - gGlobal.spriteGridBPObj.rect[1]];
    return rect.slice(); 
} 

function notifydeleted()
{
    gGlobal.spriteGridExists = 0;
}


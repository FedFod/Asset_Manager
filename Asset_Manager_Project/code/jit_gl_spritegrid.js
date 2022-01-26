autowatch = 1;

var gGlobal = new Global("AssetManager");

include("jit_gl_spritegrid_WorldGrabber.js");
include("jit_gl_spritegrid_Sprite.js");
include("jit_gl_spritegrid_WindowGrid.js");
include("jit_gl_spritegrid_MaxSpritesGrid.js");

var gP = this.patcher;
var gPP = this.patcher.parentpatcher;
var gCurrentYPos = 20;

var gWorldGrabber = new WorldGrabber();
gWorldGrabber.doSetDrawto(gGlobal.worldName);

var gWindowGrid = new WindowGrid();

gGlobal.spriteGridExists = 1;
gGlobal.spritePaths = [];
gGlobal.spriteGridBPObj = gPP.getnamed("jit_gl_spritegrid");

var tsk = new Task(CheckIfNewSprite, this);
tsk.interval = 200;
tsk.repeat();

gWindowGrid.FillCellsArray();

var gMaxSpritesGrid = new MaxSpritesGrid();
var gPathImgSelected = null;

// PUBLIC FUNCTIONS ---------------
function clear()
{
    gMaxSpritesGrid.Destroy();
    gCurrentYPos = 20;
}

function PathImgSelected(path)
{
    gPathImgSelected = path;
}

// PRIVATE FUNCTIONS --------------
function CheckIfNewSprite()
{   
    // print(gGlobal.spritePaths.length);
    if (gGlobal.isNewSprite)
    {   
        var imgPath = gGlobal.spritePaths[gGlobal.spritePaths.length-1];
        gMaxSpritesGrid.AddSprite(gP, gCurrentYPos, imgPath);
        
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
    print("Cleaning spritegrid")
    gGlobal.spriteGridExists = 0;
    gWindowGrid.Destroy();
    gWorldGrabber.Destroy();
}


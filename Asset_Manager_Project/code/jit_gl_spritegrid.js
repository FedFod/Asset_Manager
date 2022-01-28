autowatch = 1;

var gGlobal = new Global("AssetManager");

include("jit_gl_spritegrid_WorldGrabber.js");
include("jit_gl_spritegrid_MaxSprite.js");
include("jit_gl_spritegrid_WindowGrid.js");
include("jit_gl_spritegrid_MaxSpritesGrid.js");
include("AssetManager_Common.js");

var gP = this.patcher;
var gPP = this.patcher.parentpatcher;
var gCurrentYPos = 20;

var gCommon = new Common();

var gWorldGrabber = new WorldGrabber();
gWorldGrabber.doSetDrawto(gGlobal.worldName);

var gWindowGrid = new WindowGrid();

gGlobal.spriteGridExists = 1;
gGlobal.spritePaths = [];
// gGlobal.spriteGridBPObj = gPP.getnamed("jit_gl_spritegrid");

var tsk = new Task(CheckIfNewSprite, this);
tsk.interval = 200;
tsk.repeat();

var gMaxSpritesGrid = new MaxSpritesGrid(gP);
var gPathImgSelected = null;


// PUBLIC FUNCTIONS ---------------
function load_folder(path)
{
    gMaxSpritesGrid.LoadFolder(path);
    gMaxSpritesGrid.SortFolder();
}

function clear()
{
    gMaxSpritesGrid.Destroy();
    gCurrentYPos = 20;
}

function clear_window()
{
    gWindowGrid.ClearSprites();
}

function show_grid(val)
{
    gWindowGrid.ShowGrid(val);
}

function PathImgSelected(path)
{
    gPathImgSelected = path;
}

// PRIVATE FUNCTIONS --------------
function CheckIfNewSprite()
{   
    if (gGlobal.isNewSprite)
    {   
        var imgPath = gGlobal.spritePaths[gGlobal.spritePaths.length-1];
        gMaxSpritesGrid.AddSprite(imgPath);
        
        gCurrentYPos+=55;
        gGlobal.isNewSprite = 0;
    }
}
CheckIfNewSprite.local = 1;

gGlobal.GetGridBPatcherRect = function()
{   
    var rect = [gP.box.rect[0],  gP.box.rect[1],
                gP.box.rect[2] - gP.box.rect[0],
                gP.box.rect[3] - gP.box.rect[1]];
    return rect.slice(); 
} 

function notifydeleted()
{   
    print("Cleaning spritegrid")
    gGlobal.spriteGridExists = 0;
    gMaxSpritesGrid.Destroy();
    gWindowGrid.Destroy();
    gWorldGrabber.Destroy();
}


autowatch = 1;

include("jit_gl_spritegrid_WorldGrabber.js");
include("jit_gl_spritegrid_MaxSprite.js");
include("jit_gl_spritegrid_MaxSprite_VideoPlayer.js");
include("jit_gl_spritegrid_WindowGrid.js");
include("jit_gl_spritegrid_MaxSpritesGrid.js");
include("jit_gl_spritegrid_Collisions.js");
include("AssetManager_Common.js");
include("AssetManager_Chooser.js");

var gP = this.patcher;
var gPP = this.patcher.parentpatcher;

var gCommon = new Common();

var gWorldGrabber = new WorldGrabber();
gWorldGrabber.doSetDrawto("myWorld");

var gMaxSpritesGrid = new MaxSpritesGrid(gP, gPP);

var gWindowGrid = new WindowGrid();

var tsk = new Task(CheckIfResized, this);
tsk.interval = 200;
tsk.repeat();

var gCollisions = new Collisions();

var bpatcherInitialSize = [500, 400];
var gBPSize = [0,0];

// PUBLIC FUNCTIONS ---------------
function load_folder(path)
{
    gMaxSpritesGrid.LoadFolder(path);
    gMaxSpritesGrid.SortFolder();
    gMaxSpritesGrid.CreatePatcherSprites();
    gMaxSpritesGrid.RepositionSprites();
}

function zoom(val)
{
    gWindowGrid.Zoom(val);
}

function clear()
{
    gMaxSpritesGrid.Destroy();
}

function clear_window()
{
    gWindowGrid.ClearGLSprites();
}

function show_grid(val)
{
    gWindowGrid.ShowGrid(val);
}

// function PathImgSelected()
// {   
//     gMaxSpritesGrid.UnselectSprites();
// }

// PRIVATE FUNCTIONS --------------

function GetGridBPatcherRect()
{   
    var rect = [this.patcher.box.rect[0],  this.patcher.box.rect[1],
                this.patcher.box.rect[2] - this.patcher.box.rect[0],
                this.patcher.box.rect[3] - this.patcher.box.rect[1]];
    return rect.slice(); 
} 

function GetParentPatcherRect()
{
    var rect = [gPP.box.rect[0],  gPP.box.rect[1],
                gPP.box.rect[2] - gPP.box.rect[0],
                gPP.box.rect[3] - gPP.box.rect[1]];
    return rect.slice(); 
}

function SetPatcherSize()
{
    this.patcher.box.rect = [0,20, gBPSize[0], gBPSize[1]];
}

function CheckIfResized()
{
    var rect = GetParentPatcherRect();

    if (rect[2] != gBPSize[0])
    {   
        gBPSize[0] = rect[2];
        gBPSize[1] = rect[3];
        gMaxSpritesGrid.RepositionSprites();
        gMaxSpritesGrid.ResizeTitleBar(gBPSize[0]);
        SetPatcherSize();
    } 
}

// CALLED BY MAX -------------------

function SetBpatcherInitialSize()
{
    this.patcher.box.rect = [0,20, bpatcherInitialSize[0], bpatcherInitialSize[1]];
}

function notifydeleted()
{   
    FF_Utils.Print("Cleaning spritegrid")
    gMaxSpritesGrid.Destroy();
    gWindowGrid.Destroy();
    gWorldGrabber.Destroy();
    gCollisions.Destroy();
}


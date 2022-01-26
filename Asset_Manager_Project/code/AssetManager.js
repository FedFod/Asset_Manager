include("AssetManager_Folder.js");
include("AssetManager_ObjectCreator.js");
include("AssetManager_Common.js");
include("AssetManager_Container.js");
include("AssetManager_Chooser.js");


mgraphics.init();
mgraphics.relative_coords = 0;
mgraphics.autofill = 0;

var gJSUISize = [box.rect[2] - box.rect[0], box.rect[3] - box.rect[1]];
var gFolderManager = new FolderManager();
// var gObjCreator = new ObjectCreator(this.patcher);
var gObjAllocator = new ObjectAllocator(); 
var gCommon = new Common();
var gContainer = new Container(mgraphics);

var gGlobal = new Global("AssetManager");

gGlobal.worldName = "myWorld";
var gChooser = new Chooser(this.patcher);


var gMouseWindowPosition = [];
var gIsDraggingFile = false;

// PUBLIC FUNCTIONS
// function remove_objects_created()
// {
//     gObjCreator.Destroy();
// }

function load_folder(path)
{
    gFolderManager.LoadFolder(path);
    gFolderManager.SortFolder();
    gFolderManager.CalcFolderSize();
    gFolderManager.DisplayFolder();
    gContainer.CheckIfDisplayScrollBar(gFolderManager.GetFolderSize())
    mgraphics.redraw();
}

function test_chooser()
{
    gChooser.Test();
}

function clear()
{
    notifydeleted();
    mgraphics.redraw();
}

// PRIVATE FUNCTIONS

function paint()
{   
    gContainer.DrawBackground();
    gContainer.DrawScrollBar();
    // gContainer.DrawTopBorder();

    gFolderManager.DrawOffScreenBuffer(mgraphics);
    // if (gFolderManager.selectedFile.filePath)
    // {   
    //     gFolderManager.DrawSelectedHighlight(mgraphics);
    // }
    gFolderManager.DrawFileNames(mgraphics);
    gContainer.DrawTopBorder();
    if (gFolderManager.selectedFile.filePath)
    {   
        gContainer.DrawSelectedFileName(gFolderManager.selectedFile.filePath);
    }
}

function onresize(width, height)
{	
	gJSUISize = [width, height]; 
    gFolderManager.CalcFolderSize();
    gFolderManager.DisplayFolder();
    gContainer.SetScrollBarRect();
    gContainer.CheckIfDisplayScrollBar(gFolderManager.GetFolderSize())
    mgraphics.redraw();
}

function ondrag(x,y,button)
{
    if (!button)
    {
        if (gFolderManager.selectedFile != null)
        {   
            print("should allocate")
            var patcherPos = [x+box.rect[0], y+box.rect[1]];
            gObjAllocator.AllocateObject(patcherPos, gFolderManager.selectedFile.type, gFolderManager.selectedFile.filePath);
            // gIsDraggingFile = true;
            // print("is dragging "+gIsDragginFile);
            // gObjCreator.CreateObject([x,y], gFolderManager.selectedFile.filePath, gFolderManager.selectedFile.type);
        }
        gContainer.SetScrollBarSliderUnclicked();
    }
    if (button)
    {
        if (gFolderManager.selectedFile != null)
        {   
            gIsDraggingFile = true;
            // print("is dragging "+gIsDraggingFile);
            // gObjCreator.CreateObject([x,y], gFolderManager.selectedFile.filePath, gFolderManager.selectedFile.type);
        }
    }
    if (gContainer.GetScrollBarSliderClicked())
    {
        gFolderManager.SetScrollBarOffset(gContainer.MoveScrollBarSlider(y));
        gFolderManager.DisplayFolder();
    }

    // gWorldGrabber.GetWindowSize();

    mgraphics.redraw();
}

function onclick(x,y)
{
    gFolderManager.CheckIfClicked([x,y]);
    gContainer.CheckIfScrollBarSliderClicked([x,y]);
    mgraphics.redraw();
}

function notifydeleted()
{
    gFolderManager.Destroy();
    // gObjCreator.Destroy();
}
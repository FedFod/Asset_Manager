include("AssetManager_Folder.js");
include("AssetManager_ObjectCreator.js");
include("AssetManager_Common.js");
include("AssetManager_Container.js");
include("AssetManager_WorldGrabber.js");


mgraphics.init();
mgraphics.relative_coords = 0;
mgraphics.autofill = 0;

var gJSUISize = [box.rect[2] - box.rect[0], box.rect[3] - box.rect[1]];
var gFolderManager = new FolderManager();
var gObjCreator = new ObjectCreator(this.patcher);
var gCommon = new Common();
var gContainer = new Container(mgraphics);

var gWorldGrabber = new WorldGrabber();
gWorldGrabber.doSetDrawto("myWorld");

// PUBLIC FUNCTIONS
function remove_objects_created()
{
    gObjCreator.Destroy();
}

function load_folder(path)
{
    gFolderManager.LoadFolder(path);
    gFolderManager.SortFolder();
    gFolderManager.CalcColumnRows();
    gFolderManager.CalcFolderSize();
    gFolderManager.DisplayFolder();
    gContainer.CheckIfDisplayScrollBar(gFolderManager.GetFolderSize())
    mgraphics.redraw();
}

// PRIVATE FUNCTIONS

function paint()
{   
    gContainer.DrawBackground();
    gContainer.DrawScrollBar();

    gContainer.DrawTopBorder();

    if (gFolderManager.selectedFile.filePath)
    {   
        gFolderManager.DrawSelectedHighlight(mgraphics);
        gContainer.DrawSelectedFileName(gFolderManager.selectedFile.filePath);
    }
    gFolderManager.DrawOffScreenBuffer(mgraphics);
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
            gObjCreator.CreateObject([x,y], gFolderManager.selectedFile.filePath, gFolderManager.selectedFile.type);
        }
        gContainer.SetScrollBarSliderUnclicked();
    }
    if (gContainer.GetScrollBarSliderClicked())
    {
        gFolderManager.SetScrollBarOffset(gContainer.MoveScrollBarSlider(y));
        gFolderManager.DisplayFolder();
    }

    gWorldGrabber.GetWindowSize();

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
    mgraphics.redraw();
}
include("AssetManager_Folder.js");
include("AssetManager_ObjectCreator.js");
include("AssetManager_Common.js");
include("AssetManager_Container.js");

mgraphics.init();
mgraphics.relative_coords = 0;
mgraphics.autofill = 0;

var gJSUISize = [box.rect[2] - box.rect[0], box.rect[3] - box.rect[1]];
var gFolderManager = new FolderManager();
var gObjCreator = new ObjectCreator(this.patcher);
var gCommon = new Common();
var gContainer = new Container(mgraphics);

// PUBLIC FUNCTIONS
function remove_objects_created()
{
    gObjCreator.Destroy();
}

function load_folder(path)
{
    gFolderManager.LoadFolder(path);
    gFolderManager.SortFolder();
    gFolderManager.DisplayFolder();
    mgraphics.redraw();
}

// PRIVATE FUNCTIONS

function paint()
{   
    gContainer.DrawTopBorder();
    gContainer.DrawBackground();
    if (gFolderManager.selectedFile.filePath)
    {   
        gContainer.DrawSelectedFileName(gFolderManager.selectedFile.filePath);
    }
    gFolderManager.DrawOffScreenBuffer(mgraphics);
}

function onresize(width, height)
{	
	gJSUISize = [width, height]; 
    gFolderManager.DisplayFolder();
    mgraphics.redraw();
}

function ondrag(x,y,button)
{
    if (gFolderManager.selectedFile != null)
    {
        if (!button)
        {
            gObjCreator.CreateObject([x,y], gFolderManager.selectedFile.filePath, gFolderManager.selectedFile.type);
        }
    }
}

function onclick(x,y)
{
    gFolderManager.CheckIfClicked([x,y]);
    mgraphics.redraw();
}

function notifydeleted()
{
    gFolderManager.Destroy();
    mgraphics.redraw();
}
function ObjectCreator(patcher)
{
    this.p = patcher;
    this.objsArray = [];

    this.CreateImage = function(pos, filePath)
    {
        this.objsArray.push(this.p.newdefault(pos[0],pos[1],"fpic"));
        this.objsArray[this.objsArray.length-1].pict(filePath);
        this.objsArray[this.objsArray.length-1].autofit(1);
    }

    this.CreateSound = function(pos, filePath)
    {
        this.objsArray.push(this.p.newdefault(pos[0],pos[1],"playlist~"));
        this.objsArray[this.objsArray.length-1].append(filePath);
        this.objsArray[this.objsArray.length-1].clipheight = (30);
    }

    this.CreateObject = function(pos, filePath, type)
    {   
        pos[0]+=box.rect[0];
        pos[1]+=box.rect[1];

        var jsuiBox = [box.rect[0], box.rect[1], gJSUISize[0], gJSUISize[1]];

        if (!gCommon.CheckIfInside(pos, jsuiBox))
        {   
            switch (type) 
            {
                case "image":
                    this.CreateImage(pos, filePath);
                    break;
                case "sound":
                    this.CreateSound(pos, filePath);
                    break;
                default:
                    break;
            }
        }
    }

    this.Destroy = function()
    {
        this.DestroyObjects();
    }   

    this.DestroyObjects = function()
    {
        for (var obj in this.objsArray)
        {
            this.p.remove(this.objsArray[obj]);
        }
        this.imageObjs = [];
    }
}
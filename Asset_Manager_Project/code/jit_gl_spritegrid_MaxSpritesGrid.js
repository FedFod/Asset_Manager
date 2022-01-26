function MaxSpritesGrid()
{
    this.spriteObjects = [];

    this.AddSprite = function(gP, gCurrentYPos, imgPath)
    {
        this.spriteObjects.push(new Sprite(gP, gCurrentYPos, imgPath));
    }

    this.Destroy = function()
    {
        for (var obj in this.spriteObjects)
        {
            (this.spriteObjects[obj].Destroy());
        }
    }
}
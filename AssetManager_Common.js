function Common()
{
    this.CheckIfInside = function(mouse, rect)
    {   
        var val = 0;
        if (mouse[0]>rect[0] && mouse[0]<(rect[0]+rect[2]) && mouse[1]>rect[1] && mouse[1]<(rect[1]+rect[3]))
        {
            val = 1;
        }
        return val;
    }

    this.FileTypes = 
    {
        image: ["png", "PNG", "jpeg", "jpg"],
        movie: ["mov", "avi", "mpeg", "mpg", "mp4"],
        sound: ["wav", "mp3"]
    }
}


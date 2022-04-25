function Common()
{
    this.CheckIfInside = function(mouse, rect)
    {   
        // rect[0] and rect[1] represent the top left corner
        // rect[2] and rect[3] represent x and y size of the rectangle area
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
        sound: ["wav", "mp3"],
        obj:   ["obj", "dae"]
    }
}

function Log_Info(message, value)
{   
    if (value != undefined) {
        FF_Utils.Print(message +": "+value);
    } else {
        FF_Utils.Print(message);
    }
}

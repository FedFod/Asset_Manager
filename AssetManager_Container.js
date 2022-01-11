function Container(mg)
{
    this.mg = mg;
    this.backgroundColor = [0.55, 0.55, 0.55, 1.0];
    this.titleBacgroundColor = [0.3,0.3,0.3,1.0];
    this.border = [0,0,gJSUISize[0], 20];
    this.scrollBarWidth = 15;
    this.scrollBarHeight = 40;
    this.sliderTop = this.border[3];
    this.mouseYOffset = 0;
    this.folderUndisplayedPixels = 0;

    this.scrollBarSlider = 
    {
        clickedColor: [0.2, 0.2, 0.2, 1.0],
        unclickedColor: [0.7, 0.7, 0.75, 1.0],
        rect: [gJSUISize[0]-this.scrollBarWidth, this.sliderTop, this.scrollBarWidth, this.scrollBarHeight],
        isClicked: false,
        isDisplayed: false
    }

    this.DrawTopBorder = function()
    {
        this.mg.set_source_rgba(this.titleBacgroundColor);
        this.mg.rectangle(0,0,gJSUISize[0], this.border[3]);
        this.mg.fill();
    }

    this.DrawBackground = function()
    {
        this.mg.set_source_rgba(this.backgroundColor);
        this.mg.rectangle(0,this.border[3],gJSUISize[0], gJSUISize[1]);
        this.mg.fill();
    }

    this.DrawSelectedFileName = function(filePath)
    {
        this.mg.set_font_size(12);
        this.mg.set_source_rgba([1,1,1,1]);
        var string = filePath;
        var textMeasure = this.mg.text_measure(string);
        this.mg.move_to(10, textMeasure[1]);
        this.mg.text_path(string);
        this.mg.fill();
    }

    this.DrawScrollBar = function()
    {   
        if (this.scrollBarSlider.isDisplayed)
        {
            this.mg.set_source_rgba(this.titleBacgroundColor);
            this.mg.rectangle(gJSUISize[0]-this.scrollBarWidth, this.border[3], this.scrollBarWidth, gJSUISize[1]);
            this.mg.stroke();
            
            this.mg.set_source_rgba(this.scrollBarSlider.unclickedColor);
            if (this.scrollBarSlider.isClicked)
            {
                this.mg.set_source_rgba(this.scrollBarSlider.clickedColor);
            }
            var sliderRect = this.scrollBarSlider.rect.slice();
            sliderRect.push(10); sliderRect.push(10);
            this.mg.rectangle_rounded(sliderRect);
            this.mg.fill();
        }
    }

    this.CheckIfScrollBarSliderClicked = function(mousePos)
    {   
        if (this.scrollBarSlider.isDisplayed)
        {
            this.scrollBarSlider.isClicked = false;
            if (gCommon.CheckIfInside(mousePos, this.scrollBarSlider.rect))
            {   
                this.mouseYOffset = mousePos[1]-this.sliderTop;
                this.scrollBarSlider.isClicked = true;
            }
        }
    }

    this.GetScrollBarSliderClicked = function()
    {
        return this.scrollBarSlider.isClicked;
    }

    this.CheckIfDisplayScrollBar = function(folderSize)
    {   
        this.scrollBarSlider.isDisplayed = false;
        if (folderSize[1] > gJSUISize[1])
        {
            this.scrollBarSlider.isDisplayed = true;
            this.folderUndisplayedPixels = folderSize[1]-gJSUISize[1];
            print("folder size from check if display scrollbar: "+folderSize)
        }
    }

    this.MoveScrollBarSlider = function(mouseY)
    {   
        var offsetVal = 0;
        if (this.scrollBarSlider.isClicked && this.scrollBarSlider.isDisplayed)
        {   
            this.sliderTop = mouseY-this.mouseYOffset;
            this.sliderTop = this.ClipSliderPos();
            this.SetScrollBarRect();
            offsetVal = this.folderUndisplayedPixels * ((this.sliderTop-this.border[3]) / (gJSUISize[1]-this.border[3]-this.scrollBarHeight));
        }
        return offsetVal;
    }

    this.SetScrollBarSliderUnclicked = function()
    {
        this.scrollBarSlider.isClicked = false;
    }

    this.SetScrollBarRect = function()
    {   
        this.sliderTop = this.ClipSliderPos();
        this.scrollBarSlider.rect = [gJSUISize[0]-this.scrollBarWidth, this.sliderTop, this.scrollBarWidth, this.scrollBarHeight];
    }

    this.ClipSliderPos = function()
    {
        return Math.min(gJSUISize[1]-this.scrollBarHeight, Math.max(this.border[3], this.sliderTop));
    }

    this.GetTopBorderHeight = function()
    {
        return this.border[3];
    }
}
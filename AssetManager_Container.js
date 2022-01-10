function Container(mg)
{
    this.mg = mg;
    this.backgroundColor = [0.55, 0.55, 0.55, 1.0];
    this.titleBacgroundColor = [0.3,0.3,0.3,1.0];
    this.border = [0,0,gJSUISize[0], 20];

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

    this.GetTopBorder = function()
    {
        return this.border[3];
    }
}
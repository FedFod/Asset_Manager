function Sprite(id, patcher, filePath, patcherSize, textHeight)
{   
    this.p = patcher;
    this.textHeight = textHeight;
    this.panelBorderSize = 2;
    this.textYOffset = this.panelBorderSize;
    this.filePath = filePath;
    this.fpicSize = patcherSize.slice();

    this.ID = id;

    this.imgMat = new JitterMatrix();

    this.fpic = null;
    this.videoPlayer = null;
    this.videoTsk = null;
    this.isPlaying = 0;

    this.CreateFpic = function()
    {
        fpic = this.p.newdefault(0, 0, "fpic");
        fpic.autofit(1);
        fpic.forceaspect(1);
        fpic.ignoreclick = (1);
        return fpic;
    }

    this.CreatePwindow = function()
    {
        pwindow = this.p.newdefault(0, 0, "jit.pwindow");
        pwindow.ignoreclick = (1);
        return pwindow;
    }

    this.CreatePlayStopButton = function()
    {
        var playStopButton = this.p.newdefault(0,0,"pictctrl");
        playStopButton.varname = "spritegrid_playButton";
        var rectangle = [10, this.fpicSize[1]-20,30,30];
        this.p.script("sendbox", playStopButton.varname, "patching_rect", rectangle.slice());
        this.p.script("bringtofront", playStopButton.varname);
        return playStopButton;
    }

    var extension = filePath.split('.').pop();
    for (var type in gCommon.FileTypes)
    {   
        var fileType = gCommon.FileTypes[type];
        for (var index in fileType)
        {   
            var ext = fileType[index];
            if (extension == ext)
            {
                switch (type) 
                {
                    case "image":
                        FF_Utils.Print("is image")
                        this.fpic = this.CreateFpic();
                        this.fpic.read(filePath);
                        this.imgMat.importmovie(filePath);
                        break;
                    case "sound":
                        FF_Utils.Print("is sound")
                        this.fpic = this.CreateFpic();
                        this.fpic.read("SpeakerIcon.png");
                        this.imgMat.importmovie("SpeakerIcon.png");
                        break;
                    case "movie":
                        FF_Utils.Print("is movie")
                        this.fpic = this.CreatePwindow();
                        this.imgMat.importmovie(filePath);
                        this.videoPlayer = new VideoPlayer(filePath);
                        this.playStopButton = this.CreatePlayStopButton();

                        var PlayMovieCallback = (function() {
                            this.videoPlayer.LoadNewFrame();
                            this.fpic.jit_matrix(this.videoPlayer.GetMatrixName());
                        }).bind(this);

                        // questo dovrebbe essere su draw swap così si possono
                        // usare le texture per jit.movie
                        this.videoTsk = new Task(PlayMovieCallback, this);
                        this.videoTsk.interval = 33;
                        this.videoTsk.repeat(1); // fai una volta per visualizzare primo frame
                        break;
                    default:
                        this.fpic = this.CreateFpic();
                        FF_Utils.Print("no type found");
                        break;
                }
                break;
            }
        }
    }

    this.ratio = this.imgMat.dim[0] / this.imgMat.dim[1];

    this.width = Math.max(this.fpicSize[0]*this.ratio, this.fpicSize[0]);
    this.height = this.fpicSize[0];

    this.fpic.varname = "spritegrid_fpic_";
    var rectangle = [0, 0, this.width, this.fpicSize[1]];
    this.p.script("sendbox", this.fpic.varname, "patching_rect", rectangle.slice());

    this.button = this.p.newdefault(0,0, "ubutton");
    this.button.varname = "ubutton_";
    this.button.hilite(0);
    this.button.toggle(1);
    rectangle = [0, 0, this.width, this.fpicSize[1]+this.textYOffset+this.textHeight];
    this.p.script("sendbox", this.button.varname, "patching_rect", rectangle.slice());
    this.p.script("bringtofront", this.button.varname);

    this.button.spriteID = this.ID;

    this.buttonListener = new MaxobjListener(this.button, ButtonCallback);

    this.GetFileDim = function()
    {
        return this.imgMat.dim;
    }

    this.CreateText = function()
    {
        var text = this.p.newdefault(0,0, "comment");
        text.varname = "txt_";
        text.fontsize(10);
        text.setwithtruncation(this.filePath.replace(/^.*[\\\/]/, ''), this.width-10, "");
        text.textjustification(1);
        text.bgcolor([0.3,0.3,0.3,1]);
        text.textcolor([0.95,0.95,0.95,1]);
        var rectangle = [0,0, this.width+this.panelBorderSize*2, 10];
        this.p.script("sendbox", text.varname, "patching_rect", rectangle.slice());
        return text;
    }

    this.CreatePanel = function()
    {
        highlightPanel = this.p.newdefault(0,0,"panel");
        highlightPanel.varname = "spritegrid_HLPanel_";
        highlightPanel.rounded(0);
        highlightPanel.bgfillcolor([0,0,0,0]);
        highlightPanel.border(this.panelBorderSize);
        highlightPanel.bordercolor([0,0,0,1]);
        highlightPanel.ignoreclick = 1;
        var rectangle = [0,0, this.width+this.panelBorderSize*2, this.fpicSize[1]+this.panelBorderSize*2];
        this.p.script("sendbox", highlightPanel.varname, "patching_rect", rectangle.slice());
        this.p.script("sendtoback", highlightPanel.varname);
        return highlightPanel;
    }


    this.text = this.CreateText();
    this.highlightPanel = this.CreatePanel();
    
    this.GetWidth = function()
    {
        return this.width;
    }

    this.GetImagePath = function()
    {
        return this.filePath;
    }

    this.Highlight = function(val)
    {   
        this.highlightPanel.bordercolor([0,0,0,1]);
        this.button.ignoreclick = 0;
        if (val)
        {
            this.highlightPanel.bordercolor([0,0.7,1,1]);
            this.button.ignoreclick = 1;
        }
    }

    this.PlayMovie = function()
    {
        if (this.videoPlayer != null)
        {
            if (!this.videoPlayer.isPlaying)
            {
                this.videoPlayer.isPlaying = 1;
                this.videoTsk.repeat();
                FF_Utils.Print("repeat")
            }
            else 
            {
                this.videoPlayer.isPlaying = 0;
                this.videoTsk.cancel();
                FF_Utils.Print("cancel")
            }
        }
    }

    this.SetPosition = function(pos)
    {   
        this.p.script("sendbox", this.fpic.varname, "patching_position",   [pos[0], pos[1]]);
        this.p.script("sendbox", this.button.varname, "patching_position", [pos[0], pos[1]]);
        this.p.script("sendbox", this.text.varname, "patching_position",   [pos[0]-this.panelBorderSize, pos[1]+this.fpicSize[1]+this.textYOffset]);
        this.p.script("sendbox", this.highlightPanel.varname, "patching_position",   [pos[0]-this.panelBorderSize, pos[1]-this.panelBorderSize]);
    }

    this.GetRect = function()
    {   
        return [this.fpic.rect[0], this.fpic.rect[1], this.width, this.height];
    }

    this.Destroy = function()
    {
        FF_Utils.Print("Removing BP sprite");
        this.p.remove(this.fpic);
        this.p.remove(this.text);
        this.p.remove(this.button);
        this.p.remove(this.highlightPanel);
        this.imgMat.freepeer();
        if (this.videoPlayer != null)
        {
            this.videoPlayer.Destroy();
            this.videoTsk.freepeer();
        }
    }
}

function ButtonCallback(data)
{   
    FF_Utils.Print("Button Callback");
    FF_Utils.Print(data.value)
    FF_Utils.Print(data.attrname)
    gMaxSpritesGrid.SetSpriteSelected(data.maxobject.spriteID);
    FF_Utils.Print("sprite selected "+data.maxobject.spriteID);
}

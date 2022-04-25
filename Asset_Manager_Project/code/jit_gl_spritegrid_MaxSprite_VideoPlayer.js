function VideoPlayer(filePath)
{
    this.moviePlayer = new JitterObject("jit.movie");
    this.moviePlayer.output_texture = 1; // per il momento è ancora su matrix
    this.moviePlayer.drawto = gWorldName;
    this.moviePlayer.read(filePath);

    FF_Utils.Print("MoviePlayer Drawto: "+this.moviePlayer.drawto);

    this.dummyMatrix = new JitterMatrix(4, "char", 320, 240);

    this.shouldPlay = false;
    this.isPlaying = false;

    this.SetOutputTexture = function(val) 
    {
        this.moviePlayer.output_texture = val;
    }

    this.LoadNewFrame = function()
    {   
        this.moviePlayer.matrixcalc(this.dummyMatrix, this.dummyMatrix);
    }

    this.GetMatrixName = function()
    {   
        return this.dummyMatrix.name;
    }

    this.GetTextureName = function()
    {
        return this.moviePlayer.texture_name;
    }

    this.Destroy = function()
    {
        this.moviePlayer.freepeer();
        this.dummyMatrix.freepeer();
    }
}
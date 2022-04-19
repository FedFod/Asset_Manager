function VideoPlayer(filePath)
{
    this.moviePlayer = new JitterObject("jit.movie");
    this.moviePlayer.output_texture = 0; // per il momento è ancora su matrix
    this.moviePlayer.drawto = "myWorld";
    this.moviePlayer.read(filePath);

    this.dummyMatrix = new JitterMatrix(4, "char", 320, 240);

    this.isPlaying = 0;

    this.LoadNewFrame = function()
    {   
        this.moviePlayer.matrixcalc(this.dummyMatrix, this.dummyMatrix);
    }

    this.GetMatrixName = function()
    {   
        return this.dummyMatrix.name;
    }

    this.Destroy = function()
    {
        this.moviePlayer.freepeer();
        this.dummyMatrix.freepeer();
    }
}
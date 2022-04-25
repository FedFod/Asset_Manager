var gProxyLocalWorld = null;
var gLocalSwapListen = null;
if (max.version >= 820)
{
    gProxyLocalWorld = new JitterObject("jit.proxy");
}


function AssignProxyLocalWorld(worldName)
{
    gProxyLocalWorld.name = worldName;
    var worldDrawto = gProxyLocalWorld.send("getdrawto");
    gLocalSwapListen = new JitterListener(worldDrawto[0], swapcallbackLocal);
    FF_Utils.Print("Local World DrawTo: "+worldDrawto[0]);
    FF_Utils.Print("Local subject name: "+gLocalSwapListen.subjectname);
}

function DestroyLocalWorld()
{
    if (gProxyLocalWorld != null)
    {
        gProxyLocalWorld.freepeer();
    }
}
   
function swapcallbackLocal(event){
	switch (event.eventname) {
		// if context is root we use swap, if jit.gl.node use draw
		case ("swap" || "draw"):
		    // RENDER BANG
            gMaxSpritesGrid.PlayMovieSelectedSprite();
			break;

		case "mouse": 
			break;
		
		case "mouseidle":  // Check if mouse is close to vertices to highlight them
            // FF_Utils.Print("mouseidle "+event.args);
			break;

		case "mouseidleout":
            // FF_Utils.Print(event.args);
            break;
		
		case "keydown": 
			// FF_Utils.Print(event.args)
			break;
	}
}
swapcallbackLocal.local = 1
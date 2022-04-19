function WorldGrabber()
{
    this.implicitDrawto = "";
    this.drawto = "";
    this.proxyDrawto = "";
    this.swaplisten = null;
    this.explicitDrawto = false;
    this.proxy = null;
    this.implicitTracker = new JitterObject("jit_gl_implicit");

    if (max.version >= 820)
    {
        this.proxy = new JitterObject("jit.proxy");
    }

    var implicitCallback = (function() {
        if (!this.explicitDrawto && this.implicitDrawto != this.implicitTracker.drawto[0])
        {
            this.implicitDrawto = this.implicitTracker.drawto[0];
            this.doSetDrawto(this.implicitDrawto);
        }
    }).bind(this);

    this.implicitListener = new JitterListener(this.implicitTracker.name, implicitCallback);

    this.doSetDrawto = function(newDrawto)
    {
        if (newDrawto == this.drawto || !newDrawto)
        {
            return;
        }

        if (this.proxy != undefined)
        {
            this.proxy.name = newDrawto;
            FF_Utils.Print("proxy name "+this.proxy.name)

            if (this.proxy.class !== undefined)
            {
                if (this.proxy.class != "jit_gl_context_view")
                {
                    FF_Utils.Print("proxt class ")
                    this.proxyDrawto = this.proxy.send("getdrawto");
                    FF_Utils.Print("proxy drawto 1: "+this.proxyDrawto)
                    return this.doSetDrawto(this.proxyDrawto[0]);
                }
            }
            else {
                this.proxyDrawto = this.proxy.send("getdrawto");
                if(this.proxyDrawto !== null && this.proxyDrawto !== undefined) {
                    FF_Utils.Print("proxy drawto 2: "+this.proxyDrawto)
                    return dosetdrawto(this.proxyDrawto[0]);  // name of the internal node
                }
            }
        }
        this.drawto = newDrawto;
        FF_Utils.Print("drawto: "+this.drawto)
    
        if(this.swaplisten)
        {
            this.swaplisten.subjectname = "";
        }
        this.swaplisten = new JitterListener(this.drawto, swapcallback);
        FF_Utils.Print("swaplisten subject name "+this.swaplisten.subjectname)
    }

    this.Destroy = function()
    {   
        FF_Utils.Print("Cleaning WorldGrabber");
        if (this.proxy != null)
        {
            this.proxy.freepeer();
        }
        this.implicitTracker.freepeer();
    }

    // SPECIFIC FUNCTIONS AND PROPS 

    this.GetWorldName = function()
    {   
        return "myWorld";
        // return this.drawto;
    }
}

function swapcallback(event){
	switch (event.eventname) {
		// if context is root we use swap, if jit.gl.node use draw
		case ("swap" || "draw"):
		    // RENDER BANG
			break;

		case "mouse": 
            // FF_Utils.Print("mouse "+event.args);
            gMouseWindowPosition = [event.args[0], event.args[1]];
            gWindowGrid.PlaceGLSprite(gMouseWindowPosition, event.args[2]);
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
swapcallback.local = 1
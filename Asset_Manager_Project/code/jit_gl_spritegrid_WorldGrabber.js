function WorldGrabber()
{
    this.implicitDrawto = "";
    this.drawto = "";
    this.proxyDrawto = "";
    this.swaplisten = null;
    this.explicitDrawto = false;
    this.proxy = null;
    this.dummyNode = new JitterObject("jit.gl.node");
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

            if (this.proxy.class !== undefined)
            {
                if (this.proxy.class != "jit_gl_context_view")
                {
                    this.proxyDrawto = this.proxy.send("getdrawto");
                    print("proxy drawto 1: "+this.proxyDrawto)
                    return this.doSetDrawto(this.proxyDrawto[0]);
                }
            }
            else {
                this.proxyDrawto = this.proxy.send("getdrawto");
                if(this.proxyDrawto !== null && this.proxyDrawto !== undefined) {
                    print("proxy drawto 2: "+this.proxyDrawto)
                    return dosetdrawto(this.proxyDrawto[0]);  // name of the internal node
                }
            }
        }
        this.drawto = newDrawto;
        print("drawto: "+this.drawto)
        this.dummyNode.drawto = this.drawto;
    
        if(this.swaplisten)
        {
            this.swaplisten.subjectname = "";
        }
        this.swaplisten = new JitterListener(this.drawto, swapcallback);
        print("swaplisten subject name "+this.swaplisten.subjectname)
    }

    this.Destroy = function()
    {   
        print("Cleaning WorldGrabber");
        if (this.proxy != null)
        {
            this.proxy.freepeer();
        }
        this.dummyNode.freepeer();
        this.implicitTracker.freepeer();
        this.sketch.freepeer();
    }

    // SPECIFIC FUNCTIONS AND PROPS 

    this.sketch = new JitterObject("jit.gl.sketch", gGlobal.worldName);

    this.GetWindowSize = function()
    {
        // print(this.dummyNode.dim);
        return this.dummyNode.dim;
    }

    this.GetWindowPos = function()
    {
        
    }

    this.GetMouseWorldPos = function(mX, mY)
    {   
        return (this.sketch.screentoworld([mX,mY,0]));
    }
}

function swapcallback(event){
	switch (event.eventname) {
		// if context is root we use swap, if jit.gl.node use draw
		case ("swap" || "draw"):
		// RENDER BANG
			break;

		case "mouse": 
            // print("mouse "+event.args);
            gMouseWindowPosition = gWorldGrabber.GetMouseWorldPos(event.args[0], event.args[1]);
            gWindowGrid.PlaceSprite(gMouseWindowPosition, event.args[2]);
			break;
		
		case "mouseidle":  // Check if mouse is close to vertices to highlight them
            // print("mouseidle "+event.args);
			break;

		case "mouseidleout":
            // print(event.args);
            break;
		
		case "keydown": 
			print(event.args)
			break;
	}
}
swapcallback.local = 1
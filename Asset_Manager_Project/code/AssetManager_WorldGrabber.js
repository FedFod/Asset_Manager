function WorldGrabber()
{
    this.implicitDrawto = "";
    this.drawto = "";
    this.proxyDrawto = "";
    this.swaplisten = null;
    this.explicitDrawto = false;

    this.dummyNode = new JitterObject("jit.gl.node");

    this.proxy = null;
    if (max.version >= 820)
    {
        this.proxy = new JitterObject("jit.proxy");
    }

    this.implicitTracker = new JitterObject("jit_gl_implicit");

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
        print(this.swaplisten.subjectname)
    }

    // SPECIFIC FUNCTIONS AND PROPS 
    this.GetWindowSize = function()
    {
        // print(this.dummyNode.dim);
        return this.dummyNode.dim;
    }

    this.GetWindowPos = function()
    {
        
    }
}

function swapcallback(event){
	switch (event.eventname) {
		// if context is root we use swap, if jit.gl.node use draw
		case ("swap" || "draw"):
		// RENDER BANG
			break;

		case "mouse": 
            print(event.args);
			break;
		
		case "mouseidle":  // Check if mouse is close to vertices to highlight them
            // print(event.args);
			break;

		case "mouseidleout":
            print(event.args);
            break;
		
		case "keydown": 
			print(event.args)
			break;
	}
}
swapcallback.local = 1
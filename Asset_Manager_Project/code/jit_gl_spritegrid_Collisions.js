function Collisions()
{
    this.physProxy = new JitterObject("jit.proxy");
    this.physProxy.name = "physWorld";

    this.listener = new JitterListener(this.physProxy.name, PhysCallback);

    this.GetPhysName = function()
    {
        return this.physProxy.name;
    }

    this.Destroy = function()
    {   
        FF_Utils.Print("Cleaning Phys")
        this.physProxy.freepeer();
    }
}

function PhysCallback(event)
{
    // post("callback "+event.eventname+". args "+event.args+"\n");
	if(event.eventname == "collisions") {
		// the second arg contains the dict name
		// create a new Dict object referencing that dict 
		var cd = new Dict(event.args[1]);
		// iterate the keys. each key is a distinct collision
		var keys = cd.getkeys();
		if(keys) {
			// if there is only a single collision, the type will be string instead of array
			if(typeof keys === "string") {				
				process_collisions(keys);
			}
			else {
				// multiple collisions. process each one
				for (var i=0;i<keys.length;i++) {
					process_collisions(keys[i]);
				}
			}
		}		
	}
}

function process_collisions(dname) {
	var subd = new Dict(dname);
	var keys = subd.getkeys();
	// post("process dict: "+dname+"\n");
    if (dname.indexOf("character") !== -1)
    {
        if(keys) {
            for (var i=0;i<keys.length;i++) {
                if (keys[i] == "position")
                {
                    // post(keys[i]+": "+subd.get(keys[i])+"\n");
                    var posString = subd.get(keys[i]);
                    var output = [];
                    for (var axis in posString)
                    {
                        output.push(parseFloat(posString[axis].toFixed(3)));
                    }
                    outlet(0,"collision", output);
                }
            }
        }
    }
	
	// must explicitly free the dict when finished processing
	subd.freepeer();
}
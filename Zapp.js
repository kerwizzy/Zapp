var Zapp = {}

Zapp.widgets = {}

Zapp.widgets.output = {}
Zapp.widgets.info = {}

Zapp.widgets.output.terminal = class {
	constructor(id,maxLines,inputBox) {
		this.id = id;
		this.maxLines = maxLines || -1;
		if (typeof inputBox == "undefined") {
			this.inputBox = false
		} else {
			this.inputBox = inputBox
		}
		this.log = [];
	}
	
	toHTML() {
		if (this.inputBox) {
			return "<div id='"+this.id+"' ></div><input type=text id='"+this.id+"-cmdInput'></input>"
		} else {
			return "<div id='"+this.id+"' ></div>"
		}		
	}
	
	addEventListener(eventToListenFor,eventFunction) {
		if (document.getElementById(this.id)) {
			if (eventToListenFor == "command") {
				var inputId = this.id+"-cmdInput"
				
				document.getElementById(inputId).onkeydown = function(event) { //TODO: Is this supposed to be add event listener? Are multiple listeners supported?
					if (event.key == "Enter") {
						eventFunction(Zapp.utils.getValue(inputId));
						document.getElementById(inputId).value = "";
					}
				}
			}
		}
	}
	
	write(str) {
		this.log[this.log.length-1]+=str;
		return this.update();	
	}
	println(str) {
		if (this.log.length == this.maxLines) {
			this.log.shift();
		}
		this.log.push(str)
		return this.update();
	}
	
	clearLog() {
		this.log = []
		return this.update();
	}
	
	update() {
		if (document.getElementById(this.id)) {
			if (this.log.length > this.maxLines) {
				this.log = this.log.slice(-this.maxLines)
			}
			
			document.getElementById(this.id).innerHTML = this.log.join("<BR>")
			return true;
		} else {
			return false;
		}		
	}
	
	replaceLn(ln,str) {
		if (ln < 0) {
			this.log[this.log.length+ln] = str;
		} else {
			this.log[ln] = str;
		}
		return this.update();
	}
	
}

Zapp.widgets.info.progressBar = class {
	constructor(id) {
		this.id = id;
		this.value = 0;
	}
	
	toHTML() {
		return "<progress value='"+this.value+"' max='100' id='"+this.id+"'></progress>"
	}
	
	set(value) {
		this.value = value;
		this.update();
	}
	
	update() {
		if (document.getElementById(this.id)) {
			document.getElementById(this.id).value = this.value
			return true;
		} else {
			return false;
		}		
	}
	
}

Zapp.widgets.info.bootstrapProgressBar = class {
	constructor(id,showPercent,doTransition) {
		this.id = id;
		if (typeof showPercent == "undefined") {
			showPercent = true;
		}
		this.showPercent = showPercent
		
		if (typeof doTransition == "undefined") {
			doTransition = true;
		}
		
		this.doTransition = doTransition;
		
		this.value = 0;
	}
	
	toHTML() {
		var out = '<div class="progress"><div id="'+this.id+'" class="progress-bar progress-bar-success" role="progressbar" style="width:'+this.value+'%;'
		
		if (this.doTransition == false) {
			out+="transition:none;"
		}
		
		out+='">'+(this.showPercent ? (this.value)+'%' : '')+'</div></div>'
		
		return out;
	}
	
	set(value) {
		this.value = value;
		this.update();
	}
	
	update() {
		if (document.getElementById(this.id)) {
			document.getElementById(this.id).style.width = this.value+"%"
			if (this.showPercent) {
				document.getElementById(this.id).innerHTML =this.value+"%"
			}
			return true;
		} else {
			return false;
		}		
	}
	
}

Zapp.widgets.info.graph = class {
	constructor(id,width,height,drawColor,backgroundColor) {
		this.id = id;
		this.width = width || 400
		this.height = height || 100
		this.drawColor = drawColor || "#000000"
		this.backgroundColor = backgroundColor || "#FFFFFF"
		this.lastValueX = this.width-1;
		this.lastValueY = 0;
	}
	
	toHTML() {
		return '<canvas width='+this.width+' height='+this.height+' id="'+this.id+'"></canvas>'
	}
	
	clear() {
		if (document.getElementById(this.id)) {
			if (typeof this.ctx == "undefined") {
				this.ctx = document.getElementById(this.id).getContext("2d")
			}
			
			this.ctx.fillStyle = this.backgroundColor;
			
			this.ctx.fillRect(0,0,this.width,this.height)
			
			return true;
		} else {
			return false;
		}		
	}
	
	move(distance) { //Move the displayed data back by distance
		if (document.getElementById(this.id)) {
			if (typeof this.ctx == "undefined") {
				this.ctx = document.getElementById(this.id).getContext("2d")
			}
			
			var imageData = this.ctx.getImageData(distance,0,this.width,this.height)
			this.ctx.putImageData(imageData,0,0)
			
			this.ctx.fillStyle = this.backgroundColor
			this.ctx.fillRect(this.width-distance,0,distance,this.height)
			
			this.lastPointX -= distance;
			
			return true;
		} else {
			return false;
		}
	}
	
	addPoint(value,size) {
		if (document.getElementById(this.id)) {
			//value = (value*this.height)
			
			if (typeof this.ctx == "undefined") {
				this.ctx = document.getElementById(this.id).getContext("2d")
			}
			
			
			size = size || 1
		
			this.move(1)
			
			this.lastPointX = this.width-1;
			this.lastPointY = value;

			this.ctx.lineWidth = 0.0001;	

			this.ctx.strokeStyle = this.drawColor;
			this.ctx.fillStyle = this.drawColor;	
			
			this.ctx.beginPath();
			
			
			this.ctx.arc(this.width-1,value,(size/2),0,2*Math.PI);
			this.ctx.fill();
			this.ctx.stroke();
			
			return true;
		} else {
			return false;
		}		
	}	
	
	
	addLine(value,size,pointSize,pointColor) {
		if (document.getElementById(this.id)) {
			if (typeof this.ctx == "undefined") {
				this.ctx = document.getElementById(this.id).getContext("2d")
			}
			
			
			this.move(1)
		
			this.ctx.strokeStyle = this.drawColor;
			this.ctx.lineWidth = size || 1;
			
			this.ctx.beginPath();
			this.ctx.moveTo(this.lastPointX,this.lastPointY)
			this.ctx.lineTo(this.width-1,value)
			
			this.lastPointX = this.width-1;
			this.lastPointY = value;
			
			this.ctx.stroke();
			
			if (typeof pointSize != "undefined") {
				pointColor = pointColor || this.drawColor;
				
				this.ctx.lineWidth = 0.0001;	

				this.ctx.strokeStyle = pointColor;
				this.ctx.fillStyle = pointColor;	

				this.ctx.beginPath();


				this.ctx.arc(this.width-1,value,(pointSize/2),0,2*Math.PI);
				this.ctx.fill();
				this.ctx.stroke();
				
			}
			
			return true;
		} else {
			return false;
		}
	}
}


Zapp.widgets.visual = {}


Zapp.widgets.visual.canvas = class {
	constructor(id,width,height) {
		this.id = id;
		this.width = width || 400
		this.height = height || 200
	}	
	
	toHTML() {
		return '<canvas width='+this.width+' height='+this.height+' id="'+this.id+'"></canvas>'
	}
	
	fill(color) {
		if (document.getElementById(this.id)) {
			if (typeof this.ctx == "undefined") {
				this.ctx = document.getElementById(this.id).getContext("2d")
			}
			
			this.ctx.fillStyle = color || "white"
			
			this.ctx.fillRect(0,0,this.width,this.height)
			
			return true;
		} else {
			return false;
		}
	}
	
	clear() {
		if (document.getElementById(this.id)) {
			if (typeof this.ctx == "undefined") {
				this.ctx = document.getElementById(this.id).getContext("2d")
			}
			
			this.ctx.clearRect(0,0,this.width,this.height);
			
			//ctx.fillStyle = "rgba(255,255,255,1) might work too...
			
			
			return true;
		} else {
			return false;
		}		
	}
	
	rect(x,y,width,height,color,rotation) {
		if (document.getElementById(this.id)) {
			if (typeof this.ctx == "undefined") {
				this.ctx = document.getElementById(this.id).getContext("2d")
			}
			
			if (typeof rotation == "undefined") {
				rotation = 0;
			}
			
			this.ctx.fillStyle = color;
			
			this.ctx.save();
			this.ctx.translate(x,y)
			this.ctx.rotate(rotation)
			this.ctx.fillRect(0,0,width,height)
			this.ctx.stroke();
			this.ctx.restore();	
			
			return true;
		} else {
			return false;
		}
	}
	
	lineRect(x,y,width,height,color,rotation,lineWidth) { //lineWidth comes after rotation so it is the same argument order as .rect()
	if (document.getElementById(this.id)) {
		
		if (typeof this.ctx == "undefined") {
			this.ctx = document.getElementById(this.id).getContext("2d")
		}
		if (typeof rotation == "undefined") {
			rotation = 0;
		}
		
		this.ctx.strokeStyle = color;
		
		this.ctx.lineWidth = lineWidth || 1
		
		this.ctx.save();
		this.ctx.translate(x,y)
		this.ctx.rotate(rotation)
		this.ctx.rect(0,0,width,height)
		this.ctx.stroke();
		this.ctx.restore();	
		
		return true;
	} else {
		return false;
	}
	}
	
	point(x,y,size,color) {
		if (document.getElementById(this.id)) {
			if (typeof this.ctx == "undefined") {
				this.ctx = document.getElementById(this.id).getContext("2d")
			}
			size = size || 1
		
			this.ctx.strokeStyle = color || "black"
			this.ctx.fillStyle = color || "black"
			this.ctx.lineWidth = 0.00001;
			
			this.ctx.beginPath();
			
			
			this.ctx.arc(x,y,(size/2),0,2*Math.PI); //Size is the DIAMETER, NOT the radius.
			this.ctx.fill();
			this.ctx.stroke();
		
		} else {
			return false;
		}		
	}
	
	line(x1,y1,x2,y2,size,color) {
		if (document.getElementById(this.id)) {
			if (typeof this.ctx == "undefined") {
				this.ctx = document.getElementById(this.id).getContext("2d")
			}


		
			this.ctx.strokeStyle = color || "black"
			this.ctx.lineWidth = size || 1;
			
			this.ctx.beginPath();
			this.ctx.moveTo(x1,y1)
			this.ctx.lineTo(x2,y2)
			
			this.ctx.stroke();
		
		} else {
			return false;
		}		
	}
	
	addEventListener(eventToListenFor,eventFunction) {
		if (document.getElementById(this.id)) {
			var thisCanvas = document.getElementById(this.id)
			if (eventToListenFor == "mousedownXY") {
				thisCanvas.onmousedown = function(event) {
					var rect = thisCanvas.getBoundingClientRect();
					var x = event.clientX - rect.left;
					var y = event.clientY - rect.top;

					var factorX = Number(thisCanvas.clientWidth)/this.width; //Take care of styles that change the size of a canvas.
					var factorY = Number(thisCanvas.clientHeight)/this.height; 

					x = Math.floor(x/factorX)
					y = Math.floor(y/factorY)

					eventFunction(x,y);
					
				}
			} else if (eventToListenFor == "mouseupXY") {
				thisCanvas.onmouseup = function(event) {
					var rect = thisCanvas.getBoundingClientRect();
					var x = event.clientX - rect.left;
					var y = event.clientY - rect.top;

					var factorX = Number(thisCanvas.clientWidth)/this.width; //Take care of styles that change the size of a canvas.
					var factorY = Number(thisCanvas.clientHeight)/this.height; 

					x = Math.floor(x/factorX)
					y = Math.floor(y/factorY)

					eventFunction(x,y);
					
				}
			} else if (eventToListenFor == "mousemoveXY") {
				thisCanvas.onmousemove = function(event) {
					var rect = thisCanvas.getBoundingClientRect();
					var x = event.clientX - rect.left;
					var y = event.clientY - rect.top;

					var factorX = Number(thisCanvas.clientWidth)/this.width; //Take care of styles that change the size of a canvas.
					var factorY = Number(thisCanvas.clientHeight)/this.height; 

					x = Math.floor(x/factorX)
					y = Math.floor(y/factorY)

					eventFunction(x,y);
					
				}
			} else {
				thisCanvas.addEventListener(eventToListenFor,eventFunction)
			}
		}		
	}
	
	
	
}



Zapp.widgets.visual.fieldCanvas = class {
	constructor(id,width,height) {
		this.id = id;
		this.width = width || 400
		this.height = height || 200
		this.x = 0; //The location of the center of the view
		this.y = 0;
		this.scaleX = 1; //How "wide" a pixel is in global coordinates. 1 means there is a 1:1 coorespondence in coordinate deltas. An offset of 1 in global coordinates means an offest of one pixel in local coordinates.
		this.scaleY = 1;
		this.absSize = false; //If true, Convert only the coordinates of the draw calls, not the sizing.
	}

	get scale() {
		return this.scaleX //Is this the best behavior? Maybe average them instead?
	}
	
	pixelToGlobal(x,y) {
		x = x-this.width/2
		y = -(y-this.height/2)
		//Now the coordinates are in pixels from the CENTER of the screen. (0,0 is the center.)
		
		x *= this.scaleX
		y *= this.scaleY
		
		x += this.x
		y += this.y
		
		return [x,y]		
		
	}
	
	globalToPixel(x,y) {
		x -= this.x
		y -= this.y
		
		x /= this.scaleX
		y /= this.scaleY
		
		x = x+this.width/2
		y = -y+this.height/2
		
		return [x,y]
	}
	
	calcGlobalViewWidth() {
		return this.scaleX*this.width;
	}
	
	calcGlobalViewHeight() {
		return this.scaleY*this.height;
	}
	
	getMin() { //Returns the coordinates of the bottom-left corner of the canvas. (Minimum x and y values)
		var out = []
		
		out[0] = this.x-this.calcGlobalViewWidth()/2
		out[1] = this.y-this.calcGlobalViewHeight()/2
		
		return out
	}
	
	getMax() { //Returns the coordinates of the top-right corner of the canvas. (Maximum x and y values)
		var out = []
		
		out[0] = this.x+this.calcGlobalViewWidth()/2
		out[1] = this.y+this.calcGlobalViewHeight()/2
		
		return out
	}
	
	setCenter(x,y) {
		
		
		var deltaX = x-this.x
		var deltaY = y-this.y
		
		this.ctx.translate(-deltaX,-deltaY)
		
		this.x = x
		this.y = y
	}
	
	setScale() { //This can be called as setScale(scale[,originX,originY]) or as setScale(scaleX,scaleY[ ,originX,originY])
		var scaleX;
		var scaleY;
		var originX;
		var originY;
		
		if (arguments.length == 2 || arguments.length == 4) { //If have 2 or 4, the must be the second case above.
			scaleX = arguments[0]
			scaleY = arguments[1]
			originX = arguments[2]
			originY = arguments[3]
		} else {
			scaleX = arguments[0]
			scaleY = arguments[0]
			originX = arguments[1]
			originY = arguments[2]
		}		
		
		
		var scaleDeltaX = scaleX/this.scaleX;
		var scaleDeltaY = scaleY/this.scaleY;
		var ctxScaleDeltaX = 1/scaleDeltaX //Larger scales mean smaller stuff. However, the ctx.scale method is opposite. Scaling by 2 makes everything LARGER. So we need to take the reciprocal.
		var ctxScaleDeltaY = 1/scaleDeltaY
		
		originX = originX || this.x
		originY = originY || this.y
		
		//TODO: THIS DOESN'T WORK RIGHT YET!!!
		var offsetFromOriginX = this.x-originX
		var offsetFromOriginY = this.y-originY
		
		this.ctx.translate(this.x,this.y) //We have to move back to the origin an then return to where we were in order to have the scale origin be correct.
		this.ctx.scale(ctxScaleDeltaX,ctxScaleDeltaY)
		this.ctx.translate(-this.x,-this.y)
		
		this.setCenter(originX+offsetFromOriginX*scaleDeltaX,originY+offsetFromOriginY*scaleDeltaY)
		
		this.scaleX = scaleX;
		this.scaleY = scaleY
	}
	
	zoom(factor,originX,originY) { //calling feildCanvas.zoom(2) will make everything bigger by a factor of 2.
		this.setScale(this.scale/factor,originX,originY)	
	}
	
	initializeContext() {
		if (document.getElementById(this.id)) {
			if (typeof this.ctx == "undefined") {
				this.ctx = document.getElementById(this.id).getContext("2d")
			}
			
			
			
			this.ctx.translate(this.width/2,this.height/2) //Make the origin (0,0) be in the center of the screen.
			
			this.ctx.scale(1,-1) //Invert the y-axis
			
			return true;
		} else {
			return false;
		}
	}
	
	addEventListener(eventToListenFor,eventFunction,optionsOrUseCapture,wantsUntrusted) {
		var storedZappCanvasObject = this;
		if (document.getElementById(this.id)) {
			var thisCanvas = document.getElementById(this.id)			
			if (eventToListenFor.substr(-2) == "XY") {
				thisCanvas.addEventListener(eventToListenFor.substr(0,eventToListenFor.length-2),function(event) {
					var rect = thisCanvas.getBoundingClientRect();
					var x = event.clientX - rect.left;
					var y = event.clientY - rect.top;

					var factorX = Number(thisCanvas.clientWidth)/storedZappCanvasObject.width; //Take care of styles that change the size of a canvas.
					var factorY = Number(thisCanvas.clientHeight)/storedZappCanvasObject.height; 

					x = Math.floor(x/factorX)
					y = Math.floor(y/factorY)
					
					var convertedCoordinates = storedZappCanvasObject.pixelToGlobal(x,y)
					
					
					eventFunction(convertedCoordinates[0],convertedCoordinates[1],event);
					
				},optionsOrUseCapture,wantsUntrusted)
			} else {
				thisCanvas.addEventListener(eventToListenFor,eventFunction,optionsOrUseCapture,wantsUntrusted)
			}
		}		
	}	
	
	
	/* All the functions below here are the same as in the plain canvas class */
	
	toHTML() {
		return '<canvas width='+this.width+' height='+this.height+' id="'+this.id+'"></canvas>'
	}
	
	toggleAbsoluteSizing() {
		this.absSize = !this.absSize;
	}
	
	
	fill(color) {
		if (document.getElementById(this.id)) {
			if (typeof this.ctx == "undefined") {
				this.ctx = document.getElementById(this.id).getContext("2d")
			}
			
			this.ctx.save();
			this.ctx.setTransform(1, 0, 0, 1, 0, 0); //Reset the context
			
			this.ctx.fillStyle = color || "white"
			
			this.ctx.fillRect(0,0,this.width,this.height)
			
			this.ctx.restore();
			return true;
		} else {
			return false;
		}
	}
	
	clear() {
		if (document.getElementById(this.id)) {
			if (typeof this.ctx == "undefined") {
				this.ctx = document.getElementById(this.id).getContext("2d")
			}
			
			this.ctx.save();
			this.ctx.setTransform(1, 0, 0, 1, 0, 0); //Reset the context
			this.ctx.clearRect(0,0,this.width,this.height);
			this.ctx.restore();
			//ctx.fillStyle = "rgba(255,255,255,1) might work too...
			
			
			return true;
		} else {
			return false;
		}		
	}
	
	rect(x,y,width,height,color,rotation) {
		if (document.getElementById(this.id)) {
			if (typeof this.ctx == "undefined") {
				this.ctx = document.getElementById(this.id).getContext("2d")
			}
			
			if (typeof rotation == "undefined") {
				rotation = 0;
			}
			
			this.ctx.fillStyle = color;
			
			this.ctx.save();
			this.ctx.translate(x,y)
			this.ctx.rotate(rotation)
			this.ctx.fillRect(0,0,width,height)
			this.ctx.stroke();
			this.ctx.restore();	
			
			return true;
		} else {
			return false;
		}
	}
	
	lineRect(x,y,width,height,color,rotation,lineWidth) { //lineWidth comes after rotation so it is the same argument order as .rect()
	if (document.getElementById(this.id)) {
		
		if (typeof this.ctx == "undefined") {
			this.ctx = document.getElementById(this.id).getContext("2d")
		}
		if (typeof rotation == "undefined") {
			rotation = 0;
		}
		
		this.ctx.strokeStyle = color;
		
		this.ctx.lineWidth = lineWidth || 1
		
		this.ctx.save();
		this.ctx.translate(x,y)
		this.ctx.rotate(rotation)
		this.ctx.rect(0,0,width,height)
		this.ctx.stroke();
		this.ctx.restore();	
		
		return true;
	} else {
		return false;
	}
	}
	
	point(x,y,size,color) {
		if (document.getElementById(this.id)) {
			if (typeof this.ctx == "undefined") {
				this.ctx = document.getElementById(this.id).getContext("2d")
			}
			size = size || 1
			
			var pConv = [x,y]
			if (this.absSize) {
				//We reset the context and stuff to stop the point from being stretched.
				this.ctx.save();
				this.ctx.setTransform(1, 0, 0, 1, 0, 0); 
				
				pConv = this.globalToPixel(x,y) 
			}
			
			this.ctx.strokeStyle = color || "black"
			this.ctx.fillStyle = color || "black"
			this.ctx.lineWidth = 0.00001;
			
			this.ctx.beginPath();
			
			
			this.ctx.arc(pConv[0],pConv[1],(size/2),0,2*Math.PI); //Size is the DIAMETER, NOT the radius.
			this.ctx.fill();
			this.ctx.stroke();
			
			if (this.absSize) {
				this.ctx.restore();
			}
		} else {
			return false;
		}		
	}
	
	line(x1,y1,x2,y2,size,color) {
		if (document.getElementById(this.id)) {
			if (typeof this.ctx == "undefined") {
				this.ctx = document.getElementById(this.id).getContext("2d")
			}

			var p1Conv = [x1,y1]
			var p2Conv = [x2,y2]
			if (this.absSize) {
				//We reset the context and stuff to stop the lines from being stretched.
				this.ctx.save();
				this.ctx.setTransform(1, 0, 0, 1, 0, 0); 
				
				var p1Conv = this.globalToPixel(x1,y1) 
				var p2Conv = this.globalToPixel(x2,y2)
			
			}
		
			this.ctx.strokeStyle = color || "black"
			this.ctx.lineWidth = size || 1;
			
			this.ctx.beginPath();
			this.ctx.moveTo(p1Conv[0],p1Conv[1])
			this.ctx.lineTo(p2Conv[0],p2Conv[1])
			
			this.ctx.stroke();
			
			if (this.absSize) {
				this.ctx.restore();
			}
		} else {
			return false;
		}		
	}
	
	text(text,x,y,style,color) {
		if (document.getElementById(this.id)) {
			if (typeof this.ctx == "undefined") {
				this.ctx = document.getElementById(this.id).getContext("2d")
			}
			var pConv = [x,y]
			this.ctx.save();
			
			if (this.absSize) {
				this.ctx.setTransform(1, 0, 0, 1, 0, 0); 
				
				pConv = this.globalToPixel(x,y) 
			}
			//this.ctx.scale(1,-1) //flip the y-axis back so we don't have mirrored text.
			this.ctx.font = style
			this.ctx.fillStyle = color;
			this.ctx.fillText(text,pConv[0],pConv[1])
			this.ctx.restore();
		}
	}
}



Zapp.utils = {}

Zapp.utils.getValue = function(elementId) {
	var element = document.getElementById(elementId)
	if (element) {
		var tagName = element.tagName
		
		if (tagName == "INPUT") {
			if (element.type == "number" || element.type == "range") {
				return Number(element.value)
			} else if (element.type == "checkbox") {
				return element.checked
			} else {
				return element.value;
			}
		} else {
			return element.value;
		}
	}
	
}

Zapp.utils.setValue = function(elementId,value) {
	var element = document.getElementById(elementId)
	if (element) {
		var tagName = element.tagName
		
		if (tagName == "INPUT" || tagName == "SELECT" || tagName == "TEXTAREA") {
			if (element.type == "checkbox") {
				element.checked = value;
			} else {
				element.value = value;
			}
		} else {
			element.innerHTML = value;
		}
		return true;
	} else {
		return false;
	}
}

Zapp.utils.quickBootstrapSetupStandard =  function(innerDivId) {
document.body.innerHTML = 
'<div class="container">'
+'<div class="row">'
+'<div class="col-md-12" id="'+innerDivId+'">'
+document.body.innerHTML
+'</div>'
+'</div>'
+'</div>'
	
}

Zapp.utils.quickBootstrapSetupWide =  function(innerDivId) {
document.body.innerHTML = 
'<div class="container-fluid">'
+'<div class="row">'
+'<div class="col-md-12" id="'+innerDivId+'">'
+document.body.innerHTML
+'</div>'
+'</div>'
+'</div>'
	
}

Zapp.utils.escapeHTML = function(text) {
	var map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;',
		"\\": '&#92;',
	};

	return text.replace(/[&<>"'\\]/g, function(m) { return map[m]; }).replace(/  /g, " &nbsp;"); //Replace \ with \\.
}

Zapp.utils.padString = function(str,stringToPadWith,length) {
	if (typeof str != "string") {
		str = str.toString();
	}
	if (typeof stringToPadWith != "string") {
		stringToPadWith = stringToPadWith.toString();
	}
	

	while (str.length < length) {
		str = stringToPadWith + str;
	}
		
	str = str.substr(0,length)
	
	return str;
	
	
}

Zapp.utils.radiansToDegrees = function(radians) {
	return (radians/(2*Math.PI))*360
}

Zapp.utils.degreesToRadians = function(degrees) {
	return (degrees/360)*2*Math.PI;
}

Zapp.utils.polarToCartesian = function(theta,r) {
	return [r*Math.cos(theta),r*Math.sin(theta)]	
}

Zapp.utils.cartesianToPolar = function(x,y) {
	return [Math.atan2(y,x),Math.sqrt(x*x+y*y)]
	
}

Zapp.utils.bootstrapify = function() {
	//Zapp.utils.quickBootstrapSetupWide("");
	
	var buttonsArray = document.getElementsByTagName("BUTTON")
	
	for (var i = 0; i < buttonsArray.length; i++) {
		if (!buttonsArray[i].className) {
		buttonsArray[i].className = "btn btn-default"
		}
	}
	
	
}


Zapp.makeHTML = {}

Zapp.makeHTML.input = function(id,type,preHTML,postHTML,onchangeCode,className,style) {
	return preHTML+"<input id='"+id+"' class='"+className+"' style='"+style+"' onchange='"+onchangeCode+"' type='"+type+"'></input>"+postHTML
}

Zapp.makeHTML.button = function(id,innerHTML,preHTML,postHTML,onclickCode,className,style) {
	return preHTML+"<button id='"+id+"' class='"+className+"' style='"+style+"' onclick='"+onclickCode+"'>"+innerHTML+"</button>"+postHTML
}

Zapp.makeHTML.select = function(id,selectArray,preHTML,postHTML,onchangeCode,className,style) {
	var out =  "<select id='"+id+"' class='"+className+"' style='"+style+"' onchange='"+onchangeCode+"'>"
	for (var i =0; i<selectArray.length; i++) {
		out+="<option value='"+i+"'>"+selectArray[i]+"</option>"
	}
	
	return preHTML+out+"</select>"+postHTML;
	
}



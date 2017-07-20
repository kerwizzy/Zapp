# Zapp
An easy to use Javascript widget library

Javascript and HTML5 are great, but basic setup like `document.getElementById(...)`, converting number inputs to actual numbers, and many other things, can get in the way of trying out your ideas fast. Zapp solves that problem with lots of simple utility functions and widgets, offering canvas functions, automatic type conversion from inputs, and plenty of useful widgets and tools.

# Features

## Widgets

* **Zapp.widgets.visual.canvas:** A versatile canvas interface. Gives easy to use functions such as `clear`, `rect`, `point`, with out the hassle of the regular canvas API. Also allows you  to easily set event listeners that returnt the xy-position of an event, which is hard to do with the regular API.
* **Zapp.widgets.fieldCanvas:** Has all the same functions as a regular Zapp canvas, but allows scaling and moving. xy-events return the xy-position in the transformed canvas context, not simply the pixel location.
* **Zapp.widgets.output.terminal:** an interface for making a terminal-type UI.
* **Zapp.widgets.info.progressBar:** a simple progress bar widget
* **Zapp.widgets.info.bootstrapProgressBar:** a simple progress bar widget with automatic styling for Bootstrap
* **Zapp.widgets.info.graph:** a line graph widget

## Utilites

* **Zapp.utils.getValue:** Basically like `document.getElementById(...).value` but automatically returns true or false for checkboxes and numbers from number inputs.
* **Zapp.utils.setValue:** Like getValue, but for setting. Sets `element.innerHTML` for non-input elements.
* **Zapp.utils.quickBootstrapSetupStandard:** Useful for building prototyping apps very quickly. Automatically sets up a standard bootstrap page.
* **Zapp.utils.quickBootstrapSetupWide:** Like quickBootstrapSetupStandard but uses `container-fluid` instead of `container`
* **Zapp.utils.escapeHTML:** escapes &'s, <'s, >'s, single quotes, double quotes and back-slashes to their corresponding HTML entities.
* **Zapp.utils.padString:** inserts a string at the beginning of another string until it is a desired length. Useful in converting RGB values to an HTML hex string.
* **Zapp.utils.radiansToDegrees:** converts from radians to degrees
* **Zapp.utils.degreesToRadians:** converts from degrees to radians
* **Zapp.utils.polarToCartesian:** converts from polar coordinates to cartesian coordinates
* **Zapp.utils.cartesianToPolar:** converts from cartesian coordinates to polor coordinates
* **Zapp.utils.bootstrapify:** automatically assigns class `btn btn-default` to all classless button elements

## Audio

* **Zapp.audio.tone:** a simple interface for playing a tone for a duration of time.
* **Zapp.audio.halfstepsToHertz:** converts between half-steps (a musical measure of pitch) to hertz (a frequency measure of pitch, and what is needed for Zapp.audio.tone)

# Getting Started

The most useful part of Zapp is the canvas API, especially the fieldCanvas API, so this is a good place to start when trying out Zapp for the first time. To get started, make a simple HTML page like this:

```html
<head>
<title>My First Zapp Page</title>
<script src='https://gitcdn.xyz/repo/kerwizzy/Zapp/master/Zapp.js'></script>
</head>
<body>
</body>
```

Then insert a canvas element and a script element inside the body element like this:

```html
<body>
<canvas id="ZappCanvas" width=500 height=500 style='border:1px solid gray'></canvas>
<script>
var canvas = new Zapp.widgets.visual.canvas("ZappCanvas"); //Create a new Zapp canvas object from the canvas in the page with id "canvas"

canvas.point(250,250,5,"#FF0000"); //Place a red dot at 250,250 with size 5 (= diameter approx. 5 px).

</script>
</body>
```

If you did everything right, you should now have a red dot in a big blank canvas. Now for something more complicated. Lets see how to make a simple drawing app with Zapp. Go back to the code, delete the line that adds the red dot, and add an event listener to the canvas:

```javascript
var canvas = new Zapp.widgets.visual.canvas("ZappCanvas"); //Create a new Zapp canvas object from the canvas in the page with id "canvas"

var drawing = false;
var lastX = 0; //The last coordinates the user was drawing at. These will be used later.
var lastY = 0; 
canvas.addEventListener("mousedownXY",function(x,y,event) {
	drawing = true
	lastX = x
	lastY = y
})

```

Notice how easy it was to add an xy event listener to the canvas. In traditional code this would have required a longish function to account for page location, css scaling, etc. Zapp takes care of all this internally.

Next add another event listener for mousemove events. Suffix the event name with "XY" to tell Zapp to enable xy-event handling.

```javascript
var canvas = new Zapp.widgets.visual.canvas("ZappCanvas"); //Create a new Zapp canvas object from the canvas in the page with id "canvas"

var drawing = false;
var lastX = 0; //The last coordinates the user was drawing at. These will be used later.
var lastY = 0; 
canvas.addEventListener("mousedownXY",function(x,y,event) {
	drawing = true
	lastX = x
	lastY = y
})

canvas.addEventListener("mousemoveXY",function(x,y,event) {
	if (drawing) {
		canvas.line(lastX,lastY,x,y,5,"red"); //Draw a red line of width 5 from the last position to the current position.
		canvas.point(x,y,5,"red"); //Add a dot between the line connections to prevent "cracks" from appearing between the lines. (If you comment this out, you'll see what I mean) 
		lastX = x
		lastY = y
	}
})

```

Finally, we add an event listener to check when the user lets go of the mouse or moves it out of the canvas. Since xy position does not matter in this case, we can use a regular event listener. So just add:

```javascript
canvas.addEventListener("mouseup",function(event) {
	drawing = false
})

canvas.addEventListener("mouseleave",function(event) {
	drawing = false
})
```

And you're done! You should now have a simple drawing app built with Zapp! Final code:

```html
<head>
<title>My First Zapp Page</title>
<script src='https://gitcdn.xyz/repo/kerwizzy/Zapp/master/Zapp.js'></script>
</head>
<body>
<canvas id="ZappCanvas" width=500 height=500 style='border:1px solid gray'></canvas>
<script>
var canvas = new Zapp.widgets.visual.canvas("ZappCanvas"); //Create a new Zapp canvas object from the canvas in the page with id "canvas"

var drawing = false;
var lastX = 0; //The last coordinates the user was drawing at. These will be used later.
var lastY = 0; 
canvas.addEventListener("mousedownXY",function(x,y,event) {
	drawing = true
	lastX = x
	lastY = y
})

canvas.addEventListener("mousemoveXY",function(x,y,event) {
	if (drawing) {
		canvas.line(lastX,lastY,x,y,5,"red"); //Draw a red line of width 5 from the last position to the current position.
		canvas.point(x,y,5,"red"); //Add a dot between the line connections to prevent "cracks" from appearing between the lines. (If you comment this out, you'll see what I mean) 
		lastX = x
		lastY = y
	}
})

canvas.addEventListener("mouseup",function(event) {
	drawing = false
})

canvas.addEventListener("mouseleave",function(event) {
	drawing = false
})
</script>
</body>
```
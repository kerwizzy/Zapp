# Zapp
An easy to use Javascript widget library

Javascript and HTML5 are great, but basic setup like `document.getElementById(...)`, converting number inputs to actual numbers, and many other things, can get in the way of trying out your ideas fast. Zapp solves that problem with lots of simple utility functions and widgets, offering canvas functions, automatic type conversion from inputs, and plenty of useful widgets and tools.

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

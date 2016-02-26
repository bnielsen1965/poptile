# jquery-poptile.js
===================
A jQuery plugin used to pop open content based on a clicked tile inside a container.

# Requires

jQuery

# Implementation

Include the jquery-poptile.js and poptile.css files in your HTML page.

Create a main tile container, i.e. a <div> tag, and give the container the class of poptile-container so the plugin can identify the tile container.

Add tiles inside the container, i.e. as nested <div> tags, and give each tile an atribute of data-poptile-id with a string that identifies the id value of the content container this tile should open.

Add the tile content containers for each tile inside the main container, i.e. again add as <div> tags, and give each tag the class of poptile-content-container and give each tag an id that matches the value specified in the tile's data-poptile-id attribute.

In the page Javascript initialization call the poptile plugin on your tiles, i.e. $('.mytile').poptile(); and this will enable each tile's operation as a poptile.

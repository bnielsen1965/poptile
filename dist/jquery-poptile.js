/*
* Copyright (C) 2016 Bryan Nielsen - All Rights Reserved
*
* Author: Bryan Nielsen <bnielsen1965@gmail.com>
*
*
* This file is part of the PopTile jQuery plugin.
* PopTile is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
* 
* PopTile is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
* 
* You should have received a copy of the GNU General Public License
* along with this application.  If not, see <http://www.gnu.org/licenses/>.
*/
;
(function ($, window, document, undefined) {

    "use strict";

    // Create the defaults once
    var pluginName = "poptile",
        defaults = {
        };

    // the HTML filler element
    var poptileFiller = $('<div />').addClass('poptile-filler');
    var poptileBodyCover = $('<div / >').addClass('poptile-cover');
        

    // tile event handlers
    var tileEvents = {
        click: function (event) {
            // show container associated with this click event
            event.data.instance.showContainer();
        }
    };

    // The actual plugin constructor
    function Plugin(element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, {
        /**
         * Initialize this instance of the plugin.
         */
        init: function () {
            // keep a reference to self
            this.instance = this;
            
            // collect details about pop up content
            this.contentId = $(this.element).attr('data-poptile-id');
            if ( "undefined" === typeof this.contentId || false === this.contentId ) {
                throw new Error('Tile element is missing data-poptile-id attribute.');
            }
            this.contentElement = $('#' + this.contentId)[0];
            if ( "undefined" === typeof this.contentElement || false === this.contentElement ) {
                throw new Error('Missing content container with id of ' + this.contentId + '.');
            }
            
            // collect details about tile container
            this.containerElement = $(this.element).parents('.poptile-container:first')[0];
            if ( "undefined" === typeof this.containerElement || false === this.containerElement ) {
                throw new Error('Missing poptile-container parent for tile.');
            }
            
            // add events to the tile element
            $(this.element).on(tileEvents, {
                'instance': this.instance
            });

            // append the filler to the tile container
            $(this.containerElement).append(poptileFiller);
            
            $('body').append(poptileBodyCover);
            
            // attach click event to poptile close controls in content
            $(this.contentElement).find('.poptile-close').on('click', {'instance': this.instance}, function(event) {
                event.data.instance.hideContainer(event.data.instance);
                return false;
            });
        },
        
        /**
         * Show the content container for this tile.
         */
        showContainer: function() {
            this.coverBody();
            
            var contentElement = this.contentElement;
    
            $(poptileFiller)
                    .css(this.getTileCSS())
                    .fadeIn(250, function() {
                        $(this).animate({width: '100%', height: '100%', left: 0, top: 0}, function() {
                            $(contentElement).css({'display': 'block'}).addClass('poptile-content-open');
                            $(poptileFiller).fadeOut(250);
                        });
            });
        },
        
        /**
         * Cover the page body element to prevent other clicks and to capture click outside the content container.
         */
        coverBody: function() {
            $(poptileBodyCover).css('display', 'block');
            $(poptileBodyCover).on('click', {'instance': this.instance}, this.coverBodyClick);
        },
        
        /**
         * Process click event on the body cover.
         * 
         * @param {Object} event The click event object. Expects custom data node 'instance' that references the plugin instance for the content container displayed.
         */
        coverBodyClick: function (event) {
            event.data.instance.hideContainer(event.data.instance);
        },
        
        /**
         * Hide the container that is displaying the tile content.
         * 
         * @param {Object} instance A reference to the instance of the plugin for the container.
         */
        hideContainer: function(instance) {
            var contentElement = instance.contentElement;
            var tileCSS = instance.getTileCSS();
            var uncoverBodyFunction = instance.uncoverBody;
            
            $(poptileFiller).fadeIn(250, function() {
                $(contentElement).css({'display': 'none'}).removeClass('poptile-content-open');
                $(poptileFiller).animate(
                        tileCSS,
                        function () {
                            $(poptileFiller).fadeOut(250);
                            uncoverBodyFunction(instance);
                        }
                );
            });
        },
        
        /**
         * Remove the page body cover to re-enable the page.
         * 
         * @param {Object} instance A reference to the instance of the plugin for the container.
         */
        uncoverBody: function(instance) {
            $(poptileBodyCover).off('click', instance.coverBodyClick);
            $(poptileBodyCover).css('display', 'none');
        },
        
        /**
         * Get the CSS from the tile that will define the starting point for the
         * animated filler element used to transition to the content display.
         * 
         * @returns {object}
         */
        getTileCSS: function() {
            var tileOffset = $(this.element).offset();
            var tileWidth = $(this.element).width();
            var tileHeight = $(this.element).height();
            var containerOffset = $(this.containerElement).offset();
            
            return {
                        'background-color': $(this.contentElement).css('background-color'),
                        'width': tileWidth + 'px',
                        'height': tileHeight + 'px',
                        'left': (tileOffset.left - containerOffset.left) + 'px',
                        'top': (tileOffset.top - containerOffset.top) + 'px'
            };
        }
    });

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[ pluginName ] = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" +
                        pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);
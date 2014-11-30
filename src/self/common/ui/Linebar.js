
;(function() {

	"use strict";
	
	var identifier = "$ui.Linebar"

	, defaults = {
		
		selector4bar: ".score-bar",
		callback: void 0
	}
	
	, Linebar = function( target, settings ) {
		
		this.$node = target;
		this.settings = settings;
	};

	Linebar.prototype = {
	
		val: function( value, percent ) {

			var node = this.$node;
		
			if ( value ) {

				var settings = this.settings
					
				, bar = node.find( settings.selector4bar ).attr( "data-title", percent + "%" );

				percent > 100 && bar.addClass( "hight" );
				percent < 0 && bar.addClass( "low" );

				percent = percent > 100 ? 100 : Math.abs( percent );

				bar.css( "width", percent + "%" );

				"function" === typeof settings.callback && settings.callback.call( node, value );
			} else {
				
				return node.css( "width" );
			}
		}
	};

	$.fn.linebar = function( options ) {
		
		var self = this, instance;

		instance = self.data( identifier );

		if ( !instance ) {

			var settings = {};

			if ( "function" === typeof options ) {
				
				settings.callback = options;
			} else settings = options;
			
			instance = new Linebar( self, $.extend( true, {}, defaults, settings ) );

			self.data( identifier, instance );
		}

		return instance;
	};

})( window.jQuery );

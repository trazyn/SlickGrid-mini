

;(function( $ ) {

	"use strict";
	
	var defaults = {
		
		selector4bar: ".ppc-progress-fill",
		selector4title: ".ppc-percents span"
	}

	, identifier = "$ui.ProgressPie"

	, ProgressPie = function( target ) {
		
		this.val = function( value, callback ) {
			
			var rotate, text;

			if ( !value ) {
				
				return target.data( "item-value" );
			}

			value = +value || 0;

			rotate = 360 * value/100;

			text = target.data( "item-value", value ).find( defaults.selector4title ).html( value );

			if ( value > 50 ) {
				
				target.addClass( "gt-50" );
			} else target.removeClass( "gt-50" );

			target.find( defaults.selector4bar ).css( { "-webkit-transform": "rotate(" + rotate + "deg)" } );

			"function" === typeof callback 
				? callback.call( text, value )
				: text.html( value );

			return this;
		};
	};

	$.fn.progressPie = function() {
		
		var instance = this.data( identifier );

		if ( !instance ) {
			
			this.data( identifier, instance = new ProgressPie( this ) );
		}

		return instance;
	};
})( window.jQuery );

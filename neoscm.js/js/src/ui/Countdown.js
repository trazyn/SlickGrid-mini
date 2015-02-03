
(function( $ ) {
	
	var

	Countdown = function( target, settings ) {
		
		var html = "";

		for ( var i = 0; i < 4; ++i ) {
			html += "<span class='slot'></span><span style='font-size: 24px;'></span>";
		}

		tick( target.html( html ).find( "span.slot" ), new Date( settings.date ) - new Date() );
	};

	$.fn.countdown = function( options ) {
		
		this.each( function() {
			new Countdown( $( this ), options );
		} );
	};

	function update( slot, value, label ) {
		
		var 
		clone,
		offset,
		oldvalue = slot.attr( "data-oldvalue" ),
		
		value = ("0" + value).slice( -2 );

		if ( slot.is( ":visible" ) && oldvalue !== undefined && value != oldvalue ) {
			
			offset = slot.offset();

			clone = slot
				.clone()
				.css( {
					"opacity": 0,
					"visibility": "hidden",
					"transition": "all .3s linear",
					"position": "absolute",
					"font-size": "100px",
					"color": "#fff",
					"top": offset.top + 30,
					"left": offset.left
				} )
				.appendTo( document.body );

			clone
			.text( value )
			.next()
			.text( label );

			/** After the dom reflow do transition */
			setTimeout( function() {
				clone.css( {
					
					"visibility": "visible",
					"opacity": 1,
					"top": offset.top - 18
				} );

				setTimeout( function() {
					
					slot.text( value ).next().text( label );
					clone.remove();
				}, 300 );
			} );
		} else {
			slot.text( value ).next().text( label );
		}

		slot.attr( "data-oldvalue", value );
	}

	function tick( slots, times ) {
		
		var

		days = Math.floor( times / (3600 * 1000 * 24) ),
		hours = Math.floor( (times - days * 3600 * 1000 * 24) / (3600 * 1000) ),
		minutes = Math.floor( (times - (days * 3600 * 1000 * 24) - (hours * 3600 * 1000)) / (1000 * 60) ),
		seconds = Math.floor( (times - (days * 3600 * 1000 * 24) - (hours * 3600 * 1000) - (minutes * 1000 * 60)) / 1000 );

		slots.each( function( index ) {
			
			var 
			self = $( this );

			switch ( index ) {
				
				case 0:
					update( self, days, (+days > 1 ? "Days" : "Day") );
					break;

				case 1:
					update( self, hours, (+hours > 1 ? "Hours" : "Hour") );
					break;

				case 2:
					update( self, minutes, (+minutes > 1 ? "Minutes" : "Minute") );
					break;

				case 3:
					update( self, seconds, (+seconds > 1 ? "Seconds" : "Second") );
					break;
			}
		} );

		setTimeout( function() { tick( slots, times - 1000 ); }, 1000 );
	}

})( window.jQuery );

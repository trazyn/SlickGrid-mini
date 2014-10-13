
(function( $, undefined ) {

	var defaults = {
	
		key: "calendar",

		months: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],

		format: "yyyy-MM-dd"
	},

	calc = function( date ) {

		var 
		  prev = new Date( date.getFullYear(), date.getMonth(), 0 ),
		  next = new Date( date.getFullYear(), date.getMonth() + 1, 1 ),

		  now = new Date(),

		  range = {
			  prev: [ prev.getDate() - prev.getDay(), prev.getDate() ],
			  current: [ 1, new Date( date.getFullYear(), date.getMonth() + 1, 0 ).getDate() ],
			  next: [ 1, 6 - next.getDay() + 1 ]
		  }

		  , html = "<div class='headers'>" +
		  	  	"<div class='day-header'>S</div>" +
		  	  	"<div class='day-header'>M</div>" +
		  	  	"<div class='day-header'>T</div>" +
		  	  	"<div class='day-header'>W</div>" +
		  	  	"<div class='day-header'>T</div>" +
		  	  	"<div class='day-header'>F</div>" +
		  	  	"<div class='day-header'>S</div>" +
		  	  "</div>";
		
		for ( var start = range.prev[ 0 ], end = range.prev[ 1 ]; end - start !== 6 && start <= end; ++start ) {
			
			html += "<div class='day past adjacent-month last-month' data-date='" + [ prev.getFullYear(), prev.getMonth() + 1, start ].join( "-" ) + "'>" +
				start +
				"</div>";
		}

		for ( var start = range.current[ 0 ], end = range.current[ 1 ]; start <= end; ++start ) {

			var clazz = "";

			switch ( true ) {
				
				case start < now.getDate():
					clazz = " past ";
					break;

				case date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && start ===  now.getDate():
					clazz = " today ";
					break;
			}
			
			html += "<div class='day " + clazz + "' data-date='" + [ date.getFullYear(), prev.getMonth() + 2, start ].join( "-" ) + "'>" +
				start +
				"</div>";
		}

		for ( var start = range.next[ 0 ], end = range.next[ 1 ]; start <= end; ++start ) {
		
			html += "<div class='day adjacent-month next-month' data-date='" + [ next.getFullYear(), next.getMonth(), start ].join( "-" ) + "'>" +
				start +
				"</div>";
		}

		return "<div class='days'>" + html + "</div>";
	},
	
	Calendar = function( settings ) {
	
		var defaultValue

		, now, current
		, show = function( offset ) {

			offset = offset || 0;
		
			switch ( offset ) {
			
				case 0:
					now = new Date();
					current = [ now.getFullYear(), now.getMonth() + 1, 1 ];
					break;

				case -1:
					if ( 1 === current[ 1 ] ) {

						--current[ 0 ];
						current[ 1 ] = 12;
					} else 
						--current[ 1 ];
					break;

				case 1:
					if ( 12 === current[ 1 ] ) {
						
						++current[ 0 ];
						current[ 1 ] = 1;
					} 
					else ++current[ 1 ];
					break;
			}

			calendar.find( ".clndr-month" ).html( settings.months[ current[ 1 ] - 1 ] + " , " + current[ 0 ] );
			calendar.find( ".days-container" ).html( calc( new Date( current.join( "-" ) ) ) );
		}
			
		, calendar = "<div tabindex=-1 class='clndr' style='top:" + settings.position.top + "; left:" + settings.position.left + "'>" +
					"<div class='controls'>" + 
					"<div class='clndr-previous-button'>Prev</div>" +
					"<div class='clndr-month'>Today</div>" +
					"<div class='clndr-next-button'>Next</div>" +
				"</div>" +
				
				"<div class='days-container'></div>";

		if ( settings.defaultValue instanceof Date ) {
			defaultValue = settings.defaultValue;
		} else if ( "string" === typeof settings.defaultValue ) {
			defaultValue = new Date( settings.defaultValue );
		} else
			defaultValue = new Date();

		calendar = $( calendar );
		show( 0 );
		calendar.appendTo( document.body )
			
			.delegate( ".clndr-previous-button", "click", function( e ) {

				show( -1 );
				e.preventDefault();
			} )
		
			.delegate( ".clndr-next-button", "click", function( e ) {

				show( 1 );
				e.preventDefault();
			} )
			
			.delegate( ".clndr-month", "click", function() {
			
				show( 0 );
			} )
			
			.delegate( ".days-container div.day", "click", function() {
			
				var date = new Date( this.getAttribute( "data-date" ) )

				, value = settings.format.replace( /(yyyy|MM|dd|HH|mm|ss)/g, function( match, post, originalText ) {
					
					switch ( match ) {
						
						case "yyyy":
							return date.getFullYear();

						case "MM":
							return date.getMonth() + 1;

						case "dd":
							return date.getDate();

						case "HH":
							return date.getHours();

						case "mm":
							return date.getMinutes();

						case "ss":
							return date.getSeconds();
					}
				} );

				"function" === typeof settings.callback

					&& settings.callback( value );

				setTimeout( function() { calendar.remove(); } ); } )
			
			.on( "focusout", function() {
				calendar.remove();
			} )
			
			.focus();
	};

	$.fn.calendar = function( options ) {
	
		var settings = $.extend( {}, defaults, options || {} );

		this.each( function() {
			
			settings.trigger = this;

			$( this ).on( "click", function() {
				
				var self, offset;

				if ( !settings.position ) {
				
					self = $( this );
					offset = self.offset();

					settings.position = {
					
						top: offset.top + self.height(),
						left: offset.left
					};
				}

				new Calendar( settings );
			} );
		} );
	};

})( window.jQuery );


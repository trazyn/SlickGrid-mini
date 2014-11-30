
(function( $, undefined ) {

	var defaults = {
	
		key: "calendar",

		readonly: true,

		months: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],

		format: "yyyy-MM-dd",

		selector4input: ":input:first",
		selector4trigger: ".calendar-trigger"
	},

	simpleFormatter = function( date, format ) {
	
		var value = format.replace( /(yyyy|MM|dd|HH|mm|ss)/g, function( match, post, originalText ) {
			
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

		return value;
	},

	calc = function( date, defaultValue ) {

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

			start < now.getDate() && (clazz += " past ");

			date.getFullYear() === defaultValue.getFullYear() && date.getMonth() === defaultValue.getMonth() && start === defaultValue.getDate()
				&& (clazz += " current ");

			date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && start ===  now.getDate()
				&& (clazz += " today ");

			html += "<div class='day " + clazz + "' data-date='" + [ date.getFullYear(), date.getMonth() + 1, start ].join( "-" ) + "'>" +
				start +
				"</div>";
		}

		for ( var start = range.next[ 0 ], end = range.next[ 1 ]; end - start !== 6 && start <= end; ++start ) {
		
			html += "<div class='day adjacent-month next-month' data-date='" + [ next.getFullYear(), next.getMonth() + 1, start ].join( "-" ) + "'>" +
				start +
				"</div>";
		}

		return "<div class='days'>" + html + "</div>";
	},

	identifier = "$ui.calendar",
	
	Calendar = function( target, settings ) {
	
		var defaultValue

		, current
		, show = function( setup ) {

			setup = setup || new Date();
		
			switch ( setup ) {
			
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

				case 12: 
					++current[ 0 ];
					break;

				case -12:
					--current[ 0 ];
					break;

				default:
					current = [ setup.getFullYear(), setup.getMonth() + 1, 1 ];
			}

			calendar.find( ".clndr-month" ).html( settings.months[ current[ 1 ] - 1 ] + " , " + current[ 0 ] );
			calendar.find( ".days-container" ).html( calc( new Date( current.join( "-" ) ), defaultValue ) );
		}

		, input = target.find( settings.selector4input )
		, trigger = target.find( settings.selector4trigger )
			
		, calendar;

		this.$node = target;
		this.settings = settings;

		calendar = "<div tabindex=-1 class='clndr' >" +
					"<div class='controls'>" + 
					"<div class='clndr-previous-year-button'>Prev</div>" +
					"<div class='clndr-previous-button'>Prev</div>" +
					"<div class='clndr-month'>Today</div>" +
					"<div class='clndr-next-button'>Next</div>" +
					"<div class='clndr-next-year-button'>Next</div>" +
				"</div>" +
				
				"<div class='days-container'></div>";

		input.attr( {
			"readonly": settings.readonly ? "readonly" : "",
			"name": target.attr( "name" ) 
		} );

		switch ( true ) {
		
			case settings.defaultValue && "string" === typeof settings.defaultValue:
				defaultValue = new Date( settings.defaultValue );
				input.val( simpleFormatter( defaultValue, settings.format ) );
				break;

			case settings.defaultValue instanceof Date:
				defaultValue = settings.defaultValue;
				input.val( simpleFormatter( defaultValue, settings.format ) );
				break;

			default:
				if ( input.val() ) {
					defaultValue = new Date( input.val() );

					if ( isNaN( +defaultValue ) ) {
						
						input.val( "" );
						defaultValue = new Date();
					}
				} else
					defaultValue = new Date();
		}

		trigger.on( "click", function( e ) {
		
			var rect;

			if ( target.is( "[disabled]" ) ) { return; }

			rect = input[ 0 ].getBoundingClientRect();

			e.preventDefault();
			e.stopPropagation();

			calendar = $( calendar );
			show( defaultValue );
			calendar.appendTo( document.body )

				.css( {
					"top": rect.bottom,
					"left": rect.left,
					"z-index": 999
				} )
				
				.delegate( ".clndr-previous-button", "click", function( e ) {
					show( -1 );
					e.preventDefault();
				} )
			
				.delegate( ".clndr-next-button", "click", function( e ) {
					show( 1 );
					e.preventDefault();
				} )
				
				.delegate( ".clndr-month", "click", function() {
					show();
				} )

				.delegate( ".clndr-previous-year-button", "click", function( e ) {
				
					show( -12 );
					e.preventDefault();
				} )

				.delegate( ".clndr-next-year-button", "click", function( e ) {
				
					show( 12 );
					e.preventDefault();
				} )
				
				.delegate( ".days-container div.day", "click", function() {
				
					var date = new Date( this.getAttribute( "data-date" ) )

					, value = simpleFormatter( date, settings.format );

					input.val( value ).focus();

					"function" === typeof settings.callback

						&& settings.callback( value );

					defaultValue = date;

					setTimeout( function() { calendar.remove(); } ); } )
				
				.on( "focusout", function() {
					calendar.remove();
				} )
				
				.focus();
		} );

	};

	Calendar.prototype = {
		
		val: function( value ) {

			var input = this.$node.find( ":input" );
			
			if ( value && !isNaN( +new Date( value ) ) ) {
				
				var date = new Date( value );

				input.val( simpleFormatter( date, this.settings.format ) );
			} else 
				return input.val();
		},

		disabled: function() {
			this.$node.attr( "disabled", true );
		},

		enabled: function() {
			this.$node.attr( "disabled", false );
		},

		focus: function() {
			this.$node.find( ":input" ).focus();
		}
	};

	$.fn.calendar = function( options, force ) {
	
		var settings = $.extend( {}, defaults, options || {} )
		, instance = this.data( identifier );

		if ( !instance || true === force ) {
			instance = new Calendar( this, settings );
			this.data( identifier, instance );
		}

		return instance;
	};

})( window.jQuery );


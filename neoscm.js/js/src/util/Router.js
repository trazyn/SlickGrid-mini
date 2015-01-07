
(function( $, undefined ) {
	
	var 

	noop = function() {},

	defaults = {
	
		injection: "#container",
		matched: /\w+/i,
		
		before: noop,
		after: noop,

		process: function( hash ) {
			
			return $.ajax( {
				url: "/views/" + hash + ".html",
				dataType: "html"
			} );
		}
	},

	mappings = { },

	hashchange = function( e ) {
	
		var hash = window.location.hash.substr( 1 );

		for ( var key in mappings ) {
			
			var 
			response,
			config = mappings[ key ];

			if ( new RegExp( config.matched ).test( hash ) ) {

				config.before( config );
				response = config.process( hash );
				config.after( config, response );

				process( config, response );

				if ( e ) {
					e.preventDefault();
					e.stopPropagation();
				}
				break;
			}
		}
	};

	function process( config, response ) {
	
		var injection;

		if ( typeof config.injection === "function" ) {
			injection = config.injection();
		} else 
			injection = $( config.injection );

		injection.css( "opacity", 0 ).addClass( "fade out" );

		response
		.done( function( data ) {
			injection.html( data );

			setTimeout( function() {
				injection.css( "opacity", "" ).removeClass( "out" );
			}, 300 );
		} );
	}

	function register( item ) {
	

		var items = item instanceof Array ? item : [ item ];

		for ( var i = 0, length = items.length; i < length; ++i ) {
		
			mappings[ item[ i ].name ] = $.extend( {}, defaults, item[ i ].config );
		}

	}

	register( [ {
	
		name: "1.wiki",

		config: {
			matched: /^wiki(\/)?$/i
		}
	}, {
		name: "2.page",

		config: {
		
			matched: /\w+/i,
			process: function( hash ) {
				
				return $.ajax( {
					url: "/views/" + hash + ".html",
					dataType: "html"
				} );
			},

			injection: function() {
				
				var conatiner = $( "#canvas" );

				return conatiner.length ? conatiner : $( "#container" );
			}
		}
	}, {
		name: "3.index",

		config: {
			matched: /\s*/,

			process: function() {
				
				return $.ajax( {
					url: "/views/home.html",
					dataType: "html"
				} );
			}
		}
	} ] );

	$( window ).off( "hashchange", hashchange ).on( "hashchange", hashchange );

	$( function() {
		hashchange();
	} );

})( window.jQuery );

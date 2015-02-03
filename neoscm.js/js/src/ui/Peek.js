
(function( $ ) {
	
	var 
	namespace = "$ui.peek",

	Peek = function( target, settings ) {
	
		var
		current,
		mappings = {};

		target.find( settings.selector4anchor + "[" + settings.symbol + "]" )
		.each( function() {
			
			var
			name = this.getAttribute( settings.symbol ),
			self = $( this ),
			content = target.find( settings.selector4content + "[" + settings.symbol + "='" + name + "']" );

			if ( content.length ) {
				if ( !current ) {
					current = self.addClass( "active" );
				}

				mappings[ name ] = {
					offsetTop: content.offset().top - content.height(),
					anchor: self
				};
			}
		} );
		
		target
		.undelegate( settings.selector4anchor + "[" + settings.symbol + "]", "click" )
		.delegate( settings.selector4anchor + "[" + settings.symbol + "]", "click", function( e, args ) {
			
			var
			name = this.getAttribute( settings.symbol ),
			item = mappings[ name ];

			if ( item ) {
				
				current.removeClass( "active" );
				current = item.anchor.addClass( "active" );

				args === undefined && $( target ).animate( {
					
					"scrollTop": item.offsetTop
				}, 400 );

				e.stopPropagation();
				e.preventDefault();
			}
		} );

		$( document )
		.off( "scroll", autoAnchor )
		.on( "scroll", { mappings: mappings, offset: settings.offset }, autoAnchor );
	},

	timer;
	
	function autoAnchor( e ) {
		
		clearTimeout( timer );

		timer = setTimeout( function() {
			
			var
			/** Shortcuts */
			mappings = e.data.mappings,
		      	offset = e.data.offset,
		      	containerOffsetTop = document.body.scrollTop,
		      	sort = [];

			for ( var i in mappings ) {
				
				var item = mappings[ i ];

				sort.push( {
					offset: Math.abs( containerOffsetTop - item.offsetTop - offset ),
					item: item
				} );
			}

			sort.sort( function( x, y ) {
				
				if ( x.offset > y.offset ) {
					return 1;
				}

				if ( x.offset === y.offset ) {
					return 0;
				}

				return -1;
			} );

			var destination = sort[ 0 ][ "item" ][ "anchor" ];

			if ( !destination.hasClass( "active" ) ) {
				e.stopPropagation();
				e.preventDefault();
				destination.trigger( "click", { animate: false } );
			}
		}, 400 );
	}

	$.fn.peek = function( options ) {
	
		this.each( function() {
			new Peek( $( this ), $.extend( {}, $.fn.peek.defaults, options || {} ) );
		} );
	};

	$.fn.peek.defaults = {
		
		symbol 			: "data-anchor",
		offset 			: 0,

		selector4anchor 	: "#peek li",
		selector4content 	: "#canvas header"
	};

})( window.jQuery );

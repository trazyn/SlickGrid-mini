
define( function() {

	var Rates = function( target, callback, args ) {
	
		var enabled = true

		, starts = target.find( ".su-icon-start" )

		, width = target.width();

		this.$node = target

		/** Highlight */
		.on( "mousemove hl hl-selected", function( e ) {

			if ( !enabled ) {
				
				return;
			}

			if ( "hl-selected" === e.type ) {

				/** Hack the mousemove */
				setTimeout( function() {
				
					starts.addClass( "active" ).css( "width", target.attr( "data-value" ) * 20 + "%" );
				} );

				return e.stopPropagation();
			}

			starts.removeClass( "active" ).css( "width", Math.ceil((e.offsetX / width).toFixed( 2 ) / 0.2) * 20 + "%" );
		} )

		/** Deactivate */
		.on( "mouseout", function( e ) {

			if ( !enabled || e.toElement === starts.get( 0 ) ) {
				
				return;
			}

			target.is( "[active]" ) ? target.trigger( "hl-selected" ) : starts.css( "width", "0%" );
		} )
		
		/** Selected */
		.on( "click", function( e ) { 
			
			if ( enabled ) {
			
				target.attr( "active", true ).trigger( "hl-selected" ).attr( "data-value", Math.ceil((e.offsetX / width).toFixed( 2 ) / 0.2) );

				if ( "function" === typeof callback ) {
					
					args  = args instanceof Array ? args : [ args ];

					callback.apply( this, args );
				}
			}
		} );

		this.disabled = function() {
			
			enabled = false;
			return this;
		};

		this.enabled = function() {
			
			enabled = true;
			return this;
		};
	}
	
	, identifier = "$ui.Rates";

	Rates.prototype = {
		
		val: function( value ) {
			
			if ( value ) {

				value = +parseFloat( value ).toFixed( 1 );

				this.enabled();
				this.$node.attr( "data-value", value ).trigger( "hl-selected" );

				return this.disabled();
			} else
				return +(this.$node.attr( "data-value" )) || 0;
		}
	};

	$.fn.rates = function( callback, args ) {
		
		var instance = this.data( identifier );

		if ( !instance ) {
		
			this.data( identifier, instance = new Rates( this, callback, args ) );
		}

		return instance;
	};
} );


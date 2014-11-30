
;(function( $, undefined ) {
	
	var identifier = "$ui.validInput"

	, defaults = {
		
		showSuccess: false,

		validation: undefined
	}
	
	, ValidInput = function( ele, settings ) {
		
		var self = this;

		this.$input = ele.find( "input.text" );
		this.$samll = ele.find( "small.su-valid-msg" );

		this.valid = function() {

			var value = self.val(), res = true;

			if ( settings.validation ) {

				if ( "function" === typeof settings.validation ) {

					if ( true === settings.isAjax ) {
						
						res = $.Deferred();

						res.done( function() {
							self.success();
							self.$input.attr( "data-valid", true );
						} ).fail( function() {
							self.error();
							self.$input.attr( "data-valid", false );
						} )

						.always( function() { self.done(); } );

						if ( "blur" === window.event.type || !self.$input.is( "[data-valid]" ) ) {
							
							self.loading();
							settings.validation.call( this, value, res );
						} else {
							try {
								+eval(self.$input.attr( "data-valid" ) || 0) ? res.resolve() : res.reject();
							} catch( ex ) { res.reject(); }
						}

					} else
						/** True or false */
						res = settings.validation.call( this, value );
				}

				switch ( true ) {
					
					/** TODO: */
				}
			} else {
				
				res = !!(value || "").replace( /^\s+|\s+$/g, "" );
			}

			switch ( res ) {
				
				case true: 
					settings.showSuccess ? self.success() : self.normal();
					break;

				case false:
					self.error();
					break;

				case undefined:
					self.normal();
					break;
			}

			return res;
		};

		this.$input.on( "blur", function() { self.valid(); } ).val( settings.val || "" );
	};

	ValidInput.prototype = {
		
		loading: function() {
			this.normal().$samll.addClass( "circle-icon" );
			return this;
		},

		done: function() {
			this.$samll.removeClass( "circle-icon" );
			return this;
		},

		success: function() {
			this.$input.removeClass( "error" ).addClass( "info" );
			this.$samll.removeClass( "error" ).addClass( "success" );
			return this;
		},

		disabled: function() {
			this.$input.attr( "disabled", true );
		},

		enabled: function() {
			this.$input.attr( "disabled", false );
		},

		error: function() {
			this.$input.removeClass( "info" ).addClass( "error" ).focus();
			this.$samll.removeClass( "success" ).addClass( "error" );
			return this;
		},

		normal: function() {
			this.$input.removeClass( "info error" );
			this.$samll.removeClass( "success error" );
			return this;
		},

		val: function( value ) {
			return value ? (this.$input.val( value ), this) : this.$input.val();
		}
	};

	$.fn.validInput = function( options ) {
	
		var instance = this.data( identifier );

		if ( !instance ) {
			
			instance = new ValidInput( this, $.extend( true, {}, defaults, options || {} ) );
			this.data( identifier, instance );
		}

		return instance;
	};
})( window.jQuery );



;(function( $, undefined ) {

	var defaults = {

		maxlength: 200,
		minlength: 10,

		alwaysTip: true,

		selector4input: ".text",
		selector4msg: "small",

		error: "The text should between ${min} and ${max} characters!",
		warn: "Please input!",
	}

	, identifier = "$ui.smartInput"

	, formart = function( msg, settings ) {

		return msg.replace( /\$\{min\}/g, settings.minlength ).replace( /\$\{max\}/g, settings.maxlength );
	}
	
	, SmartInput = function( target, settings ) {
	
		var self = this

		, valid = true

		, input = target.find( settings.selector4input ).val( settings.val ), message = target.find( settings.selector4msg )
		, both = input.add( message );

		input
			.attr( "maxlength", settings.maxlength )

			.on( "focusout focus keyup showtip", function( e ) {

				var length = input.val().length;

				if ( (length > settings.minlength && length < settings.maxlength) || settings.minlength === 0 ) {

					both.removeClass( "error warn" ).addClass( "info" );

					message.html( length + "/" + settings.maxlength );

					if ( !settings.alwaysTip && "focusout" === e.type ) {

						both.removeClass( "info" );
					}

					return valid = true;
				}

				if ( !length && +settings.minlength > 0 ) {

					valid = false;

					both.removeClass( "error info" ).addClass( "warn" );

					message.html( formart( settings.warn, settings ) );
				} else {
					valid = false;

					both.removeClass( "info warn" ).addClass( "error" );

					message.html( formart( settings.error, settings ) );
				}
			} );

		settings.alwaysTip && input.trigger( "showtip" );

		this.$node = target;
		this.settings = settings;
		this.valid = function() {
			
			input.trigger( "focusout" );
			return valid;
		};

	};

	SmartInput.prototype = {
		
		disabled: function() {
			
			this.$node.find( this.settings.selector4input ).attr( "disabled", true );
		},

		enabled: function() {
		
			this.$node.find( this.settings.selector4input ).removeAttr( "disabled" );
		},

		val: function( value ) {
			
			var input = this.$node.find( this.settings.selector4input );

			if ( value ) {
				
				input.val( value );
				return this;
			} else
				return input.val();
		}
	};

	$.fn.smartInput = function( options ) {

		var settings = $.extend( {}, defaults, options || {} )
			
		, instance = this.data( identifier );

		if ( !instance ) {
			instance = new SmartInput( this, settings );
			this.data( identifier, instance );
		}

		return instance;
	};

})( window.jQuery );


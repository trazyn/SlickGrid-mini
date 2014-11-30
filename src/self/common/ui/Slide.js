
(function( $ ) {

	var defaults = {
		class4open: "open",
		selector4trigger: "small:first",
		selector4content: "section:first"
	}

	, identifilter = "$ui.slide"

	, Slide = function( target, settings ) {
	
		var trigger = "string" === typeof settings.selector4trigger ? target.find( settings.selector4trigger ) : settings.selector4trigger
		, content = "string" === typeof settings.selector4content ? target.find( settings.selector4content ) : settings.selector4content
		
		, onClose = settings.onClose
		, onOpen = settings.onOpen
	
		, self = this;

		this.$node = target;
		this.settings = settings;

		"function" === typeof settings.init && settings.init.call( this, target );

		trigger.on( "click", function( e ) {
		
			if ( content.is( "." + settings.class4open ) ) {
				target.add( content ).removeClass( settings.class4open );
				"function" === typeof onClose && onClose.call( self );
			} else {
				target.add( content ).addClass( settings.class4open );
				onOpen instanceof Function && onOpen.call( self );
			}
		} );
	};

	Slide.prototype = {
		
		open: function() {
		
			if ( !this.$node.is( this.settings.class4open ) ) {
				this.$node.find( ":small" ).click();
			}
		},

		close: function() {
		
			if ( this.$node.is( this.settings.class4open ) ) {
				this.$node.find( ":small" ).click();
			}
		}
	};

	$.fn.slide = function( options ) {
		
		var instance = this.data( identifilter )
			
		, settings = $.extend( {}, defaults, options || {} );

		if ( !instance ) {
			instance = new Slide( this, settings );
			this.data( identifilter, instance );
		}

		return instance;
	};
})( window.jQuery );

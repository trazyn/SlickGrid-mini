;(function( $ ) {

	var defaults = {
	
		speed: 0,
		random: false,

		stateDelay: 300,

		class4loading: "ripple-loading",
		class4success: "ripple-success",
		class4error: "ripple-error"
	}

	, identifier = "$ui.ripple"
	
	, Ripple = function( target, settings ) {

		var self = this

		, ripple = target.find( "span.ripple" )
		, max = Math.max( target.height(), target.width() );

		this.$node = target.css( "position", "relative" );
		this.settings = settings;

		if ( !ripple.length ) {
			ripple = $( "<span class='ripple'>" )
				.css( {
					width: max,
					height: max
				} )
				.appendTo( target );
		}

		target.on( "click", function( e ) {
			self.start( e );
		} );
	};

	Ripple.prototype = {
		
		disabled: function() {
			this.$node.attr( "disabled", true );
			return this;
		},

		enabled: function() {
			this.$node.attr( "disabled", false );
			return this;
		},

		start: function( e ) {

			var self = this

			, settings = self.settings
			, offset = this.$node.offset()
			, X = e ? e.pageX : (offset.left + this.$node.outerWidth() / 2)
			, Y = e ? e.pageY : (offset.top + this.$node.outerHeight() / 2)
			, rect = this.$node[ 0 ].getBoundingClientRect()
			, ripple = this.$node.find( "span.ripple" )
			, position = {
				top: Y - rect.top - ripple[0].offsetHeight / 2 - document.body.scrollTop,
				left: X - rect.left - ripple[0].offsetWidth / 2 - document.body.scrollLeft,
			};

			settings.speed && self.disabled().$node.addClass( settings.class4loading );

			(function f( self, ripple, speed, position ) {

				self.timer = setTimeout( function() {
				
					ripple.removeClass( "show" )
						.css( {
							top: position.top,
							left: position.left,
							background: "#" + Math.floor( Math.random() * 0xFFF + 0 ).toString( 0xF )
						} );

					setTimeout( function() { ripple.addClass( "show" ); 
						   speed && f( self, ripple, speed, position );
					}, 77 );
				}, self.settings.speed );

				if ( self.settings.random ) {
					
					var height = ripple[ 0 ][ "offsetHeight" ], width = ripple[ 0 ][ "offsetWidth" ];

					position = {
						top: e.pageY - rect.top - document.body.scrollTop - (Math.random() * (0 - height) + height),
						left: e.pageX - rect.left - document.body.scrollLeft - (Math.random() * (0 - width) + width)
					};
				}

			})( self, ripple, self.settings.speed, position );

			return this;
		},

		done: function( state ) {

			var self = this, $node = this.$node, settings = this.settings, clazz;

			clearTimeout( self.timer );

			$node.removeClass( settings.class4loading );
			clazz = (state === true || undefined === state) ? settings.class4success : settings.class4error;
			$node.addClass( clazz ) ;
			setTimeout( function() {
				self.enabled();
				$node.removeClass( clazz );
			}, settings.stateDelay );
		}
	};

	$.fn.ripple = function( options ) {
		
		var instance = this.data( identifier );

		if ( !instance ) {
			instance = new Ripple( this, $.extend( {}, defaults, options || {} ) );
			this.data( identifier, instance );
		}

		return instance;
	};

})( window.jQuery );



(function( $, window ) {
	
	var
	defaults = {
		selector4current 	: ".selected",
		selector4item 		: "li:not(.indicator)",
		indicator 		: "<li class='indicator'/>",
		speed 			: 222
	},

	namespace = "$ui.lavalamp",
	
	Lavalamp = function( target, settings ) {
		
		var
		current = target.find( settings.selector4current ),
		indicator = $( settings.indicator ).appendTo( target ),

		move = function( ele, animate ) {
			var
			position = ele.position(),
			properties = {
				left 	: position.left + "px",
				top 	: (ele.innerHeight() + ele[0]["offsetTop"]) + "px",
				width 	: ele.innerWidth() + "px",
				height 	: 0
			};

			(animate = animate === undefined ? true : animate)
				
				? indicator.stop( true, false ).animate( properties, settings.speed )
				: indicator.css( properties );
		};

		this.$node = target;
		this.settings = settings;

		if ( current.length === 0 ) {
			current = target.find( settings.selector4item ).eq( 0 );
		}

		current.length && move( current );

		target
		.delegate( settings.selector4item, "mouseover", function( e ) {
		
			move( $( this ) );
		} )
		.delegate( settings.selector4item, "mouseout", function( e ) {
			
			move( current );
		} )
		.delegate( settings.selector4item, "click", function( e ) {
			
			current = $( this );
		} );

		this.move = move;
	};

	$.fn.lavalamp = function( options ) {
		
		var
		instance = this.data( namespace );

		if ( !instance ) {
			
			instance = new Lavalamp( this, $.extend( {}, defaults, options || {} ) );
			this.data( namespace, instance );
		}

		return instance;
	};

})( window.jQuery, window );


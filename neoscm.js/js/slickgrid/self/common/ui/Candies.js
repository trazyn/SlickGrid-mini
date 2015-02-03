
;(function( $ ) {

	var defaults = {
	
		require: true,
		max: 1,

		selector4item: "li a",

		class4selected: "btn-active",
		class4disabled: "ul-disabled"
	}
	
	, Candies = function( target, settings ) {

		var candies = this;

		target = $( target )

				.on( "click", settings.selector4item, function( e ) {
				
					var self, clazz, selector, length, max;

					e.preventDefault();

					if ( true === candies.disabled ) {

						return;
					}

					self = $( this );
					clazz = settings.class4selected;
					selector = settings.selector4item + "." + clazz;
					length = target.find( selector ).length;
					max = +settings.max;

					if ( self.is( selector ) ) {
						
						false === settings.require && max !== 1 && self.removeClass( clazz );
					} else {
						
						switch ( true ) {
							
							/** No limit */
							case !max:
								self.addClass( clazz );
								break;

							case 1 === max:
								candies.$last && candies.$last.removeClass( clazz );
								candies.$last = self.addClass( clazz );
								break;

							case length < max:
								self.addClass( clazz );
								break;
						}
					}
				} );

		this.$node = target;
		this.settings = settings;
	}
	
	, identifier = "$Candies";

	Candies.prototype = {
	
		val: function( value ) {
			
			var res = this;

			if ( value ) {
				
				var clazz = this.settings.class4selected;

				value = value instanceof Array ? value : [ value ];

				for ( var i = value.length; --i >= 0; ) {
					
					this.$last = this.$node
							.find( this.settings.selector4item + "[item-value=" + value[ i ] + "]" )
							.addClass( clazz );
				}
			} else {
				
				var selected = this.$node.find( this.settings.selector4item + "." + this.settings.class4selected );

				res = [];

				for ( var i = selected.length; --i >= 0; ) {
					
					res.push( selected.eq( i ).attr( "item-value" ) || "" );
				}

				this.settings.max === 1 && (res = res[0]);
			}

			return res;
		},

		disabled: function() {
		
			this.$node.addClass( this.settings.class4disabled );
			this.disabled = true;
		},

		enabled: function() {
			
			this.$node.removeClass( this.settings.class4disabled );
			this.disabled = false;
		}
	};

	$.fn.candies = function( options ) {
	
		var self = $( this ), settings

		, instance = self.data( identifier );

		if ( !instance ) {
			
			settings = $.extend( {}, defaults, options || {} );

			instance = new Candies( self, settings );
		}

		return instance;
	};

})( window.jQuery );


(function( $, undefined ) {

	"use strict";

	var ALIGN

	, EVENT_UPDATE = "dropdown-update"
	, EVENT_SELECT = "dropdown-select"
	, EVENT_DESELECT = "dropdown-deselect"
	, EVENT_TOGGLE = "click"

	, Select = function( target, settings ) {

		var self = this;

		target = $( target )

		/** Update the text */
		.on( EVENT_UPDATE, function( e ) {
			
			var text = ""
			, bar = target.find( "button > span:first" )
			, lis = target.find( "li[selected]" )
			
			, e = e || window.event
			
			, _target = e ? $( e.target || e.srcElement ) : 0;

			if ( settings.readonly ) { return; }

			for ( var i = 0; i < lis.length; ++i ) {
				
				text += lis.eq( i ).text() + (i === lis.length - 1 ? "" : ", ");
			}

			/** Event for change */
			if ( text !== bar.html() ) {

				bar.html( text || settings.nothing );
				bar.attr( "title", text || settings.nothing );

				/** Trigger update */
				_target &&
				((_target.get( 0 ) || {}).nodeName || "Ajax").toLowerCase() in { "span": 1, "li": 1 } &&

				"function" === typeof settings.change &&
				settings.change.call( _target, e );

				target.trigger( "toggle" );
			}

			/** Event of click */
			/**
			_target && ((_target.get( 0 ) || {}).nodeName || "Ajax").toLowerCase() in { "span": 1, "li": 1 } 
				&& settings.click instanceof Function 
				&& settings.click.call( _target, e );
			*/
		} )

		/** Show the dropdown */
		.delegate( "button", "click toggle", function() {

			var self = $( this )

			, contents = target.find( "button + div" );

			if ( self.is( ".open" ) ) {
				
				self.removeClass( "open" );

				contents.hide();
			} else {
				
				self.addClass( "open" );

				contents.show().find( "ul" ).focus();
			}

			/** Prevent the form submission */
			return false;
		} )

		/** Hide the dropdown */
		.delegate( "button + div", "focusout", function() {

			var handler = target.find( "button" );

			setTimeout( function() {
				
				handler.is( ":focus" ) ||
						( handler.removeClass( "open" ), target.find( "button + div" ).hide() );
			}, 177 );
		} )

		/** Select an item */
		.delegate( "li", EVENT_SELECT, function() {
			
			var self = $( this );

			if ( false === settings.multi ) {
				
				target.find( "li[selected]" ).removeAttr( "selected" );
			}

			self.attr( "selected", true );
		} )
		
		/** Deselect an item */
		.delegate( "li", EVENT_DESELECT, function() {
			
			var self = $( this );

			if ( true === settings.required && self.is( "[selected]" ) ) {
				
				return;
			}

			self.removeAttr( "selected" );
		} )
		
		/** Item toggle */
		.delegate( "li", EVENT_TOGGLE, function( e ) {
			
			var item = $( this )
			, selected = item.is( "[selected]" )
			, click = settings.clicks[ item.attr( "data-index" ) ];

			if ( !settings.readonly ) {
				if ( selected ) {
					
					item.trigger( EVENT_DESELECT );
				} else
					item.trigger( EVENT_SELECT );

				settings.click instanceof Function && settings.click.call( $( this ), e );

				target.trigger( EVENT_UPDATE );
			}

			"function" === typeof click && click();
		} )
		.delegate( "[event-name]", "click", function() {
			
			var e = settings.events[ $( this ).attr( "event-name" ) ];

			"function" === typeof e && e.call( self, $( top.event.target ) );
		} );

		this.$node = target;
		this.settings = settings;

		render( target, settings );
	};

	Select.prototype = {
		
		val: function( value, eventType ) {
		
			var res = [];
	
			if ( value && !this.settings.readonly ) {
				
				value = $.isArray( value ) ? value : [ value ];

				for ( var i = value.length; --i >= 0; ) {
					
					var item = this.$node.find( "ul li[item-value=" + value[ i ][ this.settings.valueKey ] + "]" )
						
					, callback;

					if ( item.length ) {
						
						item.trigger( EVENT_SELECT );

						res.push( value[ i ][ this.settings.valueKey ] );

						if ( eventType ) {
							
							callback = this.settings[ eventType === true ? "click" : eventType ];
						}
						callback instanceof Function && callback.call( item );
					}
				}

				this.$node.trigger( EVENT_UPDATE );

			} else {
				
				this.$node
					.find( "li[selected]" )
					.each( function() {
						
						res.push( $( this ).attr( "item-value" ) );
					} );
			}

			return res;
		},

		add: function( data ) {
			
			var data = this.settings.data.concat( data ? data : (data ? [data] : []) );
			this.settings.data = data;
			render( this.$node, this.settings );

			return this;
		},

		selectAll: function() {
		
			if ( !this.settings.readonly ) {
				this.$node.find( "ul li" ).attr( "[selected]", true );
				this.$node.trigger( EVENT_UPDATE );
			}

			return this;
		},

		deselectAll: function() {
		
			this.$node.find( "ul li" ).removeAttr( "selected" );
			this.$node.trigger( EVENT_UPDATE );

			return this;
		},

		disabled: function() {
		
			this.$node.find( "button" ).attr( "disabled", true );
			return this;
		},

		enabled: function() {
		
			this.$node.find( "button" ).attr( "disabled", false );
			return this;
		}
	};

	/**
	 * Generate HTML
	 *
	 * @param target 	$DOM
	 * @param settings 	Object
	 * */
	var render = function( target, settings ) {
	
		var lis = function() {
			
			var res = "";

			settings.clicks = {};

			for ( var data = settings.data.reverse(), i = data.length; --i >= 0; ) {

				var li = settings.render( data[ i ], settings );

				res += $( "<p>" ).append( $( li ).attr( "data-index", i ) ).html();

				settings.clicks[ i ] = data[ i ][ "click" ];
			}

			return res;
		}()
		, content = [ "<div class=", settings.clazz, ">",
					"<button>",
						"<span>", settings.nothing, "</span>", "&nbsp;", "<span></span>",
					"</button>",

					"<div style='display: none;'>",
						"<span></span>",
						"<ul tabindex=-99 style='outline: 0;'>",

						lis,

						"</ul>",
					"</div>",
				"</div>" ].join( "" );

		$( target ).html( settings.clazz ? content : $( content ).html() ).trigger( EVENT_UPDATE );
	};

	$.fn.dropdown = function( option ) {
		
		var self = $( this )

		, settings;

		if ( option ) {
		
			settings = $.extend( true, {}, $.fn.dropdown.defaults, option || {} );

			settings.data = $.isArray( settings.data ) ? settings.data : (settings.data ? [settings.data] : []);

			self.each( function() {
				
				var self = $( this );

				self.data( "select", new Select( self, settings ) );
			} );
		}

		return self.data( "select" );
	};

	$.fn.dropdown.defaults = {
		
		nothing: "Please select",

		multi: false,

		readonly: false,

		required: false,

		clazz: "",

		textKey: "text",
		valueKey: "value",

		render: function( item, settings ) {
		
			return "<li item-value=" + item[ settings.valueKey ] + "><span>" + (item[ settings.textKey ] || item[ settings.valueKey ]) + "</span></li>";
		},

		callback: undefined
	};

})( window.jQuery );


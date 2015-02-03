
(function( $, undefined ) {
	
	var
	namespace = "$ui.dropmenu",

	Dropmenu = function( target, settings ) {
		
		var
		data = settings.data,
		tab,
		deferred;

		this.$node = target;
		this.settings = settings;

		if ( !data ) {
			if ( settings.service ) {
				
				var service = settings.service;

				deferred = $.Deferred();

				$.ajax( {
					
					data: {
						name: service.name,
						params: JSON.stringify( service.params )
					}
				} )
				.done( function( data ) {
					
					data = eval( "(" + data + ")" ).result;
					data = JSON.parse( data[ service.module ] );

					deferred.resolveWith( data );
				} )
				.fail( deferred.reject );
			} else {
				"function" === typeof settings.dataProxy && (deferred = settings.dataProxy);
			}
		}

		$.when( deferred ).done( function() {
			
			data = dataGroup( data || this, settings );

			tab = render( target, data, settings );
		} );

		var 
		/** UI component */
		input = target.find( "input:first" ),
		arrow = input.next(),
		content = target.find( "> .content" ),
		
		/** Store the current selected item */
		selected = $(),

		/** A queue of current operation */
		adds, dels,

		markSelected = function() {
		
			tab.$tabs.each( function() {
				
				var 
				self = $( this ),
				index = self.find( ".selected" ).attr( "data-index" );

				index && tab.$navs.filter( "[data-index=" + index + "]" ).addClass( "reddot" );
			} );
		},
		
		/** Fast keybord input */
		timer;

		target
		.delegate( "input:first", "click", function( e ) {
		
			if ( !target.is( "[disabled]" ) && !content.hasClass( "show" ) ) {
				
				content.addClass( "show" );
				arrow.addClass( "reverse" );

				adds = dels = $();
			}
		} )
		.delegate( "span.item[data-filter]", "click", function( e ) {
		
			var self = $( this );

			if ( self.hasClass( "selected" ) ) {
				
				dels = dels.add( self.removeClass( "selected" ) );
				adds = adds.filter( ".selected" );
			} else {
				adds = adds.add( self.addClass( "selected" ) );
				dels = dels.not( ".selected" );
			}

			markSelected();
		} )
		.delegate( "button[name=ok]", "click", function( e ) {
		
			var
			text = [],
			value = [];

			selected = selected.add( adds ).not( dels );

			for ( var i = 0, length = selected.length; i < length; ++i ) {
				
				text.push( selected[ i ][ "innerHTML" ] );
				value.push( selected[ i ][ "getAttribute" ]( "data-filter" ) );
			}

			content.removeClass( "show" );
			arrow.removeClass( "reverse" );

			input.val( text.join() );
			target.attr( "data-value", value.join() );
		} )
		.delegate( "button[name=cancel]", "click", function( e ) {

			var text = "";
		
			for ( var i = dels.length; --i >= 0; dels.eq( i ).addClass( "selected" ) );
			for ( i = adds.length; --i >= 0; adds.eq( i ).removeClass( "selected" ) );

			markSelected();

			content.removeClass( "show" );
			arrow.removeClass( "reverse" );
		} )
		.delegate( "input[name=filter]", "input", function( e ) {
		
			var 
			value = this.value,
			post = function() {
			
				var
				items = tab.$tabs.find( "span.item[data-filter]" ),
				matched,

				startup,

				navs = tab.$navs, tabs = tab.$tabs;

				if ( value ) {
				
					matched = items.filter( "[data-filter*='" + value.toLowerCase() + "']" );

					tab
					.$node
					.add( items.not( matched ) )
					.add( navs )
					.add( tabs )
					.css( "display", "none" );

					matched.show().each( function() {
						
						var leader = this.innerHTML[ 0 ][ "toUpperCase" ]();

						startup = startup || leader;

						navs.add( tabs ).filter( "[data-index=" + leader + "]" ).css( "display", "" );
					} );

					/** Reflow the content */
					tab.$node.show();
					tab.active( startup );
				} else {

					items
					.add( navs )
					.add( tabs )
					.css( "display", "" );

					tab.active( navs.first().attr( "data-index" ) );
				}
			};

			clearTimeout( timer );

			timer = setTimeout( post, settings.delay );
		} );
	};

	function dataGroup( data, settings ) {
	
		var 
		valueKey = settings.valueKey,
		textKey = settings.textKey,
		result = {},
		
		add = function( item ) {
			
			var leader = (item.text[ 0 ] || "").toUpperCase();

			if ( !leader ) { return; }

			if ( leader >= "A" && leader <= "Z" ) {
				
				(result[ leader ] = result[ leader ] || []).push( item );

			} else {
				
				(result[ "Other" ] = result[ "Other" ] || []).push( item );
			}
		};

		for ( var i = data.length; --i >= 0; ) {

			var item = data[ i ];

			if ( !item ) { continue; }

			if ( "string" === typeof item ) {
				add( { text: item, value: item } );
				continue;
			}

			if ( "object" === typeof item && !(item instanceof Array) ) {
				add( { text: item[ textKey ], value: item[ valueKey ] } );
			}
		}

		return result;
	}

	function render( target, data, settings ) {
	
		var
		startup,
		tabs = [];

		for ( var index in data ) {
		
			startup = startup || index;

			(function( item ) {

				tabs.push( {
					
					index: index,

					immediate: true,

					render: function() {
						
						var 
						data = item,
						html = "";
						
						for ( var i = 0, length = data.length; i < length; ++i ) {
							html += "<span data-filter='" + data[ i ][ "text" ][ "toLowerCase" ]() + "' data-value='" + data[ i ][ "value" ] + "' class='item'>" + data[ i ][ "text" ] + "</span>";
						}

						return html;
					}
				} );
			
			})( data[ index ] );
		}

		return target.find( ".ui.tab:first" ).tab().add( tabs ).active( startup );
	}

	Dropmenu.prototype = {
		
		disabled: function() {
		
			this.$node.attr( "disabled", true );
		},

		enabled: function() {
		
			this.$node.removeAttr( "disabled" );
		}
	};

	$.fn.dropmenu = function( options ) {
	
		var instance = this.data( namespace );

		if ( !instance ) {
		
			instance  = new Dropmenu( this, $.extend( {}, $.fn.dropmenu.defaults, options || {} ) );
			this.data( namespace, instance );
		}

		return instance;
	};

	$.fn.dropmenu.defaults = {

		textKey 	: "text",
		valueKey 	: "value",

		nothing 	: "Nothing...",

		/** Delay after the keybord input */
		delay 		: 400,
		
		/** Local array */
		data 		: undefined,

		/**
		 * Return promise
		 *
		 * Example:
		 * function() {
		 * 	
		 * 	var deferred = $.Deferred();
		 *
		 * 	$.ajax( "api" )
		 * 	 .done( function( data ) {
		 * 		deferred.resolveWith( data );
		 * 	 } )
		 * 	 .fail( deferred.reject );
		 *
		 * 	return deferred.promise();
		 * }
		 * */
		dataProxy 	: undefined
	};
})( window.jQuery );

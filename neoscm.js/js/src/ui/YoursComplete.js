;(function( $, undefined ) {

	"use strict";
	
	var

	namespace = "$ui.yoursComplete",

	YoursComplete = function( ele, settings ) {
	
		var 
		  self = this,

		  /** Cache the search result */
		  cache = {},

		  /** Current input value */
		  query,

		  /** Current suggestion item */
		  suggestion,

		  /** The raw data */
		  data,

		  /** Loading, error, success */
		  indicator,
		  
		  /** Front input */
		  fg, 

		  /** Backend input */
		  bg;

		this.$node = ele;
		this.settings = settings;
		this.list = $( "<div tabindex=-1 style='position: absolute; outline: 0;' class='" + settings.class4list + "'>" ).appendTo( ele );

		function setupCache( key, data ) {
			cache[ key.toLowerCase() ] = data;
		}

		function suggest( force ) {

			var keyCode;
		
			self.stopSuggest();

			if ( event ) {
				keyCode = event.keyCode;
			}

			if ( keyCode === undefined 
					? fg.value && settings.delimiter === fg.value.substr( -1 )
					: keyCode === settings.delimiter.charCodeAt() ) {

				if ( data && data.length === 1 ) {

					var 
					  match = new RegExp( settings.delimiter + "?([^" + settings.delimiter + "]*)" + settings.delimiter + "$" ).exec( fg.value ),
					  value = match && match[ 1 ];

					if ( value && value.toLowerCase() === data[ 0 ][ settings.textKey ][ "toLowerCase" ]() ) {
						setupCache( value, data );
					}
				}
				return;
			}

			settings.timer = setTimeout( function() {
			
				var 
				  value = fg.value,
				  currentValue = value ? value.replace( new RegExp( "^.{1,}" + settings.delimiter + "", "g" ), "" ) : "",
				
				  showSuggestion = function() {
				  
					  if ( data.length ) {

						  /** Cache current result */
						  setupCache( query, data );

						  for ( var html = "", i = 0, length = data.length; i < length; ++i ) {
							  html += settings.formatter( data[ i ], i, query, settings );
						  }

						  setbg();
						  self.list.html( "<ul>" + html + "</ul>" );

						  /** Only one result that just select it */
						  if ( 1 === data.length 
							  && settings.autoSelect 
							  && query.toLowerCase() === data[ 0 ][ settings.textKey ][ "toLowerCase" ]() ) {

								  select( data[ 0 ] );
								  return;
							  }
					  } else {
						  return finishSuggest();
					  }

					  self.list
					  .css( {
						  "top": fg.offsetHeight,
						  "left": 0,
						  "width": fg.offsetWidth
					  } )
					  .addClass( "show" );
				  };

				if ( currentValue === query ) { return; }

				query = currentValue;
				
				if ( query && query.length >= settings.minChars ) {
					
					/** Try to get data from cache */
					data = cache[ query.toLowerCase() ] || (function( key ) {

						var i = 0, res;

						if ( !force ) {
							while ( key = key.replace( new RegExp( ".{1}$" ), "" ) ) {
								
								res = cache[ key.toLowerCase() ];
								if ( res && res.length < settings.breaksize ) {
									break;
								}
							}
						}
						return res;
					})( query );

					if ( data && cache[ query.toLowerCase() ] ) {
						showSuggestion();
					} else {
					
						filter.call( self, data, query )
							.done( function() {

								data = this.userData;

								/** Bind cache to DOM for debug */
								settings.cacheKey && ele.data( settings.cacheKey, cache );

								showSuggestion();
							} );
					}

				} else {
					bg.value = "";
					self.list.removeClass( "show" );
				}

			}, settings.suggestDelay );
		}

		function finishSuggest() {
		
			bg.value = "";
			self.stopSuggest();
			self.list.removeClass( "show" );
		}

		function setbg() {

			var prefix = fg.value.indexOf( "," ) !== -1 ? fg.value.replace( /\,[^,]+$/, " " ) : "";

			return bg.value = prefix + data[ 0 ][ settings.textKey ][ "replace" ]( new RegExp( "^" + query, "i" ), query );
		}

		function setfg( value ) {
		
			if ( fg.value.indexOf( settings.delimiter ) === -1 ) {
				return fg.value = value;
			}

			return fg.value = fg.value.replace( new RegExp( settings.delimiter + "[^+" + settings.delimiter + "]+$" ), "," ) + value;
		}

		function select( item ) {

			var 
			  value = ele.data( "data-value" ),
			  index = fg.value.toLowerCase().split( settings.delimiter ).indexOf( item[ settings.textKey ][ "toLowerCase" ]() );

			query = item[ settings.textKey ];

			bg.value = fg.value = fg.value.replace( new RegExp( query, "i" ), query );

			/** Remove other suggestion */
			data = [ item ];

			value = value instanceof Array ? value : [];
			value.length = fg.value.split( settings.delimiter ).length;
			value[ index ] = item;
			ele.data( "data-value", value );

			/** Remove other suggestion */
			self.list.find( "ul" ).html( suggestion.attr( "data-index", 0 ) );

			/** Cache this result for fast suggest */
			setupCache( query, data );

			finishSuggest();
		}

		/** 'true': up, 'false': down */
		function move( current, direction ) {

			if ( !data.length 
					|| (settings.ajaxOptions && settings.ajaxOptions.request && settings.ajaxOptions.request.state() === "pending") ) { 
						return; 
					}
		
			/** If just one item don't show the list */
			if ( 1 === data.length && settings.autoSelect 
			    	&& fg.value.toLowerCase() === data[ 0 ][ settings.textKey ][ "toLowerCase" ]() ) { return; }

			bg.value = "";

			if ( !self.list.get( 0 ).parentNode ) {

				/** Show the result */
				setbg();
				return self.list.addClass( "show" );
			}

			var index, item;

			if ( current.length ) {
				suggestion = direction 
						? current.prev()
						: current.next()
						;

				suggestion.addClass( settings.class4selected );

				self.list.scrollTop( suggestion.attr( "data-index" ) * suggestion.height() );

				if ( suggestion.length ) {
					setfg( data[ suggestion.attr( "data-index" ) ][ settings.textKey ] );
					index = suggestion.attr( "data-index" );
				} else {
					setbg();
					setfg( query );
				}
			} else {
				self.list.find( direction ? "li:last" : "li:first" ).addClass( settings.class4selected );
				setfg( data[ index = (direction ? data.length - 1 : 0) ][ settings.textKey ] );
			}

			if ( index !== undefined ) {
				
				item = data[ index ];

				setupCache( item[ settings.textKey ][ "toLowerCase" ](), [ item ] );
			}
		}

		(fg = ele.find( settings.selector4input ).css( "background", "none" ), bg = fg.next(), fg)

			/** Prevent default event */
			.attr( "autocomplete", "off" )

			/** Keys navigation */
			.on( "keydown", function( e ) {
				
				var 
				  keys = {
					  ESC: 27,
					  TAB: 9,
					  RETURN: 13,
					  UP: 38,
					  DOWN: 40
				  },

				  which = e.which;

				if ( ele.is( "[disabled]" ) ) { return; }

				switch ( true ) {
				
					case which === keys.DOWN || which === keys.UP || which === keys.RETURN || which === keys.TAB:
						var 
						  hint = self.list.find( "li." + settings.class4selected ),
						  index = hint.attr( "data-index" );

						/** Reset current hint */
						suggestion = hint.removeClass( settings.class4selected );
						break;

					case which === keys.ESC || which === keys.RETURN || which === keys.TAB:
						finishSuggest();
						break;
				}

				switch ( which ) {

					case keys.DOWN:
						move( hint, 0 );
						break;

					case keys.UP:
						move( hint, 1 );
						break;

					case keys.ESC:
						setfg( query );
						break;

					case keys.RETURN:

						if ( index !== undefined ) {
							select( data[ index ] );
						} else {

							/** Reset query string */
							query = "";

							if ( settings.ajaxOptions && settings.ajaxOptions.enterforce ) {
								suggest( true );
							} else {
								finishSuggest();
							}
						}
						break;

					case keys.TAB:

						if ( settings.tabComplete ) {
							
							if ( data.length
									&& (fg.value.length && bg.value !== fg.value) ) {
										setfg( data[ 0 ][ settings.textKey ] );
										select( data[ 0 ] );
									}
						}
						break;

					default:
						suggest();
				}
			} )

			/** Clear suggestion */
			.on( "focusout", function( e ) {
				
				var values = fg.value ? fg.value.split( settings.delimiter ) : 0;

				e.preventDefault();
				e.stopPropagation();

				if ( e.relatedTarget === self.list[ 0 ] ) { return; }

				ele.removeData( "data-value" );

				for ( var i = 0, length = values.length; i < length; ++i ) {
					
					var value = values[ i ];

					if ( value && cache[ value.toLowerCase() ] && cache[ value.toLowerCase() ].length === 1 ) {
					
						select( cache[ value.toLowerCase() ][ 0 ] );
					} else if ( settings.inputAnything === false ) {
						indicator.addClass( settings.class4error );
					}
				}

				query = "";
				finishSuggest();
			} )

			/** Suggest current content */
			.on( "focus", function() { 
				
				indicator.removeClass( settings.class4error );
				suggest(); 
			} );

			fg = fg[ 0 ];
			bg = bg[ 0 ];

			indicator = self.$node.find( settings.selector4indicator );

			self.list
				.delegate( "li", "click", function( e ) {
					
					var item = data[ this.getAttribute( "data-index" ) ];

					setfg( item[ settings.textKey ] );
					select( item );

					query = "";

					e.preventDefault();
					e.stopPropagation();
				} )

				.delegate( "li", "mouseout", function( e ) {
					
					suggestion.removeClass( settings.class4selected );

					e.preventDefault();
					e.stopPropagation();
				} )
			
				.delegate( "li", "mouseover", function( e ) {
				
					suggestion && suggestion.removeClass( settings.class4selected );

					suggestion = $( this ).addClass( settings.class4selected );

					e.preventDefault();
					e.stopPropagation();
				} );
	};

	function filter( data, query ) {
		
		var
		  self = this, 
		  settings = this.settings, 
		  
		  res = [], 

		  deferred,
		  
		  regexs = {
			"first": "^${text}",
			"last": "${text}$",
			"contains": "${text}"
		  }, 

		  ajaxOptions = settings.ajaxOptions, 

		  regex;

		if ( !data && settings.lookup && settings.lookup.length ) {
			res = res.concat( settings.lookup );
		}

		if ( !data && ajaxOptions ) {

			indicator.addClass( settings.class4loading );

			deferred = $.Deferred();

			ajaxOptions.request = ( ("function" === typeof ajaxOptions.dataProxy && ajaxOptions.dataProxy( query )) 
					
					|| $.ajax( {
						data: {
							name: ajaxOptions.name,
							params: JSON.stringify( $.extend( {}, { query: query }, ajaxOptions.params || {} ) )
						}
					} ) )
			
			.done( function( data ) {
				
				if ( "function" === typeof ajaxOptions.dataFilter ) {
					data = ajaxOptions.dataFilter( data );
				} else {
					data = JSON.parse( data );
				}

				res = res.concat( data );

				deferred.resolve();
			} )

			/** TODO: More argument */
			.done( ajaxOptions.done )
			.fail( ajaxOptions.fail )
			.always( ajaxOptions.always )

			.always( function() { indicator.removeClass( settings.class4loading ); } );
		} else if ( data ) {
			res = res.concat( data );
		}

		if ( settings.localMatch instanceof RegExp ) {
			regex = settings.localMatch;
		} else {
			regex = new RegExp( (regexs[ settings.localMatch.toLowerCase() ] || regexs[ "first" ]).replace( /\${text}/, query )
						, settings.fuzzy ? "i" : "");
		}

		return $.when( deferred || (deferred = $.Deferred().resolve()) ).done( function() {
			
			res = $.grep( res, function( item ) {
				
				return regex.test( item[ settings.textKey ] );
			} );

			this.userData = res;
		} );
	}

	YoursComplete.prototype = {
	
		disabled: function() {

			this.stopSuggest();
			this.$node.attr( "disabled", true );

			return this;
		},

		enabled: function() {

			this.$node.attr( "disabled", false );
			return this;
		},

		stopSuggest: function() {
			
			var settings = this.settings;

			clearTimeout( settings.timer );

			settings.ajaxOptions && settings.ajaxOptions.request
				&& settings.ajaxOptions.request.abort();
			return this;
		},

		val: function( value ) {

			var
			settings = this.settings,
			text = [], dataValue = [];

			if ( value ) {
				
				value = value instanceof Array ? value : [ value ];

				for ( var i = 0, length = value.length; i < length; ++i ) {
					
					text.push( value[ settings.textKey ] );
					dataValue.push( value[ settings.valueKey ] );
				}

				this
				.$node
				.data( "data-value", dataValue )
				.find( settings.selector4input ).val( text.join() );
			} else
			return this.$node.data( "data-value" );
		}
	};

	$.fn.yoursComplete = function( options ) {

		var instance = this.data( namespace );
	
		if ( !instance ) {
			instance = new YoursComplete( this, $.extend( {}, $.fn.yoursComplete.defaults, options || {} ) );
			this.data( namespace, instance );
		}

		return instance;
	};

	$.fn.yoursComplete.defaults = {
	
		delimiter 		: ",",
		minChars 		: 1,
		cacheKey 		: "yoursComplete-data",

		class4loading 		: "loading",
		class4success 		: "success",
		class4error 		: "error",
		class4selected 		: "selected",
		class4highlight 	: "highlight",
		class4list 		: "list",

		selector4input 		: "input.front",
		selector4indicator 	: "i.icon",

		valueKey 		: "value",
		textKey 		: "text",

		breaksize 		: 10,

		inputAnything 		: true,

		highlight 		: false,

		/** Case sensitive */
		fuzzy 			: true,

		/** 'first', 'contains', 'last' */
		localMatch 		: "first",

		suggestDelay 		: 333,

		autoSelect 		: false,
		tabComplete 		: true,

		/** Local data */
		lookup 			: [],

		/** From service */
		ajaxOptions 		: undefined,

		formatter: function( item, index, query, settings ) {
			
			var 
			  value = item[ settings.valueKey ],
			  text = item[ settings.textKey ] || value;

			return settings.hightlight
				? "<li value='" + value + "' data-index='" + index + "'>" + text.replace( new RegExp( query, "i" ), "<span class='" + settings.class4highlight + "'>" + query + "</span>" ) + "</li>"
				: "<li value='" + value + "' data-index='" + index + "'>" + text + "</li>";
				;
		}
	};

})( window.jQuery );

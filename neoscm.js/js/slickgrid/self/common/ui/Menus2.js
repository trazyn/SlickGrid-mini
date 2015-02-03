define( function() {

	"use strict";

	var _actived = function( target, clazz ) {
    
		target.attr( "actived", true );

		clazz && target.addClass( clazz );
	},

	_deactive = function( target, clazz ) {
	
		target.removeAttr( "actived" );

		clazz && target.removeClass( clazz );
	}

	, href = function( contextPath, menuid ) {
	
		return "/" + (contextPath || wpf_context_path) + "/webengine/huawei/wpf/Framework#/!0/!" + menuid + "/!./!./!./!./!./!" + (+new Date());
	}

	, except = [ "scmscmuiissuihome", "scmscmuiscmhanauihome", "scmrcvuihome", "scmscmuiinvuihome", "scmscmsivuihome", "scmscmuifnduihome", "scmscmuiissuihome", "scmscmuihome" ]

	, defaults = {
        
		key: "menu",

		idKey: "id",
		parentKey: "parentId",
		textKey: "title",

		pathnameKey: "a03_context",

		more: true,

		callback: function( m ) { console.log( "Click %s:%s", m[ options.textKey ], m[ options.idKey ] ); },

		renders: [
		
			function( m ) {

				var level = index[ m[options.idKey] ]

				/** Slideup submenu */
				, deactive = function() {
					
					/** Ie + chromeframe hack */
					if ( !container.is( ":hover" ) ) {

						container.removeClass( "slideup" ).css( "display", "none" );
						_deactive( root );
					}
				}
				
				, container

				, root = $( "<a></a>" )
						.attr( "tabindex", 99 )

						.one( "loadMenus", function() {

							var count;

							container = root
									/** Create the container of submenu  */
									.after( "<div style='display: none;'><div class=menu-left><ul></ul></div></div>" )

									/** Point to the container */
									.next()

									/** Set role */
									.attr( "submenu", true )

									/** Add ability of focus */
									.attr( "tabindex", 99 )

									/** Click other close the submenu */
									.on( "focusout", function( e ) {
										
										/** Make sure the target has been hold the focus */
										setTimeout( function() { root.is( ":focus" ) || deactive(); }, 47 );
									} );

							/** Generate HTML and bind event */
							count = renderMenu( options.menus, rootMergeRule[ m[ options.textKey ] ], container.find( "ul" ) );

							/** Render submenu */
							container.find( "li" ).trigger( "loadMenus" );

							if ( !count ) {
								/** Without children */
								root.add( container ).addClass( "singleton" ).attr( "singleton", true );

								/** Right click support */
								root.attr( "href", href( m[ options.pathnameKey ], m[ options.idKey ] ) );
							} else if ( count > 4 ) {
								container.find( "ul:first" ).addClass( "list_four" );
							}

							container.find( "a[level=2]" ).length || container.attr( "vertical", true ).find( "ul:first" ).removeClass( "list_four" );
						} )

						.on( "click", function( e ) {
						
							var width = root.width();

							/** Cancel the original href */
							e.preventDefault();
							e.stopPropagation();

							/** Lazy load */
							$( this ).trigger( "loadMenus" );

							if ( container.is( ":visible" ) ) { return; }

							/** Without submenu */
							if ( container.is( ".singleton" ) ) {
								
								/** Highlight current item and forward */
								return lockMenu( root );
							}

							locked[ level ] = root.off( "focusout" ).on( "focusout", function( e ) {
									
								setTimeout( function() {

									!container.is( ":focus" ) && deactive();
								}, 47 );
							} );

							/** Active the submenu */
							container
								.css( container.is( "[vertical]" ) ? {
									"display": "block",
									"top": 37,
									"left": root.offset().left - 1,
									"white-space": "nowrap"
								} : {
									"display": "block",
									"top": 37,
									"right": "auto",
									"left": root.offset().left,
									"white-space": "nowrap"
								} );

							if ( container.is( "[vertical]" ) ) {
								
								container.find( ".menu-left" ).css( {
									
									"min-width": width + 60
								} );
							} else {
							
								var offset = container.offset();

								if ( offset.left < 0 ) {
									
									container.css( {
										
										"margin-left": 0,
										"left": 220
									} );
								} else if ( offset.left + container.width() > window.screen.availWidth - 90 ) {
									
									container.css( {
										
										"right": 90,
										"left": ""
									} );
								}
							}

							setTimeout( function() { container.addClass( "slideup" ); }, 77 );
						} )
						.hover( function() {
							
							/** Add actived class */
							_actived( $( this ) );
						}, function() {
							
							/** On mouseout remove the class of actived */
							setTimeout( function() {
								
								var submenu = root.next( "div[submenu]" );

								if ( !submenu.length || submenu.is( ":hidden" ) )
									_deactive( root );
							}, 17 );
						} );

					
				return root.show();
			},

			function( m ) {

				var level = index[ m[options.idKey] ]
					
				, container, self;
				
				return $( "<li><span><div class='fav' " + 
						(options.favs[ m[ options.idKey ] ] !== void 0 ? "selected='selected'" : "") + 
						" title='Favorite'></div><a></a><div class='newtab' title='Open as new tab'></div></span></li>" )
						
						.one( "loadMenus", function() {

							self = $( this ).find( ">span" );
							
							container = self
									.after( "<div><ul></ul></div>" )
									.next();

							self = self.find( "a:last" );

							if ( !renderMenu( options.menus, m[ options.idKey ], container.find( "ul" ) ) ) {
								
								self.add( container ).addClass( "singleton" ).attr( "singleton", true );
								self.attr( "href", href( m[ options.pathnameKey ], m[ options.idKey ] ) );
							}
						} )

						.hover( function() {
						
							_actived( locked[ level ] = self );

						}, function() {
						
							_deactive( self );
						} )
						.on( "click", function( e ) {

							e.preventDefault();
							e.stopPropagation();
							
							container.is( ".singleton" ) && lockMenu( self );
						} );
			},

			function( m ) {

				var level = index[ m[ options.idKey ] ];
				
				return $( "<li><span><div class='fav' " + 
						(options.favs[ m[ options.idKey ] ] !== void 0 ? "selected='selected'" : "") + 
						" title='Favorite'></div><a href='" + href( m[ options.pathnameKey ], m[ options.idKey ] ) + "'></a><div class='newtab' title='Open as new tab'></div></span></li>" )

					.on( "click", function( e ) {
						
						e.preventDefault();
						e.stopPropagation();

						lockMenu( $( this ).find( "a:last" ) );
					} )
					.hover( function() {
						
						_actived( $( this ).find( "a:last" ) );
					}, function() {
						
						_deactive( $( this ).find( "a:last" ) );
					} );
			}
		]
	}

	, lastLocked = []
	, locked = []

	, index = {
		
		/** "ID": "LV" */
	}

	, rootMergeRule = {}

	, lockMenu = function( target ) {
	
		var data = target.data( options.key )
		, level = index[ data[options.idKey] ]
		
		, update = function() {
		
			locked[ level ] = target;

			target.parents( "div[submenu=true]:first" ).removeClass( "slideup" ).css( "display", "none" );

			if ( window.event && $( window.event.target ).is( "a.favlink, a.currentNav" ) ) {
			
				for ( var i = level; --i >= 0; ) {
					
					target = target.parents( "div:not(.menu-left):first" ).prev();

					locked[ i ] = 0 === i ? target : target.find( ":last" );
				}
			}

			for ( var i = lastLocked.length; --i >= 0;
					lastLocked[ i ] && lastLocked[ i ].removeAttr( "selected" ) );

			/** Copy without references */
			Array.prototype.push.apply( lastLocked = [], locked );

			/** Update browser title */
			document.title = data[ options.textKey ];

			/** Show the full path */
			breadNav();

			/** Disable hash change */
			lastLocked.length = 0;
		};

		/** Page forward */
		options.callback( data, update );
	}

	, breadNav = function() {
		
		var text = "", last, menuid

		, i = 0, length = lastLocked.length;

		while ( i < length ) {
			
			last = lastLocked[ i++ ];
			if ( last ) {

				last.attr( "selected", true );
			
				if ( document.title === last.text() ) {
					break;
				}

				text += [ "<span class='smallNav'>", last.html(), "</span>", "&nbsp;&gt&nbsp;" ].join( "" );
			}
		}


		menuid = last.attr( "menuid" );

		text += "<a class='currentNav' href='" + wpf_context_path + "/webengine/huawei/wpf/Framework#/!0/!" + menuid + "' title='" + document.title + "' menuid='" + menuid + "'>" + document.title + "</a>";

		$( "#breadNav" ).html( text );

		/** Show the highlight menu */
		setTimeout( function() { lastLocked[ 0 ].focus(); } );
	}

	, renderMenu = function( menus, parent, target ) {
		
		var arrRemove = function( array, index ) {
			
			array = $.isArray( array ) ? array : [ array ];

			if ( "number" === typeof index ) {
				
				return array.slice( 0, index ).concat( array.slice( index + 1, array.length ) );
			} else
				return arrRemove( array, $.inArray( index, array ) );
		}

		, mkMenu = function( level, m, _index ) {
			
			var menu

			, render = options.renders[ level ];

			index[ m[options.idKey] ] = level;

			menu = $.isFunction( render ) && render( m );

			if ( menu ) {

				var item = (menu = $( menu )).find( "a:last" );

				0 === level && (m.index = _index);

				(item.length ? item : menu)
					.attr( {
						
						"level": level,
						"menuid": m[ options.idKey ],
						"title": m[ options.textKey ]
					} )
					.html( m[ options.textKey ] )
					.data( options.key, m );
			}

			return menu;
		}

		, isMenu = function( menu ) {
			
			return !!(menu
					&& menu.hasOwnProperty( options.textKey )	&& (menu[ options.textKey ] || "").replace( /^\s+|\s+$/g, "" )
					&& menu.hasOwnProperty( options.idKey ) 	&& !/^\s*$/g.test( menu[ options.idKey ].toString() ));
		}
		
		, count = 0, _index = 0

		/** Cahe nodes in memory */
		, roots = $(), nodes = $();

		for ( var i = menus.length; --i >= 0; ) {
			
			var m = menus[ i ];

			if ( isMenu( m ) ) {
				
				var menu;

				/** Root node */
				if ( options.rootId 
						? parent === undefined && $.inArray( m[ options.parentKey ], options.rootId ) !== -1
						: ( 0 !== m[ options.parentKey ] && !m[ options.parentKey ] ) ) {
					
					if ( !rootMergeRule[ m[ options.textKey ] ] ) {
					
						/** Except all the home node */
						if ( except.indexOf( m[ options.idKey ] ) === -1 ) {
							rootMergeRule[ m[ options.textKey ] ] = [ m[ options.idKey ] ];
						}

						(menu = mkMenu( 0, m, _index++ )) && (roots = roots.add( menu ));

						/** Update references and array length */
						options.menus = menus = arrRemove( menus, i );

						++count;
					} else {
						index[ m[ options.idKey ] ] = 0;
						rootMergeRule[ m[ options.textKey ] ].push( m[ options.idKey ] );
					}

				} else if ( m[ options.parentKey ] === parent || 

						/** Merge root menu */
						(parent && $.inArray( m[ options.parentKey ], parent ) > -1) ) {

					parent = parent instanceof Array ? parent : [ parent ];
					
					(menu = mkMenu( index[ parent[ 0 ] ] + 1, m )) && target && (nodes = nodes.add( menu ));
					options.menus = menus = arrRemove( menus, i );

					++count;
				}
			} else
				options.menus = menus = arrRemove( menus, i );
		}

		roots.length && options.container.append( roots );
		nodes.length && target && target.append( nodes );

		if ( !menus.length ) {
			
			renderMenu = function() {};
		}

		return count;
	}
	
	, options;
	
	return function( op ) {
	
		var nav;

		options = $.extend( {}, defaults, op );
		rootMergeRule = {};
		nav = options.container = $( options.container );

		renderMenu( options.menus = $.isArray( options.menus ) ? options.menus.reverse() : [ options.menus ] );

		options.rootId = options.rootId instanceof Array ? options.rootId : [ options.rootId ];

		/** Init control */
		if ( nav.width() / $( document ).width() >= 0.68 ) {

			var container, navRect
				
			, registerDelegate = function() {
				
				container.parent().delegate( "li", "click", function( e ) {

					var item = nav.find( "a[level=0][menuid=" + this.getAttribute( "menuid" ) + "]:first" );
				
					lastLocked[ 0 ].removeAttr( "actived" ).next().removeClass( "slideUp" );

					/** Force layout */
					item.focus().width();
					item.hover().attr( "actived", true ).click();
					item.focus();
				} );

				/** Execute once */
				registerDelegate = new Function();
			};
			
			nav.next().find( "[name=nav-more]" ).show()
			.on( "click", function() {
				
				var self = $( this );

				navRect = navRect || nav[ 0 ][ "getBoundingClientRect" ]();
				container = self.next().html( "<ul>" ).find( "ul" );

				for ( var name in rootMergeRule ) {
					var m = nav.find( "a[level=0][menuid=" + rootMergeRule[ name ][ 0 ] + "]:first" )
					, rect = m[ 0 ][ "getBoundingClientRect" ]();

					if ( rect.left < navRect.left || rect.right > navRect.right ) {
						container.append( "<li menuid='" + m.attr( "menuid" ) + "' title='" + m.text() + "'>" + m.text() + "</li>" );
					}
				}

				registerDelegate();

				/** Set the positon */
				container.parent()
				.css( {
					"display": "block",
					"visibility": "visible",
					"opacity": 1,
					"z-index": 99,
					"top": 117,
					"left": $( this ).offset().left
				} )
				.attr( "tabindex", 99 )

				/** Keep one */
				.off( "focusout" ).on( "focusout", function() {
					container.parent().css( "display", "none" );
				} )
				.focus();
			} );
		}

		var hashchange = function() {
		
			/** Locate to current menu */
			var hash = location.hash.replace( /\/+/g, "" ).split( "!" )
			, current = hash[ 2 ];

			if ( current ) {
				
				current = nav.find( "a[menuid=" + current + "]" );

				if ( current.length ) {
				
					document.title = current.text();
					
					for ( var i, length = i = +current.attr( "level" ); i >= 0; ) {
						
						lastLocked[ i ] = 
							i === length
							? current 
							: (current = current.parents( "div:not(.menu-left):first" ).prev(), 0 !== i && (current = current.find( "a:last" )));

						lastLocked[ i-- ] = current;
					}

					return breadNav();
				}

				/** Reset the value */
				current = hash[ 2 ];
			}

			/** Lazy load, SKIP '!#, iframe' */
			if ( hash[ 1 ] !== "#" && top === window && current ) {

				var res = (function f( id ) {
				
					var r = false;

					for ( var i = options.menus.length, menus = options.menus, m; --i >= 0; ) {
						
						m = menus[ i ];

						if ( m[ options.idKey ] === id ) {
							
							id = m[ options.parentKey ];

							if ( index[ id ] === 0 ) {
								res = nav.find( "a[menuid=" + id + "]" );

								if ( !res.length ) {
									
									for ( var name in rootMergeRule ) {
										if ( rootMergeRule[ name ][ "length" ] && rootMergeRule[ name ].indexOf( id ) > -1 ) {
											return res = nav.find( "a[menuid=" + rootMergeRule[ name ][ 0 ] + "]" );
										}
									}
								}

								/** Reneder the submenu */
								return res;
							}  
							
							/** Recursion call */
							return f( id );
						}
					}

					return r;
				})( current );

				if ( res.length ) {
					return res.trigger( "loadMenus" ), hashchange();
				}
				
				return location.hash = "", location.reload();
			}

			/** HANDLE THE INVALIDATE MENUID AND FORCE FORWARD TO HOME PAGE */

			lastLocked[ 0 ] = nav.find( "a[menuid=" + { 
				"/scm/scmui/issui/webengine/huawei/scmscmuiissui/beta/lab": "scmscmuiissuihome",
				"/scm/scmui/scmhanaui/webengine/huawei/wpf/Framework": "scmscmuiscmhanauihome",
				"/scm/rcvui/webengine/huawei/wpf/Framework": "scmrcvuihome",
				"/scm/scmui/invui/webengine/huawei/wpf/Framework": "scmscmuiinvuihome",
				"/scm/scmsivui/webengine/huawei/wpf/Framework": "scmscmsivuihome",
				"/scm/scmui/fndui/webengine/huawei/wpf/Framework": "scmscmuifnduihome",
				"/scm/scmui/issui/webengine/huawei/wpf/Framework": "scmscmuiissuihome",
				"/scm/scmui/webengine/huawei/wpf/Framework": "scmscmuihome" }[ location.pathname ] + "]" ).trigger( "loadMenus" );

			/**
			if ( !lastLocked[ 0 ][ "length" ] ) {
					
				nav.find( "a[level=0]:first" ).trigger( "loadMenus" );
				return nav.find( "a.singleton[level]:first" ).click();
			}
			*/

			document.title = lastLocked[ 0 ].text();

			breadNav();
		};

		/** Init the highlight */
		hashchange();
		
		$( window ).on( "hashchange", function() {
			
			/** Remove the menu's highlight */
			for ( var i = lastLocked.length; --i >= 0;
				lastLocked[ i ] && lastLocked[ i ].removeAttr( "selected" ) );

			hashchange();
		} );

		options.after instanceof Function && options.after( nav );
	};
} );


define( function() {

	"use strict";

	var defaults = {
		
		rule: "data-identifier",
		rulePage: "data-page",
		class4loading: "tabloading",
		class4failed: "failed",
		class4loaded: "loaded",
		
		/** fade, slideup */
		animate: ""
	}

	, Tabs = function( $ele, options ) {
	
		var instance = this
	
		, settings, navs, tabs

		/** The last actived item */
		, lastNav, lastTab
	
		, wait = false
		
		/** Show page after the ajax has been completed */
		, autoShow;

		/** Apply the default settings */
		this.settings = settings = $.extend( true, {}, defaults, options );

		this.$node = $ele;
		this.$navs = navs = $ele.find( "div.tabnav-tab" );
		this.$tabs = tabs = $ele.find( "div.tab-content" ).addClass( settings.animate ).find( "section" );

		lastNav = navs.filter( ".selected:first" );
		lastTab = lastNav.length ? tabs.filter( "[" + settings.rule + "=" + lastNav.attr( settings.rule ) + "]" ) : lastTab;

		$ele.delegate( "div.tabnav-tab", "click", function( e ) {
			
			var self = $( this ), target
			
			, index = self.attr( settings.rule )

			/** Loaded page via ajax */
			, page = self.attr( settings.rulePage )

			, _callbacks

			, _class4loaded = settings.class4loaded, _class4failed = settings.class4failed, _class4loading = settings.class4loading;

			/** Generate index */
			undefined === index && page && self.attr( settings.rule, index = "tabs" + +new Date());

			if ( !wait && !self.is( ".selected" ) && index !== undefined ) {

				target = tabs.filter( "[" + settings.rule + "=" + index + "]:first" );

				_callbacks = (instance[ "callbacks" ] || {}) [ index ] || {};

				/** Delete the references */
				delete (instance[ "callbacks" ] || {})[ index ];

				/** Has been loaded */
				if ( target.length ) {
					
					/** Lock the animation */
					wait = true;
					
					/** Clear the quene */
					autoShow = undefined;

					lastNav && lastNav.removeClass( "selected" );
					lastNav = self.removeClass( _class4loaded ).addClass( "selected" );

					if ( lastTab ) {
						
						/** Disable slidedown */
						lastTab.css( "display", "none" ).removeClass( "selected" );

						setTimeout( function() { 
							/** Unlock animation */
							wait = false;
						}, 411 );
					}

					lastTab = target.css( "display", "block" );

					return setTimeout( function() {
						target.addClass( "selected" );
					} );

					"function" === typeof settings.onSelected && settings.onSelected.call( self, index );
				}

				page = page && page.replace( /^\s+|\s+$/g, "" );

				page ? (self.is( "." + _class4loading ) ? (autoShow = index) : $.ajax( {
					
					url: page,
					dataType: "html",
					beforeSend: function() {
						autoShow = index;
						self.removeClass( _class4failed + " " + _class4loaded ).addClass( _class4loading );
					}
				} )
				.done( function( responseText ) {
				
					var response = $( "<section>" ).attr( settings.rule, index ).html( responseText );

					instance.$tabs = tabs = tabs.after( response ).add( response );

					/** Test */
					setTimeout( function() {
						self.removeClass( _class4loading );

						"function" === typeof _callbacks.success && _callbacks.success.call( response );

						autoShow === index ? self.click() : self.addClass( _class4loaded );
					}, 6777 );
				} )
				.fail( _callbacks.failed, function( xhr ) {
					self.removeClass( [ _class4loading, _class4loaded ].join( " " ) ).addClass( _class4failed );
				} )) :
					
				/** Invalid tab */
				self.removeClass( [ _class4loading, _class4loaded ].join( " " ) ).addClass( _class4failed );
			}
		} );
	}
	
	, identifier = "$ui.tabs";

	/*
	$( "div.su-tab" ).tabs().add( {
		
		name: "Success",
		page: "test/feedback.html",
		success: function() {
			
			console.log( "Load fb" );
		},
		failed: function() {
			
			console.log( "Failed to load fb" );
		}
	} ).add( {
		
		name: "ff",
		label: "Failed",
		//page: "ff",
		failed: function() {
			
			console.log( "Load ff" );
		}
	} );
	*/

	Tabs.prototype = {
		
		add: function( tabs ) {
			
			var tabs = tabs instanceof Array ? tabs : [ tabs ]
				
			, navs = this.$navs, settings = this.settings
			
			/** Active the tab */
			, actived;

			for ( var i = 0, length = tabs.length, tab; i < length; ++i ) {
			
				tab = tabs[ i ];

				if ( tab.name && 
						/** Duplicate */
						!navs.filter( "[" + settings.rule + "=" + tab.name + "]" ).length ) {

					var nav = $( [ "<div class='tabnav-tab' ", settings.rule, "='", tab.name, "'>",
							tab.before || "",
							"<span class='tabnav-tab-label'>", tab.label || tab.name, "</span>",
							"<small class='tabnav-tab-status'></small>",
							"</div>" ].join( "" ) );

					tab.page && nav.attr( settings.rulePage, tab.page );

					if ( tab.page ) {
						nav.attr( settings.rulePage, tab.page );

						(this.callbacks = this.callbacks || {})[ tab.name ] = {
							
							success: tab.success,
							failed: tab.failed
						};
					}

					/** Update index */
					this.$navs = navs = navs.add( nav );
					this.$node.find( "li:last" ).after( $( "<li>" ).append( nav ) );

					/** Set startup tab */
					actived = tab.actived ? tab.name : actived;
				}
			}

			actived && navs.filter( "[" + settings.rule + "=" + actived + "]" ).click();

			return this;
		},

		remove: function( index ) {
			
			var settings = this.settings

			, navs = this.$navs
			, tabs = this.$tabs
			
			, selector;

			try {
			
				selector = "[" + settings.rule + "=" + index + "]";

				if ( index ) {
					navs.add( tabs ).filter( selector ).remove();

					this.callbacks && (delete this.callbacks[ index ]);
				}
			} catch( e ) {}
		},

		getTab: function( index ) {
		
			try {
				if ( identifier ) {
					return this.$tabs.filter( "[" + settings.rule + "=" + index + "]" );
				} else {
					return this.$tabs.filter( "section.selected" );
				}
			} catch ( ex ) {}
		},

		active: function( index ) {
			
			var settings = this.settings;

			try {
				return this.$navs.filter( "[" + settings.rule + "=" + index + "]" ).click();
			} catch( ex ) {
				/** Invalid selector */
			}
		},

		isActive: function( index ) {
		
			var settings = this.settings;

			try {
				return this.$navs.filter( "[" + settings.rule + "=" + index + "]" ).is( ".selected" );
			} catch( ex ) {}
		}
	};
	
	$.fn.tabs = function( options ) {
		
		var instance = this.data( identifier );

		if ( !instance ) {
			
			instance = new Tabs( this, options || {} );

			this.data( identifier, instance );
		}
		return instance;
	};
} );



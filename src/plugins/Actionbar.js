
define( [ "slick/curd/Delete", 
	"slick/curd/Update",
	"slick/curd/Add",
	"slick/curd/Validation",
	"slick/plugins/Genius",
	"slick/plugins/MyColumns" ], function( Delete, Update, Add, Validation, Genius, MyColumns ) {

	"use strict";

	var defaults = {

		genius: {
			
			enable: false,

			selector: ".slick-actionbar-genius",
			type: "click",

			callback: function( $G, plugin, e ) {
			
				plugin.call( this, e );
			},

			init: function( $G ) {
				return Genius( $G, this );
			}
		},

		lab: {
			
			enable: false,

			selector: ".slick-actionbar-lab",

			init: function( $G, options ) {

				MyColumns( $G, $.extend( {
					trigger: this
				}, options ) );
			}
		},

		add: {
			enable: false,

			selector: ".slick-actionbar-add",
			type: "click",

			callback: function( $G ) {
				$G.setAddRows();
			},
			init: Add
		},

		del: {
			selector: ".slick-actionbar-delete",
			type: "click",

			enable: false,

			callback: function( $G ) {
				$G.getSelectionModel() && $G.setDeleteRows( $G.getSelectedRows() );
			},

			init: function( $G ) {

				var self = $( this ).attr( "disabled", "disabled" )
					
				, toggle = function() {

					if ( !$G.getSelectionModel() ) {
						self.attr( "disabled", "disabled" );
					} else
					$G.getSelectedRows().length
						? self.removeAttr( "disabled" )
						: self.attr( "disabled", "disabled" );
				};

				new Slick.EventHandler()
					
					.subscribe( $G.getData().onRowsChanged, toggle )
					.subscribe( $G.onCellCssStylesChanged, toggle );

				return Delete( $G );
			}
		},

		save: {
			enable: false,

			selector: ".slick-actionbar-save",
			type: "click",

			callback: function( $G ) {
				
				var self = $( this ).attr( "disabled", "disabled" );

				$G.search()

					.done( function() { 
						self.attr( "disabled", "disabled" ); 

						/** RESET CURD DATA */
						$G.setAddRows && $G.setAddRows( {} );
						$G.setDeleteRows && $G.setDeleteRows( [] );
						$G.setUpdateRows && $G.setUpdateRows( {} );
						$G.setInvalidRows && $G.setInvalidRows( {} );
					} )

					.fail( function() { 
						self.removeAttr( "disabled" ); 
					} );
			},

			init: function( $G ) {
			
				var self = $( this ).attr( "disabled", "disabled" )

				, plugin = Update( $G )
				
				, toggle = function() {
				
					var 
					  adds = $G.getAddRows(),
					  updates = $G.getUpdateRows();
					  deletes = $G.getDeleteRows();

					if ( adds.length | deletes.length | updates.length ) {
						
						self.removeAttr( "disabled" );
					} else self.attr( "disabled", "disabled" );
				};
				
				new Slick.EventHandler()
					.subscribe( $G.onCellCssStylesChanged, function( e, args ) {
					
						if ( !{ 
							"delete": 1,
							"add": 1,
							"update": 1
						}[ args.key ] ) { return; }

						toggle();
					} )
					.subscribe( $G.onSelectedRowsChanged, toggle );

				return plugin;
			}
		},

		filter: {
			selector: ".slick-actionbar-filter",
			type: "click",
			callback: function( $G ) {
				$G.setHeaderRowVisibility( !$( $G.getHeaderRow() ).is( ":visible" ) );
			},

			enable: false
		},
		
		fullscreen: {
			enable: false,
			selector: ".slick-actionbar-fullscreen",
			type: "click",
			callback: function( $G ) {
				
				var self = $( this )
				, container = $( $G.getContainerNode() )
				, wrapper = container.parent()
				, autoHeight = false;
					
				/** Save the inline style */
				wrapper.data( "slick-fullscreen-style" ) 
					|| wrapper.data( "slick-fullscreen-style", wrapper.attr( "style" ) );
				container.data( "slick-fullscreen-height" ) 
					|| container.data( "slick-fullscreen-height", container.height() );
				container.data( "slick-fullscreen-autoheight" )
					|| container.data( "slick-fullscreen-autoheight", $G.getOptions().autoHeight );

				autoHeight = container.data( "slick-fullscreen-autoheight" );

				if ( self.is( ".fullscreen-min" ) ) {

					if ( autoHeight ) {
						var options = $G.getOptions();
						options.autoHeight = true;
						$G.setOptions( options );

						/** Viewport autoheight */
						container.find( ".slick-viewport:first" ).css( "height", "" );
					}

					wrapper
						.removeClass( "slick-fullscreen" )
						.attr( "style", wrapper.data( "slick-fullscreen-style" ) );
					container.css( "height", container.data( "slick-fullscreen-height" ) );
					self.removeClass( "fullscreen-min" );
				} else {

					if ( autoHeight ) {
						var options = $G.getOptions();
						options.autoHeight = false;
						$G.setOptions( options );
					}

					/** Remove the inline style */
					wrapper.removeAttr( "style" ).addClass( "slick-fullscreen" );
					container.css( "height", "90%" );
					self.addClass( "fullscreen-min" );
				}

				$G.resizeCanvas();
			}
		}
	};
	
	return function( $G, container, options ) {

		var settings = $.extend( true, {}, defaults, options || {} );

		container = $( container );

		/** Add validation ability */
		Validation( $G );

		for ( var action in settings ) {
			
			var plugin;

			action = settings[ action ];

			if ( !action.enable ) { continue; }
			
			"function" === typeof action.init 
				&& (plugin = action.init.call( container.find( action.selector ), $G, action[ "options" ] ));

			container
				.delegate( action.selector, action.type || "SKIP THIS", (function( callback, $G, plugin ) {
					return function( e ) {
						
						callback instanceof Function && callback.call( this, $G, plugin, e );
					};
				})( action.callback, $G, plugin ) );
		}
	};
} );

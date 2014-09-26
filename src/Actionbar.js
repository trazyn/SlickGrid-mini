
define( function() {

	var defaults = {

		add: {
			selector: ".slick-action-add",
			type: "click",
			callback: function( e ) {
			
			}
		},

		update: {
			selector: ".slick-action-update",
			type: "click",
			callback: function( e ) {
				
			}
		},

		del: {
			selector: ".slick-action-delete",
			type: "click",
			callback: function( $G, e ) {
				$G.setDeleteRows();
			},

			init: function( $G ) {

				var self = $( this );

				$G.onRowSelected.subscribe( function() {
					self.removeAttr( "disabled" );
				} );

				$G.onRowDeselected.subscribe( function( e, args ) {

					var selecteds = $G.getSelectedRows();

					if ( 1 === selecteds.length && selecteds[ 0 ] == args.row ) {
						self.attr( "disabled", "disabled" );
					}
				} );
			}
		},

		save: {
			selector: ".slick-action-save",
			type: "click",
			callback: function( e ) {
			
			}
		},

		filter: {
			selector: ".slick-action-filter",
			type: "click",
			callback: function( $G ) {
				$G.setHeaderRowVisibility( !$( $G.getHeaderRow() ).is( ":visible" ) );
			}
		},
		
		settings: {
			selector: ".slick-action-settings",
			type: "click",
			callback: function( e ) {
			
			}
		},

		fullscreen: {
			selector: ".slick-action-fullscreen",
			type: "click",
			callback: function( e ) {
				
			}
		}
	};
	
	return function( $G, container, selectors ) {

		var settings = $.extend( {}, selectors || {}, defaults );

		container = $( container );

		for ( var action in settings ) {
			
			action = settings[ action ];
			
			container
				.delegate( action.selector, action.type, (function( callback, $G ) {
					return function( e ) {
						
						callback instanceof Function && callback.call( this, $G, e );
					};
				})( action.callback, $G ) );

			"function" === typeof action.init 
				&& action.init.call( container.find( action.selector ).attr( "disabled", "disabled" ), $G );
		}
	};
} );

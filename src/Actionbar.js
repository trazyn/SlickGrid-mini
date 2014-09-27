
define( function() {

	var defaults = {

		add: {
			selector: ".slick-actionbar-add",
			type: "click",
			callback: function( e ) {
			
			}
		},

		update: {
			selector: ".slick-actionbar-update",
			type: "click",
			callback: function( e ) {
				
			}
		},

		del: {
			selector: ".slick-actionbar-delete",
			type: "click",
			callback: function( $G, e ) {
				$G.setDeleteRows( $G.getSelectedRows() );
			},

			init: function( $G ) {

				var self = $( this ).attr( "disabled", "disabled" );

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
			selector: ".slick-actionbar-save",
			type: "click",
			callback: function( e ) {
			
			}
		},

		filter: {
			selector: ".slick-actionbar-filter",
			type: "click",
			callback: function( $G ) {
				$G.setHeaderRowVisibility( !$( $G.getHeaderRow() ).is( ":visible" ) );
			}
		},
		
		settings: {
			selector: ".slick-actionbar-settings",
			type: "click",
			callback: function( e ) {
			
			}
		},

		fullscreen: {
			selector: ".slick-actionbar-fullscreen",
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
				&& action.init.call( container.find( action.selector ), $G );
		}
	};
} );


define( [ "slick/curd/Delete", 
	"slick/curd/Update",
	"slick/curd/Add" ], function( Delete, Update, Add ) {

	var defaults = {

		add: {
			enable: true,

			selector: ".slick-actionbar-add",
			type: "click",

			callback: function( $G, plugin ) {
				plugin.addRow();
				$G.onBeforeCellEditorDestroy.notify();
			},
			init: Add
		},

		update: {

			enable: true,
			selector: ".slick-actionbar-save",
			type: "-ignore",

			callback: function( $G ) {
				
				var 
				  adds = $G.getAddRows(),
				  deleteds = $G.getDeleteRows(),
				  updates = $G.getUpdateRows();

				if ( adds.length || deleteds.length || updates.length ) {
					
					$( this ).removeAttr( "disabled" );
				} else $( this ).attr( "disabled", "disabled" );
			},
			
			init: function( $G ) {
			
				var self = $( this ).attr( "disabled", "disabled" );

				/** Toggle the save button */
				$G.onBeforeCellEditorDestroy.subscribe( function( e, args ) {
					
					var 
					  adds = $G.getAddRows(),
					  deleteds = $G.getDeleteRows(),
					  updates = $G.getUpdateRows();

					if ( adds.length || deleteds.length || updates.length ) {
						
						self.removeAttr( "disabled" );
					} else self.attr( "disabled", "disabled" );
				} );

				return new Update( $G );
			}
		},

		del: {
			selector: ".slick-actionbar-delete",
			type: "click",

			enable: true,

			callback: function( $G ) {
				$G.setDeleteRows( $G.getSelectedRows() );
				$G.onBeforeCellEditorDestroy.notify();
			},

			init: function( $G ) {

				var self = $( this ).attr( "disabled", "disabled" );

				$G.getData().onRowsChanged.subscribe( function() {
					self.attr( "disabled", "disabled" );
				} );

				$G.onSelectedRowsChanged.subscribe( function( e, args ) {
					
					args.rows.length ? self.removeAttr( "disabled" ) : self.attr( "disabled", "disabled" );
				} );

				return Delete( $G );
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
			},

			enable: true
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
			
			var plugin;

			action = settings[ action ];

			if ( !action.enable ) { continue; }
			
			"function" === typeof action.init 
				&& (plugin = action.init.call( container.find( action.selector ), $G ));

			container
				.delegate( action.selector, action.type, (function( callback, $G, plugin ) {
					return function( e ) {
						
						callback instanceof Function && callback.call( this, $G, plugin, e );
					};
				})( action.callback, $G, plugin ) );
		}
	};
} );

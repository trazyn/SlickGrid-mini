
define( [ "self/common/util/Storage", "self/common/ui/Amodal" ], function( Storage ) {

	var defaults = {
	
		key: "unique",
		scope: "local",

		ignore: [ "_checkbox_selector", "_radio_selector", "idx" ]
	}

	, index = "originalIndex"

	, Lab = function( $G, settings ) {
		
		var 
		  config = Storage.get( settings.key, !!{ "session": 0, "local": 1 }[ settings.scope ] ),
		  options = $G.getOptions(),
		  original = $G.getColumns(),
		  mapping,
		  miscellaneous;

		function applyConfig( initialization ) {
		
			var columns = [], index = initialization === true ? "originalIndex" : "index";

			for ( var id in mapping ) {
				
				var column;

				if ( mapping[ id ][ "always" ] | !mapping[ id ][ index ] ) {
					
					column = original[ mapping[ id ][ "originalIndex" ] ];

					column.width = mapping[ id ][ "width" ];
					column.tooltip = mapping[ id ][ "tooltip" ];

					/** Column reorder */
					columns[ +mapping[ id ][ "index" ] ] = column;
				}
			}

			/** Remove array gap */
			for ( var _columns = [], i = columns.length; --i >= 0; columns[ i ] && _columns.unshift( columns[ i ] ) );

			columns.length && $G.setColumns( _columns );

			if ( miscellaneous ) {
				options.alwaysUpdateRows = miscellaneous.alwaysUpdateRows;
				options.alwaysDeleteRows = miscellaneous.alwaysDeleteRows;
			}

			index = "index";
		}

		function updateConfig() {
		
			mapping = {};

			for ( var i = 0, length = original.length; i < length; ++i ) {
				
				var column = original[ i ];

				mapping[ column.id ] = {
					name: column.name,
					originalWidth: column.width,
					width: column.width,
					always: settings.ignore.indexOf( column.id ) > -1,
					originalTooltip: column.tooltip,
					tooltip: column.tooltip,
					hide: false,
					originalIndex: i,
					index: i
				};
			}

			miscellaneous = {
				alwaysDeleteRows: options.alwaysDeleteRows,
				alwaysUpdateRows: options.alwaysUpdateRows
			};
		}

		$G.onColumnsResized.subscribe( function( e, args ) {
			
			for ( var id in args.hash ) {
				mapping[ id ][ "width" ] = args.hash[ id ];
			}

			Storage.set( settings.key, config, { "session": false, "local": true }[ settings.scope ] );
		} );

		$G.onColumnsReordered.subscribe( function( e, args ) {
			
			var from = args.hash[ 0 ], to = args.hash[ 1 ];

			mapping[ from.id ][ "index" ] = to.index;
			mapping[ to.id ][ "index" ] = from.index;

			/** Auto save config */
			Storage.set( settings.key, config, settings.scope === "local" );
		} );

		if ( !config ) {

			updateConfig(); 

			config = {
				mapping: mapping,
				miscellaneous: miscellaneous
			};

			$G.setColumns( original );
		} else {
			mapping = config[ "mapping" ];
			miscellaneous = config[ "miscellaneous" ];

			applyConfig( true );
		}

		$( settings.trigger ).on( "click", function() {
		
			$.amodal( {
				showButtons: false,
				closeByDocument: true,
				showHead: false,

				render: function( ready, loading, close ) {

					var self = this;

					self.load( window.wpf_context_path + "/huawei/wpf/clientjavascript/scmresource/clienthtml/lab.html", function() {

						var html = "";

						for ( var id in mapping ) {

							var item = mapping[ id ];
							
							!item.always 
								&& (html += "<li data-id='" + id + "'>" + 
									"<div class='left'>" +
										"<h4>" + item.name + "</h4>" +
										"<input type='text' placeholder='Tooltip' name='tooltip' value='" + (item.tooltip || "") + "'>" +
									"</div>" +

									"<div class='right'>" +
										"<input type='checkbox' class='switch' id='show-hide-" + id + "' " + (item.hide ? "" : "checked=checked") + " >" +
										"<label for='show-hide-" + id + "'></label>" +
									"</div>" +
								"</li>");
						}
						
						self.find( "div.slick-lab-list" ).html( "<ul>" + html + "</ul>" );

						self.find( "#show-hide-alwaysDeleted" ).attr( "checked", !!miscellaneous.alwaysDeleteRows );
						self.find( "#show-hide-alwaysUpdated" ).attr( "checked", !!miscellaneous.alwaysUpdateRows );

						ready.resolve();
					} );

					self
						.delegate( "button[name=cancel]", "click", close )

						.delegate( "button[name=reset]", "click", function() {
						
							for ( var id in mapping ) {
								
								var item = mapping[ id ];

								$.extend( original[ item.index ], { 
									width: item.originalWidth,
									tooltip: (item.originalTooltip || "")
								} );
							}

							miscellaneous.alwaysUpdateRows = options.alwaysUpdateRows = false;
							miscellaneous.alwaysDeleteRows = options.alwaysDeleteRows = false;

							close();
							updateConfig();
							$G.setColumns( original );
							Storage.remove( settings.key, { "session": false, "local": true }[ settings.scope ] );
						} )

						.delegate( "button[name=save]", "click", function() {
						
							close();
							applyConfig( true );
							Storage.set( settings.key, config, { "session": false, "local": true }[ settings.scope ] );
						} )
						
						.delegate( "li[data-id] :checkbox", "click", function( e ) {

							var self = $( this )
							, item = mapping[ self.parents( "li[data-id]" ).attr( "data-id" ) ];

							item[ "hide" ] = !self.is( ":checked" );
						} )
						
						.delegate( "li[data-id] :text[name=tooltip]", "change", function( e ) {
						
							var self = $( this )
							, item = mapping[ self.parents( "li[data-id]" ).attr( "data-id" ) ];

							item[ "tooltip" ] = self.val();
						} )
						
						.delegate( "#show-hide-alwaysUpdated", "click", function() {
							
							options.alwaysUpdateRows = miscellaneous.alwaysUpdateRows = !miscellaneous.alwaysUpdateRows;
							Storage.set( settings.key, config, { "session": false, "local": true }[ settings.scope ] );
						} )

						.delegate( "#show-hide-alwaysDeleted", "click", function() {
							
							options.alwaysDeleteRows = miscellaneous.alwaysDeleteRows = !miscellaneous.alwaysDeleteRows;
							Storage.set( settings.key, config, { "session": false, "local": true }[ settings.scope ] );
						} );

					ready.resolve();
				}
			} );
		} );

		$G.onHeaderCellRendered.subscribe( function( e, args ) {
		
			var column = args.column;

			if ( column.tooltip ) {
				$( "<smnall class='header-tooltip' tooltip=" + column.tooltip + "></small>" )
					.appendTo( args.node );
			}
		} );
	};

	return function( $G, options ) {

		var settings = $.extend( {}, defaults, options || {} );
		
		new Lab( $G, settings );
	};
} );


define( [ "self/common/util/Storage", "self/common/ui/Amodal" ], function( Storage ) {

	var defaults = {
	
		key: "unique",
		scope: "local",

		ignore: [ "_checkbox_selector", "_radio_selector", "idx" ]
	};

	var Lab = function( $G, settings ) {
		
		var config = Storage.get( settings.key, !!{ "session": 0, "local": 1 }[ settings.scope ] )
	
		, original = $G.getColumns()
		, options = $G.getOptions()

		, mapping
		, miscellaneous

		, applyConfig = function() {
		
			var columns = [];

			for ( var id in mapping ) {
				
				var column;

				if ( mapping[ id ][ "always" ] | !mapping[ id ][ "hide" ] ) {
					
					column = original[ mapping[ id ][ "index" ] ];

					column.width = mapping[ id ][ "width" ];
					column.tooltip = mapping[ id ][ "tooltip" ];

					columns.push( column );
				}
			}

			columns.length && $G.setColumns( columns );

			if ( miscellaneous ) {
				options.alwaysUpdateRows = miscellaneous.alwaysUpdateRows;
				options.alwaysDeleteRows = miscellaneous.alwaysDeleteRows;
			}
		}

		, updateConfig = function() {
		
			mapping = {};

			for ( var i = 0, length = original.length; i < length; ++i ) {
				
				var column = original[ i ];

				mapping[ column.id ] = {
					name: column.name,
					originalWidth: column.width,
					width: column.width,
					always: settings.ignore.indexOf( column.id ) > -1,
					tooltip: column.tooltip,
					hide: false,
					index: i
				};
			}

			miscellaneous = {
				alwaysDeleteRows: options.alwaysDeleteRows,
				alwaysUpdateRows: options.alwaysUpdateRows
			};
		};

		$G.onColumnsResized.subscribe( function( e, args ) {
			
			for ( var id in args.hash ) {
				mapping[ id ][ "width" ] = args.hash[ id ];
			}

			Storage.set( settings.key, config, { "session": false, "local": true }[ settings.scope ] );
		} );

		if ( !config ) {

			updateConfig(); 

			config = {
				mapping: mapping,
				miscellaneous: miscellaneous
			};
		} else {
			mapping = config[ "mapping" ];
			miscellaneous = config[ "miscellaneous" ];

			applyConfig();
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

								item.originalWidth !== item.width
									
									&& (original[ item.index ][ "width" ] = item.originalWidth);
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
							applyConfig();
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
	};

	return function( $G, options ) {

		var settings = $.extend( {}, defaults, options || {} );
		
		new Lab( $G, settings );
	};
} );

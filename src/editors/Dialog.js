
define( [ "slick/paging/Paging",
	"slick/plugins/Radiocolumn",
	"self/common/ui/Amodal" ], function( Paging, Radiocolumn ) {

	var openDialog = function( options ) {

		$.amodal( {
			
			title: options.title || "Dialog",
			showButtons: false,
			closeByDocument: true,

			css: options.css || { width: 800 },

			render: function( ready, loading, close ) {
				
				var $G;

				this
				.html( "<section class='slick-dialog-head'>" + 
						"<input type='text' name='sometext' placeholder='Please enter search keywrods'>" +
						"<button name='search'>Search</button>" +
						"<button name='filter'>Filter</button>" +
					"</section>" +
					"<section class='slick-dialog-body'>" +
						"<div class='slick-wrap fade out' style='width:100%;'>" +
							"<div style='width:100%;height:410px;'></div>" +
						"</div>" +
					"</section>" +
					"<sction class='slick-dialog-tail'>" + 
						"<button name='amodal-ok'>Ok</button>" +
						"<button name='amodal-cancel'>Cancel</button>" +
					"</section>" );
				
				$G = new Slick.Grid( this.find( ".slick-wrap > div:first" ), new Slick.Data.DataView(), [], {
					
					/** Enable keybord navigation */
					enableCellNavigation: true,

					/** Fast keybord navigation */
					asyncEditorLoading: true,

					/** No horizontal scroll */
					forceFitColumns: false,

					/** Filter bar */
					showHeaderRow: true,

					/** Need init() */
					explicitInitialization: true
				} );

				$G.setColumns( [ Radiocolumn( $G ) ].concat( options.columns ) );

				Paging( $G, $G.getData(), {
				
					pagingInfo: {
						pageSize: 1000,
						pageNum: 0,

						sizes: [ 1000, 5000, 10000, 50000 ]
					},

					ajaxOptions: options.ajaxOptions || {
					
						serviceName: "queryPorject",
						moduleName: "gridElement_publicfind",
						params: {
							"entityId": 0,
							"popUpProgramName": "mrCreateCustomer"
						}
					}
				} );

				$G.init();

				$G.onDblClick.subscribe( function( e ) {
					options._onOk( $G.getRadioRow(), close() );
					e.stopImmediatePropagation();
				} );

				this

				.delegate( "button[name=search]", "click", function() {

					$G.search( {
						params: { "find": $( this ).prev().val() }
					} );
				} )

				.delegate( "button[name=filter]", "click", function() {
					/** Toggle filter bar */
					$G.setHeaderRowVisibility( !$( $G.getHeaderRow() ).is( ":visible" ) );
				} )

				.delegate( "button[name=amodal-ok]", "click", function() {
				
					options._onOk( $G.getRadioRow(), close() );
				} )

				.delegate( "button[name=amodal-cancle]", "click", function() {
				
					close();
				} )

				.delegate( ":text[name=sometext]", "keyup", function( e ) {
					
					e.keyCode === 13 && $G.search( {
						params: { "find": this.value }
					} );

					e.preventDefault();
				} )

				.find( ".slick-wrap" ).removeClass( "out" );

				ready.resolve();
			}
		} );
	}
	
	, DialogEditor = function( args ) {
	
		var
		  input,
		  trigger,
		  defaultValue;

		$.extend( this, {
			
			init: function() {

				var options = $.extend( {}, args.column.editorArgs || {}, {
					
					_onOk: function( item ) {
						this.onOk.apply( input, arguments );
						input.focus();
					},

				    	_onClose: function( item ) {
				    	
				    	}
				} );

				input = $( "<INPUT type=text class='editor-text dialog' /><small class='dialog-trigger' />" )
					.appendTo( args.container ).first().focus();

				trigger = input.next()
					.on( "click", function( e ) { openDialog( options ); } );
			},

			destroy: function() {
				
				input.add( trigger ).remove();
			},

			loadValue: function( item ) {
			
				input.val( defaultValue = item[ args.column.field ] ).focus();
			},

			serializeValue: function() {
				return input.val();
			},

			applyValue: function( item, state ) {
				item[ args.column.field ] = state;
			},

			isValueChanged: function() {
				
				/** Fuzzy match */
				return defaultValue != input.val();
			},

			validate: function( item, column ) {
			
				if ( args.column.validator ) {
					
					return args.column.validator( input.val(), item, column );
				}

				return {
					
					valid: true,
					msg: ""
				};
			}
		} );

		this.init();
	};

	return DialogEditor;
} );

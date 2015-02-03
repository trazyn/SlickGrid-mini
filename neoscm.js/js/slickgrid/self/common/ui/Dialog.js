
define( [ "slick/paging/Paging",
                "slick/plugins/Checkboxcolumn",
		"slick/plugins/Radiocolumn" ], function( Paging, Checkboxcolumn, Radiocolumn ) {

	var defaults = {
		
		css: {
			width: 800
		},

		closeByDocument: true,

                uniqueKey: "rr",

		pagingInfo: {
			pageSize: 100,
			pageNum: 0,

			sizes: [ 100, 500, 1000, 5000, 10000 ]
		},

                multiple: false,

		selector4input: ":input",
		selector4trigger: ".dialog-trigger"
	}
	
	, identifier = "$ui.dialog"

	, Dialog = function( target, settings ) {

		var input = target.find( settings.selector4input )
		, trigger = target.find( settings.selector4trigger );

		this.$node = target;
		this.settings = settings;

		input.attr( "name", target.attr( "name" ) );

		trigger.on( "click", function( e ) {
			
			if ( target.is( "disabled" ) ) { return; }

			$.amodal( {
				title: settings.title || "Dialog",
				showButtons: false,
				closeByDocument: settings.closeByDocument,
				css: settings.css,

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
					
					$G = new Slick.Grid( this.find( ".slick-wrap > div:first" ), new Slick.Data.DataView( settings.uniqueKey ), [], {
						forceFitColumns: true,
						enableHeaderRow: true,
						explicitInitialization: true
					} );

					$G.setColumns( [ settings.multiple ? Checkboxcolumn( $G ) : Radiocolumn( $G ) ].concat( settings.columns ) );

					Paging( $G, $G.getData(), {
					
						pagingInfo: settings.pagingInfo,

						ajaxOptions: settings.ajaxOptions || {
						
							serviceName: "queryPorject",
							moduleName: "gridElement_publicfind",
							params: {
								"entityId": 0,
								"popUpProgramName": "mrCreateCustomer"
							}
						}
					} );

					$G.init();

                                        settings.multiple && $G.onDblClick.subscribe( function( e ) {

						var callback = settings.onOk;

						if ( "function" === typeof callback && false === callback.call( input, $G.getRadioRow(), $G ) ) { return; }

                                                input.trigger( "change" );
						close();
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
						$G.toggleHeaderRow();
					} )

					.delegate( "button[name=amodal-ok]", "click", function() {
					
						var callback = settings.onOk;

						if ( typeof callback === "function" 
						        && false === callback.call( input
						                        , settings.multiple ? $G.getSelectedRowsData() : $G.getRadioRow()
						                        , $G ) ) {
						
						        return;
						}

						input.trigger( "change" );

						close();
					} )

					.delegate( "button[name=amodal-cancel]", "click", function() {
					
						var callback = settings.onClose;

						"function" === typeof callback && callback.call( this, $G );

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

			e.preventDefault();
		} );
	};

	Dialog.prototype = {
		
		val: function( value ) {
			
			var input = this.$node.find( ":input" );

			if ( value ) {
				input.val( value );
			} else {
				return input.val();
			}
		},

		disabled: function() {
			
			this.$node.attr( "disabled", true );
		},

		enabled: function() {
			
			this.$node.attr( "disabled", false );
		},

		focus: function() {
			
			this.$node.find( ":input" ).select().focus();
		}
	};

	$.fn.dialog = function( options, force ) {
	
		var instance = this.data( identifier );

		if ( !0 === force || !instance ) {

			instance = new Dialog( this, $.extend( {}, defaults, options || {} ) );
			this.data( identifier, instance );
		} 

		return instance;
	};
} );




define( [ "self/common/util/Template", 
		"self/common/ui/Dialog",
		"self/common/ui/W3user",
		"self/common/ui/Ripple",
		"self/common/ui/ProgressButton",
		"self/common/ui/Calendar" ], function( Template ) {

	var hook = {
		
		"dialog": function( target, options, ready ) {
			ready.resolve();
			return target.dialog( options );
		},

		"calendar": function( target, options, ready ) {
			ready.resolve();
			return target.calendar( options );
		},

		"dropdown": function( target, options, ready ) {

			ready.resolve();
			return target.dropdown( $.extend( {}, { 
				nothing: "Dropdown",
				readonly: true 
			}, options || {} ) );
		},

		"w3user": function( target, options, ready ) {
			ready.resolve();
			return target.w3user();
		},

		"progressButton": function( target, options, ready ) {
			ready.resolve();
			return target.progressButton( options );
		},

		"tab": function( target, options, ready ) {

			ready.resolve();
			return target.tabs( options );
		},

		"template": function( target, options, ready ) {

			var settings = {
				
				container: target,
				selector4save: "button[name=save]",
				selector4delete: "button[name=delete]",
				selector4default: "button[name=setDefault]",
				selector4reset: "button[name=reset]",
				selector4template: "select[name=template]"
			};

			ready.resolve();
			return Template( $.extend( {}, settings, options || {} ) );
		},

		"select": function( target, options, ready ) {

		        var 
		        request, 
                        settings = $.extend( {
                                valueKey: "value",
                                textKey: "text",
                                moduleName: "gridElement_kiss"
                        }, options ),
		        buildOptions = function( data ) {

		                var html = "";
                                for ( var i = 0, length = data.length; i < length; ++i ) {
                                        var item = data[ i ];

                                        html += "<option value='" + item[ settings.valueKey || settings.textKey ] + "'>" + item[ settings.textKey ] + "</option>";
                                }
                                target.append( html );
		        };

		        if ( options.lookupName ) {
                                
                                settings.textKey = "attribute1";
                                settings.valueKey = "meaning";

                                request = $.ajax( {
                                        data: {
                                                name: "fnd.lookup.GeLookupCodes",
                                                params: JSON.stringify( {
                                                        needGridInterceptor: "true",
                                                        lookup_type: options.lookupName
                                                } )
                                        }
                                } )
                                .done( function( data ) {
                                
                                        data = eval( "(" + data + ")" )[ "result" ][ "gridElement_fnd.lookup.geLookupCodes" ];
                                        data = JSON.parse( data ).result;
                                        buildOptions( data );
                                } );
		        } else {
		        
                                request = $.ajax( {
                                        data: settings.data
                                } )
                                .done( function( data ) {

                                        data = eval( "(" + data + ")" ).result[ settings.moduleName ];
                                        data = JSON.parse( data ).result;
                                        buildOptions( data );
                                } );
		        }
		
                        request.always( function() { ready.resolve(); } );
                }
	},

	reserved = [ "waiting" ],
	
	shims = {

                "ripple": function( container ) {

                        container
                        .delegate( "button.ripple-btn", "click", function( e ) {
                                $( this ).ripple().start( e );
                        } );
                },

                "pane": function( container ) {

                        var workspaceRight = container.find( "div.ui-workspace-right:first" );

                        container.find( "div.left-search" )
                                .slide( {

                                        selector4trigger: "small:first",
                                        selector4content: container.find( ".left-search" ),
                                        init: function( $node ) {

                                                workspaceRight.data( "originalWidth", workspaceRight[ 0 ][ "style" ][ "width" ] );

                                                $node.is( "." + this.settings.class4open )
                                                        ? $node.removeClass( "slide-left" )
                                                        : $node.addClass( "slide-left" ).css( "width", "96%" )
                                                        ;
                                        },
                                        onClose: function() {

                                                var originalWidth = workspaceRight.data( "originalWidth" );

                                                this.$node.addClass( "slide-left" );

                                                workspaceRight.animate( { "width": "96%" }, 377 ); },
                                        onOpen: function() {

                                                var originalWidth = workspaceRight.data( "originalWidth" );

                                                this.$node.removeClass( "slide-left" );

                                                workspaceRight.animate( { "width": originalWidth }, 77 );
                                        }
                                } );
                },

                "spinner": function( container, promise ) {

                        var spinner = "<div style='width: 18px;" +
                                "height: 18px;" +
                                "box-sizing: border-box;" +
                                "border: solid 2px transparent;" +
                                "border-top-color: #29d;" +
                                "border-left-color: #29d;" +
                                "border-radius: 50%;" +
                                "position: absolute;" +
                                "-webkit-animation: progress-spinner 400ms linear infinite;" +
                                "animation: progress-spinner 400ms linear infinite;" +
                                "'>";

                        spinner = $( spinner )
                                .css( {
                                        top: 15,
                                        right: 15
                                } )
                                .appendTo( container );

                        promise.always( function() {
                                spinner.remove();
                        } );
                },
    
                "slide": function( container ) {

                        container.find( ".ui-slide:not(.left-search)" )
                                .each( function() {
                                        $( this ).slide( {

                                                selector4content: ".ui-slide-content:first",
                                                onClose: function() {

                                                        var self = this;

                                                        if ( !self.inAnimate ) {
                                                                self.inAnimate = 1;

                                                                self.$node.find( self.settings.selector4content )
                                                                .slideUp( function() {
                                                                        self.inAnimate = 0;
                                                                } );
                                                        }
                                                },

                                                onOpen: function() {

                                                        var self = this;

                                                        self.inAnimate 
                                                                || (self.inAnimate = 1, 
                                                                                self.$node.find( self.settings.selector4content )
                                                                                .slideDown( function() {
                                                                                        self.inAnimate = 0;
                                                                                } ));
                                                }
                                        } );
                                } );
                }
	};
	
        return function( container, eles, shim ) {

                var 
                args = {}, 
                promise,
                callbackWrap = function( callback, target ) {
                        return function() {
                                "function" === typeof callback && callback( target );
                        };
                },
                deferreds = [];

                container = $( container );

                $.extend( shims, shim || {} );

                for ( var name in eles ) {

                        var target = eles[ name ][ "target" ], implement;

                        if ( reserved.indexOf( name ) === -1 && target ) {

                                if ( !(target instanceof window.jQuery) ) {
                                        target = $( target );
                                }

                                if ( target.length ) {

                                        var ready = $.Deferred();

                                        implement = hook[ target.attr( "data-role" ) ];

                                        if ( !name.indexOf( ":" ) ) {
                                                implement( target, eles[ name ][ "options" ], ready );
                                        } else {
                                                args[ name ] = implement( target, eles[ name ][ "options" ], ready );
                                        }

                                        ready
                                        .done( callbackWrap( eles[ name ].done, target ) )
                                        .fail( callbackWrap( eles[ name ].fial, target ) )
                                        .always( callbackWrap( eles[ name ].always, target ) );

                                        deferreds.push( ready );
                                }
                        }
                }

                promise = $.when.apply( $, deferreds );

                for ( var shim in shims ) {

                        var callback = shims[ shim ];
                        typeof callback === "function" && callback( container, promise, deferreds );
                }

                args.waiting = function() {
                        return promise;
                };

                return args;
        };
} );


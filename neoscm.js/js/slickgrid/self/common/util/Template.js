define( [ "hwlib/MessageDialog",
        "self/common/util/Storage" ],
function( MessageDialog, Storage, undefined ) {

	"use strict";

	var defaults = {
		
		/** Selectors */
		selector4save: "input[name=saveTemplate]",
		selector4delete: "input[name=deleteTemplate]",
		selector4default: "input[name=defaultTemplate]",
		selector4reset: "input[name=resetTemplate]",
		selector4template: "select[name=template]",
		selector4templateName: "input[name=templateName]",

		/** ID of the condition region */
		container: "#condionRegion",

		/** Ignore list, selector of the form elements */
		ignore: [ "input[name=commonDialog]", "input[name$=Dialog]" ],

		/** Name of current module */
		modelName: undefined,

		/** User interface */
		reset: function( container ) {},
		get: function( container, data ) {},
		set: function( container, data ) {},

		validation: function( container, data ) {
			return true;
		},

		message: {
			
			/** MessageType: Description */
			"NameIsRequired": "The template name is required.",
			"InvalidName": "The template name is invalid.",
			"AlreayExists": "The template name is already exist, override it?",
			"Template404": "The template is not exist."
		}
	};

	return function( option ) {

		var cacheKey, select, cache4template = {}

		, settings, container, eleList = [], ignoreList = []

		, updateCache = function() {
		
			var cache = [];
		
			for ( var name in cache4template ) {
				
				cache.push( {
					"criterias_name": name,
					"criterias_value": JSON.stringify( cache4template[ name ][ "value" ] ),
					"default_flag": cache4template[ name ][ "isDefault" ]
				} );
			}

			Storage.set( cacheKey, cache );
		}
			
		/** Validate the template name */
		, validate = function() {
			
			var res = {
				
				"NameIsRequired": false,
				"InvalidName": false,
				"Template404": false,
				"AlreayExists": false,

				ok: true
			}
			, templateName = container.find( settings.selector4templateName ).val();

			if ( !templateName || !(templateName = templateName.replace( /^\s+|\s+$/g, "" )) ) {
				res.ok &= false;
				return (res[ "NameIsRequired" ] = true), res;
			}

			if ( templateName.length >= 30 || !/^[a-zA-Z|\d|\u4e00-\u9fa5]*$/.test( templateName ) ) {
				res.ok &= false;
				return res[ "InvalidName" ] = true, res;
			}

			container
			.find( "select > option:contains(" + templateName + ")" )
			.each( function( ignore, e ) {
				if ( e.innerHTML === templateName ) {
					return (res[ "AlreayExists" ] = true, res);
				}
			} );

			res[ "Template404" ] = true;

			return res;
		}
		
		, showError = function( res ) {
			
			var key, message;

			for ( key in res ) {
				var ok = res[ key ];
				if ( ok && (message = settings.message[ key ]) ) {
					return $.message.error( message );
				}
			}
		}
			
		, setTemplate = function( templateName, data ) {

			var key, name;

			for ( name in data  ) {
				data.hasOwnProperty( name ) && container.find( "[name=" + name + "]" ).val( data[ name ] );
			}
			$( settings.selector4template ).val( templateName );
			$.isFunction( settings.set ) && settings.set( container, data );
		}
		
		, renderTemplate = function( templates ) {
		
			var html = "<option value>Please select</option>";

			for ( var template, i = 0, length = templates.length; i < length; ) {
				
				var templateName;

				template = templates[ i++ ];
				templateName = template[ "criterias_name" ];
				cache4template[ templateName ] = {
					value: JSON.parse( template[ "criterias_value" ] ),
					isDefault: template[ "default_flag" ] === "Y"
				};
				template = cache4template[ templateName ];

				if ( !template.isDefault ) {
					html += "<option value=" + templateName + ">" + templateName + "</option>";
				} else {
					html += "<option selected=selected value=" + templateName + ">" + templateName + "</option>";
					setTemplate( templateName, template.value );
				}
			}

			select.html( html );
			Storage.set( cacheKey, templates );
		}

		, reset = function() {

			select.val( "" );
			for ( var i = eleList.length; --i >= 0; eleList.eq( i ).val( "" ).removeClass( "error" ) );
			"function" === typeof settings.reset && settings.reset( container );
		}

		, save = function( templateName ) {

			var data = (function() {
								
				var res = {};

				for ( var i = eleList.length; --i >= 0; ) {
					
					var ele = eleList.eq( i )
					, name = ele.attr( "name" );

					name && (res[ name ] = ele.val());
				}
				
				"function" === typeof settings.get && settings.get( container, res );

				return res;
			})()
			
			, doSave = function( isNew ) {

				var templateName = templateName || container.find( settings.selector4templateName ).val();
					
				$.ajax( {
					
					type: "POST",
					data: {
						name: "scm.common.defaultTemplate.SaveTemplate",
						params: JSON.stringify( {
							
							model_name: settings.modelName,
							template_name: container.find( "input[name=templateName]" ).val(),
							template_value: JSON.stringify( data )
						} )
					},

					success: function() {

						if ( !cache4template[ templateName ] ) {
							select.append( $( "<option>" ).val( templateName ).html( templateName ) );
						}

						cache4template[ templateName ] = cache4template[ templateName ] || {};
						cache4template[ templateName ][ "value" ] = data;
						updateCache();
						reset();
					},
					error: function( e ) {}
				} );
			}
			, res = validate();

			if ( res.ok ) {
				res[ "AlreayExists" ] ? MessageDialog.confirm( {
					msg: settings[ "AlreayExists" ], onOk: doSave
				} ) : ("function" === typeof settings.validation && settings.validation( container, data ) && doSave( true ));

			} else showError( res );
		}

		, setDefault = function( templateName ) {
		
			var res = validate();
			
			templateName = templateName || container.find( settings.selector4templateName ).val();

			/** Tempname should exists */
			if ( res.ok && res[ "AlreayExists" ] ) {

				$.ajax( {
					
					type: "POST",
					data: {
						name: "scm.common.defaultTemplate.SetDefaultTemplate",
						params: JSON.stringify( { modelName: settings.modelName, templateName: templateName } )
					},

					success: function( data ) {


						for ( var name in cache4template ) {
							cache4template[ name ][ "isDefault" ] = "N";
						}

						cache4template[ templateName ][ "isDefault" ] = "Y";
						updateCache();
					},

					error: function( e ) {
						$.message.error( "Operate failed" );
					}
				} );

			} else showError( res );
		}

		, del = function( templateName ) {
		
			var res = validate()
			, templateName = templateName || container.find( settings.selector4templateName ).val();

			if ( res.ok && res[ "AlreayExists" ] ) {
				
				$.ajax( {
					data: {
						name: "scm.common.defaultTemplate.DeleteTemplate",
						params: JSON.stringify( { model_name: settings.modelName, template_name: templateName } )
					},

					success: function() {
						
						delete cache4template[ templateName ];

						select.find( ":selected" ).remove();
						updateCache();
						reset();
					},

					fail: function() {
						$.message.error( "Operate failed" );
					}
				} );
			} else showError( res );
		};

		/** Apply the setting */
		settings = $.extend( true, {}, defaults, option || {} );

		/** Use catalog id */
		settings.modelName = "string" === typeof settings.modelName ? settings.modelName : window.location.hash.split( "/" )[ 2 ];

		cacheKey = [ settings.modelName, window.wpf_logonuid, window.wpf_current_roleid ].join( "#" );

		switch ( true ) {
			
			/** CSS selector */
			case "string" === typeof settings.container:
				container = $( settings.container );
				break;

			/** An instance of jQuery */
			case (container = settings.container) instanceof window.jQuery:
				break;

			default:
				/** Fallback to the nearest form */
				container = $( window.event.target ).parents( ".scm-form" );
		}

		select = $( settings.selector4template );

		settings.ignore = $.isArray( settings.ignore ) ? settings.ignore : [ settings.ignore ];

		settings.ignore.push( settings.selector4template );

		/** Build the ignore list */
		for ( var i = settings.ignore.length; --i >= 0; ignoreList = ignoreList.concat( container.find( settings.ignore[ i ] ).toArray() ) );

		/** Build the operation list */
		eleList = container.find( ":text, :radio, select, textarea, checkbox" );

		/** Do filter */
		for ( var i = ignoreList.length; --i >= 0; (eleList = eleList.not( ignoreList[ i ] )) );

		select
		/** Clone the select */
		.html( select.html() )

		/** Change the template */
		.on( "change", function() {

			var templateName = $( this ).val();

			if ( templateName ) {
				setTemplate( templateName, cache4template[ templateName ][ "value" ] );
			} else reset();
		} );

		container
			.delegate( settings.selector4save, "click", save )
			.delegate( settings.selector4default, "click", function() { setDefault(); } )
			.delegate( settings.selector4delete, "click", function() { del(); } )
			.delegate( settings.selector4reset, "click", reset )
			;

		var data = Storage.get( cacheKey );

		/** Load the template */
		data ? renderTemplate( data ) : $.ajax( {

			data: {
		     		name: "scm.common.defaultTemplate.QueryTemplate2",
				params: JSON.stringify( { model_name: settings.modelName } )
			},
		     	success: function( data ) {
		     		
				var templates;

		     		if ( data ) {
		     			
		     			try {
						templates = eval( "(" + data + ")" ).result.gridElement_templates;
						templates = JSON.parse( templates ).result;
						renderTemplate( templates );
		     			} catch ( e ) {
		     				throw new Error( "Oops, failed to parse the data." );
		     			}
		     		}
		     	}
		} );

		return {
			reset: reset,
			save: save,
			del: del,
			setDefault: setDefault
		};
	};
} );


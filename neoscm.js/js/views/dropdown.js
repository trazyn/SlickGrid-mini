
define( [ "ui/Dropdown" ], function() {

	return function( container ) {

		var data = [ { 
			value: "AD", 
			text: "Andorra" 
		}, { 
			value: "AZ", 
			text: "Azerbaijan" 
		}, { 
			value: "AW", 
			text: "Aruba" 
		}, { 
			value: "BI", 
			text: "Bulgaria" 
		}, { 
			value: "BS", 
			text: "Bahamas" 
		}, { 
			value: "CH", 
			text: "Switzerland" 
		}, { 
			value: "CK", 
			text: "Cook Island" 
		}, { 
			value: "CL", 
			text: "Chile" 
		}, { 
			value: "CN", 
			text: "China" 
		}, { 
			value: "CM", 
			text: "Cambodia" 
		}, { 
			value: "AE", 
			text: "United Arab Emirates" 
		}, { 
			value: "AF", 
			text: "Afghanistan" 
		}, { 
			value: "AG", 
			text: "Antigua and Barbuda" 
		}, { 
			value: "AO", 
			text: "Angola" 
		} ];
	
		container
		.find( ".dropdown[name=normal]" )
		.dropdown( {
			data: data
		} );

		container
		.find( ".dropdown[name=hover]" )
		.dropdown( {
			data: data,
			nothing: "Hover Me",
			type: "hover"
		} );

		container
		.find( ".dropdown[name=multiple]" )
		.dropdown( {
			data: data,
			nothing: "Multiple Select",
			multiple: true
		} );

		container
		.find( ".dropdown[name=format]" )
		.dropdown( {
			data: data,
			nothing: "Custom Format"
		} );
	};
} );


require.config( {
	
	baseUrl: "src",

	paths: {
		
		"slick": "."
	}
} );

require( [ "slick/paging/Paging",
	"slick/plugins/Checkboxcolumn",
	"slick/plugins/Radiocolumn",
	"slick/curd/Delete",
	"slick/curd/Update",
	"slick/plugins/Actionbar",
	"slick/editors/Text",
	"slick/editors/Select",
	"slick/editors/Textarea",
	"slick/core/Core", 
	"slick/core/Grid",
	"slick/core/DataView" ], function( Paging, Checkboxcolumn, Radiocolumn, Delete, Update, Actionbar, Text, Select, Textarea ) {

	var $G
	, dataView = new Slick.Data.DataView();

	for ( var i = 0, data = []; i < 54; ++i ) {
		
		data[ i ] = {
		
			"rr": "# " + i,
			"num1": i,
			"num2": Math.random() * 1000,
			"num3": Math.random() * 10000,
			"num4": Math.random() * 100000,
			"num5": Math.random() * 100000,
			"num6": Math.random() * 100000,
			"yesNo": Math.floor( Math.random() * 100000 ) & 1 ? "Y" : "N",
			"desc": "Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
		};
	}

	$G = new Slick.Grid( "#myGrid", dataView, [], {
		editable: true,

		/** Enable keybord navigation */
		enableCellNavigation: true,

		/** Fast keybord navigation */
		asyncEditorLoading: true,

		/** No horizontal scorllbar */
		forceFitColumns: false,

		syncColumnCellResize: true,

		enableHeaderRow: true,

		headerRowVisibility: true
	} );

	;;window.$G = $G;
	;;window.dataView = dataView;
	
	$G.setColumns( [ Checkboxcolumn( $G ), Radiocolumn( $G ), {
		id: "column1",
		name: "IDS",
		field: "rr",
		sortable: true,
		width: 40
	}, {
		id: "column2",
		name: "No.1",
		field: "num1",
		editor: Text,
		filter: true,
		width: 200,
		sortable: true,

		validator: function( value, item, column ) {
			
			var result = { valid: true };

			if ( !value ) {
				
				result.valid = false;
			}

			return result;
		}
	}, {
		id: "column3",
		name: "No.2",
		field: "num2",
		editor: Text,
		filter: true,
		sortable: true,
		frozen: true,

		width: 200,
		require: true
	}, {
	
		id: "column4",
		name: "No.4",
		field: "num4",
		editor: Text,
		filter: true,
		width: 200,
		sortable: true
	}, {
		id: "column8",
		name: "Description",
		field: "desc",
		editor: Textarea,
		editorArgs: { max: 500 },
		width: 200,
		sortable: true
	}, {
	
		id: "column5",
		name: "No.5",
		field: "num5",
		editor: Text,
		filter: true,
		width: 200,
		sortable: true
	}, {
	
		id: "column6",
		name: "No.6",
		field: "num6",
		editor: Text,
		filter: true,
		width: 200,
		sortable: true
	}, {
		id: "column8",
		name: "Yes No",
		field: "yesNo8",
		editor: Select,
		editorArgs: { items: [ { value: "N", label: "No" }, { value: "Y", label: "Yes" } ] },
		filter: true,
		width: 200,
		sortable: false
	}, {
	
		id: "column9",
		name: "Yes No",
		field: "yesNo9",
		editor: Select,
		editorArgs: { items: [ { value: "N", label: "No" }, { value: "Y", label: "Yes" } ] },
		filter: true,
		width: 200,
		sortable: false
	}, {
	
		id: "column10",
		name: "Yes No",
		field: "yesNo10",
		editor: Select,
		editorArgs: { items: [ { value: "N", label: "No" }, { value: "Y", label: "Yes" } ] },
		filter: true,
		width: 200,
		sortable: false
	}, {
	
		id: "column11",
		name: "Yes No",
		field: "yesNo11",
		editor: Select,
		editorArgs: { items: [ { value: "N", label: "No" }, { value: "Y", label: "Yes" } ] },
		filter: true,
		width: 200,
		sortable: false
	}, {
	
		id: "column7",
		name: "Yes No",
		field: "yesNo",
		editor: Select,
		editorArgs: { items: [ { value: "N", label: "No" }, { value: "Y", label: "Yes" } ] },
		filter: true,
		width: 200,
		sortable: false
	} ] );

	Paging( $G, dataView, {
	
		pagingInfo: {
			pageSize: 50,
			pageNum: 0,

			sizes: [ 50, 100, 500, 1000 ]
		},

		data: data,

		/**
		ajaxOptions: {
		
			data: {
				
				name: "getNames",
				params: JSON.stringify( {} )
			}
		}
		*/
	} );

	Actionbar( $G, $G.getContainerNode().previousElementSibling, {
		
		//lab: { enable: true },
		add: { enable: true },
		del: { enable: true },
		save: { enable: true },
		genius: { enable: true },
		fullscreen: { enable: true }
	} );

	$G.init();

	$( ".slick-header-column" )

		.each( function() {
			
			this.addEventListener( "dragstart", function( e ) {
			
				e.dataTransfer.setImage( this, 0, 0 );
			} );
		} );
} );

//$.get( "/scm/scmui/ajax2?bst_model=huawei/wpf/Framework&nodeID=DC00000000091301" )

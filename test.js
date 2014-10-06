
require.config( {
	
	baseUrl: "src",

	paths: {
		
		"slick": "."
	}
} );

require( [ "slick/paging/Paging",
	"slick/plugins/Checkboxcolumn",
	"slick/curd/Delete",
	"slick/curd/Update",
	"slick/Actionbar",
	"slick/plugins/Highlight",
	"slick/core/Core", 
	"slick/core/Grid", 
	"slick/cell/Editors" ], function( Paging, Checkboxcolumn, Delete, Update, Actionbar, Highlight ) {

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
			"num7": Math.random() * 100000,
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

		showHeaderRow: true,

		explicitInitialization: true
	} );

	;;window.$G = $G;
	;;window.dataView = dataView;
	
	$G.setColumns( [ Checkboxcolumn( $G, dataView ), {
		id: "column1",
		name: "IDS",
		field: "rr",
		sortable: true,
		width: 40
	}, {
		id: "column2",
		name: "No.1",
		field: "num1",
		editor: Slick.Editors.Text,
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
		editor: Slick.Editors.Text,
		filter: true,
		sortable: true,

		width: 200,
		require: true
	}, {
	
		id: "column4",
		name: "No.4",
		field: "num4",
		editor: Slick.Editors.Text,
		filter: true,
		width: 200,
		sortable: true
	}, {
	
		id: "column5",
		name: "No.5",
		field: "num5",
		editor: Slick.Editors.Text,
		filter: true,
		width: 200,
		sortable: true
	}, {
	
		id: "column6",
		name: "No.6",
		field: "num6",
		editor: Slick.Editors.Text,
		filter: true,
		width: 200,
		sortable: true
	}, {
	
		id: "column7",
		name: "No.7",
		field: "num7",
		editor: Slick.Editors.Text,
		filter: true,
		width: 200,
		sortable: true
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

	Actionbar( $G, $G.getContainerNode().previousElementSibling );

	$G.init();
} );

//$.get( "/scm/scmui/ajax2?bst_model=huawei/wpf/Framework&nodeID=DC00000000091301" )


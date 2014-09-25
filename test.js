
require.config( {
	
	baseUrl: "src",

	paths: {
		
		"slick": "."
	}
} );

require( [ "slick/paging/Paging",
	"slick/plugins/Checkboxcolumn",
	"slick/core/Core", 
	"slick/core/Grid", 
	"slick/cell/Editors" ], function( Paging, Checkboxcolumn ) {


	var $G
	, dataView = new Slick.Data.DataView();

	for ( var i = 0, data = []; i < 1000; ++i ) {
		
		data[ i ] = {
		
			"id": "# " + i,
			"num1": Math.random() * 100,
			"num2": Math.random() * 1000,
			"num3": Math.random() * 10000
		};
	}

	$G = new Slick.Grid( "#myGrid", dataView, [], {
		editable: true,

		/** Enable keybord navigation */
		enableCellNavigation: true,

		/** Fast keybord navigation */
		asyncEditorLoading: true,

		/** Auto align the columns */
		forceFitColumns: true,

		syncColumnCellResize: true,

		showHeaderRow: true,

		explicitInitialization: true
	} );

	;;window.$G = $G;
	;;window.dataView = dataView;
	
	$G.setColumns( [ Checkboxcolumn( $G, dataView ), {
		id: "column1",
		name: "IDS",
		field: "id",
		width: 40
	}, {
		id: "column2",
		name: "Language",
		field: "num1",
		editor: Slick.Editors.Text,
		filter: true,
		sortable: true
	}, {
		id: "column3",
		name: "Year",
		field: "num2",
		editor: Slick.Editors.Text,
		filter: true,
		sortable: true
	}, {
		id: "column4",
		name: "Value",
		field: "num3",
		editor: Slick.Editors.Text,
		filter: true,
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

	$G.init();
} );

//$.get( "/scm/scmui/ajax2?bst_model=huawei/wpf/Framework&nodeID=DC00000000091301" )


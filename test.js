
require.config( {
	
	baseUrl: "src",

	paths: {
		
		"slick": "."
	}
} );

require( [ "slick/Pager",
	"slick/core/Core", 
	"slick/core/Grid", 
	"slick/cell/Editors",
	"slick/plugins/Checkboxcolumn" ], function( Pager ) {


	var $G
	, dataView = new Slick.Data.DataView()
	
	, checkBoxColumn = new Slick.CheckboxSelectColumn();

	for ( var i = 0, data = []; i < 1000; ++i ) {
		
		data[ i ] = {
		
			"id": "# " + i,
			"num1": Math.random() * 100,
			"num2": Math.random() * 1000,
			"num3": Math.random() * 10000
		};
	}

	dataView.setItems( data );

	$G = new Slick.Grid( "#myGrid", dataView, [ checkBoxColumn.getColumnDefinition(), {
		
		id: "column1",
		name: "IDS",
		field: "id",
		width: 40
	}, {
		id: "column2",
		name: "Language",
		field: "num1",
		editor: Slick.Editors.Text,
		sortable: true
	}, {
		id: "column3",
		name: "Year",
		field: "num2",
		editor: Slick.Editors.Text,
		sortable: true
	}, {
		id: "column4",
		name: "Value",
		field: "num3",
		editor: Slick.Editors.Text,
		sortable: true
	} ], {
		editable: true,

		/** Enable keybord navigation */
		enableCellNavigation: true,

		/** Fast keybord navigation */
		asyncEditorLoading: true,

		/** Auto align the columns */
		forceFitColumns: true,

		syncColumnCellResize: true,

		multiColumnSort: true,

		explicitInitialization: true
	} );

	Pager( $G, dataView );

	$G.setSelectionModel( new Slick.RowSelectionModel( { selectActiveRow: false } ) );

	$G.registerPlugin( checkBoxColumn );

	$G.init();
} );



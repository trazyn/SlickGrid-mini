var dataView = new Slick.Data.DataView()
	
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

var $G = new Slick.Grid( "#myGrid", dataView, [ {
	
	id: "column1",
    	name: "IDS",
    	field: "id",
    	width: 40
    	
}, {
	id: "column2",
    	name: "Language",
    	field: "num1",
    	editor: Slick.Editors.Text
}, {
	id: "column3",
    	name: "Year",
    	field: "num2",
    	editor: Slick.Editors.Text
}, {
	id: "column4",
    	name: "Value",
    	field: "num3",
    	editor: Slick.Editors.Text
} ].unshift( checkBoxColumn.getColumnDefinition() ), {
	editable: true,

    	/** Enable keybord navigation */
    	enableCellNavigation: true,

    	/** Fast keybord navigation */
    	asyncEditorLoading: true,

    	/** Auto align the columns */
    	forceFitColumns: true,

    	syncColumnCellResize: true
} );

$G.setSelectionModel( new Slick.RowSelectionModel( { selectActiveRow: false } ) );
$G.registerPlugin( checkBoxColumn );


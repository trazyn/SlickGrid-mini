
define([ "slick/editors/Textarea" ], function( Textarea ) {

    return function() {
        return [{
            id: "mrnumber",
            name: "MR NO.",
            field: "mrnumber",
            filter: !0,
            enableCopy: !0,
            width: 150,
            sortable: true,
			editor: Textarea,
			frozen: true
        }, {
            id: "status_desc",
            name: "Status",
            field: "status_desc",
            filter: !0,
            enableCopy: !0,
            width: 107,
            sortable: !1
        }, {
            id: "match_status_desc",
            name: "Match Status",
            field: "match_status_desc",
            filter: !0,
            enableCopy: !0,
            width: 123,
            sortable: !1
        }, {
            id: "request_arrived_date",
            name: "RAD",
            field: "request_arrived_date",
            filter: !0,
            enableCopy: !0,
            width: 100,
            sortable: !1
        }, {
            id: "project_code",
            name: "Project Code",
            field: "project_code",
            filter: !0,
            enableCopy: !0,
            width: 150,
            sortable: !1
        }, {
            id: "contractnumber",
            name: "Contract No.",
            field: "contractnumber",
            filter: !0,
            enableCopy: !0,
            width: 150,
            frozen: true,
            sortable: !0
        }, {
            id: "config_number",
            name: "Site Config No.",
            field: "config_number",
            filter: !0,
            enableCopy: !0,
            width: 150,
            sortable: !1
        }, {
            id: "msite",
            name: "DU/Site Code",
            field: "msite",
            filter: !0,
            enableCopy: !0,
            width: 150,
            sortable: !1
        }, {
            id: "site_desc",
            name: "DU/Site Name",
            field: "site_desc",
            filter: !0,
            enableCopy: !0,
            width: 150,
            sortable: !1
        }, {
            id: "physicalsitecode",
            name: "Customer Site ID",
            field: "physicalsitecode",
            filter: !0,
            enableCopy: !0,
            width: 150,
            sortable: !1
        }, {
            id: "site_address",
            name: "Site Add.",
            field: "site_address",
            filter: !0,
            enableCopy: !0,
            width: 150,
            sortable: !1
        }, {
            id: "created_person",
            name: "MR Creator",
            field: "created_person",
            filter: !0,
            enableCopy: !0,
            width: 150,
            sortable: !1
        }, {
            id: "creation_date",
            name: "MR Created Date",
            field: "creation_date",
            filter: !0,
            enableCopy: !0,
            width: 150,
            sortable: !1
        }, {
            id: "apply_by",
            name: "MR Applier",
            field: "apply_by",
            filter: !0,
            enableCopy: !0,
            width: 150,
            sortable: !1
        }, {
            id: "apply_date",
            name: "MR Apply Date",
            field: "apply_date",
            enableCopy: !0,
            filter: !0,
            width: 150,
            sortable: !1
        }, {
            id: "approver_name",
            name: "MR Approver",
            field: "approver_name",
            filter: !0,
            enableCopy: !0,
            width: 150,
            sortable: !1
        }, {
            id: "project_name",
            name: "Project Name",
            field: "project_name",
            filter: !0,
            enableCopy: !0,
            width: 150,
            sortable: !1
        }, {
            id: "inventoryname",
            name: "Warehouse",
            field: "inventoryname",
            filter: !0,
            enableCopy: !0,
            width: 150,
            sortable: !1
        }, {
            id: "actual_mr_number",
            name: "Actual MR No.",
            field: "actual_mr_number",
            filter: !0,
            enableCopy: !0,
            width: 150,
            sortable: !1
        }, {
            id: "customer_desc",
            name: "Customer",
            field: "customer_desc",
            filter: !0,
            enableCopy: !0,
            width: 150,
            sortable: !1
        }, {
            id: "cust_po_number",
            name: "Customer PO",
            field: "cust_po_number",
            filter: !0,
            enableCopy: !0,
            width: 150,
            sortable: !1
        }, {
            id: "purpose_of_delivery_desc",
            name: "Delivery Purpose",
            field: "purpose_of_delivery_desc",
            filter: !0,
            enableCopy: !0,
            width: 150,
            sortable: !1
        }, {
            id: "product_category_desc",
            name: "Product Category",
            field: "product_category_desc",
            filter: !0,
            enableCopy: !0,
            width: 150,
            sortable: !1
        }, {
            id: "request_shipment_date",
            name: "Requested Shipment Date",
            field: "request_shipment_date",
            filter: !0,
            enableCopy: !0,
            width: 150,
            sortable: !1
        }, {
            id: "delivery_address",
            name: "Delivery Address",
            field: "delivery_address",
            filter: !0,
            enableCopy: !0,
            width: 150,
            sortable: !1
        }, {
            id: "receiver_name",
            name: "Receiver",
            field: "receiver_name",
            filter: !0,
            enableCopy: !0,
            width: 150,
            sortable: !1
        }, {
            id: "receiver_tel",
            name: "Receiver Tel.",
            field: "receiver_tel",
            filter: !0,
            enableCopy: !0,
            width: 150,
            sortable: !1
        }, {
            id: "product_manager",
            name: "Product Manager",
            field: "product_manager",
            filter: !0,
            enableCopy: !0,
            width: 150,
            sortable: !1
        }, {
            id: "product_manager_tel",
            name: "Product Manager Tel.",
            field: "product_manager_tel",
            filter: !0,
            enableCopy: !0,
            width: 150,
            sortable: !1
        }, {
            id: "install_environment",
            name: "Installation Environment",
            field: "install_environment",
            filter: !0,
            enableCopy: !0,
            width: 150,
            sortable: !1
        }, {
            id: "professional_tool",
            name: "Special Unloading Req.",
            field: "professional_tool",
            filter: !0,
            enableCopy: !0,
            width: 150,
            sortable: !1
        }, {
            id: "application_date",
            name: "Application Date",
            field: "application_date",
            filter: !0,
            enableCopy: !0,
            width: 150,
            sortable: !1
        }, {
            id: "applicant_name",
            name: "Applicant",
            field: "applicant_name",
            filter: !0,
            enableCopy: !0,
            width: 150,
            sortable: !1
        }, {
            id: "applicant_tel",
            name: "Applicant Tel.",
            field: "applicant_tel",
            filter: !0,
            enableCopy: !0,
            width: 150,
            sortable: !1
        }, {
            id: "approve_date",
            name: "Approved Date",
            field: "approve_date",
            filter: !0,
            enableCopy: !0,
            width: 150,
            sortable: !1
        }, {
            id: "approve_memo",
            name: "Approval Comments",
            field: "approve_memo",
            filter: !0,
            enableCopy: !0,
            width: 150,
            sortable: !1
        }, {
            id: "description",
            name: "Description",
            field: "description",
            filter: !0,
            enableCopy: !0,
            width: 150,
            sortable: !1
        }, {
            id: "reasondesc",
            name: "Reason",
            field: "reasondesc",
            filter: !0,
            enableCopy: !0,
            width: 150,
            sortable: !1
        }, {
            id: "last_updated_person",
            name: "Updated By",
            field: "last_updated_person",
            filter: !0,
            enableCopy: !0,
            width: 150,
            sortable: !1
        }, {
            id: "last_update_date",
            name: "Updated Date",
            field: "last_update_date",
            filter: !0,
            enableCopy: !0,
            width: 150,
            sortable: !1
        }, {
            id: "mrtypedesc",
            name: "MR Type",
            field: "mrtypedesc",
            filter: !0,
            enableCopy: !0,
            width: 150,
            sortable: !1
        }, {
            id: "soNo",
            name: "RMR SO No.",
            field: "soNo",
            filter: !0,
            enableCopy: !0,
            width: 150,
            sortable: !1
        }, {
            id: "Subcontractor",
            name: "subcontractor_name",
            field: "Subcontractor",
            filter: !0,
            enableCopy: !0,
            width: 150,
            sortable: !1
        }, {
            id: "pickupperson",
            name: "Pickup Person",
            field: "pickupperson",
            filter: !0,
            enableCopy: !0,
            width: 150,
            sortable: !1
        }, {
            id: "region_office",
            name: "Regional Subcon WH",
            field: "region_office",
            filter: !0,
            enableCopy: !0,
            width: 150,
            sortable: !1
        }, {
            id: "bg",
            name: "BG",
            field: "bg",
            filter: !0,
            enableCopy: !0,
            width: 100,
            sortable: !1
        }, {
            id: "source_mrno",
            name: "Source MR No.",
            field: "source_mrno",
            filter: !0,
            enableCopy: !0,
            width: 150,
            sortable: !1
        }, {
            id: "project_area_code",
            name: "Mgmt Dimension",
            field: "project_area_code",
            filter: !0,
            enableCopy: !0,
            width: 150,
            sortable: !1
        }, {
            id: "country_region_code",
            name: "Country Region Code",
            field: "country_region_code",
            filter: !0,
            enableCopy: !0,
            width: 150,
            sortable: !1
        }, {
            id: "aassemblydesc",
            name: "Assembly Level",
            field: "aassemblydesc",
            filter: !0,
            enableCopy: !0,
            width: 150,
            sortable: !1
        }, {
            id: "creation_source",
            name: "Create Source",
            field: "creation_source",
            filter: !0,
            enableCopy: !0,
            width: 150,
            sortable: !1
        }]
    };
});

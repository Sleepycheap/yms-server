create or replace PACKAGE xxbbna_warehouse_process_pkg AS
    -- #########################################################################################################
    --  Package Name  : XXBBNA_WAREHOUSE_PROCESS_PKG                                                           #
    --  Created        : 8/31/2026                                                                             #
    --  Author        : Anthony Vauthier                                                                       #
    --  Description   : Package built for re-built Yard Management App to access Oracle Data                   #
    --                                                                                                         #
    --  Modification History :                                                                                 #
    --                                                                                                         #
    ----#-------------------------------------------------------------------------------------------------|    #
    --  |Date     |Who                |Version |Description                                               |    #
    ------------------------------------------------------------------------------------------------------|    #
    --  |8/31/2026| Anthony Vauthier  |1.0     |Created XXBBNA_WAREHOUSR_PROCESS_PKG v1.current           |    #
    --  |         |                   |        |Notes: This file has been created using the package from 
    --                                         |the previous app as a reference.                          |    #
    ----#-------------------------------------------------------------------------------------------------|    #
    -- #########################################################################################################

P_CONC_REQUEST_ID NUMBER;
P_TRUCK_ID  varchar2(200);
P_ORG_CODE  varchar2(50);
FUNCTION get_ip_plant(p_value_set IN VARCHAR2, p_flex_value IN VARCHAR2) RETURN VARCHAR2;
FUNCTION BeforeReport(P_ORG_CODE IN VARCHAR2) RETURN BOOLEAN;
FUNCTION AfterReport RETURN BOOLEAN;

    --
    -- Global record type declaration for table
    --
    TYPE g_scac_record IS RECORD(
        scac_code      VARCHAR2(4),
        carrier_name   VARCHAR2(100)
    );

    TYPE g_org_record IS RECORD(
        org_code   VARCHAR2(4)
    );

    TYPE g_truck_record IS RECORD(
        truck_id   VARCHAR2(30)
    );

    TYPE g_shipping_order_details_rec IS RECORD(
        sequence_no            NUMBER,
        cont_name              VARCHAR2(100),
        linedescription        VARCHAR2(240),
        header_desc            VARCHAR2(100),
        order_number           Number,
        ship_set_name          VARCHAR2(100),
        customer_name          VARCHAR2(100),
        ship_from_org_code     VARCHAR2(10),
        CATEGORY               VARCHAR2(100),
        transaction_type       VARCHAR2(100),
        gross_weight           NUMBER,
        requested_quantity     NUMBER,
        truck                  VARCHAR2(100),
        project_name           VARCHAR2(240),
        cust_po_number         VARCHAR2(50),
        plant_info_sup         VARCHAR2(3),
        quantity_picked        NUMBER,
        backordered_quantity   NUMBER,
        extended_wt_sup        NUMBER,
        part_number_sup        VARCHAR2(40),
        staged_truck_id        VARCHAR2(20)
    );

    TYPE g_shipping_order_details_rec_p IS RECORD(
        sequence_no            NUMBER,
        cont_name              VARCHAR2(100),
        linedescription        VARCHAR2(240),
        header_desc            VARCHAR2(100),
        order_number           NUMBER,
        ship_set_name          VARCHAR2(100),
        customer_name          VARCHAR2(100),
        ship_from_org_code     VARCHAR2(10),
        CATEGORY               VARCHAR2(100),
        transaction_type       VARCHAR2(100),
        gross_weight           NUMBER,
        requested_quantity     NUMBER,
        truck                  VARCHAR2(100),
        project_name           VARCHAR2(240),
        cust_po_number         VARCHAR2(50),
        plant_info_sup         VARCHAR2(3),
        quantity_picked        NUMBER,
        backordered_quantity   NUMBER,
        extended_wt_sup        NUMBER,
        part_number_sup        VARCHAR2(40)
    );

    TYPE g_loaded_truck_details_rec IS RECORD(
        cont_name            VARCHAR2(100),
        linedescription      VARCHAR2(240),
        header_desc          VARCHAR2(100),
        order_number         NUMBER,
        ship_set_name        VARCHAR2(100),
        customer_name        VARCHAR2(100),
        ship_from_org_code   VARCHAR2(10),
        CATEGORY             VARCHAR2(100),
        transaction_type     VARCHAR2(100),
        gross_weight         NUMBER,
        requested_quantity   NUMBER,
        truck                VARCHAR2(100)
    );

    TYPE g_truck_manifest_rec IS RECORD(
        ORGANIZATION     VARCHAR2(3),
        description      VARCHAR2(240),
        container_name   VARCHAR2(100),
        truck            VARCHAR2(100),
        ordered_qty      NUMBER,
        extended_wt      NUMBER,
        order_number     NUMBER
    );

    TYPE g_truck_img_record IS RECORD(
        truck_id      VARCHAR2(30),
        user_id       NUMBER,
        truck_image   BLOB
    );

   /* TYPE g_questions_record IS RECORD(
        category_id     INTERFACE.xxbbna_category_questions.category_id%TYPE,
        category_type   INTERFACE.xxbbna_category_questions.category_type%TYPE,
        question        INTERFACE.xxbbna_category_questions.question%TYPE
    );

    TYPE g_answers_record IS RECORD(
        category_answer_id   INTERFACE.xxbbna_category_answers.category_answer_id%TYPE,
        category_id          INTERFACE.xxbbna_category_answers.category_id%TYPE,
        answers              INTERFACE.xxbbna_category_answers.answers%TYPE
    );*/
     --
      -- Product Type category Question and Answer
      --
   TYPE g_product_type_record IS RECORD(
        product_type_id   NUMBER,
        product_type   VARCHAR2(2000)
    );
    TYPE g_cat_product_type_rel_record IS RECORD(
        category_prd_type_rel_id   NUMBER,
        category                     VARCHAR2(2000),
        product_type_id             NUMBER
    );
    TYPE g_product_type_question_record IS RECORD(
        product_type_ques_id   NUMBER,
        product_type_id  number,
        question       VARCHAR2(2000)
    );
    TYPE g_product_type_answers_record IS RECORD(
        product_type_answer_id   NUMBER,
        product_type_ques_id   NUMBER,
        answers       VARCHAR2(2000)
    );

    TYPE g_load_verification_record IS RECORD(
        product_type_answer_id   NUMBER,
        answer_flag          VARCHAR2(1)
    );
 --
 -- Load Txn Question rec
 --
    TYPE g_ld_txn_question_record IS RECORD(
        product_type_ques_id   NUMBER,
        product_type_id       NUMBER,
        product_type           VARCHAR2(2000),
        question                VARCHAR2(2000),
        additional_comments    VARCHAR2(2000),
        transaction_id         NUMBER
    );
 --
 -- Load Txn Answer rec
 --
    TYPE g_ld_txn_answer_record IS RECORD(
        answer_flag             VARCHAR2(1),
        ANSWERS                 VARCHAR2(2000),
        product_type_ques_id    NUMBER,
        product_type_answer_id  NUMBER,
        transaction_detail_id   NUMBER
    );

  --
  -- For Environment IP Details
  --
    TYPE g_ip_addr_record IS RECORD(
        ip_name   VARCHAR2(100),
        ip_addr   VARCHAR2(15)
    );

  --
  -- For Single Point Org List
  --
    TYPE g_org_list_record IS RECORD(
        org_list  VARCHAR2(100),
        tag_list    VARCHAR2(100)
    );

  --
  -- For YMS App Version Details
  --
    TYPE g_app_version_record IS RECORD(
        app_version  VARCHAR2(100),
        app_mode      VARCHAR2(100)
    );

    -- Global table type declaration for diffenent output
    --
    TYPE scactable IS TABLE OF g_scac_record
        INDEX BY BINARY_INTEGER;

    TYPE orgtable IS TABLE OF g_org_record
        INDEX BY BINARY_INTEGER;

    TYPE trucktable IS TABLE OF g_truck_record
        INDEX BY BINARY_INTEGER;

    TYPE g_shipping_order_details_tbl IS TABLE OF g_shipping_order_details_rec
        INDEX BY BINARY_INTEGER;

    TYPE g_shipping_order_details_tbl_p IS TABLE OF g_shipping_order_details_rec_p
        INDEX BY BINARY_INTEGER;

    TYPE g_loaded_truck_details_tbl IS TABLE OF g_loaded_truck_details_rec
        INDEX BY BINARY_INTEGER;

  TYPE g_truck_manifest_tbl IS TABLE OF g_truck_manifest_rec
        INDEX BY BINARY_INTEGER;

  TYPE truckimgtable IS TABLE OF g_truck_img_record
        INDEX BY BINARY_INTEGER;

    /*TYPE questions_table IS TABLE OF g_questions_record
        INDEX BY BINARY_INTEGER;

    TYPE answers_table IS TABLE OF g_answers_record
        INDEX BY BINARY_INTEGER;*/

TYPE product_type_table IS TABLE OF g_product_type_record
        INDEX BY BINARY_INTEGER;

TYPE category_product_type_table IS TABLE OF g_cat_product_type_rel_record
        INDEX BY BINARY_INTEGER;
TYPE product_type_questions_table IS TABLE OF g_product_type_question_record
        INDEX BY BINARY_INTEGER;

TYPE product_type_answers_table IS TABLE OF g_product_type_answers_record
        INDEX BY BINARY_INTEGER;

    TYPE g_load_verification_tbl IS TABLE OF g_load_verification_record
        INDEX BY BINARY_INTEGER;

TYPE ld_txn_question_table IS TABLE OF g_ld_txn_question_record
        INDEX BY BINARY_INTEGER;

TYPE ld_txn_answer_table IS TABLE OF g_ld_txn_answer_record
        INDEX BY BINARY_INTEGER;

  --
  -- For Single Point Org
  --
    TYPE orglist IS TABLE OF g_org_list_record
        INDEX BY BINARY_INTEGER;

  --
  -- For Environment Details
  --
    TYPE ipaddr IS TABLE OF g_ip_addr_record
        INDEX BY BINARY_INTEGER;

  --
  -- For YMS App Version Details
  --
    TYPE appversion IS TABLE OF g_app_version_record
        INDEX BY BINARY_INTEGER;

----------------------------------------------------------------------------------------------------------------------
--      Name: xxbbna_get_operating_unit_id
--
--    Output parameters:
--        x_org_id        : Returns the org id from the program.
--
--      Functions: This Function returns the org id for the particuler org code
--
----------------------------------------------------------------------------------------------------------------------
    FUNCTION xxbbna_get_operating_unit_id(p_org_code VARCHAR2)
        RETURN NUMBER;
----------------------------------------------------------------------------------------------------------------------
    --      Name: XXBBNA_WAREHOUSE_SCAC_CODE
    --
    --    Output parameters:
    --        x_scactable        : Returns the SCAC code from the program.
    --
    --      Functions: This procedure select all the records in WSH_CARRIERS table
    --
----------------------------------------------------------------------------------------------------------------------
    PROCEDURE xxbbna_warehouse_scac_code(x_org_code IN VARCHAR2, x_scac_cur OUT SYS_REFCURSOR);
    ----------------------------------------------------------------------------------------------------------------------
    --      Name: XXBBNA_WAREHOUSE_ORG_CODE
    --
    --    Output parameters:
    --        x_scactable        : Returns the organization_code code from the program.
    --
    --      Functions: This procedure select all the records in mtl_parameters table
    --
----------------------------------------------------------------------------------------------------------------------
    PROCEDURE xxbbna_warehouse_org_code(x_org_cur OUT SYS_REFCURSOR);
----------------------------------------------------------------------------------------------------------------------
    --      Name: XXBBNA_WAREHOUSE_TRUCK_ID
    --
    --    Output parameters:
    --        x_scactable        : Returns the truck_id code from the program.
    --
    --      Functions: This procedure select all the records in xxwsh_shippable_trucks_v2 view
    --
----------------------------------------------------------------------------------------------------------------------
    PROCEDURE xxbbna_warehouse_truck_id(x_org_code IN VARCHAR2, x_truck_id_cur OUT SYS_REFCURSOR);

----------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------
    --      Name: XXBBNA_WAREHOUSE_VALID_ORDER
    --
    --    Output parameters:
    --        x_is_valid        : Returns the valid/Invalid and Hold/Unhold code from the program.
    --
    --      Functions: This procedure validate whether the order number is there in that ORG
    --
----------------------------------------------------------------------------------------------------------------------
    FUNCTION xxbbna_warehouse_valid_order(p_org_code IN VARCHAR2, p_order_number IN NUMBER)
        RETURN VARCHAR2;
----------------------------------------------------------------------------------------------------------------------
    --      Name: XXBBNA_LOADING_SHIPPING_PROC_M
    --
    --    Output parameters:
    --        p_order_details        : Returns the ORDER details from the program.
    --
    --      Functions: This procedure select all order lines for the particular order
  --    Query extracted from   Package Loading Report
    --
----------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------
    PROCEDURE xxbbna_loading_shipping_proc_m(p_org IN VARCHAR2, p_order_number IN NUMBER, p_truck_name IN VARCHAR2,p_process_type IN VARCHAR2, p_single_point_org IN VARCHAR2, p_promise_date IN VARCHAR2, p_order_details_cur OUT SYS_REFCURSOR);
----------------------------------------------------------------------------------------------------------------------
    --      Name: XXBBNA_UPDATE_TRUCK_ID
    --
    --    Output parameters:
    --        p_status        : Returns the status  from the program.
    --
    --      procedure: This procedure add and remove all truck ids for  particular order
  --    Query extracted from   Package Loading Report
    --
----------------------------------------------------------------------------------------------------------------------
    PROCEDURE xxbbna_update_truck_id(
        p_order_number               NUMBER,
        p_cont_name                  VARCHAR2,
        p_ship_from_org_code         VARCHAR2,
        p_org                        VARCHAR2,
        p_ship_set_name              VARCHAR2,
        p_truck_id                   VARCHAR2,
        p_assigntype                 VARCHAR2,   --A r R
        p_user_id                    NUMBER,
        p_header_truck               VARCHAR2,
        p_truck_flag                 VARCHAR2,   --UPDATES CUSTOM TABLE WITH M-MANUAL,S-SCAN)
        p_status               OUT   VARCHAR2,
        p_truck_weight         OUT   NUMBER,
        p_truck_quantity       OUT   NUMBER);

 ----------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------
    --      Name: XXBBNA_TRUCK_WEIGHT_QTY_PROC
    --
    --      Output parameters:
    --        p_truck_weight        : Returns the LOADED TRUCK weight from the program.
    --        p_truck_quantity        : Returns the LOADED TRUCK quantity  from the program.
    --
    --      Functions: This procedure select total weight and quantity for the particular TRUCK
    --        Query extracted from   Package Loading Report
    --
----------------------------------------------------------------------------------------------------------------------
    PROCEDURE xxbbna_truck_weight_qty_proc(p_org IN VARCHAR2, p_truck IN VARCHAR2, p_truck_weight OUT NUMBER, p_truck_quantity OUT NUMBER, p_stagged_weight OUT NUMBER);

----------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------
    --      Name: xxbbna_get_user_id
    --
    --    Output parameters:
    --        l_user_id        : Returns user id from the program.
    --
    --      Functions: This function retrns the user_id for the particular user_name
    --
----------------------------------------------------------------------------------------------------------------------
    FUNCTION xxbbna_get_user_id(p_user_name IN VARCHAR2, p_user_account IN VARCHAR2)
        RETURN NUMBER;

----------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------
--      Name: xxcustom_order_credit_check
--
--    Output parameters:
--        l_ishold_valid       : Returns the hold item or not from the program.
--
--      Functions: This Function returns the item is hold or Not
--
----------------------------------------------------------------------------------------------------------------------
    FUNCTION xxcustom_order_credit_check(p_order_no IN NUMBER, p_organization_code IN VARCHAR2)
        RETURN VARCHAR2;

----------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------
    --      Name: XXBBNA_TRUCK_MANAIFEST_PROC
    --
    --      Output parameters:
    --        p_truck_details        : Returns the LOADED TRUCK details from the program.
    --
    --      Functions: This procedure select all order lines for the particular TRUCK
    --        Query extracted from   Package Loading Report
    --
----------------------------------------------------------------------------------------------------------------------
    PROCEDURE xxbbna_truck_manifest_proc(p_organization_code IN VARCHAR2, p_truck IN VARCHAR2, p_truck_details_cur OUT SYS_REFCURSOR);

  ----------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------
    --      Name: xxbbna_upload_truck_image
    --
    --       Output parameters:
    --       x_status         : Returns the status  from the program.
    --       Creation Date    :21-MAR-2017
    --      procedure: This procedure upload Truck image into table xxbbna_truck_image
    --
----------------------------------------------------------------------------------------------------------------------
    PROCEDURE xxbbna_upload_truck_image(p_image IN truckimgtable, x_status OUT VARCHAR2);

 ----------------------------------------------------------------------------------------------------------------------
    --      Name: xxbbna_category_questions
    --
    --    Output parameters:
    --        x_question_table        : Returns the SCAC code from the program.
    --
    --      Functions: This procedure select all the records in XXBM_CATEGORY_QUESTIONS table
    --
----------------------------------------------------------------------------------------------------------------------
    --PROCEDURE xxbbna_category_questions(x_question_table OUT questions_table);
PROCEDURE xxbbna_product_type(x_product_type_cur OUT SYS_REFCURSOR);
PROCEDURE xxbbna_cat_product_type_rel(x_category_product_type_cur OUT SYS_REFCURSOR);
PROCEDURE xxbbna_product_type_questions(x_product_type_question_cur OUT SYS_REFCURSOR);
PROCEDURE xxbbna_product_type_answers(x_product_type_answers_cur OUT SYS_REFCURSOR);
PROCEDURE xxbbna_email_loadverifiaction(p_user_id IN NUMBER,p_org_code IN VARCHAR2,p_truck_id IN VARCHAR2,p_direct_load IN VARCHAR2,x_status OUT VARCHAR2,x_ret_msg OUT VARCHAR2);
 ----------------------------------------------------------------------------------------------------------------------
    --      Name: xxbbna_category_answers
    --
    --    Output parameters:
    --        x_answers_table        : Returns the SCAC code from the program.
    --
    --      Functions: This procedure select all the records in XXBBNA_CATEGORY_ANSWERS table
    --
----------------------------------------------------------------------------------------------------------------------
    --PROCEDURE xxbbna_category_answers(x_answers_table OUT answers_table);

----------------------------------------------------------------------------------------------------------------------
    --      Name: xxbbna_load_verification_txn
    -- This is the procedure that sends load to the server -AV
    --
    --       Output parameters:
    --       x_status         : Returns the status  from the program.
    --       x_error_msg      : Returns the error message from the program.
    --      procedure: This procedure upload Load verification from into custom tables
    --
----------------------------------------------------------------------------------------------------------------------
    PROCEDURE xxbbna_load_verification_txn(
        p_document_no           IN       VARCHAR2,
        p_issued                IN       VARCHAR2,
        p_revision              IN       VARCHAR2,
        p_revised               IN       VARCHAR2,
        p_loaders_name          IN       VARCHAR2,
        p_shift                 IN       VARCHAR2,
        p_area                  IN       VARCHAR2,
        p_trailer_weight        IN       NUMBER,
        p_customer_name         IN       VARCHAR2,
        p_order_number          IN       VARCHAR2,
        p_trailer_number        IN       VARCHAR2,
        p_additional_comments   IN       VARCHAR2,
        p_auditor_signature     IN       BLOB,
        p_audit_date            IN       VARCHAR2,
        p_txn_details           IN       g_load_verification_tbl,
        p_user_id               IN       NUMBER,
        p_txn_type              IN       VARCHAR2,
    p_direct_load     IN     VARCHAR2,
        x_status                OUT      VARCHAR2,
        x_error_msg             OUT      VARCHAR2);
   procedure xxbbna_load_form_txn_details(
                                              p_org_code            IN  VARCHAR2,
                                              p_truck_id            IN  VARCHAR2,
                                              p_user_id             IN  NUMBER,
                                              x_data_exists         OUT VARCHAR2,
                                              x_ld_txn_ques         OUT SYS_REFCURSOR,
                                              x_ld_txn_answ         OUT SYS_REFCURSOR,
                                              x_loaders_name        OUT VARCHAR2,
                                              x_status              OUT VARCHAR2,
                                              x_error_msg           OUT VARCHAR2
                                      ) ;

----------------------------------------------------------------------------------------------------------------------------
-- Procedure for getting all the Single Point Orgs from the FND Lookups
----------------------------------------------------------------------------------------------------------------------------
    PROCEDURE xxbbna_single_point_org_list(p_org_code IN VARCHAR, x_org_list_cur OUT SYS_REFCURSOR);

----------------------------------------------------------------------------------------------------------------------------
-- Procedure for getting all the Environments from the FND Lookups
----------------------------------------------------------------------------------------------------------------------------
    PROCEDURE xxbbna_ip_addr_list(x_ip_addr_cur OUT SYS_REFCURSOR);

----------------------------------------------------------------------------------------------------------------------
    --      Name: XXBBNA_UPDATE_STAGGED_FLAG
    --
    --    Output parameters:
    --        p_status        : Returns the status  from the program.
    --
    --      procedure: Procedure to update the stagged flag for the application
    --
----------------------------------------------------------------------------------------------------------------------
    PROCEDURE xxbbna_update_stagged_flag(
        p_order_number                  NUMBER,
        p_cont_name                     VARCHAR2,
        p_ship_from_org_code            VARCHAR2,
        p_org                           VARCHAR2,
        p_ship_set_name                 VARCHAR2,
        p_stagged_flag                  VARCHAR2,
        p_user_id                       NUMBER,
        p_header_truck         IN       VARCHAR2,
        p_load_flag            IN       VARCHAR2,
        p_status               OUT      VARCHAR2,
        p_truck_weight         OUT      NUMBER,
        p_truck_quantity       OUT      NUMBER,
        p_stagged_weight       OUT      NUMBER);

PROCEDURE set_user_session( p_user_id number);

----------------------------------------------------------------------------------------------------------------------------
-- Procedure for Checking the Version of APP derived from FND Lookups (XXBBNA_YMS_APP_VERSION)
----------------------------------------------------------------------------------------------------------------------------
    PROCEDURE xxbbna_yms_app_version_list(x_app_version OUT appversion);

END xxbbna_warehouse_process_pkg;
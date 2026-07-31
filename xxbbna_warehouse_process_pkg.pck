CREATE OR REPLACE PACKAGE xxbbna_warehouse_process_pkg AS
    -- #########################################################################################################
    --  File Name     : XXBBNA_WAREHOUSE_PROCESS_PKG_SPEC.sql                                                     #
    --  Package Name  : XXBBNA_WAREHOUSE_PROCESS_PKG                                                              #
    --  Created        : 4/11/2017 2:18:59 AM                                                                  #
    --  Author        : SATHISH KUMAR K                                                                        #
    --  Description   : Yard Management App(Windows universal app)  related package for oracle apps.           #
    --                                                                                                         #
    --  Modification History :                                                                                 #
    --                                                                                                         #
    ----#-------------------------------------------------------------------------------------------------|    #
    --  |Date     |Who                |Version |Description                                                |    #
    ------------------------------------------------------------------------------------------------------|    #
    --  |09/15/15 |SATHISH KUMAR K    |1.0     |Created XXBBNA_YARDMANAGEMENT_PKG program 1.0 Version     |    #
    --  |02/22/17 |SATHISH KUMAR K    |1.1     |Modified xxbbna_warehouse_scac_code 'Org parameter' added |    #
    --  |03/08/17 |SATHISH KUMAR K    |1.1     |Modified xxbbna_update_truck_id 'load_truck_flag' added   |    #
    --  |03/22/17 |Bytyqi, Mentor     |1.2     |Created XXBBNA_LOADING_SHIPPING_PROC_M procedure           |    #
    --  |03/31/17 |SATHISH KUMAR K    |1.2     |Created rec type for question and answer                  |    #
    --  |03/31/17 |SATHISH KUMAR K    |1.3     |Created xxbbna_category_questions procedure               |    #
    --  |03/31/17 |SATHISH KUMAR K    |1.3     |Created xxbbna_category_answers procedure                 |    #
    --  |04/10/17 |SATHISH KUMAR K    |1.4     |Created rec typr for load verification procedure          |    #
    --  |04/10/17 |SATHISH KUMAR K    |1.4     |Created xxbbna_load_verification_txn procedure            |    #
    --  |         |                   |        |                                                          |    #
    ----#-------------------------------------------------------------------------------------------------|    #
    -- #########################################################################################################

--
-- fOR BURSTING
--
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
        scac_code      wsh_carriers.scac_code%TYPE,
        carrier_name   INTERFACE.xxbm_bill_of_lading.carrier_name%TYPE
    );

    TYPE g_org_record IS RECORD(
        org_code   mtl_parameters.organization_code%TYPE
    );

    TYPE g_truck_record IS RECORD(
        truck_id   xxwsh_shippable_trucks_v2.truck_id%TYPE
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
        truck_id      INTERFACE.xxbbna_truck_image.truck_id%TYPE,
        user_id       INTERFACE.xxbbna_truck_image.created_by%TYPE,
        truck_image   INTERFACE.xxbbna_truck_image.truck_image%TYPE
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
        product_type_id   interface.XXBM_TRKLOADVER_PRD_TYPE.product_type_id%TYPE,
        product_type   interface.XXBM_TRKLOADVER_PRD_TYPE.product_type%TYPE
    );
    TYPE g_cat_product_type_rel_record IS RECORD(
        category_prd_type_rel_id   interface.XXBM_TRKLOADVER_CAT_TYPE.category_prd_type_rel_id%TYPE,
        category                     interface.XXBM_TRKLOADVER_CAT_TYPE.category%TYPE,
        product_type_id             interface.XXBM_TRKLOADVER_CAT_TYPE.product_type_id%TYPE
    );
    TYPE g_product_type_question_record IS RECORD(
        product_type_ques_id   interface.XXBM_TRKLOADVER_PRD_TYPE_QN.product_type_ques_id%type,
        product_type_id   interface.XXBM_TRKLOADVER_PRD_TYPE_QN.product_type_id%type,
        question       interface.XXBM_TRKLOADVER_PRD_TYPE_QN.question%type
    );
    TYPE g_product_type_answers_record IS RECORD(
        product_type_answer_id   interface.XXBM_TRKLOADVER_PRD_TYPE_ANS.product_type_answer_id%type,
        product_type_ques_id   interface.XXBM_TRKLOADVER_PRD_TYPE_ANS.product_type_ques_id%type,
        answers       interface.XXBM_TRKLOADVER_PRD_TYPE_ANS.answers%type
    );

    TYPE g_load_verification_record IS RECORD(
        product_type_answer_id   interface.XXBM_TRKLOADVER_TXN_DET.product_type_answer_id%TYPE,
        answer_flag          INTERFACE.XXBM_TRKLOADVER_TXN_DET.answer_flag%TYPE
    );
 --
 -- Load Txn Question rec
 --
    TYPE g_ld_txn_question_record IS RECORD(
        product_type_ques_id   interface.XXBM_TRKLOADVER_PRD_TYPE_QN.product_type_ques_id%type,
        product_type_id        interface.XXBM_TRKLOADVER_PRD_TYPE_QN.product_type_id%type,
        product_type           interface.XXBM_TRKLOADVER_PRD_TYPE.product_type%type,
        question                interface.XXBM_TRKLOADVER_PRD_TYPE_QN.question%type,
        additional_comments    interface.XXBM_TRKLOADVER_TXN.additional_comments%type,
        transaction_id         interface.XXBM_TRKLOADVER_TXN.transaction_id%type
    );
 --
 -- Load Txn Answer rec
 --
    TYPE g_ld_txn_answer_record IS RECORD(
        answer_flag             interface.XXBM_TRKLOADVER_TXN_DET.answer_flag%type,
        ANSWERS                 interface.XXBM_TRKLOADVER_PRD_TYPE_ANS.answers%type,
        product_type_ques_id    interface.XXBM_TRKLOADVER_PRD_TYPE_QN.product_type_ques_id%type,
        product_type_answer_id  interface.XXBM_TRKLOADVER_TXN_DET.PRODUCT_TYPE_ANSWER_ID%type,
        transaction_detail_id   interface.XXBM_TRKLOADVER_TXN_DET.transaction_detail_id%type
    );

  --
  -- For Environment IP Details
  --
    TYPE g_ip_addr_record IS RECORD(
        ip_name   fnd_lookup_values.meaning%TYPE,
        ip_addr   fnd_lookup_values.description%TYPE
    );

  --
  -- For Single Point Org List
  --
    TYPE g_org_list_record IS RECORD(
        org_list   fnd_lookup_values.meaning%TYPE,
        tag_list    fnd_lookup_values.tag%TYPE
    );

  --
  -- For YMS App Version Details
  --
    TYPE g_app_version_record IS RECORD(
        app_version   fnd_lookup_values.meaning%TYPE,
        app_mode      fnd_lookup_values.description%TYPE
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

 /  TYPE truckimgtable IS TABLE OF g_truck_img_record
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
--These functions populate the tables(?)
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
    PROCEDURE xxbbna_warehouse_scac_code(x_org_code IN mtl_parameters.organization_code%TYPE, x_scac_table OUT scactable);
    ----------------------------------------------------------------------------------------------------------------------
    --      Name: XXBBNA_WAREHOUSE_ORG_CODE
    --
    --    Output parameters:
    --        x_scactable        : Returns the organization_code code from the program.
    --
    --      Functions: This procedure select all the records in mtl_parameters table
    --
----------------------------------------------------------------------------------------------------------------------
    PROCEDURE xxbbna_warehouse_org_code(x_org_table OUT orgtable);
----------------------------------------------------------------------------------------------------------------------
    --      Name: XXBBNA_WAREHOUSE_TRUCK_ID
    --
    --    Output parameters:
    --        x_scactable        : Returns the truck_id code from the program.
    --
    --      Functions: This procedure select all the records in xxwsh_shippable_trucks_v2 view
    --
----------------------------------------------------------------------------------------------------------------------
    PROCEDURE xxbbna_warehouse_truck_id(x_org_code IN xxwsh_shippable_trucks_v2.org_code%TYPE, x_truck_id OUT trucktable);

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
    FUNCTION xxbbna_warehouse_valid_order(p_org_code IN xxwsh_shippable_trucks_v2.org_code%TYPE, p_order_number IN oe_order_headers_all.order_number%TYPE)
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
    PROCEDURE xxbbna_loading_shipping_proc_m(p_org IN VARCHAR2, p_order_number IN NUMBER, p_truck_name IN VARCHAR2,p_process_type IN VARCHAR2, p_single_point_org IN VARCHAR2, p_promise_date IN VARCHAR2, p_order_details OUT g_shipping_order_details_tbl);
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
        p_truck_flag                 VARCHAR2,   --ADDED ON 08-MAR-2017(TO UPDATE CUSTOM TABLE WITH M-MANUAL,S-SCAN)
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
    PROCEDURE xxbbna_truck_manifest_proc(p_organization_code IN VARCHAR2, p_truck IN VARCHAR2, p_truck_details OUT g_truck_manifest_tbl);

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
PROCEDURE xxbbna_product_type(x_product_type_table OUT product_type_table);
PROCEDURE xxbbna_cat_product_type_rel(x_category_product_type_table OUT category_product_type_table);
PROCEDURE xxbbna_product_type_questions(x_product_type_question_table OUT product_type_questions_table);
PROCEDURE xxbbna_product_type_answers(x_product_type_answers_table OUT product_type_answers_table);
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
                                              x_ld_txn_ques         OUT ld_txn_question_table,
                                              x_ld_txn_answ         OUT ld_txn_answer_table,
                                              x_loaders_name        OUT VARCHAR2,
                                              x_status              OUT VARCHAR2,
                                              x_error_msg           OUT VARCHAR2
                                      ) ;

----------------------------------------------------------------------------------------------------------------------------
-- Procedure for getting all the Single Point Orgs from the FND Lookups
----------------------------------------------------------------------------------------------------------------------------
    PROCEDURE xxbbna_single_point_org_list(p_org_code IN VARCHAR, x_org_list OUT orglist);

----------------------------------------------------------------------------------------------------------------------------
-- Procedure for getting all the Environments from the FND Lookups
----------------------------------------------------------------------------------------------------------------------------
    PROCEDURE xxbbna_ip_addr_list(x_ip_addr OUT ipaddr);

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
/
CREATE OR REPLACE PACKAGE BODY "XXBBNA_WAREHOUSE_PROCESS_PKG" AS
  -- #########################################################################################################
  --  File Name     : XXBBNA_WAREHOUSE_PROCESS_PKG_BODY.sql                                                  #
  --  Package Name  : XXBBNA_WAREHOUSE_PROCESS_PKG                                                           #
  --  Created        : 4/11/2017 2:18:59 AM                                                                  #
  --  Author        : SATHISH KUMAR K                                                                        #
  --  Description   : Yard Management App(Windows universal app)  related package for oracle apps.           #
  --                                                                                                         #
  --  Modification History :                                                                                 #
  --                                                                                                         #
  ----#-------------------------------------------------------------------------------------------------|    #
  --  |Date     |Who                |Version |Description                                               |    #
  ------------------------------------------------------------------------------------------------------|    #
  --  |09/15/15 |SATHISH KUMAR K    |1.0     |Created xxbbna_warehouse_process_pkg program 1.0 Version  |    #
  --  |02/22/17 |SATHISH KUMAR K    |1.1     |Modified xxbbna_warehouse_scac_code 'Org parameter' added |    #
  --  |03/08/17 |SATHISH KUMAR K    |1.1     |Modified xxbbna_update_truck_id 'load_truck_flag' added   |    #
  --  |03/22/17 |Bytyqi, Mentor     |1.2     |Created XXBBNA_LOADING_SHIPPING_PROC_M procedure          |    #
  --  |03/31/17 |SATHISH KUMAR K    |1.2     |Created rec type for question and answer                  |    #
  --  |03/31/17 |SATHISH KUMAR K    |1.3     |Created xxbbna_category_questions procedure               |    #
  --  |03/31/17 |SATHISH KUMAR K    |1.3     |Created xxbbna_category_answers procedure                 |    #
  --  |04/10/17 |SATHISH KUMAR K    |1.4     |Created rec typr for load verification procedure          |    #
  --  |04/10/17 |SATHISH KUMAR K    |1.4     |Created xxbbna_load_verification_txn procedure            |    #
  --  |04/19/17 |SATHISH KUMAR K    |1.5     |Modified xxbbna_warehouse_truck_id procedure              |    #
  --                      added ship_set_name in where condition                                             #
  --  |05/05/17 |SATHISH KUMAR K    |1.6     |Modified xxbbna_warehouse_scac_code procedure             |    #
  --  |03/15/18 |KARTHIK JAYARAMAN  |1.7     |Added new cursor to XXBBNA_LOADING_SHIPPING_PROC_M for    |    #
  --  |         |                   |        |Single Point Load functionality                           |    #
  --  |         |                   |        |Added new procedures IP Address and Single Point Org List |    #
  --  |         |                   |        |Modified to add stagged_flag to order list rec            |    #
  --  |         |                   |        |Modified Truck Weight Procedure to add staged weight out  |    #
  --  |         |                   |        |Added new Procedure xxbbna_update_stagged_flag for        |    #
  --  |         |                   |        |updating staged flag                                      |    #
  --  |10/09/19 |KESHIA MATTIUSSI M |        |Added the Purchase Type orders, to procedure              |    #
  --  |         |                   |        |XXBBNA_LOADING_SHIPPING_PROC_M                            |    #
  --  |         |                   |        |                                                          |    #
  --  |         |                   |        |                                                          |    #
  --  |         |                   |        |                                                          |    #
  ----#-------------------------------------------------------------------------------------------------|    #
  -- #########################################################################################################

  ----------------------------------------------------------------------------------------------------------------------
  --      Name: xxbbna_get_operating_unit_id
  --
  --    Output parameters:
  --        x_org_id        : Returns the org id from the program.
  --
  --      Functions: This Function returns the org id for the particuler org code
  --
  ----------------------------------------------------------------------------------------------------------------------

  --changes start - abhallam
  g_pkg VARCHAR2(100) := 'xxbbna_warehouse_process_pkg';

  PROCEDURE LOG(p_prc IN VARCHAR2, p_msg IN VARCHAR2) IS
    pragma autonomous_transaction;
    l_sid VARCHAR2(50);
  BEGIN

    SELECT SYS_CONTEXT('USERENV', 'SID') INTO l_sid FROM dual;

    INSERT INTO bbna_log_table
    VALUES
      (bbna_log_table_s.nextval, g_pkg, p_prc, 'sid=' || l_sid || '. ' || p_msg, SYSDATE);
    COMMIT;
  EXCEPTION
    WHEN others THEN
      NULL;
  END LOG;
  --changes end - abhallam

  FUNCTION xxbbna_get_operating_unit_id(p_org_code VARCHAR2) RETURN NUMBER IS
    x_org_id NUMBER := 0;
  BEGIN
    SELECT operating_unit INTO x_org_id FROM org_organization_definitions WHERE organization_code = p_org_code;

    RETURN x_org_id;
  EXCEPTION
    WHEN others THEN
      dbms_output.put_line('Exception ------ ' || sqlerrm);
      RETURN x_org_id;
  END xxbbna_get_operating_unit_id;

  FUNCTION xxbbna_get_operating_inv_id(p_org_code VARCHAR2) RETURN NUMBER IS
    x_org_inv_id NUMBER := 0;
  BEGIN
    SELECT x.organization_id
    INTO   x_org_inv_id
    FROM   org_organization_definitions x
    WHERE  organization_code = p_org_code;

    RETURN x_org_inv_id;
  EXCEPTION
    WHEN others THEN
      dbms_output.put_line('Exception ------ ' || sqlerrm);
      RETURN x_org_inv_id;
  END xxbbna_get_operating_inv_id;

  FUNCTION get_ip_plant(p_value_set IN VARCHAR2, p_flex_value IN VARCHAR2) RETURN VARCHAR2 IS
    v_description apps.fnd_flex_values_vl.description%TYPE;
  BEGIN
    SELECT ffv.description
    INTO   v_description
    FROM   applsys.fnd_flex_value_sets ffs, apps.fnd_flex_values_vl ffv
    WHERE  ffs.flex_value_set_name = p_value_set
    AND    ffs.flex_value_set_id = ffv.flex_value_set_id
    AND    ffv.flex_value = p_flex_value;

    RETURN v_description;
  EXCEPTION
    WHEN no_data_found THEN
      v_description := 'No data';
      RETURN v_description;
    WHEN others THEN
      dbms_output.put_line('ERROR: ' || sqlerrm);
      RETURN NULL;
  END get_ip_plant;

  FUNCTION beforereport(p_org_code IN VARCHAR2) RETURN BOOLEAN IS
  BEGIN
    p_conc_request_id := apps.fnd_global.conc_request_id;
    mo_global.set_policy_context('S', xxbbna_get_operating_unit_id(p_org_code));
    RETURN TRUE;
  END beforereport;

  FUNCTION afterreport RETURN BOOLEAN IS
    l_req_id NUMBER;
    --xml_layout boolean;
  BEGIN
    l_req_id := fnd_request.submit_request(APPLICATION => 'XDO',
                                           PROGRAM     => 'XDOBURSTREP',
                                           description => NULL,
                                           start_time  => NULL,
                                           sub_request => FALSE,
                                           argument1   => NULL,
                                           argument2   => p_conc_request_id,
                                           argument3   => 'Y');
    RETURN TRUE;
  END afterreport;

  ----------------------------------------------------------------------------------------------------------------------
  --      Name: XXBBNA_WAREHOUSE_SCAC_CODE
  --
  --    Output parameters:
  --        x_scac_table        : Returns the SCAC code from the program.
  --
  --      Functions: This procedure select all the records in WSH_CARRIERS table
  --
  ----------------------------------------------------------------------------------------------------------------------
  PROCEDURE xxbbna_warehouse_scac_code(x_org_code IN mtl_parameters.organization_code%TYPE, x_scac_table OUT scactable) IS
    --
    -- Local variable declaration
    --
    l_scac_code scactable;
    l_err_msg   VARCHAR2(10000);
    l_err_cod   VARCHAR2(50);
    v_counter   NUMBER := 0;
  BEGIN
    ----Organization parameter added by Sathish on 2-22-2017
    --AK 8/7/17 change the scac code order query
    SELECT scac_code, carrier_name
    BULK   COLLECT
    INTO   l_scac_code
    FROM   (SELECT scac_code,
                   carrier_name,
                   CASE
                     WHEN c.scac_code IN
                          ('PSTO', 'SQCH', 'TFEJ', 'MAV1', 'MTLA', 'WSXI', 'WSXI', 'TMCD', 'PRIJ', 'SWIT', 'MTBC') THEN
                      1
                     ELSE
                      2
                   END name_order
            FROM   wsh_carriers_v C
            WHERE  c.active = 'A'
            AND    c.scac_code IS NOT NULL
            --and
            ORDER  BY 3, 2 ASC) x;

    /* IF (x_org_code IS NULL) THEN
        --
        -- Based on the input provide by Adam the below query was added on 05-05-2017
        -- to find the most recently used SCAC code
        --
        SELECT scac_code, carrier_name
        BULK   COLLECT
        INTO   l_scac_code
        FROM   (SELECT DISTINCT c.scac_code,
                                --c.carrier_id,
                                c.carrier_name,
                                (SELECT MAX(nvl(x.last_update_date, to_date('01-JAN-1900')))
                                 FROM   interface.xxbm_bill_of_lading x
                                 WHERE  x.carrier_id = c.carrier_id
                                 AND    last_update_date IS NOT NULL) last_used
                FROM   wsh_carriers_v c
                WHERE  c.active = 'A'
                AND    c.scac_code IS NOT NULL
                ORDER  BY nvl(last_used, to_date('01-JAN-1900')) DESC);


      ELSE
        SELECT scac_code, carrier_name
        BULK   COLLECT
        INTO   l_scac_code
        FROM   (SELECT DISTINCT c.scac_code,
                                --c.carrier_id,
                                c.carrier_name,
                                (SELECT MAX(nvl(x.last_update_date, to_date('01-JAN-1900')))
                                 FROM   interface.xxbm_bill_of_lading x
                                 WHERE  x.carrier_id = c.carrier_id
                                 AND    last_update_date IS NOT NULL) last_used
                FROM   wsh_carriers_v c
                WHERE  c.active = 'A'
                AND    c.scac_code IS NOT NULL
                AND    EXISTS (SELECT carrier_id
                        FROM   interface.xxbm_bill_of_lading x
                        WHERE  x.carrier_id = c.carrier_id
                        AND    upper(x.organization_code) = upper(x_org_code))
                ORDER  BY nvl(last_used, to_date('01-JAN-1900')) DESC);

      END IF;
    */
    x_scac_table := l_scac_code;
  EXCEPTION
    WHEN others THEN
      dbms_output.put_line('Exception ------ ' || sqlerrm);
  END xxbbna_warehouse_scac_code;

  ----------------------------------------------------------------------------------------------------------------------
  --      Name: XXBBNA_WAREHOUSE_ORG_CODE
  --
  --    Output parameters:
  --        x_org_table        : Returns the SCAC code from the program.
  --
  --      Functions: This procedure select all the records in WSH_CARRIERS table
  --
  ----------------------------------------------------------------------------------------------------------------------
  PROCEDURE xxbbna_warehouse_org_code(x_org_table OUT orgtable) IS
    --
    -- Local variable declaration
    --
    l_org_code orgtable;
  BEGIN
    SELECT mp.organization_code
    BULK   COLLECT
    INTO   l_org_code
    FROM   mtl_parameters mp
    --changes start - added on 12-APR-2018 - abhallam
    WHERE  mp.organization_code IN ('ANN', 'EVA', 'STJ', 'VIS', 'JAC', 'MTY', 'RAI');
    --changes end - added on 12-APR-2018 - abhallam
    x_org_table := l_org_code;
  EXCEPTION
    WHEN others THEN
      dbms_output.put_line('Exception ------ ' || sqlerrm);
  END xxbbna_warehouse_org_code;

  ---------------------------------------------------------------------------------------------------------------------
  --      Name: XXBBNA_WAREHOUSE_TRUCK_ID
  --
  --    Output parameters:
  --        x_truck_id        : Returns the truck id from the program.
  --
  --      Functions: This procedure select all the records in xxwsh_shippable_trucks_v2 view
  --
  ----------------------------------------------------------------------------------------------------------------------
  PROCEDURE xxbbna_warehouse_truck_id(x_org_code IN xxwsh_shippable_trucks_v2.org_code%TYPE, x_truck_id OUT trucktable) IS
    --
    -- Local variable declaration
    --
    l_truck_id trucktable;
    l_prc      VARCHAR2(50) := 'xxbbna_warehouse_truck_id';
  BEGIN

    --log ( l_prc,'START  x_org_code=' || x_org_code);
    /*
    SELECT truck_id
    BULK COLLECT INTO l_truck_id
    FROM   (SELECT DISTINCT xc.truck_id_1 truck_id
            FROM            interface.xxwsh_containers xc
            WHERE           xc.truck_id_1 IS NOT NULL
            AND             xc.ship_from_org_code = x_org_code
            AND             NOT EXISTS(SELECT NULL
                                       FROM   interface.xxwsh_truck_shipment xts
                                       WHERE  xts.truck_id = xc.truck_id_1
                                       AND    NVL(xts.ship_confirm, 'N') = 'Y')
            UNION
            SELECT DISTINCT xc.truck_id_2 truck_id
            FROM            interface.xxwsh_containers xc
            WHERE           xc.truck_id_2 IS NOT NULL
            AND             xc.ship_from_org_code = x_org_code
            AND             NOT EXISTS(SELECT NULL
                                       FROM   interface.xxwsh_truck_shipment xts
                                       WHERE  xts.truck_id = xc.truck_id_2
                                       AND    NVL(xts.ship_confirm, 'N') = 'Y')); */
    SELECT truck_id
    BULK   COLLECT
    INTO   l_truck_id
    FROM   (SELECT xts.truck_id
            FROM   xxwsh_truck_shipment xts
            WHERE  xts.ship_date IS NULL
            AND    xts.shipment_type = 'I'
            AND    EXISTS
             (SELECT 1
                    FROM   xxwsh_container_loading xcl,
                           xxwsh_containers        xc,
                           wsh.wsh_delivery_details          wdd
                    WHERE  xcl.ship_from_org_code = x_org_code
                    AND    NVL(xcl.btlr_ship_confirm, 'N') != 'Y'
                    AND    xc.order_no = xcl.order_no
                    AND    xc.ship_from_org_code = xcl.ship_from_org_code
                    AND    xc.cont_name = xcl.cont_name
                    AND    xc.ship_set_name = xcl.ship_set_name
                    AND    ((xcl.truck_id_1 = xts.truck_id AND xc.truck_id_1 = xcl.truck_id_1) OR
                          (xcl.staged_truck_id = xts.truck_id AND xc.staged_truck_id = xcl.staged_truck_id))
                    AND    wdd.delivery_detail_id = xc.delivery_detail_id
                    AND    wdd.released_status = 'Y') -- pick released
            UNION -- direct leg after single point
            SELECT xts.truck_id
            FROM   xxwsh_truck_shipment xts
            WHERE  xts.ship_date IS NULL
            AND    xts.shipment_type = 'S'
            AND    EXISTS (SELECT 1
                    FROM   xxwsh_container_loading xcl
                    WHERE  xcl.ship_set_name LIKE '%' || x_org_code
                          --AND  xcl.ship_set_name IS NOT NULL
                          --AND  xcl.ship_from_org_code = x_org_code
                    AND    xcl.truck_id_2 = xts.truck_id
                    AND    NVL(xcl.btlr_ship_confirm, 'N') != 'Y')
            UNION -- direct, no single point
            SELECT xts.truck_id
            FROM   xxwsh_truck_shipment xts
            WHERE  xts.ship_date IS NULL
            AND    xts.shipment_type = 'S'
            AND    EXISTS (SELECT 1
                    FROM   xxwsh_container_loading xcl,
                           xxwsh_containers        xc,
                           wsh.wsh_delivery_details          wdd
                    WHERE  xcl.ship_from_org_code = x_org_code
                    AND    xcl.truck_id_2 = xts.truck_id
                    AND    xcl.ship_set_name IS NULL
                    AND    NVL(xcl.btlr_ship_confirm, 'N') != 'Y'
                    AND    xc.order_no = xcl.order_no
                    AND    xc.ship_from_org_code = xcl.ship_from_org_code
                    AND    xc.cont_name = xcl.cont_name
                    AND    xc.ship_set_name IS NULL
                    AND    wdd.delivery_detail_id = xc.delivery_detail_id
                    AND    wdd.released_status = 'Y')); --- pick released

    x_truck_id := l_truck_id;
    -- log ( l_prc,'END l_truck_id.count=' || l_truck_id.count);
  EXCEPTION
    WHEN others THEN
      dbms_output.put_line('Exception ------ ' || sqlerrm);
      --log ( l_prc,'Error: ' || sqlerrm);
  END xxbbna_warehouse_truck_id;

  ----------------------------------------------------------------------------------------------------------------------
  --      Name: XXBBNA_WAREHOUSE_VALID_ORDER
  --
  --    Output parameters:
  --        x_is_valid        : Returns the valid/Invalid code from the program.
  --
  --      Functions: This procedure validate whether the order number is there in that ORG
  --
  ----------------------------------------------------------------------------------------------------------------------
  FUNCTION xxbbna_warehouse_valid_order(p_org_code     IN xxwsh_shippable_trucks_v2.org_code%TYPE,
                                        p_order_number IN oe_order_headers_all.order_number%TYPE) RETURN VARCHAR2 IS
    --
    -- Local variable declaration
    --
    l_is_valid      VARCHAR2(1);
    v_ishold_exists VARCHAR2(1) := 'U'; --H=hold exist,U=Hold not exist
  BEGIN
    l_is_valid := 'N';

    SELECT 'Y'
    INTO   l_is_valid
    FROM   (SELECT 'Y'
            FROM   oe_order_headers_all oh, org_organization_definitions ood
            WHERE  1 = 1
            AND    oh.org_id = ood.operating_unit
            AND    oh.order_number = p_order_number
            AND    ood.organization_code = p_org_code
            UNION
            SELECT DISTINCT 'Y'
            FROM   xxwsh_container_loading
            WHERE  order_no = p_order_number
            AND    ship_from_org_code = p_org_code);

    IF l_is_valid = 'Y' THEN
      v_ishold_exists := xxcustom_order_credit_check(p_order_number, p_org_code);

      IF v_ishold_exists = 'Y' THEN
        l_is_valid := 'H';
      ELSE
        l_is_valid := 'U';
      END IF;
    END IF;

    RETURN l_is_valid;
  EXCEPTION
    WHEN others THEN
      dbms_output.put_line('Exception ------ ' || sqlerrm);
      RETURN l_is_valid;
  END xxbbna_warehouse_valid_order;

  ----------------------------------------------------------------------------------------------------------------------
  PROCEDURE xxbbna_loading_shipping_proc_m(p_org          IN VARCHAR2,
                                           p_order_number IN NUMBER,
                                           p_truck_name   VARCHAR2,
                                           p_process_type IN VARCHAR2,
                                           --p_direct_load        IN       VARCHAR2,
                                           p_single_point_org IN VARCHAR2,
                                           p_promise_date     IN VARCHAR2,
                                           p_order_details    OUT g_shipping_order_details_tbl) IS
    l_order_details g_shipping_order_details_tbl;
    lv_org_id       NUMBER := NVL(interface.xxbm_get_master_org_id, xxbbna_get_operating_unit_id(p_org)); --get_org_id(p_org);
    lv_org_inv_id   NUMBER := xxbbna_get_operating_inv_id(p_org);
    v_count         NUMBER;
    v_truck_name    VARCHAR2(100);

    CURSOR cur_orderd_det(p_org IN VARCHAR2, p_single_point_org IN VARCHAR2, c_promise_date IN VARCHAR2) IS
      SELECT ROW_NUMBER() OVER(ORDER BY SUBSTR(cont_name, INSTR(TRANSLATE(UPPER(cont_name), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', '--------------------------'), '-'))) sequence_no,
             shpp.*
      FROM   (SELECT sall.cont_name,
                      xxcustom_get_desc(sall.order_number, sall.cont_name) "LineDescription",
                      DECODE(sall.ship_from, 1, 'DIRECT SHIPMENTS', 2, 'SINGLE POINT', 3, 'SINGLE POINT', 4, 'EXCEPTIONS') header_desc,
                      NVL(sall.order_number, 0) order_number,
                      sall.ship_set_name,
                      sall.customer_name,
                      sall.ship_from_org_code,
                      sall.category,
                      sall.transaction_type,
                      NVL(SUM(sall.gross_weight), 0) gross_weight,
                      NVL(SUM(sall.requested_quantity), 0) requested_quantity,
                      xxcustom_get_truck_id(sall.order_number,
                                            sall.cont_name,
                                            sall.ship_from_org_code,
                                            p_org,
                                            sall.ship_set_name) "truck",
                      NULL "project_name ",
                      NULL "cust_po_number",
                      NULL "plant_info_sup ",
                      NULL "quantity_picked",
                      NULL "backordered_quantity ",
                      NULL "extended_wt_sup",
                      NULL "part_number_sup ",
                      sall.staged_truck_id
               FROM   (SELECT xf.*,
                              DECODE(xf.ship_from_group,
                                     1,
                                     DECODE(xf.created_shipping_instructions, NULL, 1, 3),
                                     2,
                                     DECODE(xf.released_status, 'Y', 2, 'C', DECODE(xf.truck_not_null, 'NULL', 4, 2)),
                                     2) ship_from
                       FROM   (SELECT xx.cont_name,
                                      xx.linedescription,
                                      xx.order_number,
                                      xx.ship_set_name,
                                      xx.customer_name,
                                      xx.ship_from_org_code,
                                      interface.xxbm_shp_pkgload.category_loc(xx.location,
                                                                              xx.ship_from_org_id,
                                                                              xx.cont_name) CATEGORY,
                                      xx.transaction_type,
                                      xx.gross_weight,
                                      xx.requested_quantity,
                                      xx.delivery_detail_id,
                                      DECODE(xx.ip_plant,
                                             NULL,
                                             DECODE(xx.ship_set_name,
                                                    NULL,
                                                    '1',
                                                    DECODE(SUBSTR(xx.ship_set_name, 5, 3), p_org, '1', '2')),
                                             '3') ship_from_group,
                                      DECODE(xx.ship_set_name,
                                             NULL,
                                             DECODE(xx.ip_plant, NULL, NULL, xx.ship_from_org_code || '-' || xx.ip_plant),
                                             xx.ship_set_name) created_shipping_instructions,
                                      xx.truck_not_null,
                                      xx.released_status,
                                      xx.ship_from_org_id,
                                      xx.staged_truck_id
                               FROM   (SELECT xc.cont_name,
                                              NULL linedescription,
                                              xta.order_number,
                                              xc.ship_set_name,
                                              xc.ship_from_org_code,
                                              xc.ship_from_org_id,
                                              xc.location,
                                              xc.cont_gross_wt gross_weight,
                                              xc.cont_qty requested_quantity,
                                              xxbbna_warehouse_process_pkg.get_ip_plant('XXBM_IP_PLANT_XREF',
                                                                                        rc.customer_number) ip_plant,
                                              LTRIM(RTRIM(rc.customer_name)) customer_name,
                                              ott.name transaction_type,
                                              wdd.released_status,
                                              wdd.delivery_detail_id,
                                              MIN(DECODE(xc.truck_id_1, NULL, 'NULL', 'NOT_NULL')) truck_not_null,
                                              xc.staged_truck_id
                                       FROM   xxbm_order_truck_activity xta,
                                              xxwsh_containers          xc,
                                              ont.oe_order_headers_all            oh,
                                              wsh.wsh_delivery_details            wdd,
                                              apps.xxar_customers_v               rc,
                                              ont.oe_transaction_types_tl         ott
                                       WHERE  xta.order_number = oh.order_number
                                       AND    xta.order_number = xc.order_no
                                       AND    oh.header_id = wdd.source_header_id
                                       AND    xc.delivery_detail_id = wdd.delivery_detail_id
                                       AND    wdd.customer_id = rc.customer_id
                                       AND    oh.order_type_id = ott.transaction_type_id
                                       AND    ott.language = 'US'
                                       AND    wdd.pickable_flag = 'Y'
                                       AND    NVL(INSTR(xc.ship_set_name, p_org), 0) +
                                              NVL(INSTR(xc.ship_from_org_code, p_org), 0) > 0
                                       AND    NOT EXISTS (SELECT NULL
                                               FROM   oe_order_lines ol
                                               WHERE  ol.header_id = oh.header_id
                                               AND    ol.line_id = wdd.source_line_id
                                               AND    ol.flow_status_code = 'CANCELLED')
                                       AND    EXISTS
                                        (SELECT NULL
                                               FROM   xxwsh_container_loading xcd
                                               WHERE  xcd.order_no = oh.order_number
                                               AND    xcd.cont_name = xc.cont_name
                                               AND    xta.truck_name IN (xcd.truck_id_1, xcd.truck_id_2, xcd.staged_truck_id)
                                               AND    NVL(p_process_type, 'A') = 'S'
                                               UNION ALL
                                               SELECT NULL
                                               FROM   ont.oe_order_lines_all ol
                                               WHERE  ol.header_id = wdd.source_header_id
                                               AND    ol.line_id = wdd.source_line_id
                                               AND    ol.flow_status_code != 'CLOSED'
                                               AND    ol.flow_status_code != 'CANCELLED'
                                               AND    NVL(xc.truck_id_1, NVL(xc.truck_id_2, xc.staged_truck_id)) IS NULL
                                               AND    NVL(p_process_type, 'A') = 'S'
                                               AND    ol.shipping_instructions = p_single_point_org
                                               AND    TRUNC(ol.promise_date) = TRUNC(TO_DATE(c_promise_date, 'MM/DD/YYYY'))
                                               UNION ALL
                                               SELECT NULL
                                               FROM   dual
                                               WHERE  NVL(p_process_type, 'A') != 'S'
                                               UNION ALL
                                               SELECT NULL
                                               FROM   wsh.wsh_delivery_details wdd1
                                               WHERE  wdd1.org_id = oh.org_id
                                               AND    wdd1.source_header_id = oh.header_id
                                               AND    wdd1.customer_id = oh.sold_to_org_id
                                               AND    wdd1.pickable_flag = 'Y'
                                               AND    wdd1.released_status = 'Y'
                                               AND    NVL(wdd1.picked_quantity, 0) > 0

                                               )
                                       GROUP  BY wdd.delivery_detail_id,
                                                 xc.cont_name,
                                                 xta.order_number,
                                                 xc.ship_set_name,
                                                 xc.ship_from_org_code,
                                                 xc.ship_from_org_id,
                                                 xc.location,
                                                 xc.cont_gross_wt,
                                                 xc.cont_qty,
                                                 LTRIM(RTRIM(rc.customer_name)),
                                                 rc.customer_number,
                                                 ott.name,
                                                 wdd.released_status,
                                                 xc.staged_truck_id) xx) xf) sall
               GROUP  BY sall.created_shipping_instructions,
                         sall.cont_name,
                         sall.ship_from,
                         sall.ship_from_group,
                         sall.order_number,
                         sall.ship_set_name,
                         sall.customer_name,
                         sall.ship_from_org_code,
                         sall.ship_from_org_id,
                         sall.category,
                         sall.transaction_type,
                         sall.staged_truck_id
               UNION ALL
               SELECT NULL "cont_name",
                      part_number "LineDescription",
                      'UNPICKED ITEMS' "header_desc",
                      NVL(order_number, 0) ord_num,
                      NULL "ship_set_name",
                      customer_name customer,
                      NULL "ship_from_org_code",
                      CATEGORY loc_category,
                      trx_type,
                      NVL(SUM(gross_weight), 0) prt_gross_weight,
                      NVL(SUM(gross_qty), 0) prt_gross_qty,
                      truck null_truck,
                      NULL "project_name ",
                      NULL "cust_po_number",
                      NULL "plant_info_sup ",
                      NULL "quantity_picked",
                      NULL "backordered_quantity ",
                      NULL "extended_wt_sup",
                      NULL "part_number_sup ",
                      NULL staged_truck_id
               FROM   (SELECT oh.order_number,
                              rc.customer_name,
                              ott.name trx_type,
                              interface.xxbm_shp_pkgload.category_loc(msib.attribute2, ol.ship_from_org_id) CATEGORY,
                              NULL CONTAINER,
                              msib.segment1 part_number,
                              (msib.unit_weight * ol.ordered_quantity) gross_weight,
                              (ol.ordered_quantity) gross_qty,
                              ol.shipping_instructions,
                              NULL truck
                       FROM   oe_order_headers                    oh,
                              oe_order_lines                      ol,
                              apps.oe_transaction_types_vl        ott,
                              inv.mtl_system_items_b              msib,
                              apps.xxar_customers_v               rc,
                              xxbm_order_truck_activity xta
                       WHERE  xta.order_number = oh.order_number
                       AND    oh.header_id = ol.header_id
                       AND    oh.order_type_id = ott.transaction_type_id
                       AND    oh.sold_to_org_id = rc.customer_id
                       AND    ol.shippable_flag = 'Y'
                       AND    ol.source_type_code = 'INTERNAL'
                       AND    ol.flow_status_code NOT IN ('CLOSED', 'CANCELLED')
                       AND    msib.inventory_item_id = ol.inventory_item_id
                       AND    msib.organization_id = ol.ship_from_org_id
                       AND    msib.item_type NOT IN ('PR', 'CR')
                       AND    (ol.ship_from_org_id = lv_org_inv_id OR INSTR(ol.shipping_instructions, p_org) > 0)
                             --AND    oh.order_number = p_order_number --1501720502-- 1501720501
                       AND    (EXISTS (SELECT NULL
                                       FROM   apps.wsh_delivery_details wdd
                                       WHERE  wdd.source_header_id = oh.header_id
                                       AND    wdd.source_line_id = ol.line_id
                                       AND    wdd.pickable_flag = 'Y'
                                       AND    wdd.released_status IN ('B', 'R', 'S')
                                       AND    NVL(wdd.picked_quantity, 0) = 0) OR NOT EXISTS
                              (SELECT *
                                FROM   xxwsh_containers xcd, apps.wsh_delivery_details wdd
                                WHERE  xcd.order_no = oh.order_number
                                AND    xcd.delivery_detail_id = wdd.delivery_detail_id
                                AND    wdd.pickable_flag = 'Y'
                                AND    wdd.source_line_id = ol.line_id))
                       --AND    nvl(p_process_type, 'A') != 'S'
                       )
               GROUP  BY order_number,
                         customer_name,
                         trx_type,
                         CATEGORY,
                         CONTAINER,
                         shipping_instructions,
                         part_number,
                         truck
               UNION ALL
               SELECT NULL "cont_name",
                      msi.description description_sup,
                      'BUYOUT' "header_desc",
                      oh.order_number sales_order,
                      NULL "ship_set_name",
                      rc.customer_name,
                      mp.organization_code plant_code_sup,
                      NULL "category",
                      NULL "transaction_type",
                      NVL(ROUND(ol.ordered_quantity * msi.unit_weight, 3), 0) "gross_weight",
                      NVL(ol.ordered_quantity, 0) quantity_ordered_sup,
                      NULL "truck",
                      oh.attribute1 project_name,
                      oh.cust_po_number,
                      mp.organization_code plant_info_sup,
                      NVL(DECODE(ol.flow_status_code, 'SHIPPED', ol.ordered_quantity, 'CLOSED', ol.ordered_quantity, 0),
                          0) quantity_picked,
                      NVL(DECODE(ol.flow_status_code, 'SHIPPED', 0, 'CLOSED', 0, ol.ordered_quantity), 0) backordered_quantity,
                      NVL(ROUND(ol.ordered_quantity * msi.unit_weight, 3), 0) extended_wt_sup,
                      msi.segment1 part_number_sup,
                      NULL staged_truck_id
               FROM   inv.mtl_system_items_b              msi,
                      inv.mtl_parameters                  mp,
                      apps.oe_order_headers               oh,
                      apps.oe_order_lines                 ol,
                      apps.xxar_customers_v               rc,
                      xxbm_order_truck_activity xta
               WHERE  xta.order_number = oh.order_number
               AND    ol.header_id = oh.header_id
               AND    ol.ship_from_org_id = msi.organization_id
               AND    ol.inventory_item_id = msi.inventory_item_id
               AND    ol.ship_from_org_id = mp.organization_id
               AND    msi.item_type NOT IN ('PR', 'FRT', 'CR') -- don't include pricing items, freight, or crating charges
              AND    ol.flow_status_code <> 'CANCELLED'
              AND    ol.source_type_code = 'EXTERNAL'
              AND    rc.customer_id = oh.sold_to_org_id
              AND    NVL(p_process_type, 'A') != 'S'
              AND    ol.ship_from_org_id IN
                     (SELECT organization_id FROM inv.mtl_parameters WHERE calendar_code <> 'BUTLER MFG')
                    --AND    oh.order_number = p_order_number --1501720502
              AND    (mp.organization_code = p_org OR ol.shipping_instructions LIKE '%' || p_org)) shpp
      WHERE  1 = 1
      ORDER  BY SUBSTR(cont_name,
                       INSTR(TRANSLATE(UPPER(cont_name), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', '--------------------------'),
                             '-')),
                TO_NUMBER(TRIM(DECODE(TRANSLATE(UPPER(cont_name),
                                                'ABCDEFGHIJKLMNOPQRSTUVWXYZ0132456789 ',
                                                '^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^'),
                                      RPAD('^', LENGTH(cont_name), '^'),
                                      SUBSTR(cont_name,
                                             1,
                                             INSTR(TRANSLATE(UPPER(cont_name),
                                                             'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
                                                             '--------------------------'),
                                                   '-') - 1),
                                      0)));

    --changes start - abhallam
    w_org              NUMBER := LENGTH(p_org);
    w_order_number     NUMBER := LENGTH(p_order_number);
    w_truck_name       NUMBER := LENGTH(p_truck_name);
    w_process_type     NUMBER := LENGTH(p_process_type);
    w_single_point_org NUMBER := LENGTH(p_single_point_org);
    w_promise_date     NUMBER := LENGTH(p_promise_date);
    l_p_date           DATE;
    l_prc              VARCHAR2(100) := 'xxbbna_loading_shipping_proc_m';
    l_user_id          fnd_user.user_id%TYPE;
    l_resp_id          fnd_responsibility_tl.responsibility_id%TYPE;
    l_resp_appl_id     fnd_responsibility_tl.application_id%TYPE;
    --changes end - abhallam

    l_promise_date VARCHAR2(20) := REPLACE(p_promise_date, CHR(63));

  BEGIN
    v_truck_name := p_truck_name;

    --changes start - abhallam
    --log ( l_prc,'START. lv_org_id='||lv_org_id);
    /*
    IF fnd_global.user_id < 0 THEN
        mo_global.set_policy_context('S', xxbbna_get_operating_unit_id(p_org));
    END IF;
    */

    /* log( l_prc,'0  p_org=' || p_org || ', p_order_number=' || p_order_number || ', p_truck_name=' || p_truck_name
         || ', p_process_type=' || p_process_type || ', p_single_point_org=' || p_single_point_org
         || ', p_promise_date=' || p_promise_date
        );

    log( l_prc,'1  w_org='         || w_org
        || ', w_order_number='     || w_order_number
        || ', w_truck_name='       || w_truck_name
        || ', w_process_type='     || w_process_type
        || ', w_single_point_org=' || w_single_point_org
        || ', w_promise_date='     || w_promise_date);*/

    w_promise_date := LENGTH(l_promise_date);
    --log( l_prc,'1-1  w_promise_date_trim=' || w_promise_date);

    BEGIN
      SELECT user_id INTO l_user_id FROM fnd_user WHERE user_name = 'SYSADMIN';
    EXCEPTION
      WHEN others THEN
        l_user_id := 0; --SYSADMIN
    END;
    --log( l_prc,'1-2 l_user_id=' || l_user_id);

    BEGIN
      SELECT responsibility_id, application_id
      INTO   l_resp_id, l_resp_appl_id
      FROM   fnd_responsibility_tl
      WHERE  responsibility_name = 'BSNA Shipping' --'BSCN Order Management Super User - SJG' --'BSNA Shipping'
      AND    language = 'US';
    EXCEPTION
      WHEN others THEN
        l_resp_id      := 50438; --'BSNA Shipping'
        l_resp_appl_id := 665;
    END;
    --log( l_prc,'1-3 l_resp_id=' || l_resp_id || ', l_resp_appl_id=' || l_resp_appl_id);

    BEGIN
      --          fnd_global.APPS_INITIALIZE(user_id      => l_user_id,
      --                                     resp_id      => l_resp_id,
      --                                     resp_appl_id => l_resp_appl_id);
      mo_global.set_policy_context('S', lv_org_id);
    END;

    /*
    begin
    fnd_global.APPS_INITIALIZE(user_id=>61269, --l_user_id,
                               resp_id=>52544, --l_resp_id,
                               resp_appl_id=>660); --l_resp_appl_id);
    mo_global.set_policy_context('S',41);
    end;
              */

    --log( l_prc,'1-4 after apps_initialize');

    --changes end - abhallam

    --
    -- Based on p_process_type = Truck pull the data  --Truck data should be there for process_type = T or O or S
    --
    BEGIN
      INSERT INTO xxbm_order_truck_activity
        (order_number, last_activity, truck_name)
        SELECT a.*
        FROM   (SELECT xcl.order_no order_number,
                       MAX(NVL(xcl.last_update_date, xcl.creation_date)) last_activity,
                       v_truck_name truck_name
                FROM   xxwsh_container_loading xcl
                WHERE  v_truck_name IS NOT NULL
                AND    v_truck_name IN (xcl.truck_id_1, xcl.truck_id_2, xcl.staged_truck_id)
                GROUP  BY xcl.order_no
                ORDER  BY last_activity DESC) a
        WHERE  1 = 1;
    END;

    --
    -- Based on p_process_type = Order pull the data
    --
    IF (p_process_type = 'O') THEN
      BEGIN

        SELECT COUNT(1) INTO v_count FROM xxbm_order_truck_activity WHERE order_number = p_order_number;

        IF v_count = 0 THEN
          INSERT INTO xxbm_order_truck_activity
            (order_number, last_activity, truck_name)
            (SELECT p_order_number order_number, SYSDATE last_activity, v_truck_name
             FROM   dual
             WHERE  p_order_number IS NOT NULL);
        END IF;
      END;

      --
      -- Based on p_process_type = Single-point org pull the data
      --
    ELSIF (p_process_type = 'S') THEN

      --log( l_prc,'2 - in p_direct_load = N');

      BEGIN
        INSERT INTO xxbm_order_truck_activity
          (order_number, last_activity, truck_name)
          SELECT oh.order_number, NULL, NULL
          FROM   ont.oe_order_headers_all oh
          WHERE  oh.open_flag = 'Y'
          AND    oh.org_id = lv_org_id
          AND    oh.flow_status_code = 'BOOKED'
          AND    NOT EXISTS
           (SELECT NULL FROM xxbm_order_truck_activity xo WHERE xo.order_number = oh.order_number)
          AND    EXISTS
           (SELECT NULL
                  FROM   wsh.wsh_delivery_details wdd
                  WHERE  wdd.org_id = oh.org_id
                  AND    wdd.source_header_id = oh.header_id
                  AND    wdd.customer_id = oh.sold_to_org_id
                  AND    wdd.pickable_flag = 'Y'
                        --AND    wdd.released_status in ('B','R','S')
                  AND    wdd.released_status = 'Y'
                        -- AND    nvl(wdd.picked_quantity, 0) = 0
                  AND    NVL(wdd.picked_quantity, 0) > 0
                  AND    EXISTS (SELECT NULL
                          FROM   ont.oe_order_lines_all ol
                          WHERE  ol.header_id = wdd.source_header_id
                          AND    ol.line_id = wdd.source_line_id
                          AND    ol.org_id = oh.org_id
                          AND    TRUNC(ol.promise_date) = TRUNC(TO_DATE(l_promise_date, 'MM/DD/YYYY'))
                          AND    ol.flow_status_code != 'CLOSED'
                          AND    ol.flow_status_code != 'CANCELLED'
                          AND    ol.shipping_instructions = p_single_point_org))
          UNION
          SELECT DISTINCT oh.order_number, NULL, NULL
          FROM   ont.oe_order_headers_all        oh,
                 apps.po_requisition_headers_all prh,
                 apps.po_requisition_lines_all   prl,
                 apps.oe_po_requisition_lines_v  v,
                 apps.oe_order_lines_all         ol
          WHERE  1 = 1
          AND    oh.flow_status_code = 'BOOKED'
          AND    oh.header_id = ol.header_id
          AND    ol.flow_status_code != 'CLOSED'
          AND    ol.flow_status_code != 'CANCELLED'
          AND    ol.org_id = oh.org_id
          AND    TRUNC(ol.promise_date) = TRUNC(TO_DATE(l_promise_date, 'MM/DD/YYYY'))
          AND    prh.requisition_header_id = prl.requisition_header_id
          AND    prh.requisition_header_id = oh.source_document_id
          AND    prh.type_lookup_code IN ( 'INTERNAL', 'PURCHASE' ) --KMM 10/09/19
          AND    prl.requisition_line_id = v.requisition_line_id
          AND    v.from_loc = SUBSTR(p_single_point_org, 1, 3)
          AND    v.to_loc = SUBSTR(p_single_point_org, 5, 3)
          AND    oh.open_flag = 'Y'
          AND    oh.org_id = lv_org_id
          AND    oh.flow_status_code = 'BOOKED'
          AND    NOT EXISTS
           (SELECT NULL FROM xxbm_order_truck_activity xo WHERE xo.order_number = oh.order_number)
          AND    EXISTS (SELECT NULL
                  FROM   wsh.wsh_delivery_details wdd
                  WHERE  wdd.org_id = oh.org_id
                  AND    wdd.source_header_id = oh.header_id
                  AND    wdd.customer_id = oh.sold_to_org_id
                  AND    wdd.pickable_flag = 'Y'
                  AND    wdd.released_status = 'Y'
                  AND    NVL(wdd.picked_quantity, 0) > 0);

        --log( l_prc,'3 - after insert. released_status = B,R,S rowcount = ' || sql%rowcount);
      END;

    END IF;

    --
    -- Load the data into out variable via cursor cur_orderd_det
    --
    OPEN cur_orderd_det(p_org, p_single_point_org, l_promise_date);

    FETCH cur_orderd_det BULK COLLECT
      INTO l_order_details;

    CLOSE cur_orderd_det;

    --log(l_prc,'END - l_order_details.count = ' || l_order_details.count);

    p_order_details := l_order_details;
  EXCEPTION
    WHEN others THEN
      dbms_output.put_line(sqlerrm);
      --log(l_prc,'END Error' || sqlerrm);
  END xxbbna_loading_shipping_proc_m;

  ----------------------------------------------------------------------------------------------------------------------
  --      Name: XXBBNA_UPDATE_TRUCK_ID
  --
  --    Output parameters:
  --        p_status        : Returns the status  from the program.
  --
  --      procedure: This procedure add or remove all truck ids for  particular order
  --    Query extracted from   Package Loading Report
  --
  ----------------------------------------------------------------------------------------------------------------------
  PROCEDURE xxbbna_update_truck_id(p_order_number       NUMBER,
                                   p_cont_name          VARCHAR2,
                                   p_ship_from_org_code VARCHAR2,
                                   p_org                VARCHAR2,
                                   p_shlip_set_name      VARCHAR2,
                                   p_truck_id           VARCHAR2,
                                   p_assigntype         VARCHAR2, --A r R
                                   p_user_id            NUMBER,
                                   p_header_truck       VARCHAR2,
                                   p_truck_flag         VARCHAR2, --ADDED ON 08-MAR-2017(TO UPDATE CUSTOM TABLE WITH M-MANUAL,S-SCAN)
                                   p_status             OUT VARCHAR2,
                                   p_truck_weight       OUT NUMBER,
                                   p_truck_quantity     OUT NUMBER) IS
    p_truck_id1                 VARCHAR2(40);
    p_truck_id2                 VARCHAR2(40);
    l_resp_id                   NUMBER;
    resp_appl_id                NUMBER;
    lv_truck_weight             NUMBER := 0;
    lv_truck_quantity           NUMBER := 0;
    p_org_id                    NUMBER := 0;
    p_is_single_point           BOOLEAN := TRUE;
    p_sgpt_allowed              BOOLEAN := TRUE;
    l_single_point_truck_exists VARCHAR2(1) := 'N';
    --P Means Already updated through oracle form/other user
    lv_status               VARCHAR2(1) := 'S';
    l_cont_wt               NUMBER;
    l_truck_shipment_exists VARCHAR2(1);
    l_truck_shipment_wt     NUMBER;
    l_shipment_type         VARCHAR2(1);
    l_truck_id              VARCHAR2(30) := p_truck_id;

    q_order_number       NUMBER := LENGTH(p_order_number);
    q_cont_name          NUMBER := LENGTH(p_cont_name);
    q_ship_from_org_code NUMBER := LENGTH(p_ship_from_org_code);
    q_org                NUMBER := LENGTH(p_org);
    q_ship_set_name      NUMBER := LENGTH(p_ship_set_name);
    q_truck_id           NUMBER := LENGTH(p_truck_id);
    q_assigntype         NUMBER := LENGTH(p_assigntype);
    q_user_id            NUMBER := LENGTH(p_user_id);
    q_header_truck       NUMBER := LENGTH(p_header_truck);
    q_truck_flag         NUMBER := LENGTH(p_truck_flag);
    l_prc                VARCHAR2(100) := 'xxbbna_update_truck_id';
    pragma autonomous_transaction;
  BEGIN

    --changes start by abhallam on 12-apr-2018
    --log(l_prc,'START');

    /*log(l_prc,'1 parameter values. '
    || ',p_order_number=' ||p_order_number
    || ',p_cont_name=' ||p_cont_name
    || ',p_ship_from_org_code=' ||p_ship_from_org_code
    || ',p_org=' ||p_org
    || ',p_ship_set_name=' ||p_ship_set_name
    || ',p_truck_id=' ||p_truck_id
    || ',p_assigntype=' ||p_assigntype
    || ',p_user_id=' ||p_user_id
    || ',p_header_truck=' ||p_header_truck
    || ',p_truck_flag =' ||p_truck_flag );

    log(l_prc,'2 length of parameter data. '
    || ',p_order_number=' ||q_order_number
    || ',p_cont_name=' ||q_cont_name
    || ',p_ship_from_org_code=' ||q_ship_from_org_code
    || ',p_org=' ||q_org
    || ',p_ship_set_name=' ||q_ship_set_name
    || ',p_truck_id=' ||q_truck_id
    || ',p_assigntype=' ||q_assigntype
    || ',p_user_id=' ||q_user_id
    || ',p_header_truck=' ||q_header_truck
    || ',p_truck_flag =' ||q_truck_flag );*/

    --changes end by abhallam on 12-apr-2018

    xxbm_wsh_packing_frm.container_validation(p_order_number); -- Fix/add any missing container loading records

    --log(l_prc,'3 after xxbm_wsh_packing_frm.container_validation. l_truck_id='||l_truck_id);
    IF (l_truck_id IS NULL) THEN
      BEGIN
        SELECT truck
        INTO   l_truck_id
        FROM   (SELECT DISTINCT xcl.truck_id_1 truck
                FROM   xxwsh_container_loading xcl
                WHERE  xcl.order_no = p_order_number
                AND    xcl.cont_name = p_cont_name
                AND    xcl.ship_from_org_code = p_org
                AND    xcl.ship_set_name = p_ship_set_name
                UNION
                SELECT DISTINCT xcl.truck_id_2 -- direct no single point
                FROM   xxwsh_container_loading xcl
                WHERE  xcl.order_no = p_order_number
                AND    xcl.cont_name = p_cont_name
                AND    xcl.ship_from_org_code = p_org
                AND    xcl.ship_set_name IS NULL
                UNION
                SELECT DISTINCT xcl.truck_id_2 -- direct no single point
                FROM   xxwsh_container_loading xcl
                WHERE  xcl.order_no = p_order_number
                AND    xcl.cont_name = p_cont_name
                AND    xcl.ship_from_org_code != p_org
                AND    xcl.ship_set_name = p_ship_set_name
                AND    xcl.ship_set_name LIKE '%' || p_org);
        --log(l_prc,'4 l_truck_id = ' || l_truck_id);
      EXCEPTION
        WHEN others THEN
          l_truck_id := NULL;
          --log(l_prc,'5 Error while deriving truck_id. ' || sqlerrm);
      END;
    END IF;

    SELECT fresp.responsibility_id, fresp.application_id
    INTO   l_resp_id, resp_appl_id
    FROM   fnd_user fnd, fnd_responsibility_tl fresp
    WHERE  fnd.user_id = p_user_id
    AND    fresp.responsibility_name = 'BSNA Shipping'
    AND    fresp.language = 'US';

    --log(l_prc,'6 p_user_id=' || p_user_id || ',l_resp_id='||l_resp_id || ',resp_appl_id='||resp_appl_id);

    BEGIN
      fnd_global.apps_initialize(user_id => p_user_id, resp_id => l_resp_id, resp_appl_id => resp_appl_id);
      COMMIT;
    EXCEPTION
      WHEN others THEN
        lv_status := 'F';
        --log(l_prc,'7 error while apps initialize. ' || sqlerrm);
    END;

    -- ====================================
    -- Get container weight
    -- ====================================
    SELECT NVL(SUM(cont_gross_wt), 0)
    INTO   l_cont_wt
    FROM   xxwsh_containers xc
    WHERE  xc.order_no = p_order_number
    AND    xc.cont_name = p_cont_name
    AND    (xc.ship_from_org_code = p_org OR xc.ship_set_name LIKE '%' || p_org)
    AND    NVL(xc.ship_set_name, 'NULL') = NVL(p_ship_set_name, NVL(xc.ship_set_name, 'NULL'));

    --log(l_prc,'8');

    SELECT MAX(truck_id_1), MAX(truck_id_2)
    INTO   p_truck_id1, p_truck_id2
    FROM   xxwsh_container_loading CL
    WHERE  order_no = p_order_number
    AND    cont_name = p_cont_name
    AND    (ship_from_org_code = p_org OR ship_set_name LIKE '%' || p_org);

    --log(l_prc,'9 p_truck_id1 = ' || p_truck_id1 || ',p_truck_id2=' || p_truck_id2);

    IF p_assigntype = 'A' THEN
      -- A assign
      -- check the single point logic
      --log(l_prc,'10');
      IF p_org = SUBSTR(p_ship_set_name, 5, 3) THEN
        BEGIN
          --log(l_prc,'11');
          SELECT 'Y'
          INTO   l_single_point_truck_exists
          FROM   xxwsh_container_loading CL
          WHERE  order_no = p_order_number
          AND    cont_name = p_cont_name
          AND    sgpt_ship_confirm IS NOT NULL
          AND    truck_id_1 IS NOT NULL;

          --log(l_prc,'12 l_single_point_truck_exists=' || l_single_point_truck_exists);

          --AND    ship_from_org_code = p_org;
          COMMIT;

          --dbms_output.put_line('--- l_single_point_truck_exists Y');
          IF l_single_point_truck_exists = 'Y' THEN
            p_is_single_point := TRUE;
          END IF;
        EXCEPTION
          WHEN no_data_found THEN
            p_is_single_point := FALSE;
            lv_status         := 'I'; -- single point transaction not allowed
          --log(l_prc,'13');
          -- dbms_output.put_line('--- single point transaction not allowed - no data');
          WHEN others THEN
            p_is_single_point := FALSE;
            lv_status         := 'I'; -- single point transaction not allowed
          --log(l_prc,'14 Error: ' || sqlerrm);
          -- dbms_output.put_line('--- single point transaction not allowed - other exp');
        END;
      END IF;

      --log(l_prc,'15');

      IF p_is_single_point THEN
        --dbms_output.put_line('--- Inside p_is_single_point');
        --log(l_prc,'16');
        IF (p_truck_id2 IS NULL AND p_org = p_ship_from_org_code AND p_ship_set_name IS NULL) OR
           (p_truck_id2 IS NULL AND p_ship_set_name IS NOT NULL AND p_org = SUBSTR(p_ship_set_name, 5, 3)) THEN
          BEGIN
            -- update direct trucks
            --log(l_prc,'17');
            dbms_output.put_line('Inside if after p_is_single_point');

            UPDATE xxwsh_container_loading xcl
            SET    truck_id_2     = p_truck_id,
                   ship_confirm_2 = 'Y',
                   --stagged_flag = 'N', --commented by abhallam on 25-apr-2018
                   staged_truck_id  = NULL, --added by abhallam on 25-apr-2018
                   last_updated_by  = p_user_id,
                   last_update_date = SYSDATE,
                   --load_truck_flag = p_truck_flag,   --ADDED ON 08-MAR-2017
                   load_truck_flag_direct_load = p_truck_flag,
                   xcl.cont_gross_wt           = l_cont_wt
            WHERE  xcl.order_no = p_order_number
            AND    xcl.cont_name = p_cont_name
            AND    ((p_ship_set_name IS NULL AND xcl.ship_from_org_code = p_org -- no single point
                  ) OR (xcl.ship_set_name LIKE '%' || p_org)); -- direct on single point

            --log(l_prc,'18');

            UPDATE xxwsh_containers xc
            SET    truck_id_2 = p_truck_id,
                   --stagged_flag = 'N', --commented by abhallam on 25-apr-2018
                   staged_truck_id = NULL, --added by abhallam on 25-apr-2018
                   last_updated_by = p_user_id,
                   --load_truck_flag = p_truck_flag,   --ADDED ON 08-MAR-2017
                   load_truck_flag_direct_load = p_truck_flag,
                   last_update_date            = SYSDATE
            WHERE  xc.order_no = p_order_number
            AND    xc.cont_name = p_cont_name
            AND    ((p_ship_set_name IS NULL AND xc.ship_from_org_code = p_org -- no single point
                  ) OR (xc.ship_set_name LIKE '%' || p_org)); -- direct on single point

            --log(l_prc,'19');

            COMMIT;
            lv_status := 'S';
          EXCEPTION
            WHEN others THEN
              lv_status := 'F';
              --log(l_prc,'20 Error: ' || sqlerrm);
          END;
        ELSIF p_truck_id1 IS NULL AND p_org = p_ship_from_org_code AND p_ship_set_name IS NOT NULL THEN
          BEGIN
            --log(l_prc,'21');
            --dbms_output.put_line('Inside if ELSE IF --- ');
            UPDATE xxwsh_container_loading xcl
            SET    truck_id_1     = p_truck_id,
                   ship_confirm_1 = 'Y',
                   --stagged_flag = 'N', --commented by abhallam on 25-apr-2018
                   staged_truck_id  = NULL, --added by abhallam on 25-apr-2018
                   last_updated_by  = p_user_id,
                   last_update_date = SYSDATE,
                   --load_truck_flag = p_truck_flag,   --ADDED ON 08-MAR-2017
                   load_truck_flag_single_pt = p_truck_flag,
                   xcl.cont_gross_wt         = l_cont_wt
            WHERE  xcl.order_no = p_order_number
            AND    xcl.cont_name = p_cont_name
            AND    xcl.ship_from_org_code = p_org
            AND    xcl.ship_set_name = p_ship_set_name;

            --log(l_prc,'22');

            UPDATE xxwsh_containers xc
            SET    truck_id_1 = p_truck_id,
                   --stagged_flag = 'N', --commented by abhallam on 25-apr-2018
                   staged_truck_id = NULL, --added by abhallam on 25-apr-2018
                   last_updated_by = p_user_id,
                   --load_truck_flag = p_truck_flag,   --ADDED ON 08-MAR-2017
                   load_truck_flag_single_pt = p_truck_flag,
                   last_update_date          = SYSDATE
            WHERE  xc.order_no = p_order_number
            AND    xc.cont_name = p_cont_name
            AND    xc.ship_from_org_code = p_org
            AND    xc.ship_set_name = p_ship_set_name;

            --log(l_prc,'23');

            COMMIT;
            lv_status := 'S';
          EXCEPTION
            WHEN others THEN
              lv_status := 'F';
              --log(l_prc,'24 Error: '|| sqlerrm);
          END;
        END IF;
        -- singlr point logic end
        --log(l_prc,'25');
      END IF;

      p_status := lv_status;
    ELSIF p_assigntype = 'R' THEN
      -- R remove
      --log(l_prc,'26');
      IF p_org = SUBSTR(p_ship_set_name, 0, 3) THEN
        --log(l_prc,'27');
        BEGIN
          SELECT 'Y'
          INTO   l_single_point_truck_exists
          FROM   xxwsh_container_loading CL
          WHERE  order_no = p_order_number
          AND    cont_name = p_cont_name
          AND    truck_id_1 IS NOT NULL
                --AND    ship_confirm_1 = 'Y';
          AND    EXISTS (SELECT 1
                  FROM   xxwsh_truck_shipment xts
                  WHERE  xts.truck_id = cl.truck_id_1
                  AND    NVL(xts.ship_confirm, 'N') = 'Y');

          --AND    ship_from_org_code = p_org;
          COMMIT;
          --log(l_prc,'28 l_single_point_truck_exists=' || l_single_point_truck_exists);

          IF l_single_point_truck_exists = 'Y' THEN
            p_sgpt_allowed := FALSE;
            lv_status      := 'G'; -- single point unload not allowed
          END IF;
        EXCEPTION
          WHEN no_data_found THEN
            p_sgpt_allowed := TRUE;
            --log(l_prc,'29');
          WHEN others THEN
            p_sgpt_allowed := TRUE;
            --log(l_prc,'30');
        END;
      END IF;

      --log(l_prc,'31');

      IF p_sgpt_allowed THEN
        --log(l_prc,'32');
        IF (p_truck_id2 IS NOT NULL AND p_org = p_ship_from_org_code AND p_ship_set_name IS NULL) OR
           (p_truck_id2 IS NOT NULL AND p_ship_set_name IS NOT NULL AND p_org = SUBSTR(p_ship_set_name, 5, 3)) THEN
          BEGIN
            --log(l_prc,'33');

            UPDATE xxwsh_container_loading xcl
            SET    xcl.truck_id_2     = NULL,
                   xcl.ship_confirm_2 = NULL,
                   --stagged_flag = 'N', --commented by abhallam on 25-apr-2018
                   staged_truck_id     = NULL, --added by abhallam on 25-apr-2018
                   xcl.last_updated_by = p_user_id,
                   -- xcl.load_truck_flag = NULL,   --ADDED ON 08-MAR-2017
                   xcl.load_truck_flag_direct_load = NULL,
                   xcl.load_truck_flag_single_pt   = NULL,
                   xcl.last_update_date            = SYSDATE
            WHERE  xcl.order_no = p_order_number
            AND    xcl.cont_name = p_cont_name
            AND    ((p_ship_set_name IS NULL AND xcl.ship_from_org_code = p_org) -- no single point
                  OR (xcl.ship_set_name LIKE '%' || p_org));

            --log(l_prc,'34');

            UPDATE xxwsh_containers xc
            SET    xc.truck_id_2 = NULL,
                   --stagged_flag = 'N', --commented by abhallam on 25-apr-2018
                   staged_truck_id    = NULL, --added by abhallam on 25-apr-2018
                   xc.last_updated_by = p_user_id,
                   --xc.load_truck_flag = NULL,   --ADDED ON 08-MAR-2017
                   xc.load_truck_flag_direct_load = NULL,
                   xc.load_truck_flag_single_pt   = NULL,
                   xc.last_update_date            = SYSDATE
            WHERE  xc.order_no = p_order_number
            AND    xc.cont_name = p_cont_name
            AND    ((p_ship_set_name IS NULL AND xc.ship_from_org_code = p_org) -- no single point
                  OR (xc.ship_set_name LIKE '%' || p_org));

            --log(l_prc,'34');

            COMMIT;
            lv_status := 'S';
          EXCEPTION
            WHEN others THEN
              lv_status := 'F';
              --log(l_prc,'35');
          END;
        ELSIF p_truck_id1 IS NOT NULL AND p_org = p_ship_from_org_code AND p_ship_set_name IS NOT NULL THEN

          --log(l_prc,'36');
          BEGIN
            UPDATE xxwsh_container_loading xcl
            SET    xcl.truck_id_1     = NULL,
                   xcl.ship_confirm_1 = NULL,
                   --stagged_flag = 'N', --commented by abhallam on 25-apr-2018
                   staged_truck_id     = NULL, --added by abhallam on 25-apr-2018
                   xcl.last_updated_by = p_user_id,
                   --xcl.load_truck_flag = NULL,   --ADDED ON 08-MAR-2017
                   xcl.load_truck_flag_direct_load = NULL,
                   xcl.load_truck_flag_single_pt   = NULL,
                   xcl.last_update_date            = SYSDATE
            WHERE  xcl.order_no = p_order_number
            AND    xcl.cont_name = p_cont_name
            AND    xcl.ship_from_org_code = p_org
            AND    xcl.ship_set_name = p_ship_set_name;

            --log(l_prc,'37');

            UPDATE xxwsh_containers xc
            SET    xc.truck_id_1 = NULL,
                   --stagged_flag = 'N', --commented by abhallam on 25-apr-2018
                   staged_truck_id    = NULL, --added by abhallam on 25-apr-2018
                   xc.last_updated_by = p_user_id,
                   --                            xc.load_truck_flag = NULL,   --ADDED ON 08-MAR-2017
                   xc.load_truck_flag_direct_load = NULL,
                   xc.load_truck_flag_single_pt   = NULL,
                   xc.last_update_date            = SYSDATE
            WHERE  xc.order_no = p_order_number
            AND    xc.cont_name = p_cont_name
            AND    xc.ship_from_org_code = p_org
            AND    xc.ship_set_name = p_ship_set_name;

            --log(l_prc,'38');

            COMMIT;
            lv_status := 'S';
          EXCEPTION
            WHEN others THEN
              lv_status := 'F';
              --log(l_prc,'39');
          END;
        END IF;
      END IF;

      p_status := lv_status;
    END IF;

    --log(l_prc,'40');

    -- ====================================
    -- Update the truck shipment weight
    -- ====================================
    IF (l_truck_id IS NOT NULL) THEN
      --log(l_prc,'41');
      IF (p_ship_set_name IS NOT NULL AND p_org = SUBSTR(p_ship_set_name, 1, 3)) THEN
        -- Single Point
        l_shipment_type := 'I';

        --log(l_prc,'42');

        SELECT NVL(SUM(xc.cont_gross_wt), 0)
        INTO   l_truck_shipment_wt
        FROM   xxwsh_containers xc
        WHERE  xc.truck_id_1 = l_truck_id
        AND    xc.ship_from_org_code = p_org
        AND    xc.ship_set_name = p_ship_set_name;

        --log(l_prc,'43');

      ELSE
        --log(l_prc,'44');
        l_shipment_type := 'S'; -- Direct

        SELECT NVL(SUM(xc.cont_gross_wt), 0)
        INTO   l_truck_shipment_wt
        FROM   xxwsh_containers xc
        WHERE  xc.truck_id_2 = l_truck_id
        AND    (xc.ship_from_org_code = p_org OR xc.ship_set_name LIKE '%' || p_org);

        --log(l_prc,'45');
      END IF;

      --log(l_prc,'46');

      SELECT DECODE(COUNT(1), 0, 'N', 'Y')
      INTO   l_truck_shipment_exists
      FROM   xxwsh_truck_shipment xts
      WHERE  xts.truck_id = p_header_truck
      AND    xts.shipment_type = l_shipment_type;

      --log(l_prc,'47');

      IF (l_truck_shipment_exists = 'Y') THEN
        -- Update
        UPDATE xxwsh_truck_shipment xts
        SET    xts.total_weight = l_truck_shipment_wt
        WHERE  xts.truck_id = l_truck_id
        AND    xts.shipment_type = l_shipment_type;
        --log(l_prc,'48');
      ELSE
        INSERT INTO xxwsh_truck_shipment
          (truck_id, shipment_type, total_weight, creation_date)
        VALUES
          (l_truck_id, l_shipment_type, l_truck_shipment_wt, SYSDATE);
        --log(l_prc,'49');
      END IF;
    END IF; -- if l_truck_id is not null

    -- ====================================

    --log(l_prc,'50');

    BEGIN
      SELECT SUM(tr.cont_qty) cont_qty, SUM(tr.cont_gross_wt) cont_gross_wt
      INTO   lv_truck_quantity, lv_truck_weight
      FROM   (SELECT NVL(xc.cont_qty, 0) cont_qty, NVL(xc.cont_gross_wt, 0) cont_gross_wt
              FROM   xxwsh_containers xc
              WHERE  xc.truck_id_2 = p_header_truck
              UNION ALL
              SELECT NVL(xc.cont_qty, 0) cont_qty, NVL(xc.cont_gross_wt, 0) cont_gross_wt
              FROM   xxwsh_containers xc
              WHERE  xc.truck_id_1 = p_header_truck
              AND    xc.truck_id_2 IS NULL) tr;

      p_truck_weight   := NVL(lv_truck_weight, 0);
      p_truck_quantity := NVL(lv_truck_quantity, 0);

      --log(l_prc,'51 lv_truck_quantity='||lv_truck_quantity || ',lv_truck_weight=' || lv_truck_weight);

      dbms_output.put_line(p_truck_weight || '           ' || p_truck_quantity);
      COMMIT;
    EXCEPTION
      WHEN others THEN
        dbms_output.put_line(sqlerrm);
        --log(l_prc,'52 Error: ' || sqlerrm);
    END;
  END xxbbna_update_truck_id;

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
  PROCEDURE xxbbna_truck_weight_qty_proc(p_org            IN VARCHAR2,
                                         p_truck          IN VARCHAR2,
                                         p_truck_weight   OUT NUMBER,
                                         p_truck_quantity OUT NUMBER,
                                         p_stagged_weight OUT NUMBER) IS
    lv_truck_weight   NUMBER := 0;
    lv_truck_quantity NUMBER := 0;
    lv_stagged_weight NUMBER := 0;
    p_org_id          NUMBER := 0;
  BEGIN
    SELECT SUM(tr.cont_qty) cont_qty, SUM(tr.cont_gross_wt) cont_gross_wt
    INTO   lv_truck_quantity, lv_truck_weight
    FROM   (SELECT NVL(xc.cont_qty, 0) cont_qty, NVL(xc.cont_gross_wt, 0) cont_gross_wt
            FROM   xxwsh_containers xc
            WHERE  xc.truck_id_2 = p_truck
            UNION ALL
            SELECT NVL(xc.cont_qty, 0) cont_qty, NVL(xc.cont_gross_wt, 0) cont_gross_wt
            FROM   xxwsh_containers xc
            WHERE  xc.truck_id_1 = p_truck
            AND    xc.truck_id_2 IS NULL) tr;

    SELECT SUM(tr.cont_gross_wt) cont_gross_wt
    INTO   lv_stagged_weight
    FROM   (SELECT NVL(xc.cont_gross_wt, 0) cont_gross_wt
            FROM   xxwsh_containers xc
            WHERE  1 = 1
            AND    xc.staged_truck_id = p_truck
            AND    xc.truck_id_1 IS NULL
            AND    xc.truck_id_1 IS NULL) tr;

    p_truck_weight   := NVL(lv_truck_weight, 0);
    p_truck_quantity := NVL(lv_truck_quantity, 0);
    p_stagged_weight := NVL(lv_stagged_weight, 0);
    dbms_output.put_line(p_truck_weight || '           ' || p_truck_quantity || '           ' || p_stagged_weight);
  EXCEPTION
    WHEN others THEN
      dbms_output.put_line(sqlerrm);
  END xxbbna_truck_weight_qty_proc;

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
  FUNCTION xxbbna_get_user_id(p_user_name IN VARCHAR2, p_user_account IN VARCHAR2) RETURN NUMBER IS
    --
    -- Local variable declaration
    --
    l_user_id NUMBER;
  BEGIN
    l_user_id := 0;

    LOG('log_in', 'My p_user_name=' || p_user_name);
    LOG('log_in', 'My p_user_account=' || p_user_account);
    SELECT DISTINCT fu.user_id
    INTO   l_user_id
    FROM   fnd_user fu, per_people_v7 pp
    WHERE  fu.employee_id = pp.person_id
    AND    (LOWER(fu.user_name) = LOWER(p_user_name) OR
          -- AK 03/18 LOWER(pp.email_address) = LOWER(NVL(p_user_account, pp.email_address)))
          LOWER(pp.email_address) = LOWER(NVL(p_user_account,'xx')))
    AND    ROWNUM < 2;
    LOG('log_in', 'My User=' || l_user_id);
    set_user_session(l_user_id);
    --log('ADAM','set User session ='||l_user_id) ;
    RETURN l_user_id;
  EXCEPTION
    WHEN too_many_rows THEN
      BEGIN
        SELECT DISTINCT fu.user_id
        INTO   l_user_id
        FROM   fnd_user fu, per_people_v7 pp
        WHERE  fu.employee_id = pp.person_id
        AND    LOWER(fu.user_name) = LOWER(p_user_name)
        AND    LOWER(pp.email_address) = LOWER(p_user_account);

        RETURN l_user_id;
      END;
    WHEN no_data_found THEN
      BEGIN
        SELECT DISTINCT fu.user_id
        INTO   l_user_id
        FROM   fnd_user fu, per_people_v7 pp
        WHERE  fu.employee_id = pp.person_id
        AND    LOWER(fu.user_name) = LOWER('ANONYMOUS');

        RETURN l_user_id;
      END;
    WHEN others THEN
      dbms_output.put_line('Exception ------ ' || sqlerrm);
      RETURN l_user_id;
  END xxbbna_get_user_id;

  ---------------------------------------------------------------------------------------------------------------------
  ----------------------------------------------------------------------------------------------------------------------
  --      Name: xxcustom_order_credit_check
  --
  --    Output parameters:
  --        l_ishold_valid       : Returns the hold item or not from the program.
  --
  --      Functions: This Function returns the item is hold or Not
  --
  ----------------------------------------------------------------------------------------------------------------------
  FUNCTION xxcustom_order_credit_check(p_order_no IN NUMBER, p_organization_code IN VARCHAR2) RETURN VARCHAR2 IS
    v_count         NUMBER;
    v_ishold_exists VARCHAR2(1) := 'N';
    v_single_point  NUMBER;
    v_direct        NUMBER;
  BEGIN
    IF fnd_global.user_id < 0 THEN
      mo_global.set_policy_context('S', xxbbna_get_operating_unit_id(p_organization_code));
    END IF;

    BEGIN
      SELECT COUNT(*)
      INTO   v_count
      FROM   oe_order_holds           h, --AK PR00100 - R12 Upgrade
             oe_hold_sources          hs, --AK PR00100 - R12 Upgrade
             apps.oe_hold_definitions hd,
             oe_order_headers         oh --AK PR00100 - R12 Upgrade
      WHERE  h.released_flag = 'N'
      AND    hs.hold_source_id = h.hold_source_id
      AND    hd.hold_id = hs.hold_id
      AND    h.line_id IS NULL
      AND    h.header_id = oh.header_id
      AND    hd.type_code IN ('STOP', 'CREDIT')
      AND    oh.order_number = p_order_no;

      IF (v_count > 0) THEN
        --RETURN('Y');
        v_ishold_exists := 'Y';
      ELSE
        v_ishold_exists := 'N';
      END IF;
    EXCEPTION
      WHEN no_data_found THEN
        v_ishold_exists := 'N';
      WHEN others THEN
        v_ishold_exists := 'N';
    END;

    IF v_ishold_exists = 'N' THEN
      BEGIN
        SELECT COUNT(*)
        INTO   v_count
        FROM   oe_order_headers    oh, --AK PR00100 - R12 Upgrade
               oe_order_holds      h, --AK PR00100 - R12 Upgrade
               oe_hold_sources     hs, --AK PR00100 - R12 Upgrade
               oe_hold_definitions hd
        WHERE  oh.header_id = h.header_id
        AND    h.released_flag = 'N'
        AND    hs.hold_source_id = h.hold_source_id
        AND    hd.name IN ('SHIPPING HOLD', 'CHANGE ORDER')
        AND    hd.hold_id = hs.hold_id
        AND    oh.order_number = p_order_no;

        IF (v_count > 0) THEN
          SELECT COUNT(1)
          INTO   v_single_point
          FROM   xxwsh_containers xc
          WHERE  xc.order_no = p_order_no
          AND    xc.ship_from_org_code = p_organization_code
          AND    xc.ship_set_name IS NOT NULL;

          SELECT COUNT(1)
          INTO   v_direct
          FROM   xxwsh_containers xc
          WHERE  xc.order_no = p_order_no
          AND    ((xc.ship_from_org_code = p_organization_code AND xc.ship_set_name IS NULL) OR
                (xc.ship_set_name LIKE '%' || p_organization_code));

          IF (v_single_point > 0 AND v_direct = 0) THEN
            v_ishold_exists := 'N'; -- allow single point leg while on hold but not direct
          ELSE
            v_ishold_exists := 'Y';
          END IF;
          --RETURN('Y');
        ELSE
          v_ishold_exists := 'N';
          --RETURN('N');
        END IF;
      EXCEPTION
        WHEN no_data_found THEN
          v_ishold_exists := 'N';
        WHEN others THEN
          v_ishold_exists := 'N';
      END;
    END IF;

    RETURN v_ishold_exists;
  END xxcustom_order_credit_check;

  -----------------------------------------------------------------------------------------------------------------
  --      Name: XXBBNA_TRUCK_MANAIFEST_PROC
  --
  --      Output parameters:
  --        p_truck_details        : Returns the LOADED TRUCK details from the program.
  --
  --      Functions: This procedure select all order lines for the particular TRUCK
  --        Query extracted from   Package Loading Report
  --
  ----------------------------------------------------------------------------------------------------------------------
  PROCEDURE xxbbna_truck_manifest_proc(p_organization_code IN VARCHAR2,
                                       p_truck             IN VARCHAR2,
                                       p_truck_details     OUT g_truck_manifest_tbl) IS
    l_truck_details g_truck_manifest_tbl;
    l_prc           VARCHAR2(100) := 'xxbbna_truck_manifest_proc';

    CURSOR cur_truck_det(p_organization_code IN VARCHAR2, p_truck IN VARCHAR2) IS
      SELECT ORGANIZATION,
             description,
             container_name,
             truck_id,
             --order_by_cont_name,
             NVL(SUM(shipped_qty), 0) shipped_qty,
             NVL(SUM(cont_gross_wt), 0) extended_wt,
             compass_order_no order_number
      --oe_number
      FROM   (SELECT '123' order_number,
                     oh.order_number compass_order_no,
                     oh.attribute1 project_name,
                     oh.attribute2 oe_number,
                     wdd.cust_po_number purchase_order,
                     LTRIM(RTRIM(hp.party_name)) customer_name,
                     mp.organization_code plant_info,
                     msi.segment1 part_number,
                     xxbm_bsl_get_brand_desc(msi.description, xxbm_bsl_get_brand(oh.order_number)) description,
                     ol.ordered_quantity quantity_ordered,
                     mp.organization_code origination_plant,
                     DECODE(p_organization_code, NULL, 'ALL', p_organization_code) ORGANIZATION,
                     xcl.cont_name container_name,
                     --DECODE(xcl.truck_id_2, NULL, NVL(xcl.truck_id_1, 'xxxx'), xcl.truck_id_2) truck_id,
                     NVL(xcl.truck_id_2, NVL(xcl.truck_id_1, xcl.staged_truck_id)) truck_id, --added on 03-MAY-2018 by abhallam
                     ol.attribute16 part_mark,
                     ol.attribute20 erection_mark,
                     REPLACE(TRANSLATE(xcl.cont_name, '1234567890', '0000000000'), '0') order_by_cont_name,

                     --
                     (SELECT TO_NUMBER(ph.segment1)
                      FROM   po_requisition_headers ph, po_requisition_lines pl
                      WHERE  ph.requisition_header_id = pl.requisition_header_id
                      AND    ph.segment1 = ol.orig_sys_document_ref
                      AND    ol.orig_sys_line_ref = TO_CHAR(pl.line_num)
                      AND    ROWNUM <= 1) requisition_no,
                     --
                     DECODE(wdd.released_status, 'Y', wdd.requested_quantity, 'C', wdd.requested_quantity, 0) shipped_qty,
                     --
                     DECODE(wdd.released_status, 'B', wdd.requested_quantity, 0) backordered_qty,
                     --
                     wdd.requested_quantity ordered_qty,
                     xc.cont_gross_wt
              FROM   wsh.wsh_delivery_details          wdd,
                     apps.mtl_system_items_vl          msi,
                     apps.oe_order_headers             oh,
                     apps.oe_order_lines               ol,
                     apps.xxwsh_containers             xc,
                     xxwsh_container_loading xcl,
                     --apps.ra_customers                 rc, PR00100 R12 Upgrade
                     hz_cust_accounts    hca,
                     hz_parties          hp,
                     apps.mtl_parameters mp
              WHERE  wdd.source_header_id = oh.header_id
                    --AND :p_allow_report_to_run = 1
              AND    (wdd.requested_quantity > 0 OR wdd.released_status != 'D')
              AND    wdd.inventory_item_id = msi.inventory_item_id
              AND    oh.header_id = ol.header_id
              AND    ol.line_id = wdd.source_line_id
              AND    ol.inventory_item_id = msi.inventory_item_id
              AND    msi.organization_id = oh.org_id
                    --AND rc.customer_id = wdd.customer_id
              AND    hca.cust_account_id = wdd.customer_id
              AND    hp.party_id = hca.party_id
              AND    mp.organization_id = ol.ship_from_org_id
              AND    wdd.delivery_detail_id = xc.delivery_detail_id
              AND    xc.cont_name = xcl.cont_name
              AND    xc.order_no = xcl.order_no
              AND    NVL(xc.truck_id_1, 'YY') = NVL(xcl.truck_id_1, 'YY')
              AND    NVL(xc.truck_id_2, 'YY') = NVL(xcl.truck_id_2, 'YY')
              AND    NVL(xcl.staged_truck_id, 'YY') = NVL(xcl.staged_truck_id, 'YY')
              AND    xc.ship_from_org_code = xcl.ship_from_org_code
              AND    NOT msi.segment1 LIKE 'SS%'
              AND    xc.order_no = oh.order_number
                    --AND    DECODE(UPPER(xcl.truck_id_2), NULL, UPPER(xcl.truck_id_1), UPPER(xcl.truck_id_2)) = UPPER(p_truck)   --lp_truck_qry
              AND    UPPER(p_truck) IS NOT NULL
              AND    UPPER(p_truck) IN (xcl.truck_id_1, xcl.truck_id_2, xcl.staged_truck_id) --30-apr-2018 - abhallam
                    --AND OH.ORDER_NUMBER='|| ':P_ORDER_NO--lp_order_qry
              AND    (mp.organization_code = p_organization_code
                    --OR xc.ship_set_name LIKE '%' || p_organization_code)
                    ))
      GROUP  BY order_number,
                compass_order_no,
                project_name,
                purchase_order,
                requisition_no,
                customer_name,
                plant_info,
                ORGANIZATION,
                origination_plant,
                part_number,
                description,
                part_mark,
                erection_mark,
                container_name,
                truck_id,
                order_by_cont_name,
                oe_number;
  BEGIN

    --log(l_prc,'START');
    --log(l_prc,'p_organization_code=' || p_organization_code || ', p_truck=' || p_truck);

    IF fnd_global.user_id < 0 THEN
      mo_global.set_policy_context('S', xxbbna_get_operating_unit_id(p_organization_code));
    END IF;

    OPEN cur_truck_det(p_organization_code, p_truck);

    FETCH cur_truck_det BULK COLLECT
      INTO l_truck_details;

    CLOSE cur_truck_det;

    p_truck_details := l_truck_details;

    --log(l_prc,'END. p_truck_details.count=' || p_truck_details.count);

  EXCEPTION
    WHEN others THEN
      dbms_output.put_line(sqlerrm);
      --log(l_prc,'Error: ' || sqlerrm);
  END xxbbna_truck_manifest_proc;

  --------------------------------------------------------------------------------------------------------------------
  /*PROCEDURE xxbbna_category_questions(x_question_table OUT questions_table) IS
          --
          -- Local variable declaration
          --
          l_category_question   questions_table;
      BEGIN
          dbms_output.put_line('BODY BLOCK');

          SELECT category_id,
                 category_type,
                 question
          BULK COLLECT INTO l_category_question
          FROM   INTERFACE.xxbbna_category_questions;

          x_question_table := l_category_question;
      EXCEPTION
          WHEN OTHERS THEN
              dbms_output.put_line('Exception ------ ' || SQLERRM);
      END xxbbna_category_questions;
  */
  ----------------------------------------------------------------------------------------------------------------------
  --      Name: xxbbna_category_answers
  --
  --    Output parameters:
  --        x_answers_table        : Returns the question from the program.
  --
  --      Functions: This procedure select all the records in XXBBNA_CATEGORY_ANSWERS table
  --
  ----------------------------------------------------------------------------------------------------------------------
  /*PROCEDURE xxbbna_category_answers(x_answers_table OUT answers_table) IS
      --
      -- Local variable declaration
      --
      l_category_answers   answers_table;
  BEGIN
      SELECT category_answer_id,
             category_id,
             answers
      BULK COLLECT INTO l_category_answers
      FROM   INTERFACE.xxbbna_category_answers;

      x_answers_table := l_category_answers;
  EXCEPTION
      WHEN OTHERS THEN
          dbms_output.put_line('Exception ------ ' || SQLERRM);
  END xxbbna_category_answers;*/
  ----------------------------------------------------------------------------------------------------------------------
  --      Name: XXBM_PRODUCT_TYPE
  --
  --    Output parameters:
  --        x_question_table        : Returns the product type from the program.
  --
  --      Functions: This procedure select all the records in XXBM_PRODUCT_TYPE table
  --
  ----------------------------------------------------------------------------------------------------------------------
  PROCEDURE xxbbna_product_type(x_product_type_table OUT product_type_table) IS
    --
    -- Local variable declaration
    --
    l_product_type_table product_type_table;
  BEGIN
    dbms_output.put_line('BODY BLOCK');

    SELECT product_type_id, product_type
    BULK   COLLECT
    INTO   l_product_type_table
    FROM   xxbm_trkloadver_prd_type;

    x_product_type_table := l_product_type_table;
  EXCEPTION
    WHEN others THEN
      dbms_output.put_line('Exception xxbm_product_type ------ ' || sqlerrm);
  END xxbbna_product_type;

  ----------------------------------------------------------------------------------------------------------------------
  --      Name: XXBM_CAT_PRODUCT_TYPE_REL
  --
  --    Output parameters:
  --        x_question_table        : Returns the category product type from the program.
  --
  --      Functions: This procedure select all the records in XXBM_CAT_PRODUCT_TYPE_REL table
  --
  ----------------------------------------------------------------------------------------------------------------------
  PROCEDURE xxbbna_cat_product_type_rel(x_category_product_type_table OUT category_product_type_table) IS
    --
    -- Local variable declaration
    --
    l_category_product_type_table category_product_type_table;
  BEGIN
    dbms_output.put_line('BODY BLOCK');

    SELECT category_prd_type_rel_id, CATEGORY, product_type_id
    BULK   COLLECT
    INTO   l_category_product_type_table
    FROM   xxbm_trkloadver_cat_type;

    x_category_product_type_table := l_category_product_type_table;
  EXCEPTION
    WHEN others THEN
      dbms_output.put_line('Exception xxbbna_cat_product_type_rel ------ ' || sqlerrm);
  END xxbbna_cat_product_type_rel;

  ----------------------------------------------------------------------------------------------------------------------
  --      Name: XXBM_PRODUCT_TYPE_QUESTIONS
  --
  --    Output parameters:
  --        x_question_table        : Returns the question from the program.
  --
  --      Functions: This procedure select all the records in XXBM_PRODUCT_TYPE_QUESTIONS table
  --
  ----------------------------------------------------------------------------------------------------------------------
  PROCEDURE xxbbna_product_type_questions(x_product_type_question_table OUT product_type_questions_table) IS
    --
    -- Local variable declaration
    --
    l_product_type_question_table product_type_questions_table;
  BEGIN
    dbms_output.put_line('BODY BLOCK');

    SELECT product_type_ques_id, product_type_id, question
    BULK   COLLECT
    INTO   l_product_type_question_table
    FROM   xxbm_trkloadver_prd_type_qn;

    x_product_type_question_table := l_product_type_question_table;
  EXCEPTION
    WHEN others THEN
      dbms_output.put_line('Exception xxbm_product_type_questions ------ ' || sqlerrm);
  END xxbbna_product_type_questions;

  ----------------------------------------------------------------------------------------------------------------------
  --      Name: xxbm_category_answers
  --
  --    Output parameters:
  --        x_answers_table        : Returns the question from the program.
  --
  --      Functions: This procedure select all the records in XXBM_CATEGORY_ANSWERS table
  --
  ----------------------------------------------------------------------------------------------------------------------
  PROCEDURE xxbbna_product_type_answers(x_product_type_answers_table OUT product_type_answers_table) IS
    --
    -- Local variable declaration
    --
    l_product_type_answers_table product_type_answers_table;
  BEGIN
    dbms_output.put_line('BODY BLOCK');

    SELECT product_type_answer_id, product_type_ques_id, answers
    BULK   COLLECT
    INTO   l_product_type_answers_table
    FROM   xxbm_trkloadver_prd_type_ans;

    x_product_type_answers_table := l_product_type_answers_table;
  EXCEPTION
    WHEN others THEN
      dbms_output.put_line('Exception xxbm_product_type_answers ------ ' || sqlerrm);
  END xxbbna_product_type_answers;

  ----------------------------------------------------------------------------------------------------------------------
  --      Name: xxbbna_load_verification_txn
  --
  --    Output parameters:
  --        x_status        : Returns the transaction status from the program.
  --        x_error_msg     : Returns the error message from the program.
  --
  --      Functions: This procedure insert load verification form details into interface.XXBBNA_LOAD_VERIFI_TXN and interface.XXBBNA_LOAD_VERIFI_TXN_DETAIL  table
  --
  ----------------------------------------------------------------------------------------------------------------------
  PROCEDURE xxbbna_load_verification_txn(p_document_no         IN VARCHAR2,
                                         p_issued              IN VARCHAR2,
                                         p_revision            IN VARCHAR2,
                                         p_revised             IN VARCHAR2,
                                         p_loaders_name        IN VARCHAR2,
                                         p_shift               IN VARCHAR2,
                                         p_area                IN VARCHAR2,
                                         p_trailer_weight      IN NUMBER,
                                         p_customer_name       IN VARCHAR2,
                                         p_order_number        IN VARCHAR2,
                                         p_trailer_number      IN VARCHAR2,
                                         p_additional_comments IN VARCHAR2,
                                         p_auditor_signature   IN BLOB,
                                         p_audit_date          IN VARCHAR2,
                                         p_txn_details         IN g_load_verification_tbl,
                                         p_user_id             IN NUMBER,
                                         p_txn_type            IN VARCHAR2,
                                         p_direct_load         IN VARCHAR2,
                                         x_status              OUT VARCHAR2,
                                         x_error_msg           OUT VARCHAR2) IS
    -- Local variable declaration
    --
    l_load_rec_type xxbbna_warehouse_process_pkg.g_load_verification_tbl;
    lv_status       VARCHAR2(1);
    lv_error_msg    VARCHAR2(2000);
    l_trx_seq       NUMBER;
    exp_custom EXCEPTION;
    v_status            VARCHAR2(1);
    bursting_request_id VARCHAR2(20);
    v_user_id           NUMBER;
    v_resp_id           NUMBER;
    v_app_id            NUMBER;
  BEGIN
    BEGIN
      SELECT interface.xxbm_load_v_txn_seq.nextval INTO l_trx_seq FROM dual;
    EXCEPTION
      WHEN others THEN
        dbms_output.put_line('Error in Header seq-' || l_trx_seq || sqlerrm);
        x_status    := 'F';
        x_error_msg := 'SEQ - ' || sqlerrm;
    END;

    BEGIN
      SAVEPOINT insert_header;

      --added by abhallam on 08-may-2018 - start
      --update staged_truck_id with null if transaction type is SUBMIT.
      --Because SUBMIT means, truck is LOADED and COMPLETE. So any staged items/orders with the truck should not exist.
      IF (p_txn_type = 'SUBMIT') THEN
        UPDATE xxwsh_container_loading xcl
        SET    staged_truck_id = NULL
        WHERE  staged_truck_id = p_trailer_number
        AND    truck_id_1 IS NULL
        AND    truck_id_2 IS NULL;

        UPDATE xxwsh_containers xc
        SET    staged_truck_id = NULL
        WHERE  staged_truck_id = p_trailer_number
        AND    truck_id_1 IS NULL
        AND    truck_id_2 IS NULL;
      END IF;
      --added by abhallam on 08-may-2018 - end

      --
      -- Recreate if the record exists with status as 'P'ending
      --
      BEGIN
        IF (p_txn_type = 'SAVE') THEN
          v_status := 'C'; -- Pending
        ELSE
          v_status := 'C'; -- Completed
        END IF;

        DELETE FROM xxbm_trkloadver_txn_det
        WHERE  transaction_id = (SELECT transaction_id
                                 FROM   xxbm_trkloadver_txn
                                 WHERE  trailer_number = p_trailer_number
                                 AND    status = 'C');

        DELETE FROM xxbm_trkloadver_txn
        WHERE  trailer_number = p_trailer_number
        AND    status = 'C';
      END;

      INSERT INTO xxbm_trkloadver_txn
        (transaction_id,
         document_no,
         issued,
         revision,
         revised,
         loaders_name,
         shift,
         area,
         trailer_weight,
         customer_name,
         order_number,
         trailer_number,
         additional_comments,
         auditor_signature,
         audit_date,
         attribute1,
         attribute2,
         attribute3,
         attribute4,
         attribute5,
         status,
         created_by,
         creation_date,
         last_update_date,
         last_updated_by)
      VALUES
        (l_trx_seq,
         p_document_no,
         TO_DATE(p_issued, 'DD/MM/YYYY'),
         p_revision,
         TO_DATE(p_revised, 'DD/MM/YYYY'),
         p_loaders_name,
         p_shift,
         p_area,
         p_trailer_weight,
         p_customer_name,
         p_order_number,
         p_trailer_number,
         p_additional_comments,
         p_auditor_signature,
         TO_DATE(p_audit_date, 'DD/MM/YYYY'),
         NULL,
         NULL,
         NULL,
         NULL,
         NULL,
         v_status,
         p_user_id,
         SYSDATE,
         SYSDATE,
         p_user_id);

      --
      -- Insert all the related lines
      --
      l_load_rec_type := p_txn_details;

      FOR l_load_rec IN 1 .. l_load_rec_type.count LOOP
        BEGIN
          INSERT INTO xxbm_trkloadver_txn_det
            (transaction_detail_id,
             transaction_id,
             product_type_answer_id,
             answer_flag,
             attribute1,
             attribute2,
             attribute3,
             attribute4,
             attribute5,
             created_by,
             creation_date,
             last_update_date,
             last_updated_by)
          VALUES
            (interface.xxbm_load_v_txn_det_seq.nextval,
             l_trx_seq,
             l_load_rec_type(l_load_rec).product_type_answer_id,
             l_load_rec_type(l_load_rec).answer_flag,
             NULL,
             NULL,
             NULL,
             NULL,
             NULL,
             p_user_id,
             SYSDATE,
             SYSDATE,
             p_user_id);
        EXCEPTION
          WHEN others THEN
            dbms_output.put_line('Error in Line Insert' || sqlerrm);
            lv_status   := 'F';
            x_error_msg := 'Error in xxbbna_load_verifi_txn_detail Insert - ' || sqlerrm;
            x_status    := lv_status;
            RAISE exp_custom;
        END;
      END LOOP;

      x_status := 'S';

      /* SELECT DISTINCT fr.responsibility_id,
                      frx.application_id
      INTO            v_resp_id,
                      v_app_id
      FROM            apps.fnd_responsibility frx,
                      apps.fnd_responsibility_tl fr
      WHERE           fr.responsibility_id = frx.responsibility_id
      AND             LOWER(fr.responsibility_name) LIKE LOWER('BCON ORDER MANAGEMENT SUPER USER')
      AND             fr.LANGUAGE = 'US';

                       v_user_id := p_user_id;
                       BEGIN
                  --
                  -- App initialization
                  --
                  fnd_global.apps_initialize (user_id           => v_user_id,
                                     resp_id           => v_resp_id,
                                     resp_appl_id      => v_app_id
                                    );
                            COMMIT;
                            END;*/
      --
      -- Submitting the XML BI report for bursting process
      --
      /* BEGIN
            SELECT fresp.responsibility_id,
             fresp.application_id
      INTO   v_resp_id,
             v_app_id
      FROM   fnd_user fnd,
             fnd_responsibility_tl fresp
      WHERE  fnd.user_id = p_user_id
      AND    fresp.responsibility_name = 'BSNA Shipping'
      AND    fresp.LANGUAGE = 'US';

      BEGIN
          fnd_global.apps_initialize(user_id => p_user_id, resp_id => v_resp_id, resp_appl_id => v_app_id);
          COMMIT;
      EXCEPTION
          WHEN OTHERS THEN
              x_status := 'F';

      END;
         begin
            bursting_request_id:=FND_REQUEST.SUBMIT_REQUEST
                              (application=>'XXBM',
                               program=>'XXBM_LOAD_VER_RPT',
                               argument1=>p_trailer_number,
                               argument2=>p_area);
               COMMIT;
              IF bursting_request_id = 0
                THEN
                   dbms_output.put_line ('Concurrent request failed to submit');
                  x_status := 'F';
                  x_error_msg := 'Exception while submitting the XXBM_YARD_MNG_REPORT' || SQLERRM;
                  RAISE exp_custom;
                ELSE
                  x_status := 'S';
                  x_error_msg := '';
                   dbms_output.put_line('Successfully Submitted the Concurrent Request');
                END IF;
                end;
      END;*/

      --
      -- Based on the user selection SAVE or SUBMIT call the bursting process
      --
      --
      BEGIN
        IF (p_txn_type = 'SUBMIT') THEN
          --
          -- Call the procudure to submit load verification report and bursting
          --
          xxbbna_email_loadverifiaction(p_user_id, p_area, p_trailer_number, p_direct_load, lv_status, lv_error_msg);

          IF lv_status = 'S' THEN
            x_status := 'S';
          ELSE
            x_status    := 'F';
            x_error_msg := x_error_msg || lv_error_msg;
          END IF;
        END IF;
      END;
    EXCEPTION
      WHEN exp_custom THEN
        dbms_output.put_line('Error in main procedure' || sqlerrm);
        x_status    := 'F';
        x_error_msg := x_error_msg || ' - Exception';
        ROLLBACK TO insert_header;
        x_status := lv_status;
      WHEN others THEN
        x_status    := 'F';
        x_error_msg := 'Exception  - ' || sqlerrm;
        ROLLBACK TO insert_header;
        x_status := lv_status;
    END;
  END xxbbna_load_verification_txn;

  PROCEDURE xxbbna_email_loadverifiaction(p_user_id     IN NUMBER,
                                          p_org_code    IN VARCHAR2,
                                          p_truck_id    IN VARCHAR2,
                                          p_direct_load IN VARCHAR2,
                                          x_status      OUT VARCHAR2,
                                          x_ret_msg     OUT VARCHAR2) IS
    pragma autonomous_transaction;
    bursting_request_id   VARCHAR2(20);
    v_user_id             NUMBER;
    v_resp_id             NUMBER;
    v_app_id              NUMBER;
    truck_manifest_req_id VARCHAR2(20);
  BEGIN
    --
    -- Getting the resposibility
    --
    BEGIN
      SELECT DISTINCT fr.responsibility_id, frx.application_id
      INTO   v_resp_id, v_app_id
      FROM   apps.fnd_responsibility frx, apps.fnd_responsibility_tl fr
      WHERE  fr.responsibility_id = frx.responsibility_id
      AND    LOWER(fr.responsibility_name) LIKE LOWER('BSNA Shipping')
      AND    fr.language = 'US';

      v_user_id := p_user_id;
      --SELECT user_id INTO v_user_id FROM fnd_user WHERE user_name = '1004404';
    EXCEPTION
      WHEN others THEN
        dbms_output.put_line('Exception Getting the resposibility and user iD------ ' || sqlerrm);
        x_status  := 'F' || sqlerrm;
        x_ret_msg := 'Exception Getting the resposibility------ ' || sqlerrm;
    END;

    BEGIN
      --
      -- App initialization
      --
      BEGIN
        fnd_global.apps_initialize(user_id => p_user_id, resp_id => v_resp_id, resp_appl_id => v_app_id);
        COMMIT;
      EXCEPTION
        WHEN others THEN
          x_status := 'F';
      END;

      --
      -- Submitting the XML BI report for bursting process
      --
      BEGIN
        bursting_request_id := fnd_request.submit_request(APPLICATION => 'XXBM',
                                                          PROGRAM     => 'XXBM_LOAD_VER_RPT',
                                                          argument1   => p_truck_id,
                                                          argument2   => p_org_code);
        COMMIT;

        IF bursting_request_id = 0 THEN
          dbms_output.put_line('Concurrent request XXBM_YARD_MNG_REPORT failed to submit');
          x_status  := 'F';
          x_ret_msg := 'Exception while submitting the XXBM_YARD_MNG_REPORT' || sqlerrm;
        ELSE
          x_status  := 'S';
          x_ret_msg := '';
          dbms_output.put_line('Successfully Submitted the Concurrent Request XXBM_YARD_MNG_REPORT');
        END IF;
      END;

      ------- CALLING TRUCK MANIFEST REPORT AND BURSTING PROGRAMS ----
      ----------------------------------------------------------------
      IF (p_direct_load = 'Y') THEN
        BEGIN
          truck_manifest_req_id := fnd_request.submit_request(APPLICATION => 'XXBM',
                                                              PROGRAM     => 'XXBM_TRUCK_MAN_RPT',
                                                              argument1   => p_truck_id,
                                                              argument2   => p_org_code);
          COMMIT;

          IF truck_manifest_req_id = 0 THEN
            dbms_output.put_line('Concurrent request XXBM_TRUCK_MAN_RPT failed to submit');
            x_status  := 'F';
            x_ret_msg := 'Exception while submitting the XXBM_TRUCK_MAN_RPT' || sqlerrm;
          ELSE
            x_status  := 'S';
            x_ret_msg := '';
            dbms_output.put_line('Successfully Submitted the Concurrent Request XXBM_TRUCK_MAN_RPT');
          END IF;
        END;
      ELSIF (p_direct_load = 'N') THEN
        BEGIN
          truck_manifest_req_id := fnd_request.submit_request(APPLICATION => 'XXBM',
                                                              PROGRAM     => 'XXBM_TRUCK_SP_MAN_RPT',
                                                              argument1   => p_truck_id,
                                                              argument2   => p_org_code);
          COMMIT;

          IF truck_manifest_req_id = 0 THEN
            dbms_output.put_line('Concurrent request XXBM_TRUCK_MAN_RPT failed to submit');
            x_status  := 'F';
            x_ret_msg := 'Exception while submitting the XXBM_TRUCK_MAN_RPT' || sqlerrm;
          ELSE
            x_status  := 'S';
            x_ret_msg := '';
            dbms_output.put_line('Successfully Submitted the Concurrent Request XXBM_TRUCK_MAN_RPT');
          END IF;
        END;
      END IF;
    END;
  END xxbbna_email_loadverifiaction;

  PROCEDURE xxbbna_load_form_txn_details(p_org_code     IN VARCHAR2,
                                         p_truck_id     IN VARCHAR2,
                                         p_user_id      IN NUMBER,
                                         x_data_exists  OUT VARCHAR2,
                                         x_ld_txn_ques  OUT ld_txn_question_table,
                                         x_ld_txn_answ  OUT ld_txn_answer_table,
                                         x_loaders_name OUT VARCHAR2,
                                         x_status       OUT VARCHAR2,
                                         x_error_msg    OUT VARCHAR2) IS
    v_count              NUMBER;
    v_transaction_id     NUMBER;
    v_data_exists        VARCHAR2(1);
    v_txn_question_table ld_txn_question_table;
    v_txn_answer_table   ld_txn_answer_table;
    v_error_flag         VARCHAR2(1) := 'S';
    v_loaders_name       VARCHAR2(1000);
  BEGIN
    --
    -- Find is question and answer exists for that truck
    --
    SELECT COUNT(1)
    INTO   v_count
    FROM   xxbm_trkloadver_txn
    WHERE  trailer_number = p_truck_id
    AND    area = p_org_code
    AND    status = 'C';

    IF v_count = 0 THEN
      --
      -- Set the out variables with null
      --
      x_data_exists  := 'N';
      x_status       := 'S';
      v_error_flag   := 'S';
      v_loaders_name := '';
      x_ld_txn_ques  := v_txn_question_table;
      x_ld_txn_answ  := v_txn_answer_table;
      dbms_output.put_line('No Data Found ------ ' || x_data_exists);
    ELSE
      --
      -- Query to get Loaders Name
      --
      BEGIN
        SELECT loaders_name
        INTO   v_loaders_name
        FROM   xxbm_trkloadver_txn
        WHERE  trailer_number = p_truck_id
        AND    area = p_org_code
        AND    status = 'C';

        x_loaders_name := v_loaders_name;
      END;

      --
      -- Get the existing data and pass it
      --
      x_data_exists := 'F';

      SELECT transaction_id
      INTO   v_transaction_id
      FROM   xxbm_trkloadver_txn
      WHERE  trailer_number = p_truck_id
      AND    area = p_org_code
      AND    status = 'C';

      --dbms_output.put_line('Data Found ------ '||x_data_exists);
      BEGIN
        --
        -- Get the data for question table
        --
        SELECT DISTINCT ques.product_type_ques_id,
                        ques.product_type_id,
                        pro.product_type,
                        ques.question,
                        htxn.additional_comments,
                        htxn.transaction_id
        BULK   COLLECT
        INTO   v_txn_question_table
        FROM   xxbm_trkloadver_txn_det      txn,
               xxbm_trkloadver_prd_type_ans ans,
               xxbm_trkloadver_prd_type_qn  ques,
               xxbm_trkloadver_prd_type     PRO,
               xxbm_trkloadver_txn          htxn
        WHERE  txn.product_type_answer_id = ans.product_type_answer_id
        AND    ques.product_type_ques_id = ans.product_type_ques_id
        AND    pro.product_type_id = ques.product_type_id
        AND    htxn.transaction_id = txn.transaction_id
        AND    htxn.trailer_number = p_truck_id
        AND    txn.transaction_id = v_transaction_id
        ORDER  BY product_type_ques_id;

        x_ld_txn_ques := v_txn_question_table;
      EXCEPTION
        WHEN others THEN
          v_error_flag := 'F';
          x_status     := 'F';
          x_error_msg  := 'Exception in Question data-' || sqlerrm;
      END;

      --
      -- Answer Data
      --
      BEGIN
        --
        -- Get the data for question table
        --
        SELECT txn.answer_flag,
               ans.answers,
               ques.product_type_ques_id,
               txn.product_type_answer_id,
               txn.transaction_detail_id
        BULK   COLLECT
        INTO   v_txn_answer_table
        FROM   xxbm_trkloadver_txn_det      txn,
               xxbm_trkloadver_prd_type_ans ans,
               xxbm_trkloadver_prd_type_qn  ques
        WHERE  txn.product_type_answer_id = ans.product_type_answer_id
        AND    ques.product_type_ques_id = ans.product_type_ques_id
        AND    txn.transaction_id = v_transaction_id
        ORDER  BY transaction_detail_id;

        x_ld_txn_answ := v_txn_answer_table;
      EXCEPTION
        WHEN others THEN
          v_error_flag := 'F';
          x_status     := 'F';
          x_error_msg  := 'Exception in Answer data-' || sqlerrm;
      END;

      IF v_error_flag <> 'F' THEN
        x_status := 'S';
      END IF;
    END IF;
  EXCEPTION
    WHEN others THEN
      x_status    := 'F';
      x_error_msg := 'Exception-' || sqlerrm;
  END xxbbna_load_form_txn_details;

  ----------------------------------------------------------------------------------------------------------------------
  --      Name: xxbbna_upload_truck_image
  --
  --       Output parameters:
  --       x_status         : Returns the status  from the program.
  --       Creation Date    :21-MAR-2017
  --      procedure: This procedure upload Truck image into table xxbbna_truck_image
  --
  ----------------------------------------------------------------------------------------------------------------------
  PROCEDURE xxbbna_upload_truck_image(p_image IN truckimgtable, x_status OUT VARCHAR2) IS
    -- Local variable declaration
    --
    lv_status        VARCHAR2(1);
    l_image_rec_type xxbbna_warehouse_process_pkg.truckimgtable;
  BEGIN
    l_image_rec_type := p_image;

    FOR l_rec IN 1 .. l_image_rec_type.count LOOP
      BEGIN
        INSERT INTO xxbbna_truck_image
          (truck_id, truck_image, created_by, creation_date, last_update_date, last_updated_by)
        VALUES
          (l_image_rec_type(l_rec).truck_id,
           l_image_rec_type(l_rec).truck_image,
           l_image_rec_type(l_rec).user_id,
           SYSDATE,
           SYSDATE,
           l_image_rec_type(l_rec).user_id);

        lv_status := 'S';
        x_status  := lv_status;
      EXCEPTION
        WHEN others THEN
          dbms_output.put_line('Exception ------ ' || sqlerrm);
          lv_status := 'F';
          x_status  := lv_status;
      END xxbbna_upload_truck_image;
    END LOOP;
  EXCEPTION
    WHEN others THEN
      dbms_output.put_line('Exception ------ ' || sqlerrm);
      lv_status := 'F';
      x_status  := lv_status;
  END xxbbna_upload_truck_image;

  ----------------------------------------------------------------------------------------------------------------------------
  -- Procedure for getting all the Single Point Orgs from the FND Lookups
  ----------------------------------------------------------------------------------------------------------------------------
  PROCEDURE xxbbna_single_point_org_list(p_org_code IN VARCHAR, x_org_list OUT orglist) IS
    --
    -- Local variable declaration
    --
    l_org_list orglist;
  BEGIN
    SELECT meaning, TAG
    BULK   COLLECT
    INTO   l_org_list
    FROM   (SELECT 'DIRECT' meaning, NULL TAG
            FROM   dual
            UNION ALL
            SELECT meaning, TAG
            FROM   fnd_lookup_values_vl
            WHERE  1 = 1
            AND    lookup_type = 'XXBBNA_SINGLE_POINT_ORG_LIST'
            AND    TAG = DECODE(p_org_code, '-', TAG, p_org_code)
            AND    NVL(end_date_active, TRUNC(SYSDATE)) >= TRUNC(SYSDATE))
    ORDER  BY TAG DESC, meaning;

    x_org_list := l_org_list;
  EXCEPTION
    WHEN others THEN
      dbms_output.put_line('x_org_list Exception ------ ' || sqlerrm);
  END xxbbna_single_point_org_list;

  ----------------------------------------------------------------------------------------------------------------------------
  -- Procedure for getting all the Environments from the FND Lookups
  ----------------------------------------------------------------------------------------------------------------------------
  PROCEDURE xxbbna_ip_addr_list(x_ip_addr OUT ipaddr) IS
    l_ip_addr ipaddr;
  BEGIN
    SELECT meaning, description
    BULK   COLLECT
    INTO   l_ip_addr
    FROM   fnd_lookup_values_vl
    WHERE  1 = 1
    AND    lookup_type = 'XXBBNA_IP_ADDRESS_LIST'
    AND    (end_date_active IS NULL OR end_date_active > SYSDATE);

    x_ip_addr := l_ip_addr;
  EXCEPTION
    WHEN others THEN
      dbms_output.put_line('l_ip_addr Exception ------ ' || sqlerrm);
  END xxbbna_ip_addr_list;

  ----------------------------------------------------------------------------------------------------------------------------

  ----------------------------------------------------------------------------------------------------------------------
  --      Name: update_stagged_flag
  --
  --    Output parameters:
  --        p_status        : Returns the status  from the program.
  --
  --      procedure: Procedure to update the stagged flag for the application
  --
  ----------------------------------------------------------------------------------------------------------------------
  PROCEDURE update_stagged_flag(p_order_number       NUMBER,
                                p_cont_name          VARCHAR2,
                                p_ship_from_org_code VARCHAR2,
                                p_org                VARCHAR2,
                                p_ship_set_name      VARCHAR2,
                                p_stagged_flag       VARCHAR2,
                                p_user_id            NUMBER,
                                p_header_truck       IN VARCHAR2,
                                p_load_flag          IN VARCHAR2,
                                p_status             OUT VARCHAR2,
                                p_truck_weight       OUT NUMBER,
                                p_truck_quantity     OUT NUMBER,
                                p_stagged_weight     OUT NUMBER) IS
    lv_truck_weight         NUMBER;
    lv_truck_quantity       NUMBER;
    lv_stagged_weight       NUMBER;
    l_prc                   VARCHAR2(100) := 'update_stagged_flag'; --added by by abhallam on 12-apr-2018
    l_shipment_type         VARCHAR2(1); --added by by abhallam on 03-may-2018
    l_truck_shipment_wt     NUMBER; --added by by abhallam on 03-may-2018
    l_truck_shipment_exists VARCHAR2(1); --added by by abhallam on 03-may-2018
    ----P Means Already updated through oracle form/other user
    lv_status VARCHAR2(1) := 'S';
    pragma autonomous_transaction;
  BEGIN

    --log ( l_prc,'START');

    /*log ( l_prc,'p_order_number=' || p_order_number ||
    ',p_cont_name=' || p_cont_name ||
    ',p_ship_from_org_code=' || p_ship_from_org_code ||
    ',p_org=' || p_org ||
    ',p_ship_set_name=' || p_ship_set_name ||
    ',p_stagged_flag=' || p_stagged_flag ||
    ',p_user_id=' || p_user_id ||
    ',p_header_truck=' || p_header_truck ||
    ',p_load_flag=' || p_load_flag );*/

    BEGIN
      UPDATE xxwsh_container_loading xcl
      SET    staged_truck_id  = DECODE(p_stagged_flag, 'Y', p_header_truck, NULL) --added by abhallam on 25-apr-2018
            ,
             last_update_date = SYSDATE --added by abhallam on 12-apr-2018
      WHERE  xcl.order_no = p_order_number
      AND    xcl.cont_name = p_cont_name;

      UPDATE xxwsh_containers xc
      SET    staged_truck_id  = DECODE(p_stagged_flag, 'Y', p_header_truck, NULL) --added by abhallam on 25-apr-2018
            ,
             last_update_date = SYSDATE
      WHERE  xc.order_no = p_order_number
      AND    xc.cont_name = p_cont_name;

      lv_status := 'S';

    EXCEPTION
      WHEN others THEN
        lv_status := 'F';
        --log ( l_prc,'Error while updating staged_truck_id: ' || sqlerrm);
    END;

    -- ====================================
    BEGIN

      --log ( l_prc,'before getting sum of cont_qty and gross_wt for truck. ' || to_char(sysdate,'DD-MON-RRRR HH:MI:SS AM'));

      SELECT SUM(tr.cont_qty) cont_qty, SUM(tr.cont_gross_wt) cont_gross_wt
      INTO   lv_truck_quantity, lv_truck_weight
      FROM   (SELECT NVL(xc.cont_qty, 0) cont_qty, NVL(xc.cont_gross_wt, 0) cont_gross_wt
              FROM   xxwsh_containers xc
              WHERE  xc.truck_id_2 = p_header_truck
              UNION ALL
              SELECT NVL(xc.cont_qty, 0) cont_qty, NVL(xc.cont_gross_wt, 0) cont_gross_wt
              FROM   xxwsh_containers xc
              WHERE  xc.truck_id_1 = p_header_truck
              AND    xc.truck_id_2 IS NULL) tr;

      --log ( l_prc,'before getting sum of cont_qty and gross_wt for staged_truck. ' || to_char(sysdate,'DD-MON-RRRR HH:MI:SS AM'));

      --changes start - by abhallam on 03-may-2018
      SELECT SUM(NVL(xc.cont_gross_wt, 0)) cont_gross_wt
      INTO   lv_stagged_weight
      FROM   xxwsh_containers xc
      WHERE  xc.staged_truck_id IS NOT NULL
      AND    xc.staged_truck_id = p_header_truck;

      --log ( l_prc,'after getting sum of cont_qty and gross_wt for staged_truck. ' || to_char(sysdate,'DD-MON-RRRR HH:MI:SS AM'));

      IF (p_header_truck IS NOT NULL) THEN
        IF (p_ship_set_name IS NOT NULL AND p_org = SUBSTR(p_ship_set_name, 1, 3)) THEN
          -- Single Point
          l_shipment_type := 'I';

          SELECT NVL(SUM(xc.cont_gross_wt), 0)
          INTO   l_truck_shipment_wt
          FROM   xxwsh_containers xc
          WHERE  xc.staged_truck_id = p_header_truck
          AND    xc.ship_from_org_code = p_org
          AND    xc.ship_set_name = p_ship_set_name;

          SELECT DECODE(COUNT(1), 0, 'N', 'Y')
          INTO   l_truck_shipment_exists
          FROM   xxwsh_truck_shipment xts
          WHERE  xts.truck_id = p_header_truck
          AND    xts.shipment_type = l_shipment_type;

          IF (l_truck_shipment_exists = 'Y') THEN
            -- Update
            UPDATE xxwsh_truck_shipment xts
            SET    xts.total_weight = l_truck_shipment_wt
            WHERE  xts.truck_id = p_header_truck
            AND    xts.shipment_type = l_shipment_type;
          ELSE
            INSERT INTO xxwsh_truck_shipment
              (truck_id, shipment_type, total_weight, creation_date)
            VALUES
              (p_header_truck, l_shipment_type, l_truck_shipment_wt, SYSDATE);
          END IF;
        END IF; --IF (    p_ship_set_name IS NOT NULL
      END IF; -- if l_truck_id is not null
      --changes end - by abhallam on 03-may-2018

      p_truck_weight   := NVL(lv_truck_weight, 0);
      p_truck_quantity := NVL(lv_truck_quantity, 0);
      p_stagged_weight := NVL(lv_stagged_weight, 0);
      /*log ( l_prc,'lv_truck_weight = ' || lv_truck_weight ||
      'lv_truck_quantity = ' || lv_truck_quantity ||
      'lv_stagged_weight = ' || lv_stagged_weight);*/
      COMMIT;
    EXCEPTION
      WHEN others THEN
        dbms_output.put_line(sqlerrm);
        --log ( l_prc,'Error while inserting into INTERFACE.xxwsh_truck_shipment: ' || sqlerrm);
    END;

    p_status := lv_status;
  END update_stagged_flag;

  ----------------------------------------------------------------------------------------------------------------------------

  ----------------------------------------------------------------------------------------------------------------------
  --      Name: XXBBNA_UPDATE_STAGGED_FLAG
  --
  --    Output parameters:
  --        p_status        : Returns the status  from the program.
  --
  --      procedure: Procedure to update the stagged flag for the application
  --
  ----------------------------------------------------------------------------------------------------------------------
  PROCEDURE xxbbna_update_stagged_flag(p_order_number       NUMBER,
                                       p_cont_name          VARCHAR2,
                                       p_ship_from_org_code VARCHAR2,
                                       p_org                VARCHAR2,
                                       p_ship_set_name      VARCHAR2,
                                       p_stagged_flag       VARCHAR2,
                                       p_user_id            NUMBER,
                                       p_header_truck       IN VARCHAR2,
                                       p_load_flag          IN VARCHAR2,
                                       p_status             OUT VARCHAR2,
                                       p_truck_weight       OUT NUMBER,
                                       p_truck_quantity     OUT NUMBER,
                                       p_stagged_weight     OUT NUMBER) IS
    l_prc VARCHAR2(100) := 'xxbbna_update_stagged_flag'; --added by by abhallam on 12-apr-2018
  BEGIN

    --log ( l_prc,'START');

    /*log ( l_prc,'p_order_number=' || p_order_number ||
    ',p_cont_name=' || p_cont_name ||
    ',p_ship_from_org_code=' || p_ship_from_org_code ||
    ',p_org=' || p_org ||
    ',p_ship_set_name=' || p_ship_set_name ||
    ',p_stagged_flag=' || p_stagged_flag ||
    ',p_user_id=' || p_user_id ||
    ',p_header_truck=' || p_header_truck ||
    ',p_load_flag=' || p_load_flag );*/

    update_stagged_flag(p_order_number,
                        p_cont_name,
                        p_ship_from_org_code,
                        p_org,
                        p_ship_set_name,
                        p_stagged_flag,
                        p_user_id,
                        p_header_truck,
                        p_load_flag,
                        p_status,
                        p_truck_weight,
                        p_truck_quantity,
                        p_stagged_weight);

    /* log ( l_prc,'END. p_truck_weight = ' || p_truck_weight ||
    ',p_truck_quantity = ' || p_truck_quantity ||
    ',p_stagged_weight = ' || p_stagged_weight);*/
  EXCEPTION
    WHEN others THEN
      dbms_output.put_line(sqlerrm);
      --log ( l_prc,'Error: ' || sqlerrm);
  END xxbbna_update_stagged_flag;

  -- Procedure for Checking the Version of APP derived from FND Lookups (XXBBNA_YMS_APP_VERSION)
----------------------------------------------------------------------------------------------------------------------------
    PROCEDURE xxbbna_yms_app_version_list(x_app_version OUT appversion) IS
    l_app_version appversion;
  BEGIN
    SELECT meaning, description
    BULK COLLECT INTO l_app_version
    FROM fnd_lookup_values_vl
    WHERE 1 = 1
    AND lookup_type = 'XXBBNA_YMS_APP_VERSION'
    AND (end_date_active IS NULL OR end_date_active>SYSDATE);

    x_app_version := l_app_version;
  EXCEPTION
    WHEN others THEN
      dbms_output.put_line('YMS App Version Exception ----- :'||sqlerrm);
  END xxbbna_yms_app_version_list;

  PROCEDURE set_user_session(p_user_id NUMBER) IS

    v_resp_id NUMBER;
    v_app_id  NUMBER;
    v_user_id NUMBER;
    x_status  VARCHAR2(255);
    x_ret_msg VARCHAR2(255);

  BEGIN

    BEGIN

      SELECT DISTINCT fr.responsibility_id, frx.application_id
      INTO   v_resp_id, v_app_id
      FROM   apps.fnd_responsibility frx, apps.fnd_responsibility_tl fr
      WHERE  fr.responsibility_id = frx.responsibility_id
      AND    LOWER(fr.responsibility_name) LIKE LOWER('BSNA Shipping')
      AND    fr.language = 'US';

      v_user_id := p_user_id;

    EXCEPTION
      WHEN others THEN
        dbms_output.put_line('Exception Getting the resposibility and user iD------ ' || sqlerrm);
        x_status  := 'F' || sqlerrm;
        x_ret_msg := 'Exception Getting the resposibility------ ' || sqlerrm;
    END;

    BEGIN
      fnd_global.apps_initialize(user_id => p_user_id, resp_id => v_resp_id, resp_appl_id => v_app_id);
      LOG('log_in', 'apps_initialize p_user_name=' || p_user_id);
      COMMIT;
    EXCEPTION
      WHEN others THEN
        dbms_output.put_line('Exception setting the user session user iD------ ' || sqlerrm);
        x_status  := 'F' || sqlerrm;
        x_ret_msg := 'Exception setting the user session------ ' || sqlerrm;

    END;

  END set_user_session;
  ----------------------------------------------------------------------------------------------------------------------------
END xxbbna_warehouse_process_pkg;
/

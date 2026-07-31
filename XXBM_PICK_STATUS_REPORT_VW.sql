CREATE OR REPLACE VIEW APPS_RO.XXBM_PICK_STATUS_REPORT_VW AS
SELECT 
--wdd might be WSH_DELIVERY_DETAILS
wdd.source_Header_number order_number,
        wdd.last_update_date,
        wdd.delivery_detail_id,
        wdd.released_status,
        wdd.source_line_Number,
        wdd.source_line_id line_id,
        wdd.organization_id,
        wdd.inventory_item_id,
        xc.cont_name,
        xc.ship_set_name cont_ship_set,
        xc.truck_id_1 single_pt_truck,
        xc.truck_id_2 direct_truck,
        wda.delivery_id,
        mp.organization_code shipping_org,
        xc.ship_from_org_code cont_org,
        xc.cont_qty,
        wdd.requested_quantity,
        --IF THEN ELSE statement. IF wdd.released_status === C, then do the nested logic, ELSE return N
        DECODE(wdd.released_status,
                        'C',
                        --IF oe_interfaced_flag IS NULL THEN return wnd.name, ELSE go to next 
                        DECODE(wdd.oe_interfaced_flag,
                                       NULL,
                                       wnd.name,
                                       --IF X then NULL else if Y then NULL else return wnd.name
                                       DECODE(wdd.inv_interfaced_flag,
                                                      'X',
                                                      NULL,
                                                      'Y',
                                                      NULL,
                                                      --wnd might be wsh_new_deliveries
                                                      wnd.name)),
                       'N') interface_trip_stop_delivery,
        --
        (SELECT NVL(SUM(moq.transaction_quantity),0)
            FROM apps.mtl_onhand_quantities moq
         WHERE moq.inventory_item_id     = wdd.inventory_item_id
               AND moq.organization_id   = wdd.organization_id
               AND moq.subinventory_code = 'FG')  fg_qoh,
        --
        (SELECT NVL(SUM(mr.reservation_quantity),0)
            FROM inv.mtl_reservations mr
         WHERE mr.demand_source_line_id = wdd.source_line_id
               AND mr.inventory_item_id = wdd.inventory_item_id
               AND mr.organization_id   = wdd.organization_id
               AND mr.supply_source_type_id = 13 -- Inventory
               AND NVL(mr.subinventory_code, 'FG') = 'FG') fg_reserved_qty,
        cc.user_name cont_created_by,
        xc.creation_date cont_creation_date,
        cu.user_name cont_updated_by,
        xc.last_update_date cont_update_date,
        wnd.confirm_date,
        wnd.confirmed_by,
        --
        xc.cont_gross_wt,
        --
        xc.single_pt_truck_loaded_date single_pt_truck_loaded_date,
        spusr.user_name single_pt_truck_loaded_by,
        xc.direct_truck_loaded_date direct_truck_loaded_date,
        dirusr.user_name direct_truck_loaded_by,
        xtssp.ship_date single_point_ship_date,
        xtsdir.ship_date direct_ship_date,
        xc.load_truck_flag_single_pt ,
        xc.load_truck_flag_direct_load ,
        sysdate etl_load_date
   FROM interface.xxwsh_containers xc,
        wsh.wsh_delivery_details wdd,
        wsh.wsh_delivery_assignments wda,
        wsh.wsh_new_deliveries wnd,
        inv.mtl_parameters mp,
        applsys.fnd_user cc,
        applsys.fnd_user cu,
        applsys.fnd_user spusr,
        applsys.fnd_user dirusr,
        interface.xxwsh_truck_shipment xtssp,
        interface.xxwsh_truck_shipment xtsdir
   WHERE 1=1
     and wdd.delivery_detail_id = xc.delivery_detail_id (+) 
     AND wda.delivery_detail_id = wdd.delivery_detail_id
     AND wnd.delivery_id (+)= wda.delivery_id
     AND mp.organization_id = wdd.organization_id
     AND cc.user_id (+)= xc.created_by
     AND cu.user_id (+)= xc.last_updated_by
     --
     AND spusr.user_id  (+)= xc.single_pt_truck_loaded_by
     AND dirusr.user_id (+)= xc.direct_truck_loaded_by
     --
     AND xtssp.truck_id (+)= xc.truck_id_1
     AND xtssp.shipment_type (+)= 'I'  -- single point
     --
     AND xtsdir.truck_id (+)= xc.truck_id_2
     AND xtsdir.shipment_type (+)= 'S' -- direct
     AND wdd.last_update_date >= sysdate - 365
;

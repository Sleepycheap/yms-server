using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ButlerWarehouseApp.DataModel
{
    /// <summary>
    /// Class for defining the ScanItem Object
    /// </summary>
    public class ScanningItem 
    {
        public ScanningItem()
        {
            this.ID = 0;
            this.SequenceNumber = 0;
            this.PartID = 0;
            this.Container = "";
            this.OrderNumber = 0;
            this.HeaderDescription = "";
            this.ItemDescription = "";
            this.PartName = "";
            this.ImagePath = "";
            this.UnitPrice = 0;
            this.ShipSetName = "";
            this.GrossQuantity = 0;
            this.GrossWeight = 0;
            this.Location = "";
            this.ShippingInst = "";
            this.Category = "";
            this.TruckID = null;
            this.CustomerName = "";
            this.ShipFromOrgCode= "";
            this.CreatedDate = DateTime.Now;
            this.UpdatedDate = DateTime.Now;
            // added for buyouts on 20/04/2016
            this.ProjectName = "";
            this.PartNumber = "";
            this.QuantityOrdered = 0;
            this.OriginalPlant = "";
            this.QuantityShipped = 0;
            this.BackOrderQuantity = 0;
            this.ExtendedWeight = 0;
            this.LoadTruckFlag = "";
            this.StagedFlag = false;
            this.StaggedCheckBoxReadonlyFlag = false;
            this.TruckLoadButtonReadonlyFlag = false;
            this.staggedContent = "Stage / Load";
            this.ForeColorforList = "";
            this.StagedTruckID = "";
            //this.TruckDescription = "";
        }

        /// <summary>
        /// Constructor for setting the value during initialization
        /// </summary>
        /// <param name="_id"></param>
        /// <param name="_partID"></param>
        /// <param name="_partName"></param>
        /// <param name="_container"></param>
        /// <param name="_orderNumber"></param>
        /// <param name="_headerDescription"></param>
        /// <param name="_itemDescription"></param>
        /// <param name="_imagePath"></param>
        /// <param name="_unitPrice"></param>
        /// <param name="_shipSetName"></param>
        /// <param name="_grossQuantity"></param>
        /// <param name="_grossWeight"></param>
        /// <param name="_truckID"></param>
        /// <param name="_location"></param>
        /// <param name="_shippingInst"></param>
        /// <param name="_category"></param>
        /// <param name="_createdDate"></param>
        /// <param name="_updatedDate"></param>
        /// <param name="_customerName"></param>
        /// <param name="_shipFromOrgCode"></param>
        /// <param name="_projectName"></param>
        /// <param name="_partNumber"></param>
        /// <param name="_quantityOrdered"></param>
        /// <param name="_originalPlant"></param>
        /// <param name="_quantityShipped"></param>
        /// <param name="_backOrderQuantity"></param>
        /// <param name="_extendedWeight"></param>
        /// <param name="_sequenceNumber"></param>
        public ScanningItem(int _id, int _partID, String _partName, string _container, int _orderNumber, string _headerDescription, string _itemDescription, string _imagePath, decimal _unitPrice,string _shipSetName , decimal _grossQuantity, decimal _grossWeight, string _truckID, String _location, String _shippingInst, String _category,DateTime _createdDate,DateTime _updatedDate,String _customerName,String _shipFromOrgCode,
                            // added for buyouts on 20/04/2016
                            string _projectName, string _partNumber, decimal _quantityOrdered, string _originalPlant, decimal _quantityShipped, decimal _backOrderQuantity, decimal _extendedWeight, int _sequenceNumber, string _loadTruckFlag, bool _stagedFlag,  bool _TruckLoadButtonReadonlyFlag, bool _staggedCheckBoxReadonlyFlag, string _staggedContent, string _ForeColorforList,string _StagedTruckID)
        {
            this.ID = _id;
            this.SequenceNumber = _sequenceNumber;
            this.PartID = _partID;
            this.PartName = _partName;
            this.Container = _container;
            this.OrderNumber = _orderNumber;
            this.HeaderDescription = _headerDescription;
            this.ItemDescription = _itemDescription.ToLower();
            this.ImagePath = _imagePath;
            this.UnitPrice = _unitPrice;
            this.ShipSetName = _shipSetName;
            this.GrossQuantity = _grossQuantity;
            this.GrossWeight = _grossWeight;
            this.TruckID = _truckID;
            this.Location = _location;
            this.ShippingInst = _shippingInst;
            this.Category = _category;
            this.CreatedDate = _createdDate;
            this.UpdatedDate = _updatedDate;
            this.CustomerName = _customerName;
            this.ShipFromOrgCode= _shipFromOrgCode;
            // added for buyouts on 20/04/2016
            this.PartNumber = _partNumber;
            this.QuantityOrdered = _quantityOrdered;
            this.OriginalPlant = _originalPlant;
            this.QuantityShipped = _quantityShipped;
            this.BackOrderQuantity = _backOrderQuantity;
            this.LoadTruckFlag = _loadTruckFlag;
            this.StagedFlag = _stagedFlag;
            this.StaggedCheckBoxReadonlyFlag = _staggedCheckBoxReadonlyFlag;
            this.TruckLoadButtonReadonlyFlag = _TruckLoadButtonReadonlyFlag;
            this.staggedContent = _staggedContent;
            this.ForeColorforList = _ForeColorforList;
            this.StagedTruckID = _StagedTruckID;
            //this.TruckDescription = _truckDescription;
        }
        
        // Instance variable declaration
        //The Id property is marked as the Primary Key
        [SQLite.PrimaryKey, SQLite.AutoIncrement]
        public int ID { get; set; }

        public int SequenceNumber { get; set; }
        public int PartID { get; set; }
        public string PartName { get; set; }
        public string Container{ get; set; }
        public int OrderNumber { get; set; }
        public string ItemDescription { get; set; }
        public string HeaderDescription { get; set; }
        public string ImagePath { get; set; }
        public decimal UnitPrice { get; set; }
        public string ShipSetName { get; set; }
        public decimal GrossQuantity { get; set; }
        public decimal GrossWeight { get; set; }
        public string TruckID { get; set; }
        public string ShippingInst { get; set; }
        public string Category { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public string Location { get; set; }
        public string CustomerName { get; set; }
        public string ShipFromOrgCode { get; set; }
        // added for buyouts on 20/04/2016
        public string ProjectName { get; set; }
        public string PartNumber { get; set; }
        public decimal QuantityOrdered { get; set; }
        public string OriginalPlant { get; set; }
        public decimal QuantityShipped { get; set; }
        public decimal BackOrderQuantity{ get; set; }
        public decimal ExtendedWeight{ get; set; }
        public string LoadTruckFlag { get; set; }
        public bool StagedFlag { get; set; }
        public bool StaggedCheckBoxReadonlyFlag { get; set; }
        public bool TruckLoadButtonReadonlyFlag { get; set; }
        public string staggedContent { get; set; }

        //Object for storing Truck and Description
        //public string TruckDescription { get; set; }
        public string ForeColorforList { get; set; }

        public string StagedTruckID { get; set; }

        public override string ToString()
        {
            return this.PartName;
        }
    }
}

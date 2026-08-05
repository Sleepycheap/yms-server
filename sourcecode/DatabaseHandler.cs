using ButlerWarehouseApp.DataModel;
using ButlerWarehouseApp.DataModel.Utils;
using ButlerWarehouseApp.Utils;
using SQLite;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;


/*
		public void RunInTransaction (Action action)
		{
			try {
				var savePoint = SaveTransactionPoint ();
				action ();
				Release (savePoint);
			} catch (Exception) {
				Rollback ();
				throw;
			}
		}


		public string SaveTransactionPoint ()
		{
			int depth = Interlocked.Increment (ref _transactionDepth) - 1;
			string retVal = "S" + _rand.Next (short.MaxValue) + "D" + depth;

			try {
				Execute ("savepoint " + retVal);
			} catch (Exception ex) {
				var sqlExp = ex as SQLiteException;
				if (sqlExp != null) {
					// It is recommended that applications respond to the errors listed below 
					//    by explicitly issuing a ROLLBACK command.
					// TODO: This rollback failsafe should be localized to all throw sites.
					switch (sqlExp.Result) {
					case SQLite3.Result.IOError:
					case SQLite3.Result.Full:
					case SQLite3.Result.Busy:
					case SQLite3.Result.NoMem:
					case SQLite3.Result.Interrupt:
						RollbackTo (null, true);
						break;
					}
				} else {
					Interlocked.Decrement (ref _transactionDepth);
				}

				throw;
			}

			return retVal;
		}


    		public void RollbackTo (string savepoint)
		{
			RollbackTo (savepoint, false);
		}



	void RollbackTo (string savepoint, bool noThrow)
		{
			// Rolling back without a TO clause rolls backs all transactions 
			//    and leaves the transaction stack empty.   
			try {
				if (String.IsNullOrEmpty (savepoint)) {
					if (Interlocked.Exchange (ref _transactionDepth, 0) > 0) {
						Execute ("rollback");
					}
				} else {
					DoSavePointExecute (savepoint, "rollback to ");
				}   
			} catch (SQLiteException) {
				if (!noThrow)
					throw;
            
			}
			// No need to rollback if there are no transactions open.
		}





*/


namespace ButlerWarehouseApp.DataModel
{
    /// <summary>
    /// This class for perform all database CRUD operations  
    /// </summary>
    public partial class DatabaseHandler
    {
        SQLiteConnection dbConn;
        //Create Tabble 
        /// <summary>
        /// 
        /// </summary>
        /// <param name="DB_PATH"></param>
        /// <returns></returns>
        public async Task<bool> onCreate(string DB_PATH)
        {
            try
            {
                if (!CheckFileExists(DB_PATH).Result)
                {
                    using (dbConn = new SQLiteConnection(DB_PATH))
                    {
                        dbConn.CreateTable<ScanningItem>();
                    }
                }
                return true;
            }
            catch
            {
                return false;
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="fileName"></param>
        /// <returns></returns>
        private async Task<bool> CheckFileExists(string fileName)
        {
            try
            {
                var store = await Windows.Storage.ApplicationData.Current.LocalFolder.GetFileAsync(fileName);
                return true;
            }
            catch
            {
                return false;
            }
        }

        // Insert the new Log in the Log table. 
        public void DeleteLog()
        {
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    dbConn.RunInTransaction(() =>
                    {
                        dbConn.DeleteAll<Log>();
                    });
                }
            }
            catch (Exception exp)
            {

            }
        }
        public void writeLog(Log newLog)
        {
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    dbConn.RunInTransaction(() =>
                    {
                        dbConn.Insert(newLog);
                    });
                }
            }
            catch (Exception exp)
            {

            }
        }
        // Insert the new Log in the Log table. 
        public void createIPConfig(IPConfiguration ipConfig)
        {
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    dbConn.RunInTransaction(() =>
                    {
                        dbConn.Insert(ipConfig);
                    });
                }
            }
            catch (Exception exp)
            {
                exp.Message.ToString();

            }
        }
        // Retrieve the IP address from DB
        public IPConfiguration getIPConfigDetail()
        {
            IPConfiguration ipConfig = null;
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    ipConfig = (IPConfiguration)dbConn.Query<IPConfiguration>("select * from IPConfiguration").First();
                }
            }
            catch (InvalidOperationException exp)
            {
                ipConfig = null;
            }
            catch (Exception exp)
            {
                ipConfig = null;
            }
            return ipConfig;
        }
        //Delete specific Order lines
        public void deleteIPConfig()
        {
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    List<IPConfiguration> existingOrder = dbConn.Query<IPConfiguration>("Delete  from IPConfiguration");
                }
            }
            catch (Exception exp)
            {
                CommonUtility.showMessageBox("Exception while deleting IPConfiguration" + exp.Message.ToString(), " Exception");
            }
        }
        // Insert the new Totoal weight & Quantity in the Gross Table .
        public void insertTruckWeightQuantity(GrossObject newObj)
        {
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    dbConn.RunInTransaction(() =>
                    {
                        dbConn.Insert(newObj);
                    });
                }
            }
            catch (Exception exp)
            {

            }
        }
        // Insert the new part in the Scan table. 
        public void InsertItem(ScanningItem newItem)
        {
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    dbConn.RunInTransaction(() =>
                    {
                        dbConn.Insert(newItem);
                    });
                }
            }
            catch (Exception exp)
            {

            }
        }
        // Insert the new part in the Scan table. 
        public void UpdateItem(ScanningItem updateItem)
        {
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    dbConn.RunInTransaction(() =>
                    {
                        dbConn.Update(updateItem);
                    });
                }
            }
            catch (Exception exp)
            {

            }
        }

        // Retrieve the all Items list from the database. 222
        public ObservableCollection<ScanningItem> getOrderLines(String orderNumber)
        {
            ObservableCollection<ScanningItem> itemList = null;
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    List<ScanningItem> myCollection = null;
                    if (orderNumber.Equals(""))
                    {
                        myCollection = dbConn.Query<ScanningItem>("select * from ScanningItem ORDER BY sequencenumber");
                    }
                    else
                    {
                        myCollection = dbConn.Query<ScanningItem>("select * from ScanningItem where OrderNumber = ? ORDER BY sequencenumber", orderNumber);
                    }
                    itemList = new ObservableCollection<ScanningItem>(myCollection);
                }
            }
            catch (Exception exp)
            {
                CommonUtility.showMessageBox("Exception while selecting ScanningItem" + exp.Message.ToString(), " Exception");
            }
            return itemList;
        }

        // Retrieve the all Items list from the database for particular Category 
        public ObservableCollection<ScanningItem> getOrderLinesByCategory(String orderNumber, String categoryType)
        {
            ObservableCollection<ScanningItem> itemList = null;
            try
            {
                List<ScanningItem> myCollection = null;
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    if (!orderNumber.Equals(""))
                    {
                        object[] parameter = new object[2];
                        parameter[0] = orderNumber;
                        parameter[1] = categoryType;
                        myCollection = dbConn.Query<ScanningItem>("select * from ScanningItem where OrderNumber = ? and  Category = ? ORDER BY sequencenumber", parameter);
                        itemList = new ObservableCollection<ScanningItem>(myCollection);
                    }
                    else
                    {
                        myCollection = dbConn.Query<ScanningItem>("select * from ScanningItem where Category = ? ORDER BY sequencenumber", categoryType);
                        itemList = new ObservableCollection<ScanningItem>(myCollection);
                    }
                }
            }
            catch (Exception exp)
            {
                CommonUtility.showMessageBox("Exception while selecting ScanningItem" + exp.Message.ToString(), " Exception");
            }
            return itemList;
        }
        // Retrieve the all Items list from the database for particular Truck
        public ObservableCollection<ScanningItem> getOrderLinesByTruck(String orderNumber, String truckID)
        {
            ObservableCollection<ScanningItem> itemList = null;
            try
            {
                List<ScanningItem> myCollection = null;
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    if (!orderNumber.Equals(""))
                    {
                        object[] parameter = new object[2];
                        parameter[0] = orderNumber;
                        parameter[1] = truckID;
                        myCollection = dbConn.Query<ScanningItem>("select * from ScanningItem where OrderNumber = ? and  TruckID = ? ORDER BY container*1,container", parameter);
                        itemList = new ObservableCollection<ScanningItem>(myCollection);
                    }
                    else
                    {
                        myCollection = dbConn.Query<ScanningItem>("select * from ScanningItem where TruckID = ? ORDER BY container*1,container", truckID);
                        itemList = new ObservableCollection<ScanningItem>(myCollection);
                    }
                }
            }
            catch (Exception exp)
            {
                CommonUtility.showMessageBox("Exception while selecting ScanningItem" + exp.Message.ToString(), " Exception");
            }
            return itemList;
        }
        /// <summary>
        /// Retrieve the distinct Category list from the database. 
        /// </summary>
        /// <param name="orderNumber"></param>
        /// <returns></returns>
        public ObservableCollection<ScanningItem> getCategory(String orderNumber)
        {
            ObservableCollection<ScanningItem> cattegoryList = null;
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    // Query was modified on 02/27/17 to add GrossWeight along with each Category

                    List<ScanningItem> myCollection = null;
                    if (!orderNumber.Equals(""))
                    {
                        myCollection = dbConn.Query<ScanningItem>("select  distinct Category,sum(GrossWeight) GrossWeight  FROM ScanningItem  where OrderNumber = ? group by Category ORDER BY Category", orderNumber);
                    }
                    else
                    {
                        myCollection = dbConn.Query<ScanningItem>("select  distinct Category,sum(GrossWeight) GrossWeight  FROM ScanningItem group by Category ORDER BY Category");
                    }
                    cattegoryList = new ObservableCollection<ScanningItem>(myCollection);
                }
            }
            catch (Exception exp)
            {
                CommonUtility.showMessageBox("Exception while selecting Category" + exp.Message.ToString(), " Exception");
            }
            return cattegoryList;
        }

        /// <summary>
        /// Retrieve overall weight of Category from the database. 
        /// </summary>
        /// <param name="orderNumber"></param>
        /// <returns></returns>
        public ScanningItem getTotalCategoryWeight(String orderNumber)
        {
            ScanningItem totalWeight = null;
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    if (!orderNumber.Equals(""))
                    {
                        object[] parameter = new object[1];
                        parameter[0] = orderNumber;
                        totalWeight = (ScanningItem)dbConn.Query<ScanningItem>("select sum(GrossWeight) GrossWeight FROM ScanningItem where OrderNumber = ?", parameter).First();
                    }
                    else
                    {
                        totalWeight = (ScanningItem)dbConn.Query<ScanningItem>("select sum(GrossWeight) GrossWeight FROM ScanningItem ").First();
                    }
                }
            }
            catch (InvalidOperationException exp)
            {
                totalWeight = new ScanningItem();
                totalWeight.GrossWeight = 0;
            }
            catch (Exception exp)
            {
                totalWeight = new ScanningItem();
                totalWeight.GrossWeight = 0;
            }

            return totalWeight;
        }

        // New method added by Aruna, for scanned items list, in all categiries;

      

        public ObservableCollection<ScanningItem> getScannedItemsList(string OrderNumber, string SelectedCategry, [Optional] bool Loaded, [Optional]bool Picked, [Optional]bool Unpicked, [Optional]bool Staged, [Optional]string TruckID, [Optional]string orgCode)
        {

            // string TranscationTypeParam = string.Empty;
            ObservableCollection<ScanningItem> itemList = null;
            List<ScanningItem> myCollection = null;
            string SQLQuery = string.Empty;
            // string Wherecondition = string.Empty;
            // string SQLQuery = SqlQueryforData(OrderNumber, SelectedCategry, Loaded, Picked, Unpicked, Staged);
            // only Load
            if (Loaded == true && Picked == false && Unpicked == false && Staged == false)
            {
                SQLQuery = "select * from ScanningItem where (TruckID IS NOT NULL AND TruckID!='' and StagedFlag=0)  ";

            }
             // load or stage
            else if (Loaded == true && Picked == false && Unpicked == false && Staged == true)
            {
                SQLQuery = "select * from ScanningItem where (TruckID IS NOT NULL AND TruckID!='' or StagedFlag=1)  ";
            }
            // only picked
            else if (Loaded == false && Picked == true && Unpicked == false && Staged == false)
            {
                SQLQuery = "select * from ScanningItem where (HeaderDescription IN('DIRECT SHIPMENTS', 'SINGLE POINT')  and (TruckID = '' or TruckID  is null) and StagedFlag=0)  ";
                // // select  ifnull(sum(GrossWeight),0) GrossWeight  FROM ScanningItem  where Category=?  and  HeaderDescription IN('DIRECT SHIPMENTS','SINGLE POINT') and (TruckID='' or TruckID is null)
            }
            // picked or staged
            else if (Loaded == false && Picked == true && Unpicked == false && Staged == true)
            {
                SQLQuery = "select * from ScanningItem where (HeaderDescription IN('DIRECT SHIPMENTS', 'SINGLE POINT')  and (TruckID = '' or TruckID  is null) or StagedFlag=1)  ";
            }
            // unpicked
            else if (Loaded == false && Picked == false && Unpicked == true && Staged == false)
            {
                SQLQuery = "select * from ScanningItem where HeaderDescription= 'UNPICKED ITEMS' and ((TruckID == '' or TruckID is null) and StagedFlag=0) ";
            }
            // unpicked ot stagged
            else if (Loaded == false && Picked == false && Unpicked == true && Staged == true)
            {
                SQLQuery = "select * from ScanningItem where HeaderDescription= 'UNPICKED ITEMS' and (TruckID == '' or TruckID is null) or StagedFlag=1 ";
            }
            else if (Loaded == true && Picked == true && Unpicked == false && Staged == false)
            {
                SQLQuery = "select * from ScanningItem where  (HeaderDescription IN('DIRECT SHIPMENTS','SINGLE POINT') and (TruckID != '' or TruckID is not null) and StagedFlag=0) ";

            }
            else if (Loaded == true && Picked == true && Unpicked == false && Staged == true)
            {
                SQLQuery = "select * from ScanningItem where  (HeaderDescription IN('DIRECT SHIPMENTS','SINGLE POINT') and (TruckID != '' or TruckID is not null) or StagedFlag=1) ";
            }
            else if (Loaded == true && Picked == false && Unpicked == true && Staged == false)
            {
                SQLQuery = "select * from ScanningItem where ((TruckID IS NOT NULL AND TruckID!='' and StagedFlag=0) or HeaderDescription= 'UNPICKED ITEMS') ";
            }
            else if (Loaded == true && Picked == false && Unpicked == true && Staged == true)
            {
                SQLQuery = "select * from ScanningItem where ((TruckID IS NOT NULL AND TruckID!='' or StagedFlag=1) or HeaderDescription= 'UNPICKED ITEMS') ";
            }
            else if (Loaded == false && Picked == true && Unpicked == true && Staged == false)
            {
                SQLQuery = "select * from ScanningItem where ((TruckID=='' or TruckID is null ) and StagedFlag=0  and HeaderDescription IN('DIRECT SHIPMENTS','SINGLE POINT','UNPICKED ITEMS')) ";
            }
            else if (Loaded == false && Picked == true && Unpicked == true && Staged == true)
            {
                SQLQuery = "select * from ScanningItem where ((TruckID=='' or TruckID is null ) or StagedFlag=1  and HeaderDescription IN('DIRECT SHIPMENTS','SINGLE POINT','UNPICKED ITEMS')) ";
            }
            else if (Loaded == false && Picked == false && Unpicked == false && Staged == true)
            {
                SQLQuery = "select * from ScanningItem where 1=1 and StagedFlag=1 ";
            }
            else if (Loaded == true && Picked == true && Unpicked == true && Staged == false)
            {
                SQLQuery = "select * from ScanningItem where 1=1 and StagedFlag=0 ";
            }
            else if (Loaded == true && Picked == true && Unpicked == true && Staged == true)
            {
                SQLQuery = "select * from ScanningItem where 1=1 ";
            }

            if (!OrderNumber.Equals(""))
            {
                if (SQLQuery != "")
                    SQLQuery += " and OrderNumber = '" + OrderNumber + "'";
                else
                    SQLQuery = "select * from ScanningItem where 1=1 and OrderNumber = '" + OrderNumber + "'";
            }
            if (SelectedCategry == "" || SelectedCategry.ToUpper() == "ALL")
            {
                SelectedCategry = "All";
            }
            if (SelectedCategry.ToUpper() != "ALL")
            {
                if (!SQLQuery.Equals(""))
                    SQLQuery += " and  Category = '" + SelectedCategry + "'";
                else
                    SQLQuery = "select * from ScanningItem where 1=1 and  Category = '" + SelectedCategry + "'";

            }
            SQLQuery += " ORDER BY sequencenumber";

            using (var dbConn = new SQLiteConnection(App.DB_PATH))
            {
                myCollection = dbConn.Query<ScanningItem>(SQLQuery);
                itemList = new ObservableCollection<ScanningItem>(myCollection);
            }
            return itemList;
        }

        public ScanningItem getLoadedCategoryWeightNew(string OrderNumber, string SelectedCategry, [Optional] bool Loaded, [Optional]bool Picked, [Optional]bool Unpicked, [Optional]bool Staged)
        {
            string SQLQuery = string.Empty;
            ScanningItem totalWeight = null;
            // SQLQuery = SqlQueryforData(OrderNumber, SelectedCategry, Loaded, Picked, Unpicked, Staged,true);
            if (Loaded == true && Picked == false && Unpicked == false && Staged == false)
            {
                SQLQuery = "select ifnull(sum(GrossWeight),0) GrossWeight from ScanningItem where  Category='"+ SelectedCategry+"'  and (TruckID IS NOT NULL AND TruckID!='' and StagedFlag=0)  ";

            }
            else if (Loaded == true && Picked == false && Unpicked == false && Staged == true)
            {
                SQLQuery = "select ifnull(sum(GrossWeight),0) GrossWeight from ScanningItem where Category='" + SelectedCategry + "'  and(TruckID IS NOT NULL AND TruckID!='' or StagedFlag=1)  ";
            }
            else if (Loaded == false && Picked == true && Unpicked == false && Staged == false)
            {
                SQLQuery = "select ifnull(sum(GrossWeight),0) GrossWeight from ScanningItem where Category='"+ SelectedCategry +"' and (HeaderDescription IN('DIRECT SHIPMENTS', 'SINGLE POINT')  and (TruckID = '' or TruckID  is null) and StagedFlag=0)  ";
            }
            else if (Loaded == false && Picked == true && Unpicked == false && Staged == true)
            {
                SQLQuery = "select ifnull(sum(GrossWeight),0) GrossWeight from ScanningItem where Category='" + SelectedCategry + "' and (HeaderDescription IN('DIRECT SHIPMENTS', 'SINGLE POINT')  and (TruckID = '' or TruckID  is null) or StagedFlag=1)  ";
            }
            else if (Loaded == false && Picked == false && Unpicked == true && Staged == false)
            {
                SQLQuery = "select ifnull(sum(GrossWeight),0) GrossWeight from ScanningItem where Category='" + SelectedCategry + "' and HeaderDescription= 'UNPICKED ITEMS' and ((TruckID == '' or TruckID is null) and StagedFlag=0) ";
            }
            else if (Loaded == false && Picked == false && Unpicked == true && Staged == true)
            {
                SQLQuery = "select ifnull(sum(GrossWeight),0) GrossWeight from ScanningItem where HeaderDescription= 'UNPICKED ITEMS' and (TruckID == '' or TruckID is null) or StagedFlag=1 and Category='"+ SelectedCategry+"'";
            }
            else if (Loaded == true && Picked == true && Unpicked == false && Staged == false)
            {
                SQLQuery = "select ifnull(sum(GrossWeight), 0) GrossWeight from ScanningItem where  (HeaderDescription IN('DIRECT SHIPMENTS', 'SINGLE POINT') and(TruckID != '' or TruckID is not null) and StagedFlag = 0)  and Category = '" + SelectedCategry +"'";
            }
            else if (Loaded == true && Picked == true && Unpicked == false && Staged == true)
            {
                SQLQuery = "select ifnull(sum(GrossWeight), 0) GrossWeight from ScanningItem where  (HeaderDescription IN('DIRECT SHIPMENTS', 'SINGLE POINT') and(TruckID != '' or TruckID is not null) or StagedFlag = 1)  and Category = '" + SelectedCategry + "'";
            }

            else if (Loaded == true && Picked == false && Unpicked == true && Staged == false)
            {
                SQLQuery = "select ifnull(sum(GrossWeight),0) GrossWeight from ScanningItem where ((TruckID IS NOT NULL AND TruckID!='' and StagedFlag=0) or HeaderDescription= 'UNPICKED ITEMS') and Category = '" + SelectedCategry + "'";
            }
            else if (Loaded == true && Picked == false && Unpicked == true && Staged == true)
            {
                SQLQuery = "select ifnull(sum(GrossWeight),0) GrossWeight from ScanningItem where ((TruckID IS NOT NULL AND TruckID!='' or StagedFlag=1) or HeaderDescription= 'UNPICKED ITEMS') and Category = '" + SelectedCategry + "'";
            }
            else if (Loaded == false && Picked == true && Unpicked == true && Staged == false)
            {
                SQLQuery = "select ifnull(sum(GrossWeight),0) GrossWeight from ScanningItem where ((TruckID=='' or TruckID is null ) and StagedFlag=0  and HeaderDescription IN('DIRECT SHIPMENTS','SINGLE POINT','UNPICKED ITEMS')) and Category = '" + SelectedCategry + "'";
            }
            else if (Loaded == false && Picked == true && Unpicked == true && Staged == true)
            {
                SQLQuery = "select ifnull(sum(GrossWeight),0) GrossWeight from ScanningItem where ((TruckID=='' or TruckID is null ) or StagedFlag=1  and HeaderDescription IN('DIRECT SHIPMENTS','SINGLE POINT','UNPICKED ITEMS')) and Category = '" + SelectedCategry + "'";
            }
            else if (Loaded == false && Picked == false && Unpicked == false && Staged == true)
            {
                SQLQuery = "select ifnull(sum(GrossWeight),0) GrossWeight from ScanningItem where 1=1 and StagedFlag=1 and Category = '" + SelectedCategry + "'";
            }
            else if (Loaded == true && Picked == true && Unpicked == true && Staged == false)
            {
                SQLQuery = "select ifnull(sum(GrossWeight),0) GrossWeight from ScanningItem where 1=1 and StagedFlag=0 and Category = '" + SelectedCategry + "'";
            }
            else if (Loaded == true && Picked == true && Unpicked == true && Staged == true)
            {
                SQLQuery = "select ifnull(sum(GrossWeight),0) GrossWeight from ScanningItem where 1=1 and Category = '" + SelectedCategry + "'";
            }

            else if (Loaded == false && Picked == false && Unpicked == false && Staged == false)
            {
                SQLQuery = "select ifnull(sum(GrossWeight),0) GrossWeight from ScanningItem where 1=1 and  Category='" + SelectedCategry + "'";
            }
            if (!OrderNumber.Equals(""))
            {
                if (SQLQuery != "")
                    SQLQuery += " and OrderNumber = '" + OrderNumber + "'";
                else
                    SQLQuery = "select ifnull(sum(GrossWeight),0) GrossWeight from ScanningItem where 1=1 and  Category='" + SelectedCategry + "' and OrderNumber = '" + OrderNumber + "'";
            }
           

            using (var dbConn = new SQLiteConnection(App.DB_PATH))
            {
                totalWeight = (ScanningItem)dbConn.Query<ScanningItem>(SQLQuery).First();
            }
            return totalWeight;
        }

        public int chkStagedvalues()
        {
            string SQLQuery = "Select count(*) Count from ScanningItem where StagedFlag=1";
            int Count = 0;
            using (var dbConn = new SQLiteConnection(App.DB_PATH))
            {
                Count=dbConn.ExecuteScalar<int>(SQLQuery);
            }
            return Count;
        }
        public int ChkOrdervalues(string OrderNumber)
        {
            string SQLQuery = "select count(*) from scanningitem where (truckid!=null or truckid!='') and ordernumber='" + OrderNumber + "'";
            int Count = 0;
            using (var dbConn = new SQLiteConnection(App.DB_PATH))
            {
                Count = dbConn.ExecuteScalar<int>(SQLQuery);
            }
            return Count;
        }

        public ObservableCollection<ScanningItem> GetStagedItems()
        {
            List<ScanningItem> myCollection = null;
            ObservableCollection<ScanningItem> itemList = null;
            using (var dbConn = new SQLiteConnection(App.DB_PATH))
            {
                myCollection = dbConn.Query<ScanningItem>("Select * from ScanningItem where StagedFlag=1");
                itemList = new ObservableCollection<ScanningItem>(myCollection);
            }
            return itemList;
        }

        // Retrieve the all Items list from the database for particular Truck
        public ScanningItem getScannedItemExists(String orderNumber, String container)
        {
            ScanningItem itemExists = null;
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    if (!orderNumber.Equals(""))
                    {
                        object[] parameter = new object[2];
                        parameter[0] = orderNumber;
                        parameter[1] = container.ToUpper();
                        itemExists = (ScanningItem)dbConn.Query<ScanningItem>("select * from ScanningItem where OrderNumber = ? and  upper(Container) = ? ORDER BY sequencenumber", parameter).First();
                    }
                    else
                    {
                        itemExists = (ScanningItem)dbConn.Query<ScanningItem>("select * from ScanningItem where upper(Container) = ? ORDER BY sequencenumber").First();
                    }
                }
            }
            catch (InvalidOperationException exp)
            {
                itemExists = null;
            }
            catch (Exception exp)
            {
                CommonUtility.showMessageBox("Error ", "Exception while selecting Scanned Item" + exp.Message.ToString());
            }
            return itemExists;
        }

        // Retrieve totoal Gross weight/Quantity for particular truck
        public GrossObject getTotalWeightandQuantity(String truckID)
        {
            GrossObject totalObj = null;
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    object[] parameter = new object[1];
                    parameter[0] = truckID;
                    totalObj = (GrossObject)dbConn.Query<GrossObject>("select sum(ifnull(totoalWeight,0)) totoalWeight,sum(ifnull(totoalQuantity,0)) totoalQuantity  from GrossObject where TruckId = ?", parameter).First();
                }
            }
            catch (InvalidOperationException exp)
            {
                totalObj = new GrossObject();
                totalObj.totoalQuantity = 0;
                totalObj.totoalWeight = 0;
            }
            catch (Exception exp)
            {
                totalObj = new GrossObject();
                totalObj.totoalQuantity = 0;
                totalObj.totoalWeight = 0;
            }
            return totalObj;
        }
        //Delete specific Order lines
        public void DeleteOrder(String orderNumber)
        {
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    List<ScanningItem> existingOrder = dbConn.Query<ScanningItem>("select * from ScanningItem where OrderNumber = ?", orderNumber);
                    if (existingOrder != null)
                    {
                        foreach (var obj in existingOrder.ToList<ScanningItem>())
                        {
                            dbConn.Delete<ScanningItem>(obj.ID);
                        }
                        dbConn.Commit();
                    }
                }
            }
            catch (Exception exp)
            {
                CommonUtility.showMessageBox("Exception while deleting ScanningItem" + exp.Message.ToString(), " Exception");
            }
        }
        //Delete specific Order lines
        public void DeleteExistingOrder(String orderNumber)
        {
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    List<ScanningItem> existingOrder = dbConn.Query<ScanningItem>("Delete  from ScanningItem where OrderNumber = ?", orderNumber);
                }
            }
            catch (Exception exp)
            {
                CommonUtility.showMessageBox("Exception while deleting Order from ScanningItem" + exp.Message.ToString(), " Exception");
            }
        }
        //Delete specific Order lines
        public void DeleteTruckWeightQuantity()
        {
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    List<ScanningItem> existingOrder = dbConn.Query<ScanningItem>("Delete  from GrossObject");
                }
            }
            catch (Exception exp)
            {
                CommonUtility.showMessageBox("Exception while deleting GrossObject" + exp.Message.ToString(), " Exception");
            }
        }

        //Delete specific Order lines
        public void DeleteAllOrder()
        {
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    List<ScanningItem> existingOrder = dbConn.Query<ScanningItem>("Delete  from ScanningItem");
                }
            }
            catch (Exception exp)
            {
                CommonUtility.showMessageBox("Exception while deleting ScanningItem" + exp.Message.ToString(), " Exception");
            }
        }

        // Retrieve the all Items list from the database for 
        public ObservableCollection<ScanningItem> getLoadedOrderLines(String orderNumber)
        {
            ObservableCollection<ScanningItem> itemList = null;
            try
            {
                List<ScanningItem> myCollection = null;
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    if (!orderNumber.Equals(""))
                    {
                        myCollection = dbConn.Query<ScanningItem>("select * from ScanningItem where OrderNumber = ? and  TruckID IS NOT NULL AND TruckID!='' ORDER BY sequencenumber", orderNumber);
                        itemList = new ObservableCollection<ScanningItem>(myCollection);
                    }
                    else
                    {
                        myCollection = dbConn.Query<ScanningItem>("select * from ScanningItem where TruckID IS NOT NULL AND TruckID!='' ORDER BY sequencenumber");
                        itemList = new ObservableCollection<ScanningItem>(myCollection);
                    }
                }
            }
            catch (Exception exp)
            {
                CommonUtility.showMessageBox("Exception while getting the Loaded ScanningItem" + exp.Message.ToString(), " Exception");
            }
            return itemList;
        }
        // Retrieve the all Items list from the database for Loaded with Category filter
        public ObservableCollection<ScanningItem> getLoadedOrderLinesCategory(String orderNumber, String categoryType)
        {
            ObservableCollection<ScanningItem> itemList = null;
            try
            {
                List<ScanningItem> myCollection = null;
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    if (!orderNumber.Equals(""))
                    {
                        object[] parameter = new object[2];
                        parameter[0] = orderNumber;
                        parameter[1] = categoryType;
                        myCollection = dbConn.Query<ScanningItem>("select * from ScanningItem where OrderNumber = ? and  Category = ? and  TruckID IS NOT NULL AND TruckID!='' ORDER BY sequencenumber", parameter);
                        itemList = new ObservableCollection<ScanningItem>(myCollection);
                    }
                    else
                    {
                        myCollection = dbConn.Query<ScanningItem>("select * from ScanningItem where Category = ? and  TruckID IS NOT NULL AND TruckID!='' ORDER BY sequencenumber", categoryType);
                        itemList = new ObservableCollection<ScanningItem>(myCollection);
                    }
                }
            }
            catch (Exception exp)
            {
                CommonUtility.showMessageBox("Exception while getting the Loaded ScanningItem" + exp.Message.ToString(), " Exception");
            }
            return itemList;
        }

        // Retrieve the all Items list from the database for 
        public ObservableCollection<ScanningItem> getLoadedandPickedOrderLines(String orderNumber)
        {
            ObservableCollection<ScanningItem> itemList = null;
            try
            {
                List<ScanningItem> myCollection = null;
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    if (!orderNumber.Equals(""))
                    {
                        myCollection = dbConn.Query<ScanningItem>("select * from ScanningItem where OrderNumber = ? and  ((TruckID IS NOT NULL AND TruckID!='' ) or  HeaderDescription IN('DIRECT SHIPMENTS','SINGLE POINT')) ORDER BY sequencenumber", orderNumber);
                        itemList = new ObservableCollection<ScanningItem>(myCollection);
                    }
                    else
                    {
                        myCollection = dbConn.Query<ScanningItem>("select * from ScanningItem where ((TruckID IS NOT NULL AND TruckID!='' ) or  HeaderDescription IN('DIRECT SHIPMENTS','SINGLE POINT')) ORDER BY sequencenumber");
                        itemList = new ObservableCollection<ScanningItem>(myCollection);
                    }
                }
            }
            catch (Exception exp)
            {
                CommonUtility.showMessageBox("Exception while getting the Loaded ScanningItem" + exp.Message.ToString(), " Exception");
            }
            return itemList;
        }
        // Retrieve the all Items list from the database for 
        public ObservableCollection<ScanningItem> getLoadedandPickedOrderLinesCategory(String orderNumber, String categoryType)
        {
            ObservableCollection<ScanningItem> itemList = null;

            try
            {
                List<ScanningItem> myCollection = null;
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    if (!orderNumber.Equals(""))
                    {
                        object[] parameter = new object[3];
                        parameter[0] = orderNumber;
                        parameter[1] = categoryType;
                        parameter[2] = categoryType;
                        myCollection = dbConn.Query<ScanningItem>("select * from ScanningItem where OrderNumber = ? and   ((TruckID IS NOT NULL AND TruckID!='' and Category = ?) or  (HeaderDescription IN('DIRECT SHIPMENTS','SINGLE POINT')and Category = ?)) ORDER BY sequencenumber", parameter);
                        itemList = new ObservableCollection<ScanningItem>(myCollection);
                    }
                    else
                    {
                        object[] parameter = new object[2];
                        parameter[0] = categoryType;
                        parameter[1] = categoryType;
                        myCollection = dbConn.Query<ScanningItem>("select * from ScanningItem where ((TruckID IS NOT NULL AND TruckID!='' and Category = ?) or  (HeaderDescription IN('DIRECT SHIPMENTS','SINGLE POINT')and Category = ?)) ORDER BY sequencenumber");
                        itemList = new ObservableCollection<ScanningItem>(myCollection);
                    }
                }
            }
            catch (Exception exp)
            {
                CommonUtility.showMessageBox("Exception while getting the Loaded ScanningItem" + exp.Message.ToString(), " Exception");
            }
            return itemList;
        }
        // Retrieve the all Items list from the database for 
        public ObservableCollection<ScanningItem> getLoadedandUnPickedOrderLines(String orderNumber)
        {
            ObservableCollection<ScanningItem> itemList = null;
            try
            {
                List<ScanningItem> myCollection = null;
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    if (!orderNumber.Equals(""))
                    {
                        myCollection = dbConn.Query<ScanningItem>("select * from ScanningItem where OrderNumber = ? and  (TruckID IS NOT NULL AND TruckID!='') or HeaderDescription= 'UNPICKED ITEMS' ORDER BY sequencenumber", orderNumber);
                        itemList = new ObservableCollection<ScanningItem>(myCollection);
                    }
                    else
                    {
                        myCollection = dbConn.Query<ScanningItem>("select * from ScanningItem where (TruckID IS NOT NULL AND TruckID!='') or HeaderDescription= 'UNPICKED ITEMS' ORDER BY sequencenumber");
                        itemList = new ObservableCollection<ScanningItem>(myCollection);
                    }
                }
            }
            catch (Exception exp)
            {
                CommonUtility.showMessageBox("Exception while getting the Loaded ScanningItem" + exp.Message.ToString(), " Exception");
            }
            return itemList;
        }
        // Retrieve the all Items list from the database for 
        public ObservableCollection<ScanningItem> getLoadedandUnPickedOrderLinesCategory(String orderNumber, String categoryType)
        {
            ObservableCollection<ScanningItem> itemList = null;
            try
            {
                List<ScanningItem> myCollection = null;
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    if (!orderNumber.Equals(""))
                    {
                        object[] parameter = new object[3];
                        parameter[0] = orderNumber;
                        parameter[1] = categoryType;
                        parameter[2] = categoryType;
                        myCollection = dbConn.Query<ScanningItem>("select * from ScanningItem where OrderNumber = ? and  ((TruckID IS NOT NULL AND TruckID!='' and Category = ? ) or (HeaderDescription= 'UNPICKED ITEMS' and Category = ?)) ORDER BY sequencenumber", parameter);
                        itemList = new ObservableCollection<ScanningItem>(myCollection);
                    }
                    else
                    {
                        object[] parameter = new object[2];
                        parameter[0] = categoryType;
                        parameter[1] = categoryType;
                        myCollection = dbConn.Query<ScanningItem>("select * from ScanningItem where ((TruckID IS NOT NULL AND TruckID!='' and Category = ? ) or (HeaderDescription= 'UNPICKED ITEMS' and Category = ?)) ORDER BY sequencenumber", parameter);
                        itemList = new ObservableCollection<ScanningItem>(myCollection);
                    }
                }
            }
            catch (Exception exp)
            {
                CommonUtility.showMessageBox("Exception while getting the Loaded ScanningItem" + exp.Message.ToString(), " Exception");
            }
            return itemList;
        }
        // Retrieve the all Items list from the database for 
        public ObservableCollection<ScanningItem> getPickedUnPickedOrderLines(String orderNumber)
        {
            ObservableCollection<ScanningItem> itemList = null;
            try
            {
                List<ScanningItem> myCollection = null;
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    if (!orderNumber.Equals(""))
                    {
                        myCollection = dbConn.Query<ScanningItem>("select * from ScanningItem where OrderNumber = ? and ((TruckID='' or TruckID is null) and HeaderDescription IN('DIRECT SHIPMENTS','SINGLE POINT'))   or HeaderDescription IN('UNPICKED ITEMS') ORDER BY sequencenumber", orderNumber);
                        itemList = new ObservableCollection<ScanningItem>(myCollection);
                    }
                    else
                    {
                        myCollection = dbConn.Query<ScanningItem>("select * from ScanningItem where ((TruckID='' or TruckID is null) and HeaderDescription IN('DIRECT SHIPMENTS','SINGLE POINT'))   or HeaderDescription IN('UNPICKED ITEMS') ORDER BY sequencenumber");
                        itemList = new ObservableCollection<ScanningItem>(myCollection);
                    }
                }
            }
            catch (Exception exp)
            {
                CommonUtility.showMessageBox("Exception while getting the Loaded ScanningItem" + exp.Message.ToString(), " Exception");
            }
            return itemList;
        }
        // Retrieve the all Items list from the database for 
        public ObservableCollection<ScanningItem> getPickedUnPickedOrderLinesCategory(String orderNumber, String categoryType)
        {
            ObservableCollection<ScanningItem> itemList = null;
            try
            {
                List<ScanningItem> myCollection = null;
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    if (!orderNumber.Equals(""))
                    {
                        object[] parameter = new object[3];
                        parameter[0] = orderNumber;
                        parameter[1] = categoryType;
                        parameter[2] = categoryType;
                        myCollection = dbConn.Query<ScanningItem>("select * from ScanningItem where OrderNumber = ? and ((TruckID='' or TruckID is null) and HeaderDescription IN('DIRECT SHIPMENTS','SINGLE POINT') and Category = ? )   or (HeaderDescription IN('UNPICKED ITEMS') and Category = ?)  ORDER BY sequencenumber", parameter);
                        itemList = new ObservableCollection<ScanningItem>(myCollection);
                    }
                    else
                    {
                        object[] parameter = new object[2];
                        parameter[0] = categoryType;
                        parameter[1] = categoryType;
                        myCollection = dbConn.Query<ScanningItem>("select * from ScanningItem where ((TruckID='' or TruckID is null) and HeaderDescription IN('DIRECT SHIPMENTS','SINGLE POINT') and Category = ? )   or (HeaderDescription IN('UNPICKED ITEMS') and Category = ?)  ORDER BY sequencenumber", parameter);
                        itemList = new ObservableCollection<ScanningItem>(myCollection);
                    }
                }
            }
            catch (Exception exp)
            {
                CommonUtility.showMessageBox("Exception while getting the Loaded ScanningItem" + exp.Message.ToString(), " Exception");
            }
            return itemList;
        }
        // Retrieve the all Items list from the database for
        /// <summary>
        /// transcationType  P - Picked items U - Un Picked Items
        /// </summary>
        /// <param name="orderNumber"></param>
        /// <param name="transcationType"></param>
        /// <returns></returns>
        public ObservableCollection<ScanningItem> getPickedANDUnpickedOrderLines(String orderNumber, String transcationType)
        {
            ObservableCollection<ScanningItem> itemList = null;
            List<ScanningItem> myCollection = null;
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    if (!orderNumber.Equals(""))
                    {
                        object[] parameter = new object[2];
                        parameter[0] = orderNumber;
                        if (transcationType.Equals("P"))
                        {
                            myCollection = dbConn.Query<ScanningItem>("select * from ScanningItem where OrderNumber = ? and  HeaderDescription IN('DIRECT SHIPMENTS','SINGLE POINT') and (TruckID='' or TruckID is null) ORDER BY sequencenumber", orderNumber);

                        }
                        else
                        {
                            myCollection = dbConn.Query<ScanningItem>("select * from ScanningItem where HeaderDescription= 'UNPICKED ITEMS' AND OrderNumber = ? ORDER BY sequencenumber", orderNumber);
                        }
                        itemList = new ObservableCollection<ScanningItem>(myCollection);
                    }
                    else
                    {
                        if (transcationType.Equals("P"))
                        {
                            myCollection = dbConn.Query<ScanningItem>("select * from ScanningItem where HeaderDescription IN('DIRECT SHIPMENTS','SINGLE POINT') and (TruckID='' or TruckID is null) ORDER BY sequencenumber");

                        }
                        else
                        {
                            myCollection = dbConn.Query<ScanningItem>("select * from ScanningItem where HeaderDescription= 'UNPICKED ITEMS' ORDER BY sequencenumber");
                        }
                        itemList = new ObservableCollection<ScanningItem>(myCollection);
                    }
                }
            }
            catch (Exception exp)
            {
                CommonUtility.showMessageBox("Exception while getting the Loaded ScanningItem" + exp.Message.ToString(), " Exception");
            }
            return itemList;
        }
        //Retrieve the all Items list from the database for
        /// <summary>
        /// transcationType  P - Picked items U - Un Picked Items
        /// </summary>
        /// <param name="orderNumber"></param>
        /// <param name="transcationType"></param>
        /// <returns></returns>
        public ObservableCollection<ScanningItem> getPickedANDUnpickedOrderLinesCategory(String orderNumber, String transcationType, String categoryType)
        {
            ObservableCollection<ScanningItem> itemList = null;
            List<ScanningItem> myCollection = null;
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    if (!orderNumber.Equals(""))
                    {
                        object[] parameter = new object[2];
                        parameter[0] = orderNumber;
                        parameter[1] = categoryType;
                        if (transcationType.Equals("P"))
                        {
                            myCollection = dbConn.Query<ScanningItem>("select * from ScanningItem where OrderNumber = ? and  Category = ? and  HeaderDescription IN('DIRECT SHIPMENTS','SINGLE POINT') and (TruckID='' or TruckID is null) ORDER BY sequencenumber", parameter);

                        }
                        else
                        {
                            myCollection = dbConn.Query<ScanningItem>("select * from ScanningItem where HeaderDescription= 'UNPICKED ITEMS' AND OrderNumber = ? and  Category = ? ORDER BY sequencenumber", parameter);
                        }
                        itemList = new ObservableCollection<ScanningItem>(myCollection);
                    }
                    else
                    {
                        if (transcationType.Equals("P"))
                        {
                            myCollection = dbConn.Query<ScanningItem>("select * from ScanningItem where Category = ? and  HeaderDescription IN('DIRECT SHIPMENTS','SINGLE POINT') and (TruckID='' or TruckID is null) ORDER BY sequencenumber", categoryType);

                        }
                        else
                        {
                            myCollection = dbConn.Query<ScanningItem>("select * from ScanningItem where HeaderDescription= 'UNPICKED ITEMS' AND Category = ? ORDER BY sequencenumber", categoryType);
                        }
                        itemList = new ObservableCollection<ScanningItem>(myCollection);
                    }
                }
            }
            catch (Exception exp)
            {
                CommonUtility.showMessageBox("Exception while getting the Loaded ScanningItem" + exp.Message.ToString(), " Exception");
            }
            return itemList;
        }

        // Retrieve totoal count of Buyout Data for particular order
        public BuyoutCount getBuyoutCount(String orderNumber)
        {
            BuyoutCount totalCount = null;
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    if (!orderNumber.Equals(""))
                    {
                        object[] parameter = new object[1];
                        parameter[0] = orderNumber;
                        totalCount = (BuyoutCount)dbConn.Query<BuyoutCount>("select count(*) totoalCount  from ScanningItem where HeaderDescription = 'BUYOUT' and OrderNumber = ?", parameter).First();
                    }
                    else
                    {
                        totalCount = (BuyoutCount)dbConn.Query<BuyoutCount>("select count(*) totoalCount  from ScanningItem where HeaderDescription = 'BUYOUT'").First();
                    }
                }
            }
            catch (InvalidOperationException exp)
            {
                totalCount = new BuyoutCount();
                totalCount.totoalCount = 0;
            }
            catch (Exception exp)
            {
                totalCount = new BuyoutCount();
                totalCount.totoalCount = 0;
                CommonUtility.showMessageBox("Exception while getting getBuyoutCount ", "Error");
            }
            return totalCount;
        }

        // Retrieve the all Items list from the database. for buyout data
        public ObservableCollection<ScanningItem> getBuyOutOrderLines(String orderNumber)
        {
            ObservableCollection<ScanningItem> itemList = null;
            try
            {
                List<ScanningItem> myCollection = null;
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    if (!orderNumber.Equals(""))
                    {
                        myCollection = dbConn.Query<ScanningItem>("select * from ScanningItem where HeaderDescription = 'BUYOUT' and OrderNumber = ? ORDER BY container*1,container", orderNumber);
                        itemList = new ObservableCollection<ScanningItem>(myCollection);
                    }
                    else
                    {
                        myCollection = dbConn.Query<ScanningItem>("select * from ScanningItem where HeaderDescription = 'BUYOUT' ORDER BY container*1,container");
                        itemList = new ObservableCollection<ScanningItem>(myCollection);
                    }
                }
            }
            catch (Exception exp)
            {
                CommonUtility.showMessageBox("Exception while selecting ScanningItem" + exp.Message.ToString(), " Exception");
            }
            return itemList;
        }

        // Retrieve totoal count of Buyout Data for particular order
        // -- processType Loading or Unloading --processType L - Load
        public void updateTruckWeightQuantity(String truckID, Decimal totalWgt, Decimal totalQty, String processType)
        {
            DatabaseHandler dbHandler = new DatabaseHandler();
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    object[] parameter = new object[1];
                    parameter[0] = truckID;
                    if (processType.Equals("L"))
                    {
                        var addCount = dbConn.Query<GrossObject>(" update  GrossObject set totoalWeight=totoalWeight+" + totalWgt + ",totoalQuantity=totoalQuantity+" + totalQty + " where truckID = ?", parameter);
                    }
                    else
                    {
                        var reduceCount = dbConn.Query<GrossObject>(" update  GrossObject set totoalWeight=totoalWeight-" + totalWgt + ",totoalQuantity=totoalQuantity-" + totalQty + " where truckID = ?", parameter);
                    }
                }
            }
            catch (Exception exp)
            {
                Log l = new Log();
                l.LogMessage = "Inside updateTruckWeightQuantity Exception" + exp.Message.ToString();
                l.TimeStamp = DateTime.Now.ToString();
                dbHandler.writeLog(l);

                CommonUtility.showMessageBox("Exception while updateTruckWeightQuantity ", "Error");
            }
        }

        // Retrieve customerName particular order
        public Customer getCustomerName(String orderNumber)
        {
            Customer customer = null;
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    object[] parameter = new object[1];
                    parameter[0] = orderNumber;
                    customer = (Customer)dbConn.Query<Customer>("select distinct CustomerName customerName from ScanningItem  where OrderNumber = ?", parameter).First();
                }
            }
            catch (InvalidOperationException exp)
            {
                customer = new Customer();
                customer.customerName = "";
            }
            catch (Exception exp)
            {
                customer = new Customer();
                customer.customerName = "";
                CommonUtility.showMessageBox("Exception while getting getBuyoutCount ", "Error");
            }
            return customer;
        }

        // Insert the new Totoal weight & Quantity in the Gross Table .
        public void insertTruckImg(TruckImage newObj)
        {
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    dbConn.RunInTransaction(() =>
                    {
                        dbConn.Insert(newObj);
                    });
                }
            }
            catch (Exception exp)
            {

            }
        }
        // Retrieve the all Truck Image list from the database for
        /// <summary>        
        /// </summary>
        /// <param name="orderNumber"></param>
        /// <param name="transcationType"></param>
        /// <returns></returns>
        public ObservableCollection<TruckImage> getTruckImgList(String truckID)
        {
            ObservableCollection<TruckImage> truckList = null;
            List<TruckImage> myCollection = null;
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    object[] parameter = new object[1];
                    parameter[0] = truckID;
                    myCollection = dbConn.Query<TruckImage>("select Id,TruckId,TruckImg, 1 IsSelected,IsUploaded from TruckImage where TruckId = ?", parameter);
                    truckList = new ObservableCollection<TruckImage>(myCollection);
                }
            }
            catch (Exception exp)
            {
                CommonUtility.showMessageBox("Exception while getting the Loaded TruckImage" + exp.Message.ToString(), " Exception");
            }
            return truckList;
        }

        /// <summary>
        /// DB method to delete all the images once successfully uploaded into server 
        /// </summary>
        /// <param name="truckID"></param>
        public XReturnObject deleteTruckImages(String truckID)
        {
            XReturnObject returnObject = null;
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    List<TruckImage> existingOrder = dbConn.Query<TruckImage>("select * from TruckImage where TruckId = ?", truckID);
                    if (existingOrder != null)
                    {
                        foreach (var obj in existingOrder.ToList<TruckImage>())
                        {
                            dbConn.Delete<TruckImage>(obj.Id);
                        }
                        dbConn.Commit();
                        returnObject = new XReturnObject("0", "", null);

                    }
                }
            }
            catch (Exception exp)
            {
                returnObject = new XReturnObject("-1", "Exception while deleting Truck Images" + exp.Message.ToString(), null);
            }
            return returnObject;
        }
        /// <summary>
        /// Added on 07-AUG-2017 
        /// Method to update the upload status as 'Y' after photos has been uploaded
        /// </summary>
        /// <param name="truckID"></param>
        public void updateTruckImages(String truckID)
        {
            DatabaseHandler dbHandler = new DatabaseHandler();
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    object[] parameter = new object[1];
                    parameter[0] = truckID;
                    var updateCount = dbConn.Query<TruckImage>(" update  TruckImage set IsUploaded='Y' where truckID = ?", parameter);
                }
            }
            catch (Exception exp)
            {
                CommonUtility.showMessageBox("Exception in updateTruckImages-" + exp.Message, "Error");
            }
        }

        /// <summary>
        /// DB method to get all CategoryTypeQuestions based on the order number
        /// </summary>
        /// <param name="orderNumber"></param>
        /// <returns>Collection of  CategoryTypeQuestions</returns>
        public ObservableCollection<CategoryTypeQuestions> getCategoryTypeQuestions(String orderNumber)
        {
            ObservableCollection<CategoryTypeQuestions> truckList = null;
            List<CategoryTypeQuestions> myCollection = null;
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    if (!orderNumber.Equals(""))
                    {
                        myCollection = dbConn.Query<CategoryTypeQuestions>("select CategoryId,CategoryType,Question from CategoryTypeQuestions where CategoryType in (select distinct category from ScanningItem where OrderNumber= ? )", orderNumber);
                        truckList = new ObservableCollection<CategoryTypeQuestions>(myCollection);
                    }
                    else
                    {
                        myCollection = dbConn.Query<CategoryTypeQuestions>("select CategoryId,CategoryType,Question from CategoryTypeQuestions where CategoryType in (select distinct category from ScanningItem)");
                        truckList = new ObservableCollection<CategoryTypeQuestions>(myCollection);
                    }
                }
            }
            catch (Exception exp)
            {
                CommonUtility.showMessageBox("Exception while getting the CategoryTypeQuestions" + exp.Message.ToString(), " Exception");
            }
            return truckList;
        }

        /// <summary>
        /// Retrieve the distinct CategoryTypeAnswers list from the database based on category Type
        /// </summary>
        /// <param name="categoryTypeID"></param>
        /// <returns>Collection of  getCategoryTypeAnswers</returns>
        public ObservableCollection<CategoryTypeAnswers> getCategoryTypeAnswers(String categoryTypeID)
        {
            ObservableCollection<CategoryTypeAnswers> cattegoryList = null;
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    List<CategoryTypeAnswers> myCollection = dbConn.Query<CategoryTypeAnswers>("select  Answer,0 IsSelected,CategoryId,CategoryAnswerId   FROM CategoryTypeAnswers  where CategoryId = ? ORDER BY CategoryAnswerId", categoryTypeID);
                    cattegoryList = new ObservableCollection<CategoryTypeAnswers>(myCollection);
                }
            }
            catch (Exception exp)
            {
                CommonUtility.showMessageBox("Exception while selecting Category" + exp.Message.ToString(), " Exception");
            }
            return cattegoryList;
        }

        /// <summary>
        /// Method for inserting the CategoryTypeQuestions into SQLITE table
        /// </summary>
        /// <param name="question"></param>
        public void insertCategoryQuestion(CategoryTypeQuestions question)
        {
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    dbConn.RunInTransaction(() =>
                    {
                        dbConn.Insert(question);
                    });
                }
            }
            catch (Exception exp)
            {

            }
        }

        /// <summary>
        /// Method for inserting the new question into CategoryTypeAnswer.  
        /// </summary>
        /// <param name="answer"></param>
        public void insertCategoryAnswer(CategoryTypeAnswers answer)
        {
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    dbConn.RunInTransaction(() =>
                    {
                        dbConn.Insert(answer);
                    });
                }
            }
            catch (Exception exp)
            {

            }
        }

        /// <summary>
        /// Delete existing lines 
        /// </summary>
        public void DeleteExistingQuestion()
        {
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    List<CategoryTypeQuestions> existingOrder = dbConn.Query<CategoryTypeQuestions>("Delete  from CategoryTypeQuestions");
                }
            }
            catch (Exception exp)
            {
                CommonUtility.showMessageBox("Exception while deleting CategoryTypeQuestions" + exp.Message.ToString(), " Exception");
            }
        }

        /// <summary>
        /// Delete existing lines 
        /// </summary>
        public void DeleteExistingAnswer()
        {
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    List<CategoryTypeAnswers> existingOrder = dbConn.Query<CategoryTypeAnswers>("Delete  from CategoryTypeAnswers");
                }
            }
            catch (Exception exp)
            {
                CommonUtility.showMessageBox("Exception while deleting CategoryTypeAnswers" + exp.Message.ToString(), " Exception");
            }
        }
        //0---------------------------------------------26/04/17--------------------------------------------
        /// <summary>
        /// Method for inserting the ProductType into SQLITE table
        /// </summary>
        /// <param name="question"></param>
        public void insertProductType(ProductType pType)
        {
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    dbConn.RunInTransaction(() =>
                    {
                        dbConn.Insert(pType);
                    });
                }
            }
            catch (Exception exp)
            {

            }
        }
        /// <summary>
        /// Method for inserting the CategoryProductRel into SQLITE table
        /// </summary>
        /// <param name="question"></param>
        public void insertCategoryProductRel(CategoryProductRel catePrdRel)
        {
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    dbConn.RunInTransaction(() =>
                    {
                        dbConn.Insert(catePrdRel);
                    });
                }
            }
            catch (Exception exp)
            {

            }
        }
        /// <summary>
        /// Method for inserting the new question into ProductTypeQuestions.  
        /// </summary>
        /// <param name="answer"></param>
        public void insertProductTypeQuestions(ProductTypeQuestions question)
        {
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    dbConn.RunInTransaction(() =>
                    {
                        dbConn.Insert(question);
                    });
                }
            }
            catch (Exception exp)
            {

            }
        }
        /// <summary>
        /// Method for inserting the answers into ProductTypeAnswers.  
        /// </summary>
        /// <param name="answer"></param>
        public void insertProductTypeAnswers(ProductTypeAnswers answers)
        {
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    dbConn.RunInTransaction(() =>
                    {
                        dbConn.Insert(answers);
                    });
                }
            }
            catch (Exception exp)
            {

            }
        }

        /// <summary>
        /// Delete existing product questions  
        /// </summary>
        public void DeleteExistingProductQuestion()
        {
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    List<ProductTypeQuestions> existingOrder = dbConn.Query<ProductTypeQuestions>("Delete  from ProductTypeQuestions");
                }
            }
            catch (Exception exp)
            {
                CommonUtility.showMessageBox("Exception while deleting ProductTypeQuestions" + exp.Message.ToString(), " Exception");
            }
        }

        /// <summary>
        /// Delete existing product answers 
        /// </summary>
        public void DeleteExistingProductAnswer()
        {
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    List<ProductTypeAnswers> existingOrder = dbConn.Query<ProductTypeAnswers>("Delete  from ProductTypeAnswers");
                }
            }
            catch (Exception exp)
            {
                CommonUtility.showMessageBox("Exception while deleting ProductTypeAnswers" + exp.Message.ToString(), " Exception");
            }
        }

        /// <summary>
        /// Delete existing product answers 
        /// </summary>
        public void DeleteExistingCategoryProductRel()
        {
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    List<CategoryProductRel> existingOrder = dbConn.Query<CategoryProductRel>("Delete  from CategoryProductRel");
                }
            }
            catch (Exception exp)
            {
                CommonUtility.showMessageBox("Exception while deleting CategoryProductRel" + exp.Message.ToString(), " Exception");
            }
        }
        /// <summary>
        /// Delete existing product questions  
        /// </summary>
        public void DeleteExistingProductType()
        {
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    List<ProductType> existingOrder = dbConn.Query<ProductType>("Delete  from ProductType");
                }
            }
            catch (Exception exp)
            {
                CommonUtility.showMessageBox("Exception while deleting ProductType" + exp.Message.ToString(), " Exception");
            }
        }

        /// <summary>
        /// Retrieve the distinct CategoryTypeAnswers list from the database based on category Type
        /// </summary>
        /// <param name="categoryTypeID"></param>
        /// <returns>Collection of  getProductTypeAnswers</returns>
        public ObservableCollection<ProductTypeAnswers> getProductTypeAnswers(String productTypeQuestionID)
        {
            ObservableCollection<ProductTypeAnswers> productTypeAnswersList = null;
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    List<ProductTypeAnswers> myCollection = dbConn.Query<ProductTypeAnswers>("select  Answer,0 IsSelected,ProductTypeQuestionID,ProductTypeAnswerID   FROM ProductTypeAnswers  where ProductTypeQuestionID = ? ORDER BY ProductTypeAnswerID", productTypeQuestionID);
                    productTypeAnswersList = new ObservableCollection<ProductTypeAnswers>(myCollection);
                }
            }
            catch (Exception exp)
            {
                CommonUtility.showMessageBox("Exception while selecting ProductTypeAnswers" + exp.Message.ToString(), " Exception");
            }
            return productTypeAnswersList;
        }

        /// <summary>
        /// DB method to get all productTypeQuestionsList based on the order number
        /// </summary>
        /// <param name="orderNumber"></param>
        /// <returns>Collection of  productTypeQuestionsList</returns>
        public ObservableCollection<ProductTypeQuestions> getProductTypeQuestions(String orderNumber)
        {
            ObservableCollection<ProductTypeQuestions> productTypeQuestionsList = null;
            List<ProductTypeQuestions> myCollection = null;
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    if (!orderNumber.Equals(""))
                    {
                        myCollection = dbConn.Query<ProductTypeQuestions>("select distinct  q.ProductTypeQuestionID,q.ProductTypeID,pt.ProductTypeName,q.Question from ProductTypeQuestions q, ProductType pt,CategoryProductRel rel where q.ProductTypeID=pt.ProductTypeID and rel.productTypeID=pt.productTypeID and rel.category in (select distinct category from ScanningItem where OrderNumber in (" + orderNumber + ") )");
                        productTypeQuestionsList = new ObservableCollection<ProductTypeQuestions>(myCollection);
                    }
                    else
                    {
                        myCollection = dbConn.Query<ProductTypeQuestions>("select distinct  q.ProductTypeQuestionID,q.ProductTypeID,pt.ProductTypeName,q.Question from ProductTypeQuestions q, ProductType pt,CategoryProductRel rel where q.ProductTypeID=pt.ProductTypeID and rel.productTypeID=pt.productTypeID and rel.category in (select distinct category from ScanningItem)");
                        productTypeQuestionsList = new ObservableCollection<ProductTypeQuestions>(myCollection);
                    }
                }
            }
            catch (Exception exp)
            {
                CommonUtility.showMessageBox("Exception while getting the CategoryTypeQuestions" + exp.Message.ToString(), " Exception");
            }
            return productTypeQuestionsList;
        }

        /// <summary>
        /// DB method to get all productTypeQuestionsList based on the order number
        /// </summary>
        /// <param name="orderNumber"></param>
        /// <returns>Collection of  productTypeQuestionsList</returns>
        public ObservableCollection<ProductTypeQuestions> getDefaultQuestions()
        {
            ObservableCollection<ProductTypeQuestions> productTypeQuestionsList = null;
            List<ProductTypeQuestions> myCollection = null;
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    myCollection = dbConn.Query<ProductTypeQuestions>("select q.ProductTypeQuestionID,q.ProductTypeID,pt.ProductTypeName,q.Question from ProductTypeQuestions q, ProductType pt where q.ProductTypeID=pt.ProductTypeID and pt.ProductTypeName in('Dunnage','Load Photos')");
                    productTypeQuestionsList = new ObservableCollection<ProductTypeQuestions>(myCollection);
                }
            }
            catch (Exception exp)
            {
                CommonUtility.showMessageBox("Exception while getting the Default CategoryTypeQuestions" + exp.Message.ToString(), " Exception");
            }
            return productTypeQuestionsList;
        }

        /// <summary>
        /// DB method to get all productTypeQuestionsList based on the order number
        /// </summary>
        /// <param name="orderNumber"></param>
        /// <returns>Collection of  productTypeQuestionsList</returns>
        public ProductTypeQuestions getDefaultProductTypeQuestions()
        {
            ProductTypeQuestions productTypeQuestionsList = null;
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    productTypeQuestionsList = (ProductTypeQuestions)dbConn.Query<ProductTypeQuestions>("select q.ProductTypeQuestionID,q.ProductTypeID,pt.ProductTypeName,q.Question from ProductTypeQuestions q, ProductType pt where q.ProductTypeID=pt.ProductTypeID and pt.ProductTypeName = 'Dunnage'").First();
                }
            }
            catch (Exception exp)
            {
                CommonUtility.showMessageBox("Exception while getting the Default CategoryTypeQuestions" + exp.Message.ToString(), " Exception");
            }
            return productTypeQuestionsList;
        }

        /// <summary>
        /// Retrieve overall weight of Category from the database. 
        /// </summary>
        /// <param name="orderNumber"></param>
        /// <returns></returns>
        public ScanningItem getLoadedPickedCategoryWeight(String orderNumber, String category)
        {
            ScanningItem totalWeight = null;
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    if (!orderNumber.Equals(""))
                    {
                        object[] parameter = new object[3];
                        parameter[0] = orderNumber;
                        parameter[1] = category;
                        parameter[2] = category;
                        totalWeight = (ScanningItem)dbConn.Query<ScanningItem>("select  ifnull(sum(GrossWeight),0) GrossWeight  FROM ScanningItem  where OrderNumber = ? and ((TruckID IS NOT NULL AND TruckID!='' and Category = ?) or (HeaderDescription IN('DIRECT SHIPMENTS','SINGLE POINT')and Category =?))", parameter).First();
                    }
                    else
                    {
                        object[] parameter = new object[2];
                        parameter[0] = category;
                        parameter[1] = category;
                        totalWeight = (ScanningItem)dbConn.Query<ScanningItem>("select  ifnull(sum(GrossWeight),0) GrossWeight  FROM ScanningItem  where ((TruckID IS NOT NULL AND TruckID!='' and Category = ?) or (HeaderDescription IN('DIRECT SHIPMENTS','SINGLE POINT')and Category =?))", parameter).First();
                    }
                }
            }
            catch (InvalidOperationException exp)
            {
                totalWeight = new ScanningItem();
                totalWeight.GrossWeight = 0;
            }
            catch (Exception exp)
            {
                totalWeight = new ScanningItem();
                totalWeight.GrossWeight = 0;
            }
            return totalWeight;
        }
        /// <summary>
        /// Retrieve overall weight of Category from the database. 
        /// </summary>
        /// <param name="orderNumber"></param>
        /// <returns></returns>
        public ScanningItem getLoadedUnPickedCategoryWeight(String orderNumber, String category)
        {
            ScanningItem totalWeight = null;
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    if (!orderNumber.Equals(""))
                    {
                        object[] parameter = new object[3];
                        parameter[0] = orderNumber;
                        parameter[1] = category;
                        parameter[2] = category;
                        totalWeight = (ScanningItem)dbConn.Query<ScanningItem>("select  ifnull(sum(GrossWeight),0) GrossWeight  FROM ScanningItem  where OrderNumber = ? and ((TruckID IS NOT NULL AND TruckID!='' and Category = ? )) or ((HeaderDescription= 'UNPICKED ITEMS' and Category = ?))", parameter).First();
                    }
                    else
                    {
                        object[] parameter = new object[2];
                        parameter[0] = category;
                        parameter[1] = category;
                        totalWeight = (ScanningItem)dbConn.Query<ScanningItem>("select  ifnull(sum(GrossWeight),0) GrossWeight  FROM ScanningItem  where ((TruckID IS NOT NULL AND TruckID!='' and Category = ? )) or ((HeaderDescription= 'UNPICKED ITEMS' and Category = ?))", parameter).First();
                    }
                }
            }
            catch (InvalidOperationException exp)
            {
                totalWeight = new ScanningItem();
                totalWeight.GrossWeight = 0;
            }
            catch (Exception exp)
            {
                totalWeight = new ScanningItem();
                totalWeight.GrossWeight = 0;
            }
            return totalWeight;
        }
        // <summary>
        /// Retrieve overall weight of Category from the database. 
        /// </summary>
        /// <param name="orderNumber"></param>
        /// <returns></returns>
        public ScanningItem getPickedUnPickedCategoryWeight(String orderNumber, String category)
        {
            ScanningItem totalWeight = null;
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    if (!orderNumber.Equals(""))
                    {
                        object[] parameter = new object[3];
                        parameter[0] = orderNumber;
                        parameter[1] = category;
                        parameter[2] = category;
                        totalWeight = (ScanningItem)dbConn.Query<ScanningItem>("select  ifnull(sum(GrossWeight),0) GrossWeight  FROM ScanningItem  where OrderNumber = ? and  (((TruckID='' or TruckID is null) and HeaderDescription IN('DIRECT SHIPMENTS','SINGLE POINT') and Category = ? ))   or ((HeaderDescription IN('UNPICKED ITEMS') and Category = ?))", parameter).First();
                    }
                    else
                    {
                        object[] parameter = new object[2];
                        parameter[0] = category;
                        parameter[1] = category;
                        totalWeight = (ScanningItem)dbConn.Query<ScanningItem>("select  ifnull(sum(GrossWeight),0) GrossWeight  FROM ScanningItem  where (((TruckID='' or TruckID is null) and HeaderDescription IN('DIRECT SHIPMENTS','SINGLE POINT') and Category = ? ))   or ((HeaderDescription IN('UNPICKED ITEMS') and Category = ?))", parameter).First();
                    }
                }
            }
            catch (InvalidOperationException exp)
            {
                totalWeight = new ScanningItem();
                totalWeight.GrossWeight = 0;
            }
            catch (Exception exp)
            {
                totalWeight = new ScanningItem();
                totalWeight.GrossWeight = 0;
            }
            return totalWeight;
        }
        // <summary>
        /// Retrieve overall weight of Category from the database. 
        /// </summary>
        /// <param name="orderNumber"></param>
        /// <returns></returns>
        public ScanningItem getLoadedPickedUnPickedCategoryWeight(String orderNumber, String category)
        {
            ScanningItem totalWeight = null;
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    if (!orderNumber.Equals(""))
                    {
                        object[] parameter = new object[3];
                        parameter[0] = orderNumber;
                        parameter[1] = category;
                        parameter[2] = category;
                        totalWeight = (ScanningItem)dbConn.Query<ScanningItem>("select  ifnull(sum(GrossWeight),0) GrossWeight  FROM ScanningItem  where OrderNumber = ? and Category= ?", parameter).First();
                    }
                    else
                    {
                        object[] parameter = new object[2];
                        parameter[0] = category;
                        parameter[1] = category;
                        totalWeight = (ScanningItem)dbConn.Query<ScanningItem>("select  ifnull(sum(GrossWeight),0) GrossWeight  FROM ScanningItem  where Category= ?", parameter).First();
                    }
                }
            }
            catch (InvalidOperationException exp)
            {
                totalWeight = new ScanningItem();
                totalWeight.GrossWeight = 0;
            }
            catch (Exception exp)
            {
                totalWeight = new ScanningItem();
                totalWeight.GrossWeight = 0;
            }
            return totalWeight;
        }
        /// <summary>
        /// Retrieve overall weight of Category from the database. 
        /// </summary>
        /// <param name="orderNumber"></param>
        /// <returns></returns>
        public ScanningItem getPickedCategoryWeight(String orderNumber, String category)
        {
            ScanningItem totalWeight = null;
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    if (!orderNumber.Equals(""))
                    {
                        object[] parameter = new object[2];
                        parameter[0] = orderNumber;
                        parameter[1] = category;
                        totalWeight = (ScanningItem)dbConn.Query<ScanningItem>("select  ifnull(sum(GrossWeight),0) GrossWeight  FROM ScanningItem  where OrderNumber = ? and Category=?  and  HeaderDescription IN('DIRECT SHIPMENTS','SINGLE POINT') and (TruckID='' or TruckID is null)", parameter).First();
                    }
                    else
                    {
                        totalWeight = (ScanningItem)dbConn.Query<ScanningItem>("select  ifnull(sum(GrossWeight),0) GrossWeight  FROM ScanningItem  where Category=?  and  HeaderDescription IN('DIRECT SHIPMENTS','SINGLE POINT') and (TruckID='' or TruckID is null)", category).First();
                    }
                }
            }
            catch (InvalidOperationException exp)
            {
                totalWeight = new ScanningItem();
                totalWeight.GrossWeight = 0;
            }
            catch (Exception exp)
            {
                totalWeight = new ScanningItem();
                totalWeight.GrossWeight = 0;
            }
            return totalWeight;
        }
        /// <summary>
        /// Retrieve overall weight of Category from the database. 
        /// </summary>
        /// <param name="orderNumber"></param>
        /// <returns></returns>
        public ScanningItem getLoadedCategoryWeight(String orderNumber, String category)
        {
            ScanningItem totalWeight = null;
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    if (!orderNumber.Equals(""))
                    {
                        object[] parameter = new object[2];
                        parameter[0] = orderNumber;
                        parameter[1] = category;
                        totalWeight = (ScanningItem)dbConn.Query<ScanningItem>("select  ifnull(sum(GrossWeight),0) GrossWeight  FROM ScanningItem  where OrderNumber = ? and Category= ? and TruckID IS NOT NULL AND TruckID!=''", parameter).First();
                    }
                    else
                    {
                        totalWeight = (ScanningItem)dbConn.Query<ScanningItem>("select  ifnull(sum(GrossWeight),0) GrossWeight  FROM ScanningItem  where Category= ? and TruckID IS NOT NULL AND TruckID!=''", category).First();
                    }
                }
            }
            catch (InvalidOperationException exp)
            {
                totalWeight = new ScanningItem();
                totalWeight.GrossWeight = 0;
            }
            catch (Exception exp)
            {
                totalWeight = new ScanningItem();
                totalWeight.GrossWeight = 0;
            }
            return totalWeight;
        }
        /// <summary>
        /// Retrieve overall weight of Category from the database. 
        /// </summary>
        /// <param name="orderNumber"></param>
        /// <returns></returns>
        public ScanningItem getUnPickedCategoryWeight(String orderNumber, String category)
        {
            ScanningItem totalWeight = null;
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    if (!orderNumber.Equals(""))
                    {
                        object[] parameter = new object[2];
                        parameter[0] = orderNumber;
                        parameter[1] = category;
                        totalWeight = (ScanningItem)dbConn.Query<ScanningItem>("select  ifnull(sum(GrossWeight),0) GrossWeight  FROM ScanningItem  where OrderNumber = ? and Category= ? and HeaderDescription= 'UNPICKED ITEMS'", parameter).First();
                    }
                    else
                    {
                        totalWeight = (ScanningItem)dbConn.Query<ScanningItem>("select  ifnull(sum(GrossWeight),0) GrossWeight  FROM ScanningItem  where Category= ? and HeaderDescription= 'UNPICKED ITEMS'", category).First();
                    }
                }
            }
            catch (InvalidOperationException exp)
            {
                totalWeight = new ScanningItem();
                totalWeight.GrossWeight = 0;
            }
            catch (Exception exp)
            {
                totalWeight = new ScanningItem();
                totalWeight.GrossWeight = 0;
            }
            return totalWeight;
        }

        /// <summary>
        /// Retrieve overall weight of Category from the database. 
        /// </summary>
        /// <param name="orderNumber"></param>
        /// <returns></returns>
        public ObservableCollection<ScanningItem> getDistinctCategory(String orderNumber)
        {
            ObservableCollection<ScanningItem> categoryList = null;
            try
            {
                List<ScanningItem> myCollection = null;
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    if (!orderNumber.Equals(""))
                    {
                        myCollection = dbConn.Query<ScanningItem>("select distinct Category from ScanningItem  where OrderNumber = ? group by Category ORDER BY Category", orderNumber);
                        categoryList = new ObservableCollection<ScanningItem>(myCollection);
                    }
                    else
                    {
                        myCollection = dbConn.Query<ScanningItem>("select distinct Category from ScanningItem group by Category ORDER BY Category");
                        categoryList = new ObservableCollection<ScanningItem>(myCollection);
                    }
                }
            }
            catch (Exception exp)
            {
                CommonUtility.showMessageBox("Exception while selecting getDistinctCategory" + exp.Message.ToString(), " Exception");
            }
            return categoryList;
        }

        // Insert the new Totoal weight & Quantity in the Gross Table .
        public void insertSignatureImg(SignatureImg newObj)
        {
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    dbConn.RunInTransaction(() =>
                    {
                        dbConn.Insert(newObj);
                    });
                }
            }
            catch (Exception exp)
            {

            }
        }
        // Retrieve the all Items list from the database for
        /// <summary>
        /// transcationType  P - Picked items U - Un Picked Items
        /// </summary>
        /// <param name="orderNumber"></param>
        /// <param name="transcationType"></param>
        /// <returns></returns>
        public SignatureImg getSignatureImg(String truckID)
        {
            SignatureImg sigImg = null;
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    object[] parameter = new object[1];
                    parameter[0] = truckID;
                    sigImg = (SignatureImg)dbConn.Query<SignatureImg>("select  SignatureImage  FROM SignatureImg  where TruckID = ? ", parameter).First();
                }
            }
            catch (Exception exp)
            {
                CommonUtility.showMessageBox("Exception while getting the SignatureImage" + exp.Message.ToString(), " Exception");
            }
            return sigImg;
        }
        //Delete specific Order lines
        public void deleteExistingSignature(String truckID)
        {
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    List<SignatureImg> existingOrder = dbConn.Query<SignatureImg>("select * from SignatureImg where TruckID = ?", truckID);
                    if (existingOrder != null)
                    {
                        foreach (var obj in existingOrder.ToList<SignatureImg>())
                        {
                            dbConn.Delete<SignatureImg>(obj.Id);
                        }
                        dbConn.Commit();

                    }
                }
            }
            catch (Exception exp)
            {

            }
        }

        // To check wheather photo taken or not
        public IsPhotoTaken isPhotoTaken(String truckID)
        {
            IsPhotoTaken totalCount = null;
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    object[] parameter = new object[1];
                    parameter[0] = truckID;
                    totalCount = (IsPhotoTaken)dbConn.Query<IsPhotoTaken>("select count(*) totoalCount  from TruckImage where TruckID = ?", parameter).First();
                }
            }
            catch (InvalidOperationException exp)
            {
                totalCount = new IsPhotoTaken();
                totalCount.totoalCount = 0;
            }
            catch (Exception exp)
            {
                totalCount = new IsPhotoTaken();
                totalCount.totoalCount = 0;
                CommonUtility.showMessageBox("Exception while getting getBuyoutCount ", "Error");
            }
            return totalCount;
        }

        /// <summary>
        /// Retrieve product Type answer with Yes or No nased on Truck Image availability
        /// </summary>
        /// <param name="categoryTypeID"></param>
        /// <returns>Collection of  getProductTypeAnswers</returns>
        public ObservableCollection<ProductTypeAnswers> getProductTypePhotoAnswersYes(String productTypeQuestionID, String photoFlag)
        {
            ObservableCollection<ProductTypeAnswers> productTypeAnswersList = null;
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    object[] parameter = new object[2];
                    parameter[0] = productTypeQuestionID;
                    parameter[1] = productTypeQuestionID;
                    List<ProductTypeAnswers> myCollection = dbConn.Query<ProductTypeAnswers>("select Answer,IsSelected,ProductTypeQuestionID,ProductTypeAnswerID from ( select  Answer,1 IsSelected,ProductTypeQuestionID,ProductTypeAnswerID   FROM ProductTypeAnswers  where ProductTypeQuestionID = ? and upper(Answer)='YES' union select  Answer,0 IsSelected,ProductTypeQuestionID,ProductTypeAnswerID   FROM ProductTypeAnswers  where ProductTypeQuestionID = ? and upper(Answer) !='YES' ) ORDER BY ProductTypeAnswerID", parameter);
                    productTypeAnswersList = new ObservableCollection<ProductTypeAnswers>(myCollection);
                }
            }
            catch (Exception exp)
            {
                CommonUtility.showMessageBox("Exception while selecting ProductTypeAnswers" + exp.Message.ToString(), " Exception");
            }
            return productTypeAnswersList;
        }
        /// <summary>
        /// Retrieve product Type answer with Yes or No nased on Truck Image availability
        /// </summary>
        /// <param name="categoryTypeID"></param>
        /// <returns>Collection of  getProductTypeAnswers</returns>
        public ObservableCollection<ProductTypeAnswers> getProductTypePhotoAnswersNo(String productTypeQuestionID, String photoFlag)
        {
            ObservableCollection<ProductTypeAnswers> productTypeAnswersList = null;
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    object[] parameter = new object[2];
                    parameter[0] = productTypeQuestionID;
                    parameter[1] = productTypeQuestionID;
                    List<ProductTypeAnswers> myCollection = dbConn.Query<ProductTypeAnswers>("select Answer,IsSelected,ProductTypeQuestionID,ProductTypeAnswerID from ( select  Answer,1 IsSelected,ProductTypeQuestionID,ProductTypeAnswerID   FROM ProductTypeAnswers  where ProductTypeQuestionID = ? and upper(Answer)='YES' union select  Answer,1 IsSelected,ProductTypeQuestionID,ProductTypeAnswerID   FROM ProductTypeAnswers  where ProductTypeQuestionID = ? and upper(Answer) !='YES' ) ORDER BY ProductTypeAnswerID", parameter);
                    productTypeAnswersList = new ObservableCollection<ProductTypeAnswers>(myCollection);
                }
            }
            catch (Exception exp)
            {
                CommonUtility.showMessageBox("Exception while selecting ProductTypeAnswers" + exp.Message.ToString(), " Exception");
            }
            return productTypeAnswersList;
        }


        public ProductTypeQuestions getLoadPhotoPT()
        {
            ProductTypeQuestions question = null;
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    question = (ProductTypeQuestions)dbConn.Query<ProductTypeQuestions>("select Q.ProductTypeQuestionID,Q.ProductTypeID,pt.ProductTypeName,Q.Question from ProductTypeQuestions Q,ProductType PT where Q.ProductTypeID = PT.ProductTypeID and upper(PT.ProductTypeName) = 'LOAD PHOTOS'").First();
                }
            }
            catch (InvalidOperationException exp)
            {
                question = null;
            }
            catch (Exception exp)
            {
                question = null;
            }
            return question;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public ProductTypeQuestions disableListviewChkbox(String productTypeQuestionID)
        {
            ProductTypeQuestions question = null;
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    object[] parameter = new object[1];
                    parameter[0] = productTypeQuestionID;
                    question = (ProductTypeQuestions)dbConn.Query<ProductTypeQuestions>("select Q.ProductTypeQuestionID,Q.ProductTypeID,pt.ProductTypeName,Q.Question from ProductTypeQuestions Q,ProductType PT where Q.ProductTypeID = PT.ProductTypeID and ProductTypeQuestionID = ?", parameter).First();
                }
            }
            catch (InvalidOperationException exp)
            {
                question = null;
            }
            catch (Exception exp)
            {
                question = null;
            }
            return question;
        }

        /// <summary>
        /// Added on 07-AUG-2017
        /// To check wheather photo uploaded or not 
        /// </summary>
        /// <param name="truckID"></param>
        /// <returns></returns>
        public IsPhotoTaken isPhotoUploded(String truckID)
        {
            IsPhotoTaken totalCount = null;
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    object[] parameter = new object[2];
                    parameter[0] = truckID;
                    parameter[1] = truckID;
                    totalCount = (IsPhotoTaken)dbConn.Query<IsPhotoTaken>("select count(*) totoalCount  from TruckImage where IsUploaded='Y' and TruckID = ? and not exists (select 1 totoalCount  from TruckImage where IsUploaded='N' and TruckID = ?)", parameter).First();
                }
            }
            catch (InvalidOperationException exp)
            {
                totalCount = new IsPhotoTaken();
                totalCount.totoalCount = 0;
            }
            catch (Exception exp)
            {
                totalCount = new IsPhotoTaken();
                totalCount.totoalCount = 0;
                CommonUtility.showMessageBox("Exception while getting isPhotoUploded count ", "Error");
            }
            return totalCount;
        }

        /// <summary>
        /// Method for inserting the environment data from SOA
        /// </summary>
        /// <param name="newItem"></param>
        public void InsertEnvironment(Environment newItem)
        {
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    dbConn.RunInTransaction(() =>
                    {
                        dbConn.Insert(newItem);
                    });
                }
            }
            catch (Exception exp)
            {
                CommonUtility.showMessageBox("Exception while inserting Environment" + exp.Message.ToString(), " Exception");
            }
        }

        /// <summary>
        /// Getting all the Environments
        /// </summary>
        /// <returns></returns>
        public List<Environment> getEnvironments()
        {
            List<Environment> environmentList = null;
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    List<Environment> myCollection = dbConn.Query<Environment>("select * from Environment");
                    environmentList = new List<Environment>(myCollection);
                }
            }
            catch (Exception exp)
            {
                CommonUtility.showMessageBox("Exception while selecting Environment" + exp.Message.ToString(), " Exception");
            }
            return environmentList;
        }

        /// <summary>
        /// Method to delete the entries in the environment table.
        /// </summary>
        public void deleteEnvironments()
        {
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    List<Environment> existingOrder = dbConn.Query<Environment>("Delete  from Environment");
                }
            }
            catch (Exception exp)
            {
                CommonUtility.showMessageBox("Exception while deleting Environment" + exp.Message.ToString(), " Exception");
            }
        }


        /// <summary>
        /// Method for inserting the SinglePointOrgMap data from SOA
        /// </summary>
        /// <param name="newItem"></param>
        public void InsertSinglePointOrgMap(SinglePointOrgMap newItem)
        {
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    dbConn.RunInTransaction(() =>
                    {
                        dbConn.Insert(newItem);
                    });
                }
            }
            catch (Exception exp)
            {
                CommonUtility.showMessageBox("Exception while inserting SinglePointOrgMap" + exp.Message.ToString(), " Exception");
            }
        }

        /// <summary>
        /// Getting all the Environments
        /// </summary>
        /// <returns></returns>
        public List<SinglePointOrgMap> getSinglePointOrgMaps()
        {
            List<SinglePointOrgMap> environmentList = null;
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    List<SinglePointOrgMap> myCollection = dbConn.Query<SinglePointOrgMap>("select * from SinglePointOrgMap");
                    environmentList = new List<SinglePointOrgMap>(myCollection);
                }
            }
            catch (Exception exp)
            {
                CommonUtility.showMessageBox("Exception while selecting SinglePointOrgMap" + exp.Message.ToString(), " Exception");
            }
            return environmentList;
        }

        /// <summary>
        /// Method to delete the entries in the environment table.
        /// </summary>
        public void deleteSinglePointOrgMaps()
        {
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    List<SinglePointOrgMap> existingOrder = dbConn.Query<SinglePointOrgMap>("Delete  from SinglePointOrgMap");
                }
            }
            catch (Exception exp)
            {
                CommonUtility.showMessageBox("Exception while deleting SinglePointOrgMap" + exp.Message.ToString(), " Exception");
            }
        }


        public void updateScanningItemReadonlyFlags(string mode)
        {
            string sqlQuery = "";
            string sqlQuery1 = "";
            try
            {
                using (var dbConn = new SQLiteConnection(App.DB_PATH))
                {
                    if (mode.ToUpper().Equals("STAGING"))
                    {
                        sqlQuery = "UPDATE ScanningItem SET  StaggedCheckBoxReadonlyFlag = 0, TruckLoadButtonReadonlyFlag=1 where ID not in (select id from ScanningItem  where TruckID IS NOT NULL AND TruckID!='' ORDER BY sequencenumber)";
                        sqlQuery1 = "UPDATE ScanningItem SET  StaggedCheckBoxReadonlyFlag = 0, TruckLoadButtonReadonlyFlag=1 where ID in (select id from ScanningItem  where TruckID IS NOT NULL AND TruckID!='' ORDER BY sequencenumber)";
                    }
                    else if (mode.ToUpper().Equals("LOADING"))
                        sqlQuery = "UPDATE ScanningItem SET  StaggedCheckBoxReadonlyFlag = 1, TruckLoadButtonReadonlyFlag=1";

                    SQLiteCommand command = new SQLiteCommand(dbConn);
                    command.CommandText = sqlQuery;
                    command.ExecuteNonQuery();
                    if (sqlQuery1 != "")
                    {
                        command.CommandText = sqlQuery1;
                        command.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception exp)
            {
                CommonUtility.showMessageBox("Exception while updating the scanning item readonly flags" + exp.Message.ToString(), " Exception");
            }
        }

    }

}

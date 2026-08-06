		internal SQLiteCommand (SQLiteConnection conn)
		{
			_conn = conn;
			_bindings = new List<Binding> ();
			CommandText = "";
		}
	protected virtual SQLiteCommand NewCommand ()
		{
			return new SQLiteCommand (this);
		}


				/// Creates a SQLiteCommand given the command text (SQL) with arguments. Place a '?'
		/// in the command text for each of the arguments and then executes that command.
		/// Use this method instead of Query when you don't expect rows back. Such cases include
		/// INSERTs, UPDATEs, and DELETEs.
    
// TimeExecution is boolean

    public int Execute (string query, params object[] args)
		{
			var cmd = CreateCommand (query, args);
			
			if (TimeExecution) {
				if (_sw == null) {
					_sw = new Stopwatch ();
				}
				_sw.Reset ();
				_sw.Start ();
			}

			var r = cmd.ExecuteNonQuery ();
			
			if (TimeExecution) {
				_sw.Stop ();
				_elapsedMilliseconds += _sw.ElapsedMilliseconds;
				Debug.WriteLine (string.Format ("Finished in {0} ms ({1:0.0} s total)", _sw.ElapsedMilliseconds, _elapsedMilliseconds / 1000.0));
			}
			
			return r;
		}

		/// Creates a new SQLiteCommand given the command text with arguments. Place a '?'
		/// in the command text for each of the arguments.

    		public SQLiteCommand CreateCommand (string cmdText, params object[] ps)
		{
			if (!_open)
				throw SQLiteException.New (SQLite3.Result.Error, "Cannot create commands from unopened database");

			var cmd = NewCommand ();
			cmd.CommandText = cmdText;
			foreach (var o in ps) {
				cmd.Bind (o);
			}
			return cmd;
		}

	public static extern Result Step (IntPtr stmt);

		public int ExecuteNonQuery ()
		{
			if (_conn.Trace) {
				Debug.WriteLine ("Executing: " + this);
			}
			
// result.done = SQLite result 101

			var r = SQLite3.Result.OK;
			var stmt = Prepare ();
			r = SQLite3.Step (stmt);
			Finalize (stmt);
			if (r == SQLite3.Result.Done) {
				int rowsAffected = SQLite3.Changes (_conn.Handle);
				return rowsAffected;
			} else if (r == SQLite3.Result.Error) {
				string msg = SQLite3.GetErrmsg (_conn.Handle);
				throw SQLiteException.New (r, msg);
			}
			else if (r == SQLite3.Result.Constraint) {
				if (SQLite3.ExtendedErrCode (_conn.Handle) == SQLite3.ExtendedResult.ConstraintNotNull) {
					throw NotNullConstraintViolationException.New (r, SQLite3.GetErrmsg (_conn.Handle));
				}
			}

			throw SQLiteException.New(r, r.ToString());
		}

    		protected virtual Sqlite3Statement Prepare ()
		{
			var stmt = SQLite3.Prepare2 (Connection.Handle, CommandText);
			return stmt;
		}

// Appears to return the prepared statement
		public static IntPtr Prepare2 (IntPtr db, string query)
		{
			IntPtr stmt;
#if NETFX_CORE
            byte[] queryBytes = System.Text.UTF8Encoding.UTF8.GetBytes (query);
            var r = Prepare2 (db, queryBytes, queryBytes.Length, out stmt, IntPtr.Zero);
#else
            var r = Prepare2 (db, query, System.Text.UTF8Encoding.UTF8.GetByteCount (query), out stmt, IntPtr.Zero);
#endif
			if (r != Result.OK) {
				throw SQLiteException.New (r, GetErrmsg (db));
			}
			return stmt;
		}



    public class GetTruckResponseTruck
    {
        public String truck_id { get; set; }
    }


    public class SCACResponseSCACCode
    {
        public String scac_code { get; set; }
        public String carrier_name{ get; set; }
    }

		   public class OrgResponseOrg
    {
        public String org_code { get; set; }
    }

		    public class SinglePointOrgMap
    {
        // Instance variable declaration
        //The Id property is marked as the Primary Key
        [SQLite.PrimaryKey, SQLite.AutoIncrement]
        public int ID { get; set; }
        public string singlePointOrg { get; set; }
        public string baseOrg { get; set; }
    }


		
        /// <summary>
        /// Service method to download all the Question and Answer into Local SQLITE DB
        /// Master data will be utilized in LoadVerification Form
        /// Added on 07/04/2017
        /// </summary>
        private async void populateCategoryQuestionAnswer()


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
				////////////////

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

//////////////

 public partial class ProductQuestionResponseQuestionaire : object, System.ComponentModel.INotifyPropertyChanged {
        
        private string productTypeQuesIDField;
        
        private string productTypeIDField;
        
        private string questionField;
        
        /// <remarks/>
        [System.Xml.Serialization.XmlElementAttribute(DataType="integer", Order=0)]
        public string ProductTypeQuesID {
            get {
                return this.productTypeQuesIDField;
            }
            set {
                this.productTypeQuesIDField = value;
                this.RaisePropertyChanged("ProductTypeQuesID");
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlElementAttribute(DataType="integer", Order=1)]
        public string ProductTypeID {
            get {
                return this.productTypeIDField;
            }
            set {
                this.productTypeIDField = value;
                this.RaisePropertyChanged("ProductTypeID");
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlElementAttribute(Order=2)]
        public string Question {
            get {
                return this.questionField;
            }
            set {
                this.questionField = value;
                this.RaisePropertyChanged("Question");
            }
        }
        
///////////////////
           protected void RaisePropertyChanged(string propertyName) {
            System.ComponentModel.PropertyChangedEventHandler propertyChanged = this.PropertyChanged;
            if ((propertyChanged != null)) {
                propertyChanged(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
            }
        }

            public partial class GetProductTypeDataResponse {
        
        [System.ServiceModel.MessageBodyMemberAttribute(Namespace="http://xmlns.oracle.com/BBNA_Butler/YardManagementSystem/MobileAppSchema", Order=0)]
        [System.Xml.Serialization.XmlArrayItemAttribute("ProductType", IsNullable=false)]
        public ButlerWarehouseApp.BBNAYardManagementServices.ProductTypeResponseProductType[] ProductTypeResponse;
        
        public GetProductTypeDataResponse() {
        }
        
        public GetProductTypeDataResponse(ButlerWarehouseApp.BBNAYardManagementServices.ProductTypeResponseProductType[] ProductTypeResponse) {
            this.ProductTypeResponse = ProductTypeResponse;
        }
    }

////////////////
/* 
These are all the calls the app makes to the oracle db

*/

    public interface YardManagementSystem_BPEL {
        
        [System.ServiceModel.OperationContractAttribute(Action="GetSCACCode", ReplyAction="*")]
        [System.ServiceModel.XmlSerializerFormatAttribute(SupportFaults=true)]
        System.Threading.Tasks.Task<ButlerWarehouseApp.BBNAYardManagementServices.GetSCACCodeResponse> GetSCACCodeAsync(ButlerWarehouseApp.BBNAYardManagementServices.GetSCACCodeRequest request);
        
        [System.ServiceModel.OperationContractAttribute(Action="GetOrg", ReplyAction="*")]
        [System.ServiceModel.XmlSerializerFormatAttribute(SupportFaults=true)]
        System.Threading.Tasks.Task<ButlerWarehouseApp.BBNAYardManagementServices.GetOrgResponse> GetOrgAsync(ButlerWarehouseApp.BBNAYardManagementServices.GetOrgRequest request);
        
        [System.ServiceModel.OperationContractAttribute(Action="GetTruckId", ReplyAction="*")]
        [System.ServiceModel.XmlSerializerFormatAttribute(SupportFaults=true)]
        System.Threading.Tasks.Task<ButlerWarehouseApp.BBNAYardManagementServices.GetTruckIdResponse> GetTruckIdAsync(ButlerWarehouseApp.BBNAYardManagementServices.GetTruckIdRequest request);
        
        [System.ServiceModel.OperationContractAttribute(Action="OrderNumberValidation", ReplyAction="*")]
        [System.ServiceModel.XmlSerializerFormatAttribute(SupportFaults=true)]
        System.Threading.Tasks.Task<ButlerWarehouseApp.BBNAYardManagementServices.OrderNumberValidationResponse> OrderNumberValidationAsync(ButlerWarehouseApp.BBNAYardManagementServices.OrderNumberValidationRequest request);
        
        [System.ServiceModel.OperationContractAttribute(Action="GetOrderData", ReplyAction="*")]
        [System.ServiceModel.XmlSerializerFormatAttribute(SupportFaults=true)]
        System.Threading.Tasks.Task<ButlerWarehouseApp.BBNAYardManagementServices.GetOrderDataResponse> GetOrderDataAsync(ButlerWarehouseApp.BBNAYardManagementServices.GetOrderDataRequest request);
        
        [System.ServiceModel.OperationContractAttribute(Action="GetTRUCKUPDATE", ReplyAction="*")]
        [System.ServiceModel.XmlSerializerFormatAttribute(SupportFaults=true)]
        System.Threading.Tasks.Task<ButlerWarehouseApp.BBNAYardManagementServices.GetTRUCKUPDATEResponse> GetTRUCKUPDATEAsync(ButlerWarehouseApp.BBNAYardManagementServices.GetTRUCKUPDATERequest request);
        
        [System.ServiceModel.OperationContractAttribute(Action="UPLOADIMAGEUPDATEprocess", ReplyAction="*")]
        [System.ServiceModel.XmlSerializerFormatAttribute(SupportFaults=true)]
        System.Threading.Tasks.Task<ButlerWarehouseApp.BBNAYardManagementServices.UPLOADIMAGEUPDATEprocessResponse> UPLOADIMAGEUPDATEprocessAsync(ButlerWarehouseApp.BBNAYardManagementServices.UPLOADIMAGEUPDATEprocessRequest request);
        
        [System.ServiceModel.OperationContractAttribute(Action="GetLOADEDTRUCKData", ReplyAction="*")]
        [System.ServiceModel.XmlSerializerFormatAttribute(SupportFaults=true)]
        System.Threading.Tasks.Task<ButlerWarehouseApp.BBNAYardManagementServices.GetLOADEDTRUCKDataResponse> GetLOADEDTRUCKDataAsync(ButlerWarehouseApp.BBNAYardManagementServices.GetLOADEDTRUCKDataRequest request);
        
        [System.ServiceModel.OperationContractAttribute(Action="GetTruckWeightQtyData", ReplyAction="*")]
        [System.ServiceModel.XmlSerializerFormatAttribute(SupportFaults=true)]
        System.Threading.Tasks.Task<ButlerWarehouseApp.BBNAYardManagementServices.GetTruckWeightQtyDataResponse> GetTruckWeightQtyDataAsync(ButlerWarehouseApp.BBNAYardManagementServices.GetTruckWeightQtyDataRequest request);
        
        [System.ServiceModel.OperationContractAttribute(Action="GetUserIDData", ReplyAction="*")]
        [System.ServiceModel.XmlSerializerFormatAttribute(SupportFaults=true)]
        System.Threading.Tasks.Task<ButlerWarehouseApp.BBNAYardManagementServices.GetUserIDDataResponse> GetUserIDDataAsync(ButlerWarehouseApp.BBNAYardManagementServices.GetUserIDDataRequest request);
        
        [System.ServiceModel.OperationContractAttribute(Action="GetLoadVerficationTxnData", ReplyAction="*")]
        [System.ServiceModel.XmlSerializerFormatAttribute(SupportFaults=true)]
        System.Threading.Tasks.Task<ButlerWarehouseApp.BBNAYardManagementServices.GetLoadVerficationTxnDataResponse> GetLoadVerficationTxnDataAsync(ButlerWarehouseApp.BBNAYardManagementServices.GetLoadVerficationTxnDataRequest request);
        
        [System.ServiceModel.OperationContractAttribute(Action="GetProductTypeData", ReplyAction="*")]
        [System.ServiceModel.XmlSerializerFormatAttribute(SupportFaults=true)]
        System.Threading.Tasks.Task<ButlerWarehouseApp.BBNAYardManagementServices.GetProductTypeDataResponse> GetProductTypeDataAsync(ButlerWarehouseApp.BBNAYardManagementServices.GetOrgRequest request);
        
        [System.ServiceModel.OperationContractAttribute(Action="GetCatePrdTypeRelData", ReplyAction="*")]
        [System.ServiceModel.XmlSerializerFormatAttribute(SupportFaults=true)]
        System.Threading.Tasks.Task<ButlerWarehouseApp.BBNAYardManagementServices.GetCatePrdTypeRelDataResponse> GetCatePrdTypeRelDataAsync(ButlerWarehouseApp.BBNAYardManagementServices.GetOrgRequest request);
        
        [System.ServiceModel.OperationContractAttribute(Action="GetPrdQuestionaireData", ReplyAction="*")]
        [System.ServiceModel.XmlSerializerFormatAttribute(SupportFaults=true)]
        System.Threading.Tasks.Task<ButlerWarehouseApp.BBNAYardManagementServices.GetPrdQuestionaireDataResponse> GetPrdQuestionaireDataAsync(ButlerWarehouseApp.BBNAYardManagementServices.GetOrgRequest request);
        
        [System.ServiceModel.OperationContractAttribute(Action="GetPrdAnswerData", ReplyAction="*")]
        [System.ServiceModel.XmlSerializerFormatAttribute(SupportFaults=true)]
        System.Threading.Tasks.Task<ButlerWarehouseApp.BBNAYardManagementServices.GetPrdAnswerDataResponse> GetPrdAnswerDataAsync(ButlerWarehouseApp.BBNAYardManagementServices.GetOrgRequest request);
        
        [System.ServiceModel.OperationContractAttribute(Action="GetLOADFORMTXNDETAILData", ReplyAction="*")]
        [System.ServiceModel.XmlSerializerFormatAttribute(SupportFaults=true)]
        System.Threading.Tasks.Task<ButlerWarehouseApp.BBNAYardManagementServices.GetLOADFORMTXNDETAILDataResponse> GetLOADFORMTXNDETAILDataAsync(ButlerWarehouseApp.BBNAYardManagementServices.GetLOADFORMTXNDETAILDataRequest request);
        
        [System.ServiceModel.OperationContractAttribute(Action="GetOrgSinglePointData", ReplyAction="*")]
        [System.ServiceModel.XmlSerializerFormatAttribute(SupportFaults=true)]
        System.Threading.Tasks.Task<ButlerWarehouseApp.BBNAYardManagementServices.GetOrgSinglePointDataResponse> GetOrgSinglePointDataAsync(ButlerWarehouseApp.BBNAYardManagementServices.GetOrgSinglePointDataRequest request);
        
        [System.ServiceModel.OperationContractAttribute(Action="GetInstanceDetailsData", ReplyAction="*")]
        [System.ServiceModel.XmlSerializerFormatAttribute(SupportFaults=true)]
        System.Threading.Tasks.Task<ButlerWarehouseApp.BBNAYardManagementServices.GetInstanceDetailsDataResponse> GetInstanceDetailsDataAsync(ButlerWarehouseApp.BBNAYardManagementServices.GetOrgRequest request);
        
        [System.ServiceModel.OperationContractAttribute(Action="GetStaggedTruckUpdateData", ReplyAction="*")]
        [System.ServiceModel.XmlSerializerFormatAttribute(SupportFaults=true)]
        System.Threading.Tasks.Task<ButlerWarehouseApp.BBNAYardManagementServices.GetStaggedTruckUpdateDataResponse> GetStaggedTruckUpdateDataAsync(ButlerWarehouseApp.BBNAYardManagementServices.GetStaggedTruckUpdateDataRequest request);
    }

    
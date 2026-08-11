using ButlerWarehouseApp.BBNAYardManagementServices;
using ButlerWarehouseApp.DataModel;
using ButlerWarehouseApp.Utils;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Threading.Tasks;
using Windows.Devices.Input;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.Graphics.Imaging;
using Windows.Storage.Streams;
using Windows.UI;
using Windows.UI.Input;
using Windows.UI.Input.Inking;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Media.Imaging;
using Windows.UI.Xaml.Navigation;
using Windows.UI.Xaml.Shapes;
using ButlerWarehouseApp.InkHelper;
using Windows.UI.Core;
using ButlerWarehouseApp.DataModel.Response;
using ButlerWarehouseApp.DataModel.Utils;

namespace ButlerWarehouseApp
{
    /// <summary>
    /// Load verification form
    /// </summary>
    public sealed partial class LoadVerification : Page
    {

        /// <summary>
        /// Global level object and variable declaration
        /// </summary>
        public event EventHandler CloseRequested;
        private Popup catalogPopup;

        // Database handler declaration
        DatabaseHandler dbHandler;
        //CategoryQuestionAnswer questionAnswer = new CategoryQuestionAnswer();
        ProductTypeQuestionAnswer questionAnswer = new ProductTypeQuestionAnswer();
        ObservableCollection<ProductTypeQuestions> questionList = null;
       

        String activeOrderButton = "";
        String truckName= "";
        String firstName = "";
        String lastName = "";
        String customerName = "";
        String domainName = "";
        String emailAccount = "";
        UInt32 userID = 0;
        Decimal totalTruckWeight = 0;
        Decimal totalTruckQuantity = 0;
        string DirectLoad = "N";
        string SinglePointLane = "";
        string OrgCode = "";

        //public LoadVerification(String _truckName, String _activeOrder, String _firstName, String _lastName, String _customerName, UInt32 _userID, Decimal _totalTruckWeight, String _plantName, String _formattedOrderNo)
        public LoadVerification( )
        {
            this.InitializeComponent();
            // Setting the page/grid height to full window size
            this.Height = Window.Current.Bounds.Height;
            this.Width = Window.Current.Bounds.Width;
            LoadFormGrid.Height = Window.Current.Bounds.Height;
            LoadFormGrid.Width = Window.Current.Bounds.Width;
            questionAnswer = new ProductTypeQuestionAnswer();

            // Database handler Initializtion
            dbHandler = new DatabaseHandler();

        }
        /// <summary>
        /// Retriving the parameter/information from previous page
        /// </summary>
        /// <param name="e"></param>
        protected override async void OnNavigatedTo(NavigationEventArgs e)
        {
            LoadPage dialog = new LoadPage();
            dialog.CloseRequested += dialog_CloseRequested;
            this.catalogPopup = new Popup();
            this.catalogPopup.Child = dialog;
            this.catalogPopup.IsOpen = true;
            await Task.Delay(TimeSpan.FromSeconds(3)); // set your desired delay
            LoadingParameter qString = (LoadingParameter)e.Parameter;
            if (qString != null)
            {
                ////Retriving the value during the constructor Initializtion
                activeOrderButton = qString.OrderNumber;
                truckName = qString.TruckID;
                firstName = qString.FirstName;
                lastName = qString.LastName;
                customerName = qString.CustomerName;
                //plantName = _plantName;
                userID = qString.UserID;
                totalTruckWeight = qString.TotalWeight;
                totalTruckQuantity = qString.TotalQuantity;
                emailAccount = qString.EmailAccount;
                domainName = qString.DomainName;
                tCustomerName.Text = qString.CustomerName;
                tOrderNumber.Text = qString.FormattedOrderNo;
                tTrailerWeight.Text = qString.TotalWeight.ToString();
                tArea.Text = qString.OrgCode;
                tTruckID.Text = qString.TruckID;
                DirectLoad = qString.DirectLoad;
                SinglePointLane = qString.SinglePointLane;
                OrgCode = qString.OrgCode;


                /**
                 *  Once get the order number get the list of category available for that order and populate the nested listview load form based on that
                 *  Modified with multiple order no for common question and Answer (after UAT testing )
                 */
                //populateListView(qString.FormattedOrderNo);

                // Added 05/22/2017
                String dataExists = "";
                /**
                 * Find The transation is exists already in database 
                 * if available pull the data and bind it to the liestview and nested listview
                 */
                LOADFORMTXNDETAILReq restDt = new LOADFORMTXNDETAILReq();
                restDt.UserID = "0";
                restDt.TruckID = qString.TruckID;
                restDt.OrgCode = qString.OrgCode;

                YardManagementSystem_BPELClient webRequestClient = new YardManagementSystem_BPELClient();
                webRequestClient.Endpoint.Address = new System.ServiceModel.EndpointAddress(CommonUtility.getIPAddress() + "/soa-infra/services/BBNA_Butler/YardManagementSystem/YardManagementSystem_ep");
                GetLOADFORMTXNDETAILDataResponse serviceResponse = (GetLOADFORMTXNDETAILDataResponse)webRequestClient.GetLOADFORMTXNDETAILDataAsync(restDt).Result;
                LOADFORMTXNDETAILResp fResponse = (LOADFORMTXNDETAILResp)serviceResponse.LOADFORMTXNDETAILResp;
                dataExists = fResponse.DataExists;
                if (dataExists.Equals("N"))
                {
                    tLoaderName.Text = qString.FirstName + " " + qString.LastName;
                    /**
                     *  Once get the order number get the list of category available for that order and populate the nested listview load form based on that
                     *  Modified with multiple order no for common question and Answer (after UAT testing )
                     */
                    populateListView(qString.FormattedOrderNo);
                }
                else
                {
                    /**
                     * Get the loaders name from previous transaction and add it to current
                     */
                    string existingLoaderName = fResponse.LoadersName;
                    string currentLoaderName = qString.FirstName + " " + qString.LastName;
                    if (currentLoaderName.Equals(existingLoaderName))
                    {
                        tLoaderName.Text = qString.FirstName + " " + qString.LastName;
                    }
                    else
                    {
                        tLoaderName.Text = currentLoaderName + "," + existingLoaderName;
                    }


                    questionList = new ObservableCollection<ProductTypeQuestions>();
                    //Get the existing question and bind it 
                    ObservableCollection<ProductTypeQuestions> qList = new ObservableCollection<ProductTypeQuestions>();
                    ObservableCollection<ProductTypeQuestions> newfilterList = new ObservableCollection<ProductTypeQuestions>();
                    ObservableCollection<ProductTypeAnswers> answerList = new ObservableCollection<ProductTypeAnswers>();
                    LOADFORMTXNDETAILRespLoadTransQuestionData[] quesData = fResponse.LoadTransQuestionData;
                    LOADFORMTXNDETAILRespLoadTransAnswerData[] ansData = fResponse.LoadTransAnswerData;
                    int commentCounter = 0;                    
                    int counter = 0;
                    for (int i = 0; i < quesData.Length; ++i)
                    {
                        answerList = new ObservableCollection<ProductTypeAnswers>();
                        //quesData[i]
                        ProductTypeQuestions ques = new ProductTypeQuestions();
                        ques.ProductTypeQuestionID = Int32.Parse(quesData[i].ProductTypeQuestionID);
                        ques.ProductTypeID = Int32.Parse(quesData[i].ProductTypeID);
                        ques.ProductTypeName = quesData[i].ProductType;
                        ques.Question = quesData[i].Questions;
                        
                        // Getting the existing comment 
                        if (commentCounter == 0)
                        {
                            rtAdditionalComment.Text = quesData[i].AdditionalComments.ToString();
                            commentCounter++;
                        }

                        qList.Add(ques);
                        questionList.Add(ques);
                        //Getting all the questions
                        questionAnswer.QuestionList.Add(ques);
                        ObservableCollection<ProductTypeAnswers> answerSubList = new ObservableCollection<ProductTypeAnswers>();
                        for (int j = 0; j < ansData.Length; ++j)
                        {
                            ProductTypeAnswers a1 = new ProductTypeAnswers();
                            a1.Answer = ansData[j].Answers;
                            if (ansData[j].AnswerFlag.Equals("Y"))
                                a1.IsSelected = true;
                            else
                                a1.IsSelected = false;

                            
                            a1.ProductTypeAnswerID = Int32.Parse(ansData[j].ProductTypeAnswerID);
                            a1.ProductTypeQuestionID= Int32.Parse(ansData[j].ProductTypeQuestionID);
                            answerList.Add(a1);
                        }
                        int ID = (int)ques.ProductTypeQuestionID;
                        answerSubList = new ObservableCollection<ProductTypeAnswers>(answerList.Where(d => d.ProductTypeQuestionID.Equals(ID)));
                        //Getting all the Answersd for that question
                        foreach (ProductTypeAnswers ansObject in answerSubList)
                        {
                            if (quesData[i].ProductType.ToUpper().Equals("LOAD PHOTOS"))
                            {
                                // Chek wheather photo taken or not 
                                ProductTypeQuestions pQ = dbHandler.getLoadPhotoPT();
                                if (pQ != null)
                                {
                                    if (pQ.ProductTypeQuestionID.ToString().Equals(ansObject.ProductTypeQuestionID.ToString()))
                                    {
                                        IsPhotoTaken obj = dbHandler.isPhotoTaken(truckName);
                                        if (obj != null)
                                        {
                                            if (obj.totoalCount > 0)
                                            {
                                                if (ansObject.Answer.ToUpper().Equals("YES"))
                                                    ansObject.IsSelected = true;
                                                else
                                                    ansObject.IsSelected = false;
                                            }
                                        }
                                    }
                                }
                            }
                            questionAnswer.QuestionList[counter].Answers.Add(ansObject);
                        }

                        counter++;

                    }
                    /**
                     * Once bind the DB data check wheather user opened new order or not 
                     *  If new order opened again sync the question and answer based on the new category
                     */
                    ObservableCollection<ProductTypeQuestions> updatedList = null;
                    //Calling the DB method to get all the questions and updating the questionList ObservableCollection
                    updatedList = dbHandler.getProductTypeQuestions(qString.FormattedOrderNo);
                    foreach (ProductTypeQuestions cQuestion in qList)
                    {
                        foreach (var itemToRemove in updatedList.Where(x => x.ProductTypeQuestionID.Equals(cQuestion.ProductTypeQuestionID)).ToList())
                        {
                            updatedList.Remove(itemToRemove);
                        }
                    }
                    int updatedCounter = questionAnswer.QuestionList.Count;
                    if (updatedList != null)
                    {
                        foreach (ProductTypeQuestions qObject1 in updatedList)
                        {
                            questionList.Add(qObject1);
                            //adding the questions
                            questionAnswer.QuestionList.Add(qObject1);
                            //Getting all the Answersd for that question
                            ObservableCollection<ProductTypeAnswers> newAnswerList = dbHandler.getProductTypeAnswers(qObject1.ProductTypeQuestionID.ToString());
                            foreach (ProductTypeAnswers ansObject1 in newAnswerList)
                            {
                                questionAnswer.QuestionList[updatedCounter].Answers.Add(ansObject1);
                            }
                            updatedCounter++;
                        }
                    }

                    // Settin the datasource to nested Listview - groupListView & itemListViews
                    this.DataContext = questionAnswer; 
                    int newfilterListcOUNT = newfilterList.Count;
                }
                this.catalogPopup.IsOpen = false;
            }
        }

        /// <summary>
        /// Method to close the popup window
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void dialog_CloseRequested(object sender, EventArgs e)
        {
            this.catalogPopup.IsOpen = false;
        }
        /// <summary>
        /// Method for retriving the category type question & answer from SQLITE DB based on OrderNumber
        /// </summary>
        /// <param name="orderNumber"></param>
        private void populateListView(String formattedOrderNo)
        {
            //Calling the DB method to get all the questions and updating the questionList ObservableCollection
            questionList = dbHandler.getProductTypeQuestions(formattedOrderNo);
            ObservableCollection<ProductTypeQuestions> defaultQues = dbHandler.getDefaultQuestions();
            foreach (ProductTypeQuestions cQ1 in defaultQues)
            {
                questionList.Add(cQ1);
            }
            int counter = 0;
            if (questionList != null)
            {
                foreach (ProductTypeQuestions qObject in questionList)
                {
                    //Getting all the questions
                    questionAnswer.QuestionList.Add(qObject);
                    /* Only - Load Photos
                     * Photo Answer Validation
                     * If photo taked enable the checkbox or flag 
                     */
                    if (qObject.ProductTypeName.ToUpper().Equals("LOAD PHOTOS"))
                    {
                        // Check wheather photo taken or not
                        IsPhotoTaken obj = dbHandler.isPhotoTaken(truckName);
                        if (obj != null)
                        {
                            if (obj.totoalCount > 0)
                            {
                                ObservableCollection<ProductTypeAnswers> PhotoAnswer = dbHandler.getProductTypePhotoAnswersYes(qObject.ProductTypeQuestionID.ToString(), "Y");
                                foreach (ProductTypeAnswers ansObj1 in PhotoAnswer)
                                {
                                    if (ansObj1.Answer.ToUpper().Equals("YES"))
                                        ansObj1.IsSelected = true;
                                    else
                                        ansObj1.IsSelected = false;

                                    questionAnswer.QuestionList[counter].Answers.Add(ansObj1);
                                }
                            }
                            else
                            {

                                ObservableCollection<ProductTypeAnswers> PhotoAnswer = dbHandler.getProductTypePhotoAnswersNo(qObject.ProductTypeQuestionID.ToString(), "Y");
                                foreach (ProductTypeAnswers ansObj2 in PhotoAnswer)
                                {
                                    if (ansObj2.Answer.ToUpper().Equals("YES"))
                                        ansObj2.IsSelected = false;
                                    else
                                        ansObj2.IsSelected = true;

                                    questionAnswer.QuestionList[counter].Answers.Add(ansObj2);
                                }
                            }
                        }
                        else
                        {
                            ObservableCollection<ProductTypeAnswers> PhotoAnswer = dbHandler.getProductTypePhotoAnswersNo(qObject.ProductTypeQuestionID.ToString(), "Y");
                            foreach (ProductTypeAnswers ansObj2 in PhotoAnswer)
                            {
                                if (ansObj2.Answer.ToUpper().Equals("YES"))
                                    ansObj2.IsSelected = false;
                                else
                                    ansObj2.IsSelected = true;

                                questionAnswer.QuestionList[counter].Answers.Add(ansObj2);
                            }
                        }
                    }
                    else
                    {
                        //Getting all the Answers for every question
                        ObservableCollection<ProductTypeAnswers> answerList = dbHandler.getProductTypeAnswers(qObject.ProductTypeQuestionID.ToString());
                        foreach (ProductTypeAnswers ansObject in answerList)
                        {
                            questionAnswer.QuestionList[counter].Answers.Add(ansObject);
                        }
                    }
                    counter++;
                }

            }
            // Settin the datasource to nested Listview - groupListView & itemListViews
            this.DataContext = questionAnswer;
        }
      
       
        /// <summary>
        /// Event hadler for clearng the signature (Canvas clear)
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void clearBtn_Click(object sender, RoutedEventArgs e)
        {
            //_InkInfo.ClearStrokes();
            //signatureCanvas.Children.Clear();
            TestInkManager lDialog = new TestInkManager();
            lDialog.CloseRequested += lDialog_CloseRequested;
            this.catalogPopup = new Popup();
            this.catalogPopup.Child = lDialog;
            this.catalogPopup.IsOpen = true;
            this.catalogPopup.Height = Window.Current.Bounds.Height;
            this.catalogPopup.Width = Window.Current.Bounds.Width;

            //this.Frame.Navigate(typeof(TestInkManager));
            

        }
        /// <summary>
        /// Method to close the popup window
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void lDialog_CloseRequested(object sender, EventArgs e)
        {
            this.catalogPopup.IsOpen = false;
        }

       
        /// <summary>
        /// Method to convert the IRandomAccessStream to Byte for DB insert
        /// </summary>
        /// <param name="s"></param>
        /// <returns></returns>
        async Task<byte[]> Convert(IRandomAccessStream s)
        {
            var dr = new DataReader(s.GetInputStreamAt(0));
            var bytes = new byte[s.Size];
            await dr.LoadAsync((uint)s.Size);
            dr.ReadBytes(bytes);

            return bytes;
        }
        
        /// <summary>
        /// Handler method for upload button
        /// Insert the load verification data into EBS base table 
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void uploadButton_Click(object sender, RoutedEventArgs e)
        {
            
            try
            {
                LOADVERIFICATIONTXNReqTransactionDetailsData[] answerListData = new LOADVERIFICATIONTXNReqTransactionDetailsData[100];
                LOADVERIFICATIONTXNReq loadFormRequest = new LOADVERIFICATIONTXNReq();
                ObservableCollection<ProductTypeAnswers> globalAnswers = new ObservableCollection<ProductTypeAnswers>();
                /**
                 * Added custom parameter object for re-direction purpose
                 */
                LoadVerificationTxnParameter loadFormRequest1 = new LoadVerificationTxnParameter();
                ObservableCollection<LoadVerificationTxnSubParameter> answerListData1 = new ObservableCollection<LoadVerificationTxnSubParameter>();
                int i = 0;
                Boolean selectionOnce = true;
                // Gettting the data source from nested Listview 
                foreach (ProductTypeQuestions listItem in this.groupListView.Items)
                {
                    ProductTypeQuestions currentObj = (ProductTypeQuestions)listItem;
                    /**
                     * Getting the header table data from repeted lines 
                     * and assign the values to header and lines object
                     * 
                     */
                    if (selectionOnce)
                    {
                        loadFormRequest1.DocumnetNo = "FMMF1002";
                        DateTime formattedDate = DateTime.ParseExact("09/09/2015", "MM/dd/yyyy", null);
                        loadFormRequest1.IssuedDate = "09/09/2015";
                        loadFormRequest1.Revision = "3";
                        DateTime formattedRevisedDate = DateTime.ParseExact("01/04/2016", "MM/dd/yyyy", CultureInfo.InvariantCulture);
                        loadFormRequest1.Revised = "01/04/2016"; ;
                        loadFormRequest1.LoadersName = tLoaderName.Text;
                        loadFormRequest1.Shift = tShift.Text;
                        loadFormRequest1.Area = tArea.Text;
                        loadFormRequest1.TrailerWeight = tTrailerWeight.Text;
                        loadFormRequest1.CustomerName = tCustomerName.Text;
                        loadFormRequest1.OrderNumber = tOrderNumber.Text;
                        loadFormRequest1.TrailerNumber = tTruckID.Text;
                        loadFormRequest1.AdditionalComments = rtAdditionalComment.Text.ToString(); 
                        //loadFormRequest.AuditorSignature = sigObject.SignatureImage;// await byteArray;
                        //await Task.Delay(TimeSpan.FromSeconds(3));
                        loadFormRequest1.AuditDate = DateTime.Now.ToString("dd/MM/yyyy");
                        loadFormRequest1.UserID = userID.ToString();
                        // Based on user selection SAVE or SUBMIT set the transaction flag value in order to send EMAIL
                        loadFormRequest1.TransactionType = "SUBMIT";
                        loadFormRequest1.FirstName = firstName;
                        loadFormRequest1.LastName = lastName;
                        loadFormRequest1.DomainName = domainName;
                        loadFormRequest1.EmailAccount = emailAccount;
                        loadFormRequest1.ActiveOrderNumber = activeOrderButton;
                        loadFormRequest1.DirectLoad = DirectLoad;
                        loadFormRequest1.OrgCode = OrgCode;
                        selectionOnce = false;
                    }
                    // Getting the values for line table 
                    ObservableCollection<ProductTypeAnswers> answers = currentObj.Answers;
                    foreach (ProductTypeAnswers currentAnswer in answers)
                    {
                        LOADVERIFICATIONTXNReqTransactionDetailsData answerObj = new LOADVERIFICATIONTXNReqTransactionDetailsData();
                        LoadVerificationTxnSubParameter answerObj1 = new LoadVerificationTxnSubParameter();
                        answerObj1.ProductTypeAnswerID = currentAnswer.ProductTypeAnswerID.ToString();
                        //Based on the checkbox selection asign the flag with 'Y' or 'N'
                        if (currentAnswer.IsSelected)
                            answerObj1.AnswerFlag = "Y";
                        else
                            answerObj1.AnswerFlag = "N";

                        //answerListData[i] = answerObj;
                        answerListData1.Add(answerObj1);
                        i++;
                    }
                    loadFormRequest1.TransactionDetailsData = answerListData1;
                }


                this.Frame.Navigate(typeof(TestInkManager), loadFormRequest1);
            }
            catch (Exception exp)
            {
                exp.StackTrace.ToString();
                CommonUtility.showMessageBox("Exception during LoadVerfication service" + exp.StackTrace.ToString(), "Exception");
            }
        }

        private async Task CreateSaveBitmapAsync(Canvas canvas)
        {           
            try
            {
                //Logic for Signature Capture
                var bitmap = new RenderTargetBitmap();
                await bitmap.RenderAsync(canvas); // ccDraw is CanvasControl
                byte[] byteArray = null;
                // get the pixels
                IBuffer pixelBuffer = await bitmap.GetPixelsAsync();
                byte[] pixels = pixelBuffer.ToArray();

                // write the pixels to a InMemoryRandomAccessStream
                var stream = new InMemoryRandomAccessStream();
                var encoder = await BitmapEncoder.CreateAsync(BitmapEncoder.BmpEncoderId, stream);
                encoder.SetPixelData(BitmapPixelFormat.Bgra8, BitmapAlphaMode.Straight, (uint)bitmap.PixelWidth, (uint)bitmap.PixelHeight, 96, 96, pixels);

                await encoder.FlushAsync();
                stream.Seek(0);

                Image iNew = new Image();
                iNew.Stretch = Stretch.None;
                iNew.Source = bitmap;
                byteArray = await Convert(stream);

                DatabaseHandler dbHandler = new DatabaseHandler();
                SignatureImg tImage = new SignatureImg();
                tImage.TruckID = truckName;
                tImage.SignatureImage = byteArray;
                dbHandler.insertSignatureImg(tImage);
            }
            catch (Exception exp)
            {
                Utils.CommonUtility.showMessageBox("Exception in save **** -->" + exp.Message, "Exception");
            }


        }
        private void TextBlock_SelectionChanged(object sender, RoutedEventArgs e)
        {

        }

        /// <summary>
        /// Handler event for answer selection 
        /// For every check and unckeck ObservableCollection will updated in order to find the user selection
        /// Answer List will be updated based on the selection
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void selectedAnswersCheckbox_Click(object sender, RoutedEventArgs e)
        {
            //Getting the current checked or unchecked item
            DataModel.ProductTypeAnswers selectedItem = (sender as CheckBox).DataContext as DataModel.ProductTypeAnswers;

            /**
             * perform checked action
             * mean overite the current truck IsSelected property to "TRUE"
            */
            if ((sender as CheckBox).IsChecked == true)
            {
                int selectedVal = selectedItem.ProductTypeAnswerID;
                String selectedVal1 = selectedItem.Answer;
                //finding the selected answer in list and update
                foreach (ProductTypeQuestions question in questionList)
                {
                    for (int i = 0; i < question.Answers.Count; i++)
                    {
                        if (question.Answers[i].ProductTypeQuestionID == selectedItem.ProductTypeQuestionID)
                        {
                            if(question.Answers[i].ProductTypeAnswerID == selectedItem.ProductTypeAnswerID)
                            {
                                selectedItem.IsSelected = true;
                                question.Answers[i] = selectedItem;
                            }
                        }
                    }
                }
            }            
        }

        /// <summary>
        /// Event handler for closing the popup window
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private async void closeButton_Click(object sender, RoutedEventArgs e)
        {
            LoadPage dialog = new LoadPage();
            dialog.CloseRequested += dialog_CloseRequested;
            this.catalogPopup = new Popup();
            this.catalogPopup.Child = dialog;
            this.catalogPopup.IsOpen = true;
            Parameters qParameter = new Parameters();
            qParameter.TruckNo = truckName;
            qParameter.OrderNumber = activeOrderButton;
            qParameter.OrgCode = tArea.Text;
            qParameter.FirstName = firstName;
            qParameter.LastName = lastName;
            qParameter.DomainName = domainName;
            qParameter.EmailAccount = emailAccount;
            qParameter.TotalQuantity = totalTruckQuantity;
            qParameter.TotalWeight = totalTruckWeight;
            qParameter.UserID = userID;
            qParameter.FormattedOrderNumber = tOrderNumber.Text;
            qParameter.SinglePointOrg = SinglePointLane;
            this.catalogPopup.IsOpen = false;

            if (DirectLoad.Equals("Y"))
            {
                this.Frame.Navigate(typeof(ScanningPage), qParameter);
            }
            else
            {
                this.Frame.Navigate(typeof(SinglePointLoadPage), qParameter);
            }
        }

        private async void saveButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                LoadPage dialog = new LoadPage();
                dialog.CloseRequested += dialog_CloseRequested;
                this.catalogPopup = new Popup();
                this.catalogPopup.Child = dialog;
                this.catalogPopup.IsOpen = true;

                LOADVERIFICATIONTXNReqTransactionDetailsData[] answerListData = new LOADVERIFICATIONTXNReqTransactionDetailsData[100];
                LOADVERIFICATIONTXNReq loadFormRequest = new LOADVERIFICATIONTXNReq();
                ObservableCollection<ProductTypeAnswers> globalAnswers = new ObservableCollection<ProductTypeAnswers>();
                int i = 0;
                Boolean selectionOnce = true;
                // Gettting the data source from nested Listview 
                foreach (ProductTypeQuestions listItem in this.groupListView.Items)
                {
                    ProductTypeQuestions currentObj = (ProductTypeQuestions)listItem;
                    /**
                     * Getting the header table data from repeted lines 
                     * and assign the values to header and lines object
                     * 
                     */
                    if (selectionOnce)
                    {
                        loadFormRequest.DocumnetNo = "FMMF1002";
                        DateTime formattedDate = DateTime.ParseExact("09/09/2015", "MM/dd/yyyy", null);
                        loadFormRequest.IssuedDate = "09/09/2015";
                        loadFormRequest.Revision = "3";
                        DateTime formattedRevisedDate = DateTime.ParseExact("01/04/2016", "MM/dd/yyyy", CultureInfo.InvariantCulture);
                        loadFormRequest.Revised = "01/04/2016"; ;
                        loadFormRequest.LoadersName = tLoaderName.Text;
                        loadFormRequest.Shift = tShift.Text;
                        loadFormRequest.Area = tArea.Text;
                        loadFormRequest.TrailerWeight = tTrailerWeight.Text;
                        loadFormRequest.CustomerName = tCustomerName.Text;
                        loadFormRequest.OrderNumber = tOrderNumber.Text;
                        loadFormRequest.TrailerNumber = tTruckID.Text;
                        loadFormRequest.AdditionalComments = rtAdditionalComment.Text.ToString();
                        //loadFormRequest.AuditorSignature = sigObject.SignatureImage;// await byteArray;
                        //await Task.Delay(TimeSpan.FromSeconds(3));
                        loadFormRequest.AuditDate = DateTime.Now.ToString("dd/MM/yyyy");
                        loadFormRequest.AuditorSignature = null;
                        loadFormRequest.UserID = userID.ToString();
                        // Based on user selection SAVE or SUBMIT set the transaction flag value in order to send EMAIL
                        loadFormRequest.TransactionType = "SAVE";
                        loadFormRequest.DirectLoad = DirectLoad;
                        selectionOnce = false;
                    }
                    // Getting the values for line table 
                    ObservableCollection<ProductTypeAnswers> answers = currentObj.Answers;
                    foreach (ProductTypeAnswers currentAnswer in answers)
                    {
                        LOADVERIFICATIONTXNReqTransactionDetailsData answerObj = new LOADVERIFICATIONTXNReqTransactionDetailsData();
                        answerObj.ProductTypeAnswerID = currentAnswer.ProductTypeAnswerID.ToString();
                        //Based on the checkbox selection asign the flag with 'Y' or 'N'
                        if (currentAnswer.IsSelected)
                            answerObj.AnswerFlag = "Y";
                        else
                            answerObj.AnswerFlag = "N";

                        answerListData[i] = answerObj;
                        i++;
                    }
                    loadFormRequest.TransactionDetailsData = answerListData;
                }
                await Task.Delay(TimeSpan.FromSeconds(3)); // set your desired delay
                //this.Frame.Navigate(typeof(TestInkManager), loadFormRequest);
                // create an instance of the webservice client object                        
                YardManagementSystem_BPELClient webRequestClient = new YardManagementSystem_BPELClient();
                webRequestClient.Endpoint.Address = new System.ServiceModel.EndpointAddress(CommonUtility.getIPAddress() + "/soa-infra/services/BBNA_Butler/YardManagementSystem/YardManagementSystem_ep");
                GetLoadVerficationTxnDataResponse serviceResponse = (GetLoadVerficationTxnDataResponse)webRequestClient.GetLoadVerficationTxnDataAsync(loadFormRequest).Result;
                LOADVERIFICATIONTXNResp fResponse = (LOADVERIFICATIONTXNResp)serviceResponse.LOADVERIFICATIONTXNResp;
                string result = fResponse.Status;
                string error = fResponse.ErrorMsg;
                if (result.Equals("S"))
                {
                    /*
                     * Delete all the images from SQL DB - for that particular TRUCK once successfully uploaded into server
                     */
                    XReturnObject returnObject = dbHandler.deleteTruckImages(truckName);
                    //delete the signature from internal DB after successful upload
                    //dbHandler.deleteExistingSignature(loadFormRequest.TrailerNumber);
                    Parameters qParameter = new Parameters();
                    qParameter.TruckNo = truckName;
                    qParameter.OrderNumber = activeOrderButton;
                    qParameter.OrgCode = tArea.Text;
                    qParameter.FirstName = firstName;
                    qParameter.LastName = lastName;
                    qParameter.DomainName = domainName;
                    qParameter.EmailAccount = emailAccount;
                    qParameter.TotalQuantity = totalTruckQuantity;
                    qParameter.TotalWeight = totalTruckWeight;
                    qParameter.UserID = userID;
                    qParameter.FormattedOrderNumber = tOrderNumber.Text;
                    qParameter.SinglePointOrg = SinglePointLane;

                    this.catalogPopup.IsOpen = false;

                    if (DirectLoad.Equals("Y"))
                    {
                        this.Frame.Navigate(typeof(ScanningPage), qParameter);
                    }
                    else
                    {
                        this.Frame.Navigate(typeof(SinglePointLoadPage), qParameter);
                    }
                }
                else
                {
                    this.catalogPopup.IsOpen = false;
                    CommonUtility.showMessageBox("Error while updating Load form data! Please close the APP." + error, "Warning");
                    // Frame.Navigate(typeof(TruckSelection));
                }
            }
            catch (Exception exp)
            {
                exp.StackTrace.ToString();
                CommonUtility.showMessageBox("Exception during LoadVerfication service" + exp.StackTrace.ToString(), "Exception");
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="args"></param>
        private void groupListView_ContainerContentChanging(ListViewBase sender, ContainerContentChangingEventArgs args)
        {
            LinearGradientBrush evenLinearGradientBrush =
            new LinearGradientBrush
            {
                StartPoint = new Point(0, 0),
                EndPoint = new Point(0, 0.5),
                SpreadMethod = GradientSpreadMethod.Reflect
            };            //Color _secondColor = new Color { A = 255, R = 198, G = 198, B = 198 };
            evenLinearGradientBrush.GradientStops.Add(new GradientStop
            {
                Color = Color.FromArgb(0xff, 0, 0, 0),
                Offset = 0
            });
            evenLinearGradientBrush.GradientStops.Add(new GradientStop
            {
                Color = Color.FromArgb(0xff, 39, 39, 39),
                Offset = 1
            });

            LinearGradientBrush oddLinearGradientBrush =
            new LinearGradientBrush
            {
                StartPoint = new Point(0, 0),
                EndPoint = new Point(0, 0.5),
                SpreadMethod = GradientSpreadMethod.Reflect
            };            //Color _secondColor = new Color { A = 255, R = 198, G = 198, B = 198 };
            oddLinearGradientBrush.GradientStops.Add(new GradientStop
            {
                Color = Color.FromArgb(0xff, 39, 39, 39),
                Offset = 0
            });
            oddLinearGradientBrush.GradientStops.Add(new GradientStop
            {
                Color = Color.FromArgb(0xff, 65, 65, 65),
                Offset = 1
            });

            //Color _secondColor = new Color { A = 255, R = 198, G = 198, B = 198 };
            SolidColorBrush oddBackground = new SolidColorBrush(Color.FromArgb(0xff, 35, 35, 35));
            SolidColorBrush evenBackground = new SolidColorBrush(Color.FromArgb(0xff, 57, 57, 57));
            if (args.ItemIndex % 2 != 0)
            {
                args.ItemContainer.Background = oddLinearGradientBrush;
            }
            else
            {
                args.ItemContainer.Background = evenLinearGradientBrush;
            }
        }
    }
}

using ButlerWarehouseApp.DataModel;
using ButlerWarehouseApp.DataModel.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.UI.Popups;
using Windows.UI.Xaml.Controls;

namespace ButlerWarehouseApp.Utils
{
    public class CommonUtility
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="messageData"></param>
        /// <param name="titleData"></param>
        public async static void showMessageBox(string messageData, string titleData)
        {
            var msgDiaglog = new Windows.UI.Popups.MessageDialog(messageData, titleData);
            msgDiaglog.DefaultCommandIndex = 1;
            await msgDiaglog.ShowAsync();


        }

        /// <summary>
        /// Method to play alert sound
        /// Used MediaElement as input to play sound
        /// </summary>
        /// <param name="mElement"></param>
        public static void playALert(MediaElement mElement,String scanType)
        {
            if (scanType.Equals("I"))
                mElement.Source = new Uri("ms-appx:///Assets/InvalidBeep.wav", UriKind.RelativeOrAbsolute);
            else
                mElement.Source = new Uri("ms-appx:///Assets/Beep.wav", UriKind.RelativeOrAbsolute);

            mElement.Play();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="messageData"></param>
        /// <param name="titleData"></param>
        public async static void showOKMessageBox(string messageData, string titleData)
        {
            var msgDiaglog = new Windows.UI.Popups.MessageDialog(messageData, titleData);
            msgDiaglog.Commands.Add(new UICommand(("OK")));
            msgDiaglog.DefaultCommandIndex = 1;
            await msgDiaglog.ShowAsync();
        }

        /// <summary>
        /// Method to get the SOA service deployed host ip address
        /// </summary>
        /// <returns></returns>
        public static String getIPAddress()
        {
            String webserviceIPAddress = "http://";
            //webserviceIPAddress = StaticDefinitions.YASH_IP_ADDRESS;
            //Modifying to get the details from the Global Environment value
            webserviceIPAddress = "http://"+App.selectedEnvironmentIP;
            return webserviceIPAddress;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="messageData"></param>
        /// <param name="titleData"></param>
        public async static void dialogMessageBox(string messageData, string titleData, ScanningItem updateItem, DatabaseHandler dbHandler)
        {
            var messageDialog = new Windows.UI.Popups.MessageDialog("Are you sure! You want to unload Truck?", "Confirmation Message");
            // Add commands and set their callbacks
            messageDialog.Commands.Add(new UICommand("Yes", (command) =>
            {
                updateItem.UpdatedDate = DateTime.Now;
                updateItem.TruckID = "";
                dbHandler.UpdateItem(updateItem);
            }));
            messageDialog.Commands.Add(new UICommand("No", (command) =>
            {
            }));
            // Set the command that will be invoked by default
            messageDialog.DefaultCommandIndex = 1;
            messageDialog.CancelCommandIndex = 2;
            // Show the message dialog
            await messageDialog.ShowAsync();
        }
    }

}

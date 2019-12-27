using Client.Services;
using DocuSign.eSign.Client;
using DocusignWebMVC.Models;
using jwt_framework;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WIS.DTS.Main;
using WIS.WebControls;

namespace DocusignWebMVC.Controllers
{
    public class HomeController : Controller
    {
        private DataAccess _dataAccess;

        public ActionResult Index()
        {



            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View(new ClientViewModel());
        }

        [HttpGet]
        public ActionResult Report()
        {
            //check for model.Name property value now
            //to do : Return something
      

            return View (new ClientViewModel());
        }

        [HttpPost]
        public ActionResult SendDocs(string templateId)
        {
            //check for model.Name property value now
            //to do : Return something

            ApiClient apiClient = new ApiClient("https://demo.docusign.net" + "/restapi");

            Envelopes envelopes = new Envelopes(apiClient);
            envelopes.ProcessEnvelopes(templateId);
            return View();
        }
        [HttpGet]
        public string GetClients()
        {

            string wisConnectionString = "Data Source=WISPRODUCTION;initial catalog=uploads;persist security info=True;Trusted_Connection=True;";
            _dataAccess = new DataAccess(wisConnectionString, true);
            var result = _dataAccess.GetClients().GetXml();
      
     
         
            return result;

        }
        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
        private InitUserSession GetUserSession(string dbEnvironment)
        {
            //try
            //{
            string userName = User.Identity.Name;

            WisWebFormSupport _wisFormSupport = new WisWebFormSupport(dbEnvironment, userName);
            InitUserSession intUserSession = _wisFormSupport.UserSession;

            return intUserSession;
            //}
            //catch (Exception)
            //{
            //    throw new Exception(string.Format("Cannot resolve the database ", dbEnvironment));
            //}
        }
    }
}
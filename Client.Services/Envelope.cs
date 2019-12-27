using Client.Services;
using DocuSign.eSign.Client;
using DocuSign.eSign.Model;
using System.Collections.Generic;


namespace jwt_framework
{
    public class Envelopes : AuthToken
    {
        /// <summary>
        /// This class create and send envelope
        /// </summary>
        /// <param name="apiClient"></param>
        public Envelopes(ApiClient apiClient) : base(apiClient)
        {
        }

        public string ProcessEnvelopes(string templateId)
        {
            string response = string.Empty;
            List<IEnvelope> envelopes = new List<IEnvelope>();
            ApiEnvelope apiEnvelope = new ApiEnvelope(ApiClient);
            JwtEnvelope jwtEnvelope = new JwtEnvelope(ApiClient);
            envelopes.Add(apiEnvelope);
            envelopes.Add(jwtEnvelope);
            foreach (var env in envelopes)
            {
                var envDef = CreateEvelope(templateId);
                response = env.SendEnvelope(envDef);
            }
            return response;
        }

        private static EnvelopeDefinition CreateEvelope(string templateId)
        {
           // string templateId = "212fcb4c-75b2-41a3-9f40-1056373a5c6e";

            EnvelopeDefinition envDef = new EnvelopeDefinition();

            envDef.TemplateId = templateId;
            TemplateRole tRole = new TemplateRole();
            tRole.Email = "rberger@weitzlux.com";
            //tRole.Name = "Rafael Berger";
            tRole.RoleName = "signer";

            tRole.Tabs = new Tabs();
            tRole.Tabs.TextTabs = new List<Text>();
            Text textTab = new Text();
            textTab.TabLabel = "FullName";
            textTab.Value = "R Berger";
            tRole.Tabs.TextTabs.Add(textTab);
            List<TemplateRole> rolesList = new List<TemplateRole>() { tRole };

            envDef.EmailSubject = "[DocuSign] - Please sign this doc";
            envDef.TemplateRoles = rolesList;
            envDef.Status = "sent";
            return envDef;
        }



        //EnvelopesApi envelopesApi = new EnvelopesApi(ApiClient.Configuration);
        //EnvelopesInformation envelopesList = new ListEnvelopes(ApiClient).List();

        //var url = "https://account-d.docusign.com";
        //var client = new RestClient(url);

        //string filePath = String.Empty;
        //FileStream fs = null;
        //foreach (var envelope in envelopesList.Envelopes)
        //{
        //    CheckToken();
        //    FoldersApi foldersApi = new FoldersApi(ApiClient.Configuration);
        //    //FoldersRequest foldersRequest = new FoldersRequest();
        //    //foldersRequest.EnvelopeIds = new List<string>();
        //    //foldersRequest.EnvelopeIds.Add(envelope.EnvelopeId);


        //    //foldersApi.MoveEnvelopes(accountId, "recyclebin", foldersRequest);

        //    EnvelopeDocumentsResult docsList = envelopesApi.ListDocuments(accountId, envelope.EnvelopeId);


        //    //foreach (var document in docsList.EnvelopeDocuments)
        //    //{

        //    //    MemoryStream docStream = (MemoryStream)envelopesApi.GetDocument(accountId, envelope.EnvelopeId, document.DocumentId);

        //    //    filePath = @"C:\wlcollection\WORKAREA RafaelB\Docusign\Envelopes\" + envelope.EnvelopeId + document.DocumentId + ".pdf";
        //    //    fs = new FileStream(filePath, FileMode.Create);
        //    //    docStream.Seek(0, SeekOrigin.Begin);
        //    //    docStream.CopyTo(fs);
        //    //    fs.Close();
        //    //}
        //}
    }
}

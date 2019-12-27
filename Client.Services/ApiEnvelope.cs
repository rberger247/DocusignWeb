using DocuSign.eSign.Client;
using DocuSign.eSign.Model;
using RestSharp;
using Newtonsoft.Json;

namespace Client.Services
{
    internal class ApiEnvelope : AuthToken, IEnvelope
    {
        public ApiEnvelope(ApiClient apiClient) : base(apiClient)
        {
        }      

        public string SendEnvelope(EnvelopeDefinition envDef)
        {
            string accountId = "9597916";
            var envelopeJson = JsonConvert.SerializeObject(envDef);
            var request = new RestRequest("/resource/", Method.POST);
            request.Resource = $"/restapi/v2/accounts/{accountId}/envelopes/";
            AuthToken authToken = new AuthToken(ApiClient);
            var accessToken = authToken.CheckToken();
            var client = new RestClient("https://demo.docusign.net");

            request.AddParameter("Authorization", string.Format("Bearer " + accessToken), ParameterType.HttpHeader);
            request.AddParameter("application/json; charset=utf-8", envelopeJson, ParameterType.RequestBody);
            IRestResponse responses = client.Execute(request);
            return responses.ToString();
        }
    }

  
}


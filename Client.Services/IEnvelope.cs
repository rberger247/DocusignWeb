using DocuSign.eSign.Model;

namespace Client.Services
{
    interface IEnvelope
    {
        string SendEnvelope(EnvelopeDefinition envDef);
    }
}

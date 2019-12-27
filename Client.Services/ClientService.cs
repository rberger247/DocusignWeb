using SQLWNET.WIS.DATA;

namespace Client.Services
{
    public class ClientService 
    {
        private DataFactory df;
        private string ConnectionString;

        public ClientService(string connectionString)
        {
            df = new DataFactory();
            ConnectionString = connectionString;
        }
    }
}

using SQLWNET.WIS.DATA;
using System.Data;
using System.Data.SqlClient;

namespace Client.Services
{
    public class DataAccess
    {

        public DataFactory df;
        private string ConnectionString;
        SqlConnection sqlConn;

        public DataAccess(string connectionString, bool useDapper)
        {
            ConnectionString = connectionString;

            df = new DataFactory();
            if (useDapper)
            {
                sqlConn = GetOpenConnection(ConnectionString);
            }

        }
        public DataSet GetClients()
        {
            
            SqlConnection sql = new SqlConnection("Data Source=WISPRODUCTION;initial catalog=uploads;persist security info=True;Trusted_Connection=True;");
            var ds = df.ExecuteDataset(sql, CommandType.Text, "Select * from TestDocusignClients", null);
            
            return ds;
        }
        private SqlConnection GetOpenConnection(string connectionString)
        {
            var result = new SqlConnection(connectionString);
            result.Open();
            return result;
        }

    }

}

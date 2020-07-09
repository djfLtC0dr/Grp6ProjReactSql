const express = require('express');

const sql = require('mssql');
const { response } = require('express');
const server = 'localhost';

var sqlConfig = {
    server: `${server}`,
    database: 'AdventureWorks',
    user: 'dbUser',
    password: 'dbUserP@$$w0rd',
    options: {
        enableArithAbort: true,
        encrypt: true
      },
    port: 1433
};

const pool = new sql.ConnectionPool(sqlConfig);
const poolCnx = pool.connect();

pool.on('SQL ConnectionPool Error', err => {
  // ... error handler
  console.log(err)
})

const app = express();
const port = 3001;


app.listen(port, () => {
  console.log(`App server now listening to port ${port}`);
});

app.get('/sss/users', (req, res) => {
  try {  
    return poolCnx.then(pool => {
      const table ='HumanResources.SSS';
      const queryParam = "'/5%'"
      const query = `SELECT OrgNode, NodeString, LoginID, Email, Name, Title, Supervisor FROM ${table} WHERE NodeString LIKE ${queryParam} ORDER BY OrgLvl, NodeString;`
      return pool.query(query)
      }).then(result => {
        // do something with result
        return res.status(200).send(result.recordset)
      })
  } catch (err) {
    console.error('SQL error', err);
  }
});

//TODO
app.post('/sss/coord', (req, res) => {
    try {
      return poolCnx.then(pool => {
        // INSERT INTO [HumanResources].[SSSCoord]
        const table = 'HumanResources.SSSCoord'
        const columns = '([LoginID] ,[CoordType] ,[DateSubmit] ,[CurrentDueDate] ,[OverallDueDate] ,[CurrentCoordComplete] ,[CurrentCoordOwner] ,[FinalCoordOwner] ,[OverallCoordComplete])'
        // VALUES
        const loginID = req.params.LoginID;
        const coordType = 'Signature';
        const dateSubmit = Date.now();
        const currentDueDate = addDays(dateSubmit, 2);
        const overallDueDate = addDays(currentDueDate, 2);
        const currentCoordComplete = 0;
        const currentCoordOwner = req.params.CoordTo; //TODO: Needs to be re-factored based on NodeString
        const finalCoordOwner = req.params.CoordTo;
        const overallCoordComplete = 0;
      })
    } catch (err) {
      console.error('SQL error', err);
    }
  })

    // connection.query('INSERT INTO HumanResources.SSSCoord  ?',users, function (error, results, fields) {
    //   if (error) {
    //   console.log("error ocurred",error);
    // res.send({
    // "code":400,
    // "failed":"error ocurred"
    // })
    // }else{
    // console.log('The solution is: ', results);
    // res.send({
    // "code":200,
    // "success":"user registered sucessfully"
    // });
    // }
    // });
    // });

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
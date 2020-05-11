const express = require('express');
const router = express.Router();

const dbConnection = require('../database');

router.post('/videoQuestionsPdf', (req, res) => {
    let params = req.body;
    let userId = params.userId;
    let catalogQuestionId = params.catalogQuestionId;

    // Search for request for same user where request is not yet sent and time is less than 5 minutes
    console.log(`Search for request for same user where request is not yet sent and time is less than 5 minutes`);
    dbConnection.query(`Select * from sendPdf where userId = ${userId} and sendTime > ${Math.floor(new Date().getTime()/1000)} and sent = 0 order by id desc limit 1`,
        function(err, results, fields) {
            if(results && results.length > 0){
                console.log(`Update sendPdf `);
                // request less than 5 minutes is present, update in same request
                dbConnection.query(`Update sendPdf set catalogQuestionId = ${catalogQuestionId}, sendTime = ${Math.floor(new Date().getTime()/1000)} where id = ${results[0].id}`,
                function(error, updateResult) {
                    console.log(error);
                    if(error){
                        res
                        .status(500)
                        .json({
                            status: "false",
                            message: "Some error occured"
                        });
                    }else{
                        res
                        .status(200)
                        .json({
                            status: "true",
                            message: "Successfully updated request"
                        });
                    }
                });
            } else{
                console.log("Insert in sendpdf ");
                // No request present make a new entry
                dbConnection.query(`Insert into sendPdf(userId, catalogQuestionId, sendTime, sent) values(${userId}, ${catalogQuestionId}, ${Math.floor(new Date().getTime()/1000) + 300}, 0)`,
                function(error, insertResult) {
                    if(error){
                        res
                        .status(500)
                        .json({
                            status: "false",
                            message: "Some error occured"
                        });
                    }else{
                        res
                        .status(200)
                        .json({
                            status: "true",
                            message: "Successfully created request"
                        });
                    }
                });
                
            }
        }
    )
});

module.exports = router;
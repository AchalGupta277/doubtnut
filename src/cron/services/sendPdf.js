const dbConnection = require('../../database');
let ejs = require("ejs");
let pdf = require("html-pdf");
let path = require("path");

let sampleQuestions = [
    { question: "Which one is correct answer 1?" },
    { question: "Which one is correct answer 2?" },
    { question: "Which one is correct answer 3?" },
    { question: "Which one is correct answer 4?" },
    { question: "Which one is correct answer 5?" },
];

const sendPdf = () => {
    console.log("----------------------------- Cron for sending pdf running -----------------------------");
    const query = `Select * from sendPdf where sendTime <= ${new Date().getTime()} and sent = 0`;
    dbConnection.query(query,
        function (err, results) {
            for (let i = 0; i < results.length; i++) {
                // NOTE : ---------------------------------------------------------------- GENERATE PDF ------------------------------------------------------------------
                generatePdf(results[i]['userId'], results[i]['id']);
            }    
        }
    );
}

const generatePdf = (userId, requestId) => {
    console.log("----------------------------- Generating pdf -----------------------------");
    ejs.renderFile(path.join(__dirname, '../../views/', "report.ejs"), { questions: sampleQuestions }, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            let options = {
                "height": "11.25in",
                "width": "8.5in",
                "header": {
                    "height": "20mm"
                },
                "footer": {
                    "height": "20mm",
                },
            };
            let fileName = `${userId}-${new Date().getTime()}.pdf`;

            // NOTE : ----------------------------------------------------------------DELETE FILES AFTER SENDING THROUGH APPROPRIATE MEDIUM ------------------------------------------------------------------

            pdf.create(data, options).toFile(fileName, function (err, data) {
                if (err) {
                    console.log("An error occured", err);
                } else {
                    console.log("File created and send using the sendService")
                    dbConnection.query(`Update sendPdf set sent = 1 where id = ${requestId}`,
                    function (err) {
                        if (err) {
                            console.log(err)
                        }
                    }
                )
                }
            });
        }
    });
}

module.exports = sendPdf;
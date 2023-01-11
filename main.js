const express = require("express")
const app = express();
const port = 3006;

const mysql=require("./connection").con


//configuration
app.set("view engine","hbs");
app.set("views", "./view");


//Routing
app.get("/",(req,res)=>{
    res.render("index")
});
app.get("/add", (req, res) => {
    res.render("add")

});
app.get("/search1", (req, res) => {
    res.render("search1")

});

app.get("/search2", (req, res) => {
    res.render("search2")

});

app.get("/update", (req, res) => {
    res.render("update")

});

app.get("/delete", (req, res) => {
    res.render("delete")

});


app.get("/view", (req, res) => {
    let qry = "select * from spring";
    mysql.query(qry, (err, results) => {
        if (err) throw err
        else {
            res.render("view", { data: results });
        }

    });

});


app.get("/addstudent", (req, res) => {
    // fetching data from form
    const { eid, ename, empdesig, empdept, empsal, emploc } = req.query

    // Sanitization XSS...
    let qry = "select * from spring where eid=?";
    mysql.query(qry, [eid], (err, results) => {
        if (err)
            throw err
        else {

            if (results.length > 0) {
                res.render("add", { checkmesg: true })
            } else {

                // insert query
                let qry2 = "insert into spring values(?,?,?,?,?,?)";
                mysql.query(qry2, [eid, ename, empdesig, empdept, empsal, emploc], (err, results) => {
                    if (results.affectedRows > 0) {
                        res.render("add", { mesg: true })
                    }
                })
            }
        }
    })
});



app.get("/updatesearch", (req, res) => {
    // fetching data from form


    const { eid } = req.query;

    let qry = "select * from spring where eid=?";
    mysql.query(qry, [eid], (err, results) => {
        if (err) throw err
        else {
            if (results.length > 0) {
                res.render("update", { mesg1: true, mesg2: false, data: results })
            } else {

                res.render("update", { mesg1: false, mesg2: true })

            }

        }
    });

})


app.get("/updatestudent", (req, res) => {
    // fetching data from form


    const { eid, emploc } = req.query;
    let qry="update spring set emploc=? where eid=?";
    
    mysql.query(qry, [eid, emploc], (err, results) => {
        if (err) throw err
        else {
            if (results.affectedRows > 0) {
                res.render("update", { umesg: true })
            }
        }        
    })
})

app.get("/removestudent", (req, res) => {

    // fetch data from the form


    const { eid } = req.query;

    let qry = "delete from spring where eid=?";
    mysql.query(qry, [eid], (err, results) => {
        if (err) throw err
        else {
            if (results.affectedRows > 0) {
                res.render("delete", { mesg1: true, mesg2: false })
            } else {

                res.render("delete", { mesg1: false, mesg2: true })

            }

        }
    });
});


app.listen(port,(err)=>{
    if(err)
        throw err
    else
        console.group("Server running at %d port",port);
});


app.get("/searchstudentbyphno", (req, res) => {
    // fetch data from the form


    const { empdept } = req.query;

    let qry = "select * from spring where empdept=?";
    mysql.query(qry, [empdept], (err, results) => {
        if (err) throw err
        else {
            if (results.length > 0) {
                res.render("search1", { mesg1: true, mesg2: false })
            } else {

                res.render("search1", { mesg1: false, mesg2: true })

            }

        }
    });
})


app.get("/searchstudentbysal", (req, res) => {
    // fetch data from the form


    const { empdept,empsal } = req.query;

    let qry = "select * from spring where empdept=? and empsal>120000";
    mysql.query(qry, [empdept, empsal], (err, results) => {
        if (err) throw err
        else {
            if (results.length > 0) {
                res.render("search2", { mesg1: true, mesg2: false })
            } else {

                res.render("search2", { mesg1: false, mesg2: true })

            }

        }
    });
})
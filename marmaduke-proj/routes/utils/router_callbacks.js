"use strict";

let queries = require("../data/queries");
let moment = require("moment");
let db_settings = require("../data/db_settings");

const {Pool, client} = require("pg");

/*
 * Callback list
 */

function cbLiveDataTable(tmpl_name, states){
    return (req, res, next) => {
      console.log(db_settings);
      const pool = new Pool(db_settings.AUTH_DB);
      const id = req.params.id;
      const mdate = moment().format("YYYY-MM-DD");
  
      // async/await call
      (async ()=> {
        const client = await pool.connect();
        try {
          const params = {
            mdate: mdate,
            statesOfInterest: states,
            id: id
          };
  
          let query = queries.shipsNow(params);      
          const records = await client.query(query);
          res.render(tmpl_name, {allDataNow: records.rows});
  
        } finally {
          client.release();
        }
  
      })().catch(e => console.log(e.stack));
    }
  }


function cbHomePage(){
  return function(req, res) {
    res.render("home", { title: "Main page" });
  }
}

module.exports = {
    cbHomePage: cbHomePage,
    cbLiveDataTable: cbLiveDataTable
}
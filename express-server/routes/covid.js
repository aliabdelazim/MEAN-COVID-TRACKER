const { response } = require("express");
const express = require("express");
const router = express.Router();
var unirest = require("unirest");
var countries = require("../mock/countriesLatLonDic.json")


router.get("/countries", (req, res, next) => {
    var request = unirest("GET", "https://covid-193.p.rapidapi.com/countries");

  
    request.headers({
        "x-rapidapi-key": "742355e704msh072229798e669dfp17f864jsn754fb33b57bd",
        "x-rapidapi-host": "covid-193.p.rapidapi.com",
        "useQueryString": true
    });


    request.end(function (response) {
        if (response.error) throw new Error(response.error);

        res.send(response.body)
    });
});

router.get("/statistics",  (req, res, next) => {
    var request = unirest("GET", "https://covid-193.p.rapidapi.com/statistics");


    request.headers({
        "x-rapidapi-key": "742355e704msh072229798e669dfp17f864jsn754fb33b57bd",
        "x-rapidapi-host": "covid-193.p.rapidapi.com",
        "useQueryString": true
    });
    
    
    request.end(function (response) {
        if (response.error) throw new Error(response.error);
    
        extractStatisticsData(response.body, res)
    })
})

router.get("/history", (req, res, next) => {
    
    var request = unirest("GET", "https://covid-193.p.rapidapi.com/history");
    request.query({
        "country": req.query.query ? req.query.query : "All"
    });
    request.headers({
        "x-rapidapi-key": "742355e704msh072229798e669dfp17f864jsn754fb33b57bd",
        "x-rapidapi-host": "covid-193.p.rapidapi.com",
        "useQueryString": true
    });
    request.end(function (response) {
        if (response.error) throw new Error(response.error);
        extractHistoricalData(response.body, res)
    });
});

const extractStatisticsData = (req, res)=> {
    let response = req.response
    let casesResponse = []
    response.map((statResp, statIndex)=> {
        let latlongObj = countries.countries.find(country=> (statResp.country === country.name))
        if(latlongObj){
            let casesObject = {
                ...statResp,
                totalInfected: statResp.cases.total,
                totalTests: statResp.tests.total,
                totalDeath: statResp.deaths.total,
                lat: latlongObj.latlng[0],
                lon: latlongObj.latlng[1],
            }
            casesResponse.push(casesObject);
        }
    })
    res.send(casesResponse)
}

const extractHistoricalData = (req, res) => {
    let response = req.response.slice(0,999)
    let dayBydayResponse = []
    dayBydayResponse.push(response[0])
    response.map((historicalResp,histIndex)=> {
        if(histIndex !==0 && historicalResp.day !== response[histIndex-1].day){
            dayBydayResponse.push(historicalResp);
        }
    })
    res.send(dayBydayResponse);
    
}

module.exports = router;
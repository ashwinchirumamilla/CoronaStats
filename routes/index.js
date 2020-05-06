const request = require('request');

module.exports = {
    getHomePage: function(req, res) {
        
        

        request('https://api.thevirustracker.com/free-api?global=stats', function(err, res, body){
            if (err) {
                return res.status(500).send(err);
            }

            let json = JSON.parse(body);
            //console.log(json);
            
            let total_cases = json.results[0].total_cases;
            let total_recovered = json.results[0].total_recovered;
            let total_unresolved = json.results[0].total_unresolved;
            let total_deaths = json.results[0].total_deaths;
            let total_new_cases_today = json.results[0].total_new_cases_today;
            let total_new_deaths_today = json.results[0].total_new_deaths_today;
            let total_affected_countries = json.results[0].total_affected_countries;

            var APIUpdate = `UPDATE globalstats
            SET total_cases = ${total_cases}, total_recovered = ${total_recovered}, total_unresolved = ${total_unresolved}, 
            total_deaths = ${total_deaths}, total_new_cases_today = ${total_new_cases_today}, total_new_deaths_today = ${total_new_deaths_today}, 
            total_affected_countries = ${total_affected_countries}
            WHERE id = 1;`

            
            database.query(APIUpdate, (error, result) => {
                if(err) {
                    return res.status(500).send(error);
                }
                
                console.log('Sucessfully updated table');
            });

        })
        
        
        database.query('SELECT * FROM globalstats ORDER by id ASC', (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            let months = {

            }
            let renderData = {
                stats: result[0],
                country: false,
                monthData: months
            }

            res.render('index', renderData);
        });

        

    },

    getCountryData: function(req, res) {
        let country = req.body.country;
        let date = req.body.date;
        console.log(country);
        let parsedDate = date.charAt(6) + "/" +  date.substring(8,10) + "/" + date.substring(2, 4);

        request(`https://api.thevirustracker.com/free-api?countryTimeline=${country}`, function(err, response, body){ 

            let countryTimeline = JSON.parse(body);
                    
            let countryData = countryTimeline.timelineitems[0];
            let countryDataByDate;
            let Jan = 0;
            let Feb = 0;
            let Mar = 0;
            let Apr = 0;
            let May = 0;
            Jan = countryData['1/31/20'].total_cases;
            Feb = countryData['2/28/20'].total_cases;
            Mar = countryData['3/31/20'].total_cases;
            Apr = countryData['4/30/20'].total_cases;
            May = countryData['5/05/20'].total_cases;
            for (var key in countryData) 
            { 
                if (!countryData.hasOwnProperty(key))
                    { continue; } 
                /*if (key == '1/31/20') {
                    Jan = countryData[key].total_cases;
                    console.log(Jan);

                } 
                else if (key == '2/28/20') {
                    Feb = countryData[key].total_cases;
                    console.log(Feb);
                }
                else if (key == '3/31/20') {
                    Mar = countryData[key].total_cases;
                    console.log(Mar);
                }
                else if (key == '4/30/20') {
                    Apr =  countryData[key].total_cases;
                    console.log(Apr);
                }
                else if (key == '5/5/20') {
                    May =  countryData[key].total_cases
                    console.log(May);
                }*/
                 if (key == parsedDate)
                {
                    console.log(key + ' -> ' +  countryData[key]);
                    countryDataByDate = countryData[key];
                    break;
                }
                
                
            }
            
            let months = {
                Jan: Jan,
                Feb: Feb,
                Mar: Mar,
                Apr: Apr,
                May: May
            }
            let renderData = {
                stats: countryDataByDate,
                country: true,
                name: req.body.country,
                date: parsedDate,
                monthData: months
            }

            res.render('index', renderData);
        })
      
    }
}
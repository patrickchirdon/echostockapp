
const express=require('express');
const app=express()
app.use(express.static('views/images')); 
const exphbs =require('express-handlebars');

const path = require('path');
const request = require('request')
const bodyParser= require('body-parser');

const PORT=process.env.PORT || 5000;

//use body parser middleware
app.use(bodyParser.urlencoded({extended: false}));

var tickervar = 0

const { Console } = require("console");
// get fs module for creating write streams
const fs = require("fs");

app.use(express.static('.'))

var jsondata;


function call_api(finishedAPI, ticker){
    
    if (tickervar===0){
    ticker='TSLA'
    tickervar=1
    }
    
	request('https://cloud.iexapis.com/stable/stock/' + ticker + '/quote?token=pk_2711a2706e924888a2a063e6e4cf4307', {json: true}, (err, res,body)=> {
	if(err){ return console.log(err);}
	if(res.statusCode ===200){
	    
    const myLogger = new Console({
    stdout: fs.createWriteStream("views/overview.json"),
    stderr: fs.createWriteStream("errStdErr.txt"),
    });
	    myLogger.log(JSON.stringify(body))
	    
        
        
		finishedAPI(body);
		}
	});
	
	if (tickervar===0){
    ticker='TSLA'
    tickervar=1
    }
    
	
	//advanced stats
	request('https://cloud.iexapis.com/stable/stock/' + ticker + '/stats?token=pk_2711a2706e924888a2a063e6e4cf4307', {json: true}, (err, res,body)=> {
	if(err){ return console.log(err);}
	if(res.statusCode ===200){
	     
    const myLogger = new Console({
    stdout: fs.createWriteStream("views/stats.json"),
    stderr: fs.createWriteStream("errStdErr.txt"),
    });
	    myLogger.log(JSON.stringify(body))
	    
		}
	});
	
	if (tickervar===0){
    ticker='TSLA'
    tickervar=1
    }
    
	//company info
	request('https://cloud.iexapis.com/stable/stock/' + ticker + '/company?token=pk_2711a2706e924888a2a063e6e4cf4307', {json: true}, (err, res,body)=> {
	if(err){ return console.log(err);}
	if(res.statusCode ===200){
	     
    const myLogger = new Console({
    stdout: fs.createWriteStream("views/info.json"),
    stderr: fs.createWriteStream("errStdErr.txt"),
    });
	myLogger.log(JSON.stringify(body))
	    
		}
	});
	
	if (tickervar===0){
    ticker='TSLA'
    tickervar=1
    }
    
	//company news
	request('https://cloud.iexapis.com/stable/stock/' + ticker + '/news/last/4?token=pk_2711a2706e924888a2a063e6e4cf4307', {json: true}, (err, res,body)=> {
	if(err){ return console.log(err);}
	if(res.statusCode ===200){
	     
        const myLogger = new Console({
        stdout: fs.createWriteStream("views/news.json"),
        stderr: fs.createWriteStream("errStdErr.txt"),
        });
	    myLogger.log(body)
	    finishedAPI(body);
	    
		}
	});
	
  
    

	
};




app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');



//Set index handlebar index  GET routes
app.get('/', function(req, res){
		call_api(function(doneAPI){
          
            
            
			res.render('home', {
			stock: doneAPI
			
			
			
		
		});
		
		
	});

});

//Set index handlebar index  POST routes
app.post('/', function(req, res){
		call_api(function(doneAPI){
		    console.log(req.body)
			posted_stuff =req.body.stock_ticker;
			res.render('home', {
			stock: doneAPI
			
			
			
				
		
		});
	}, req.body.stock_ticker);

});



//set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () =>console.log('Server Listening on port' + PORT))

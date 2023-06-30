const express = require('express');
const axios = require('axios');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const geohash = require('ngeohash');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.options('*', cors());
const TMAPIKey = 'ABCD';

app.get('/searchId', async function(req, res) {
    try {
        var searchID = req.query.id;
        var TMApi = "https://app.ticketmaster.com/discovery/v2/events/"+searchID+".json?apikey=" + TMAPIKey;
        axios.get(TMApi)
        .then(response => {
            console.log(response.data.name);
            res.send(JSON.stringify(response.data));
        })
    }
    catch (err) {
        console.log(err);
    }
});

app.get('/search', async function (req, res) {
    try {
        // console.log(req.query);
        var ticketmasterAPI = "https://app.ticketmaster.com/discovery/v2/events.json?apikey="+ TMAPIKey
        var keyword = req.query.keyword;
        var category = req.query.segmentId;
        var radius = req.query.distance;
        var lat = req.query.lat;
        var long = req.query.long;
        if(category === 'undefined' || category === 'null')
        {
            finalAPI = ticketmasterAPI + '&keyword=' + keyword + '&geoPoint=' + geohash.encode(lat, long, 7) + '&radius=' + radius + '&unit=miles' + "&limit=20";
        }
        else
        {
            finalAPI = ticketmasterAPI + '&keyword=' + keyword + '&geoPoint=' + geohash.encode(lat, long, 7) + '&radius=' + radius + '&segmentId=' + category +'&unit=miles' +"&limit=20";
        }
        axios.get(finalAPI)
        .then(response => {
            if(response.data && response.data._embedded && response.data._embedded.events)
            {
                res.send(JSON.stringify(response.data._embedded.events))
            }
            else
            {
                res.send([]);
            }
        })
    }
    catch (err) {
        console.log(err);
    }
});

app.get('/autocomplete', (req, res) => {
    try{
        var keyword = req.query.keyword;
        axios.get('https://app.ticketmaster.com/discovery/v2/suggest?apikey='+ TMAPIKey +'&keyword=' + keyword)
        .then(response => {

            if(response.data._embedded)
            {
                res.send(JSON.stringify(response.data._embedded.attractions));
            }
            else
            {
                console.log("No Attractions Available");
            }
        })
    }
    catch(err) {
      console.log(err);
    }
    
});

app.get('/locateUser', async(req, res) => {
    try{
        var locationValue = req.query.val;
        let response = await axios.get("https://maps.googleapis.com/maps/api/geocode/json?key=ABCD&address="+locationValue);
        let result = await response.data;
        if(result.status == "OK"){
            latitude = result['results'][0]['geometry']['location']['lat'];
            longitude = result['results'][0]['geometry']['location']['lng'];
            res.send(JSON.stringify([latitude,longitude]));
        }
        else{
            latitude = "none";
            res.send(JSON.stringify(latitude));
        }
    }
    catch(err){
        console.log(err);
    }
});

app.get('/artist', (req, res) => {

    try
    {
        var spotifyRequest = new SpotifyWebApi({
        clientId: 'ABCD',
        clientSecret: 'ABCD'
        });
    
        spotifyRequest.clientCredentialsGrant()
        .then(function(response) {

            var spotifyRequest = new SpotifyWebApi({
                clientId: 'ABCD',
                clientSecret: 'ABCD'
            });

            spotifyRequest.setAccessToken(response.body['access_token']);
    
            var spotifyRequest = new SpotifyWebApi({
                accessToken: response.body['access_token']
            });

            let result = [];

            spotifyRequest.searchArtists(req.query.name)
            .then(function(resp) {
                if(resp.body && resp.body.artists && resp.body.artists.items[0])
                {
                    result.push(resp.body.artists.items[0])
                }
                else
                {
                    res.send([]);
                }
                
                if(resp.body && resp.body.artists && resp.body.artists.items[0] && resp.body.artists.items[0].id)
                {
                    spotifyRequest.getArtistAlbums(resp.body.artists.items[0].id, {limit: 3})
                    .then(function(albumsResp) {
                        let albums=[]
                        for(var i=0; i<albumsResp.body.items.length; i++)
                        {
                            albums.push(albumsResp.body.items[i].images[0].url)
                        }
                        result.push({albums: albums})
                        res.send(JSON.stringify(result));
                    });
                }
            });
        })
    }
    catch(err){
        console.log(err);
    }
});

app.get('/venueDetails', (req, res) => {
    try
    {
        var name = req.query.name;
        axios.get('https://app.ticketmaster.com/discovery/v2/venues.json?apikey='+TMAPIKey+'&keyword=' + name)
        .then(response => {
            if(response.data && response.data._embedded && response.data._embedded.venues[0])
            {
                res.send(JSON.stringify(response.data._embedded.venues[0]));
            }
            else
            {
                res.send([]);
            }
        });
    }
    catch(err) {
      console.log(err);
    };
    
});



app.use(express.static(path.join(__dirname, 'dist/main')));
const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Localhost started on port ${port}`);
});

app.get('/*', function (req, res){
    res.sendFile(path.join(__dirname, '/dist/main/index.html'))
});
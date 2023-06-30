import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { single } from 'rxjs';


@Component({
  selector: 'app-home-table',
  templateUrl: './home-table.component.html',
  styleUrls: ['./home-table.component.css']
})
export class HomeTableComponent{
  @Input() data: any;
  @Output() dataLoaded = new EventEmitter<any>();
  noData = false;
  allEvents: any[] = [];
  events: any[] = [];
  eventClicked = false;
  clickedEvent: any[] =[];
  isFavorite = false;
  isMusic = false;
  artistDetails: any[] = [];
  venueDetailsData: any[] = [];
  coordinates: any;
  
  ngOnInit(): void {
    
  }
  text: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

  isExpandedOH: boolean = false;
  isExpandedGR: boolean = false;
  isExpandedCR: boolean = false;

  toggleExpansion(secName: string) {
    if(secName == "isExpandedOH")
    {
      this.isExpandedOH = !this.isExpandedOH;
    }
    if(secName == "isExpandedGR")
    {
      this.isExpandedGR = !this.isExpandedGR;
    }
    if(secName == "isExpandedCR")
    {
      this.isExpandedCR = !this.isExpandedCR;
    }
  }
  

  ngOnChanges(changes: SimpleChanges) {
    this.data = changes['data'].currentValue;
    this.fetchData();
  }

  async fetchData() {
    var url = 'https://homework8-382009.wn.r.appspot.com/search?keyword=' + this.data.keyword + '&segmentId=' + this.data.category + '&distance=' + this.data.radius + '&lat=' + this.data.latitude + '&long=' + this.data.longitude;
    // console.log(url);
    var response = await fetch(url);
    var result = await response.json();
    this.allEvents = result;
    for(let i=0; i<result.length; i++)
    {
      let singleEvent = {
        id: result[i].hasOwnProperty('id') ? result[i].id : '',
        date: result[i].hasOwnProperty('dates') ? result[i].dates.hasOwnProperty('start') ? result[i].dates.start.hasOwnProperty('localDate') ? result[i].dates.start.localDate : '' : '' : '',
        time: result[i].hasOwnProperty('dates') ? result[i].dates.hasOwnProperty('start') ? result[i].dates.start.hasOwnProperty('localTime') ? result[i].dates.start.localTime : '' : '' : '',
        genre: result[i].hasOwnProperty('classifications') ? result[i].classifications[0].hasOwnProperty('segment') ? result[i].classifications[0].segment.hasOwnProperty('name') ? result[i].classifications[0].segment.name : '' : '' : '',
        name: result[i].hasOwnProperty('name') ? result[i].name : '',
        image: result[i].hasOwnProperty('images') ? result[i].images[0].hasOwnProperty('url') ? result[i].images[0].url : '' : '',
        venue: result[i].hasOwnProperty('_embedded') ? result[i]._embedded.hasOwnProperty('venues') ? result[i]._embedded.venues[0].hasOwnProperty('name') ? result[i]._embedded.venues[0].name : '' : '' : '',
      }
      this.events.push(singleEvent);
    }
    this.events.sort((a: any, b: any) => {
      return new Date(a.date + " " + a.time).getTime() - new Date(b.date + " " + b.time).getTime();
    });
    if(result)
    {
      // console.log(result);
    }
    else
    {
      this.noData = true;
    }
  }

  eventDetails(id: string){
    this.eventClicked = true;
    let dataFavs = localStorage.getItem('favoritesData');
    let tableData = dataFavs ? JSON.parse(dataFavs) : [];
    for(let i=0; i<tableData.length; ++i)
    {
      if(tableData[i].id === id)
      {
        this.isFavorite = true;
        break;
      }
      else
      {
        this.isFavorite = false;
      }
    }
    for(let i=0; i<this.allEvents.length; i++)
    {
      if(this.allEvents[i].id == id)
      {
        let venue = ''
        if(this.allEvents[i]._embedded.venues && this.allEvents[i]._embedded.venues.length > 0){
            if(this.allEvents[i]._embedded.venues[0].name){
                venue = this.allEvents[i]._embedded.venues[0].name
            }
        }
        this.venueDetails(this.allEvents[i]._embedded.venues[0].name);
        let title = this.allEvents[i].name
        let dateTime = this.allEvents[i].dates.start.localDate
        let ticketStatus = this.allEvents[i].dates.status.code
        let TMLink = this.allEvents[i].url
        let artists = ''
        let spotifyArtists = new Array();
        if(this.allEvents[i]._embedded && this.allEvents[i]._embedded.attractions){
            for(let j = 0; j < this.allEvents[i]._embedded.attractions.length; j++){
                if(this.allEvents[i]._embedded.attractions[j].url){
                    artists += this.allEvents[i]._embedded.attractions[j].name
                    spotifyArtists.push(this.allEvents[i]._embedded.attractions[j].name)
                }
                else{
                    artists += this.allEvents[i]._embedded.attractions[i].name
                    spotifyArtists.push(this.allEvents[i]._embedded.attractions[j].name)
                }
                if(j != this.allEvents[i]._embedded.attractions.length-1){
                    artists += " | "
                }
            }
        }
        if(this.allEvents[i].classifications[0].segment.name == "Music")
        {
          this.isMusic = true;
          this.artistDetail(spotifyArtists)
        }
        let genres = ''
        if(this.allEvents[i].classifications){
            if(this.allEvents[i].classifications[0].subGenre && this.allEvents[i].classifications[0].subGenre.name != 'Undefined'){
                genres += this.allEvents[i].classifications[0].subGenre.name 
            }
            if(this.allEvents[i].classifications[0].genre && this.allEvents[i].classifications[0].genre.name != 'Undefined'){
                genres += ' | ' + this.allEvents[i].classifications[0].genre.name
            }
            if(this.allEvents[i].classifications[0].segment && this.allEvents[i].classifications[0].segment.name != 'Undefined'){
                genres += ' | ' + this.allEvents[i].classifications[0].segment.name
            }
            if(this.allEvents[i].classifications[0].subType && this.allEvents[i].classifications[0].subType.name != 'Undefined'){
                genres += ' | ' + this.allEvents[i].classifications[0].subType.name
            }
            if(this.allEvents[i].classifications[0].type && this.allEvents[i].classifications[0].type.name != 'Undefined'){
                genres += ' | ' + this.allEvents[i].classifications[0].type.name
            }
        }
      let priceRange = ''
      if(this.allEvents[i].priceRanges){
          priceRange = this.allEvents[i].priceRanges[0].min + '-' + this.allEvents[i].priceRanges[0].max;
      }

      let seating = ''
      if(this.allEvents[i].seatmap){
          seating = this.allEvents[i].seatmap.staticUrl;
      }

      let socialUrl = ''
      if(this.allEvents[i].url)
      {
        socialUrl = this.allEvents[i].url;
      }

      let statusName = ''
      if(ticketStatus == "onsale")
      {
          statusName = "On Sale"
      }
      else if(ticketStatus == "offsale")
      {
          statusName = "Off Sale"
      }
      else if(ticketStatus == "cancelled")
      {
          statusName = "Cancelled"
      }
      else if(ticketStatus == "postponed")
      {
          statusName = "Postponed"
      }
      else if(ticketStatus == "rescheduled")
      {
          statusName = "Rescheduled"
      }

      let singleEvent = {
        id: id,
        venue: venue,
        title: title,
        dateTime: dateTime,
        ticketStatus: ticketStatus,
        statusName: statusName,
        TMLink: TMLink,
        artists: artists,
        genres: genres,
        priceRange: priceRange,
        seating: seating,
        socialUrl: socialUrl
      }
      this.clickedEvent.push(singleEvent);
      }
    }
  }

  async artistDetail(spotifyArtists: Array<string>)
  {
    this.artistDetails = [];
    for(let i=0; i<spotifyArtists.length; i++)
    {
      var url = 'https://homework8-382009.wn.r.appspot.com/artist?name=' + spotifyArtists[i];
      var response = await fetch(url);
      var result = await response.json();
      if(!result)
      {
        this.isMusic = false;
        continue;
      }
      // console.log(result);
      let artistData = {
        image: result[0].images[0].url,
        name: result[0].name,
        popularity: result[0].popularity,
        followers: result[0].followers.total.toLocaleString(),
        spotify: result[0].external_urls.spotify,
        albums: result[1].albums,
      }
      this.artistDetails.push(artistData);      
    }
  }

  async venueDetails(name: string)
  {
    this.coordinates = [];
    this.venueDetailsData = [];
    var url = 'https://homework8-382009.wn.r.appspot.com/venueDetails?name='+name;
    var response = await fetch(url);
    var result = await response.json();
    let address = "";
    if(result.address && result.address.line1)
    {
      address += result.address.line1;
    }
    if(result.city && result.city.name)
    {
      address += ", " + result.city.name;
    }
    if(result.state && result.state.name)
    {
      address += ", " + result.state.name;
    }
    let phonenumber = "";
    if(result.boxOfficeInfo && result.boxOfficeInfo.phoneNumberDetail)
    {
      phonenumber = result.boxOfficeInfo.phoneNumberDetail
    }
    let openHours = "";
    if(result.boxOfficeInfo && result.boxOfficeInfo.openHoursDetail)
    {
      openHours = result.boxOfficeInfo.openHoursDetail;
    }
    let generalRule = "";
    if(result.generalInfo && result.generalInfo.generalRule)
    {
      generalRule = result.generalInfo.generalRule;
    }
    let childRule = "";
    if(result.generalInfo && result.generalInfo.childRule)
    {
      childRule = result.generalInfo.childRule;
    }
    this.coordinates = {
      lat: parseFloat(result.location.latitude),
      lng: parseFloat(result.location.longitude)
    }
    let venueDetail = {
      name: result.name,
      address: address,
      phone: phonenumber,
      openHours: openHours,
      generalRule: generalRule,
      childRule: childRule,
    }
    this.venueDetailsData.push(venueDetail);

  }

  addFavorite(id: string, dateTime: string, genres: string, venue: string, name: string)
  {
    alert("Event Added to Favorites!");
    this.isFavorite = true;
    let data = localStorage.getItem('favoritesData');
    let favoritesData = data ? JSON.parse(data) : [];
    favoritesData.push({ id, dateTime, name, genres, venue });
    localStorage.setItem('favoritesData', JSON.stringify(favoritesData));
  }

  removeFavorite(id: string)
  {
    alert("Event Removed from favorites!")
    this.isFavorite = false;
    let data = localStorage.getItem('favoritesData');
    let tableData = data ? JSON.parse(data) : [];
    for(let i=0; i<tableData.length; i++)
    {
      if(tableData[i].id === id)
      {
        tableData.splice(i, 1);
      }
    }
    localStorage.setItem('favoritesData', JSON.stringify(tableData));
  }

  back(){
    this.eventClicked = false;
    this.clickedEvent = [];
  }
}

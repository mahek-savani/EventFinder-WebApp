import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-form',
  templateUrl: './home-form.component.html',
  styleUrls: ['./home-form.component.css']
})
export class HomeFormComponent implements OnInit{
  keyword = new FormControl();
  radius= new FormControl();
  category = new FormControl();
  options:string[] = [];
  isLoading = false;
  selectedKeyword: any = "";
  latitude: any = "";
  longitude: any = "";
  location = new FormControl({value: '', disabled: false})
  autoLocate = new FormControl(false);
  doLocate = "";
  isChecked: boolean = false;
  isDisabled: boolean = false;
  formData: any = {};
  showTable: boolean = false;
  noLocation: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.keyword.valueChanges.subscribe(latestKeyword => {
      // console.log('latestKeyword: ', latestKeyword)
      this.requestToAutoComplete(latestKeyword)
    })
    this.autoLocate.valueChanges.subscribe(doLocate => {
      this.isDisabled = this.isChecked;
      if(doLocate){
        this.location.disable();
        this.location.setValue("");
      }
      else{
        this.location.enable();
      }
    })
  }

  async searchEvent(){
    // var url = 'http://localhost:8000/search?keyword=' + this.keyword.value + '&segmentId=' + this.category.value + '&distance=' + this.radius.value + '&lat=' + this.latitude.value + '&long=' + this.longitude.value;
    // console.log(url);
    // var result = await fetch(url);
    // var data = await result.json();
    this.showTable = false;
    if(this.autoLocate.value)
    {
      await this.autoLocateUser();
    }
    else
    {
      await this.locateByValue();
    }
    if(this.radius === null || this.radius.value === null)
    {
      this.radius.setValue(10);
    }
    this.formData = {
      keyword: this.keyword.value,
      category: this.category.value,
      radius: this.radius.value,
      latitude: this.latitude,
      longitude: this.longitude
    }
    if(this.formData.latitude && this.formData.longitude)
    {
      this.noLocation = false;
      this.showTable = true;
      console.log(this.formData);
    }
    
  }

  requestToAutoComplete(keyword:String){
    this.isLoading = true;
    var url = "https://homework8-382009.wn.r.appspot.com/autocomplete?keyword=" + keyword;
    // console.log(url)
    fetch(url)
      .then(response => response.json())
      .then(response => {
        var result = []
        for(var i = 0; i < response.length; ++i){
          result.push(response[i].name)
        }
        this.options = result;
        this.isLoading = false;
        // console.log("Options: ",this.options);
      })
  }

  async autoLocateUser(){
    this.latitude="";
    this.longitude="";
    try
    {
      var ipInfo = "https://ipinfo.io/?token=ABCD"
      var response = await fetch(ipInfo);
      const result = await response.json();
      var coordinates = result["loc"]
      var arr = coordinates.split(",")
      this.latitude = arr[0]
      this.longitude = arr[1]
    }
    catch (error) {
      console.log(error);
    }
  }

  async locateByValue(){
    this.latitude="";
    this.longitude="";
    try
    {
      var url = "https://homework8-382009.wn.r.appspot.com/locateUser?val=" + this.location.value;
      // console.log(url)
      const response = await fetch(url);
      const result = await response.json();
      if(result !== "none")
      {
        this.latitude = result[0];
        this.longitude = result[1];
        // console.log(this.latitude, this.longitude);
      }
      else
      {
        // console.log("Could not find");
        this.noLocation = true;
        this.showTable = false;
      }
    }
    catch (error) {
      console.log(error);
    }
  }
  
  clearEverything(){
    this.router.navigate(['/search']);
    this.showTable = false;
    this.location.enable();
    this.noLocation = false;
  }

}

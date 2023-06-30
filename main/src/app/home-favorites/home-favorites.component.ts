import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-favorites',
  templateUrl: './home-favorites.component.html',
  styleUrls: ['./home-favorites.component.css']
})
export class HomeFavoritesComponent implements OnInit{
  constructor() { }
  isFavorite = false;
  storedData: any[] =[];
  favoriteEvents: any = JSON.parse(localStorage.getItem('favoritesData') || '[]');

  ngOnInit(): void {
    this.favoritesData();
  }

  favoritesData(): void {
    if(this.favoriteEvents.length > 0)
    {
      this.isFavorite = true;
    }
  }

  removeFavorite(id: string): void {
    alert("Removed from favorites!")
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
    this.favoriteEvents = JSON.parse(localStorage.getItem('favoritesData') || '[]');
    if(this.favoriteEvents.length == 0)
    {
      this.isFavorite = false;
    }
  }

  
  
  
  


}

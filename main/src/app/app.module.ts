import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { GoogleMapsModule } from '@angular/google-maps';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeFormComponent } from './home-form/home-form.component';
import { HomeFavoritesComponent } from './home-favorites/home-favorites.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { HomeTableComponent } from './home-table/home-table.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs'; 

@NgModule({
  declarations: [
    AppComponent,
    HomeFormComponent,
    HomeFavoritesComponent,
    HomeComponent,
    HomeTableComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatTabsModule,
    GoogleMapsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

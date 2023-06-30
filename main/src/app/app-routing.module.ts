import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeFormComponent } from './home-form/home-form.component';
import { HomeFavoritesComponent } from './home-favorites/home-favorites.component'

const routes: Routes = [
  { path: 'search', component: HomeFormComponent },
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  { path: 'favorites', component: HomeFavoritesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

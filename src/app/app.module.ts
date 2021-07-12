import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EcgChartModule } from './ecg-chart/ecg-chart.module';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, EcgChartModule, MatButtonModule,MatIconModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

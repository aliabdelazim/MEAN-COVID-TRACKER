import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  IgxButtonModule, IgxCardModule, IgxExpansionPanelModule,
  IgxIconModule, IgxBottomNavModule, IgxAvatarModule, IgxRippleModule, IgxButtonGroupModule, IgxTabsModule,
  IgxListModule,
  IgxNavbarModule,
  IgxDividerModule,
  IgxTooltipModule, IgxSwitchModule, IgxProgressBarModule
} from 'igniteui-angular';
import {
  IgxDataChartCoreModule, IgxDataChartCategoryModule,
  IgxDataChartAnnotationModule, IgxCalloutLayerModule, IgxCrosshairLayerModule,
  IgxFinalValueLayerModule, IgxLegendModule, IgxTimeXAxisModule,
  IgxNumericXAxisModule, IgxCategoryXAxisModule, IgxFinancialChartModule,
  IgxScatterLineSeriesModule, IgxLineSeriesModule, IgxCategoryToolTipLayerModule,
  IgxDataChartInteractivityModule
} from 'igniteui-angular-charts';
import { IgxGeographicMapCoreModule, IgxGeographicMapModule } from 'igniteui-angular-maps';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';

import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/auth-guard.service';
import { UserService } from './services/user.service';


import { AppRoutingModule } from './app-routing.module';
import { CovidService } from './services/CovidService/covid.service';
import { MapCasesComponent } from './map-cases/map-cases.component';
import { TimelineChartComponent } from './timeline-chart/timeline-chart.component'

import { NgxSpinnerModule } from "ngx-spinner"; 

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    DashboardComponent,
    ProfileComponent,
    FooterComponent,
    HeaderComponent,
    MapCasesComponent,
    TimelineChartComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    FlashMessagesModule.forRoot(),
    AppRoutingModule,
    IgxGeographicMapCoreModule,
    IgxButtonGroupModule,
    IgxTabsModule,
    IgxGeographicMapModule,
    IgxRippleModule,
    IgxListModule,
    BrowserAnimationsModule,
    IgxButtonModule,
    IgxCardModule,
    IgxExpansionPanelModule,
    IgxIconModule,
    IgxBottomNavModule,
    IgxAvatarModule,
    IgxRippleModule,
    IgxDataChartCoreModule,
    IgxDataChartCategoryModule,
    IgxDataChartAnnotationModule,
    IgxCalloutLayerModule,
    IgxCrosshairLayerModule,
    IgxFinalValueLayerModule,
    IgxLegendModule,
    IgxTimeXAxisModule,
    IgxNumericXAxisModule,
    IgxCategoryXAxisModule,
    IgxFinancialChartModule,
    IgxNavbarModule,
    IgxCardModule,
    IgxDividerModule,
    IgxScatterLineSeriesModule,
    IgxLineSeriesModule,
    IgxTooltipModule,
    IgxSwitchModule,
    IgxProgressBarModule,
    IgxCategoryToolTipLayerModule,
    IgxDataChartInteractivityModule,
    NgxSpinnerModule
  ],
  providers: [
    AuthService,
    AuthGuardService,
    UserService,
    CovidService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

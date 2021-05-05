import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef, ViewContainerRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { MapCasesComponent } from '../map-cases/map-cases.component';
import { CovidService, ICasesData } from '../services/CovidService/covid.service' 
import { TimelineChartComponent } from '../timeline-chart/timeline-chart.component'
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  countries: any;
  statistics: any;
  @ViewChild(TimelineChartComponent, { read: TimelineChartComponent }) public charts: TimelineChartComponent;
  @ViewChild('map', { static: true }) public map: MapCasesComponent;
  showChartLoader: boolean =false;
  private dataRequestConfirmed: any;
  private dataRequestRecovered: any;
  private dataRequestDeaths: any;
  historyData: any;

  constructor(private covidService: CovidService) { 
    this.loadCovidData();
    this.loadHistoryCovidData();
  }

  ngOnInit() {

    this.covidService.countries().subscribe((data)=> {
      console.log(data);
      this.countries = data.response
    })


  }

  public loadCovidData() {
    this.dataRequestConfirmed = this.covidService.statistics(0);
    this.dataRequestRecovered = this.covidService.statistics(1);
    this.dataRequestDeaths = this.covidService.statistics(2);

    forkJoin([this.dataRequestConfirmed, this.dataRequestRecovered, this.dataRequestDeaths]).subscribe(results => {

      const jsonDataConfirmed = results[0];
      const jsonDataRecovered = results[1];
      const jsonDataDeaths = results[2];
      const worldData: ICasesData = { totalConfirmed: jsonDataConfirmed, totalRecovered: jsonDataRecovered, totalDeaths: jsonDataDeaths };

    
      this.map.data = worldData;
      this.map.onDataSetSelected({ index: 0 });

    });
  }
  public loadHistoryCovidData(country ? : string) {
    this.showChartLoader = true;
    if(country){
      this.covidService.history(country).subscribe(historyData=> {
        this.showChartLoader = false;
        this.historyData = historyData;
        this.charts.transformChartConfirmedCases(JSON.stringify(this.historyData));
        this.charts.transformChartRecoveredCases(JSON.stringify(this.historyData));
      });
    }else{
      this.covidService.history().subscribe(historyData=> {
        this.showChartLoader = false;
        this.historyData = historyData;
        this.charts.transformChartConfirmedCases(JSON.stringify(this.historyData));
        this.charts.transformChartRecoveredCases(JSON.stringify(this.historyData));
      });
    }
  }

  getSelectedCountry(event){
    console.log(event)
    this.loadHistoryCovidData(event);
  }
}

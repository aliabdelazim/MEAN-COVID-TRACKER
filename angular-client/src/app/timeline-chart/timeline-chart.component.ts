import { Component, OnInit, Input, ViewChild, AfterViewInit, TemplateRef, ChangeDetectorRef, OnChanges } from '@angular/core';
import { IgxDataChartComponent, IgxCategoryXAxisComponent, IgxNumericYAxisComponent,
  IgxCategoryToolTipLayerComponent, 
  CategoryTooltipLayerPosition} from 'igniteui-angular-charts';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-timeline-chart',
  templateUrl: './timeline-chart.component.html',
  styleUrls: ['./timeline-chart.component.scss']
})
export class TimelineChartComponent implements OnInit, AfterViewInit {
  @ViewChild('chart', { static: true }) public chart: IgxDataChartComponent;
  @ViewChild('chartActual', { static: true }) public chartActual: IgxDataChartComponent;
  @ViewChild('chartDaily', { static: true }) public chartDaily: IgxDataChartComponent;
  @ViewChild('xAxis', { static: true }) public xAxis: IgxCategoryXAxisComponent;
  @ViewChild('yAxis', { static: true }) public yAxis: IgxNumericYAxisComponent;
  @ViewChild('tooltipActualChart', {static: true}) public tooltipActualTemplate: TemplateRef<any>;
  @ViewChild('tooltipDailyChart', {static: true}) public tooltipDailyTemplate: TemplateRef<any>;

  public chartData: any[] = [];
  public dailyDataOtherLocations: any[] = [];
  public dailyRecoveredCases: Map<string, number> = new Map();
  public dailyConfirmedCases: Map<string, number> = new Map();
  public totalDailyRecoveredCases: Map<string, number> = new Map();
  public categoryTooltipLayer: IgxCategoryToolTipLayerComponent;

  @Input() showChartLoader: boolean;

  constructor(private cdr: ChangeDetectorRef, private spinner: NgxSpinnerService) {
    this.categoryTooltipLayer = new IgxCategoryToolTipLayerComponent();
  }

  ngOnInit(): void { 
    this.spinner.show();
  }

  ngAfterViewInit(): void {
    this.setCustomTooltips();
  }

  public fillData(csvData) {
    let jsonCSV = JSON.parse(csvData[0]);
    let columns = [];
    let day: string = null;
    const cases: Map<string, number> = new Map();
    let transformedCases: Map<string, number> = new Map();
    let totalRecoveredCases: Map<string, number> = new Map();
    const firstRecordedDate =  jsonCSV[jsonCSV.length - 1].day//new Date().toDateString();

      for (let columnIdx = jsonCSV.length - 1; columnIdx >= 0; columnIdx--) {
          day = jsonCSV[columnIdx].day

          cases.set(day, jsonCSV[columnIdx].cases.active);
      }

      for (let columnIdx = jsonCSV.length - 2; columnIdx >= 0; columnIdx--) {
          day = jsonCSV[columnIdx].day

          totalRecoveredCases.set(day, jsonCSV[columnIdx].cases.recovered);
 
      }
    
    for (let index = 0; index < cases.size - 1; index++) {

      let newCasesCount = 0;
      let currentElementKey = Array.from(cases.keys())[index];
      const currentElementValue = cases.get(currentElementKey);

      const nextElementKey = Array.from(cases.keys())[index + 1];
      const nextElementValue = cases.get(nextElementKey);


      const actualDailyChangeDate = new Date(currentElementKey);
      actualDailyChangeDate.setDate(actualDailyChangeDate.getDate() + 1);
      currentElementKey = actualDailyChangeDate.toDateString();

      if (nextElementValue && nextElementValue > currentElementValue) {
        newCasesCount = nextElementValue - currentElementValue;

        transformedCases.set(currentElementKey, newCasesCount);
      } else {
        transformedCases.set(currentElementKey, nextElementValue);
      }
    }

   
    return [transformedCases, totalRecoveredCases];
  }

  public transformChartConfirmedCases(csvData: string) {
    const dailyData: any[] = [];
    const csvLines = csvData.split('\n');
    const allCases = this.fillData(csvLines);

    this.dailyConfirmedCases = allCases[0];
    this.totalDailyRecoveredCases = allCases[1];

    for (const item of this.dailyConfirmedCases) {
      dailyData.push({ date: new Date(item[0]), activeCases: item[1] });
    }

    let i = 0;
    for (const item of this.totalDailyRecoveredCases) {
      dailyData[i].recoveredCases = item[1];
      i++;
    }

   
    this.chartData = dailyData;
  }

  public transformChartRecoveredCases(csvData: string) {
    const dailyData: any[] = [];
    const csvLines = csvData.split('\n');
    const allCases = this.fillData(csvLines);

    this.dailyRecoveredCases = allCases[1];
  
    for (const item of this.dailyRecoveredCases) {
      dailyData.push({ date: new Date(item[0]), recoveredCases: item[1] });
    }

    this.chartData = dailyData.map((item) => {
      const isEqualToDate = (element) =>  {
        let formatedDate = moment(element.date).format("DD MM YYYY")
        let formatedSecondDate = moment(item.date).format("DD MM YYYY")
        return moment(element.date).format("DD MM YYYY")  === moment(item.date).format("DD MM YYYY");
      };

      item.activeCases = this.chartData[this.chartData.findIndex(isEqualToDate)].activeCases;
      item.recoveredCases = this.chartData[this.chartData.findIndex(isEqualToDate)].recoveredCases;

      return item;
    });
  }

  public formatDateLabel(item: any): string {
    return item.date.toLocaleDateString();
  }

  private setCustomTooltips() {
    this.chartActual.actualSeries[0].tooltipTemplate = this.tooltipActualTemplate;
    this.chartActual.actualSeries[1].tooltipTemplate = this.tooltipActualTemplate;

    this.chartDaily.actualSeries[0].tooltipTemplate = this.tooltipDailyTemplate;
    this.chartDaily.actualSeries[1].tooltipTemplate = this.tooltipDailyTemplate;
  }
}

interface IChartConfig {
  name: string;
  chartComponent: IgxDataChartComponent;
  tooltipTemplate: TemplateRef<any>;
}

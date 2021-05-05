import { Component, TemplateRef, ViewChild, OnInit, Output, EventEmitter } from '@angular/core';
import { IgxTileGeneratorMapImagery, IgxGeographicProportionalSymbolSeriesComponent, ArcGISOnlineMapImagery } from 'igniteui-angular-maps';
import { IgxGeographicMapComponent } from 'igniteui-angular-maps';
import { CovidService, IRegionData, IWorldData, ICasesData } from '../services/CovidService/covid.service'
import { IgxSizeScaleComponent, IgxValueBrushScaleComponent, MarkerType } from 'igniteui-angular-charts';
import { EsriStyle, EsriUtility } from './EsriMapsUtility';
import { Rect } from 'igniteui-angular-core';

@Component({
    providers: [CovidService],
    selector: 'app-map-cases',
    templateUrl: './map-cases.component.html',
    styleUrls: ['./map-cases.component.scss'],
    host: { class: 'app__map-wrapper' }
})
export class MapCasesComponent implements OnInit {

    @ViewChild('map', { static: true }) public map: IgxGeographicMapComponent;
    @ViewChild('template', { static: true }) public tooltip: TemplateRef<object>;
    @Output() selectedCountry = new EventEmitter<string>();
    public tileImagery: IgxTileGeneratorMapImagery;
    public darkTheme = true;
    public series: IgxGeographicProportionalSymbolSeriesComponent[] = this.createSeries();
    public dataSetButtons = [
        {
            name: 'Total',
            selected: true
        },
        {
            name: 'Recovered',
            selected: false
        },
        {
            name: 'Deaths',
            selected: false
        }
    ];
    public dataSets = ['totalConfirmed', 'totalRecovered', 'totalDeaths'];
    public brushes = [
        [
            ['rgba(0,153,255, .3)'],
            ['rgba(95,191,112, .4)'],
            ['rgba(255, 138, 144, .4)']
        ],
        [
            ['rgba(62,57,114, .3)'],
            ['rgba(78,184,98, .3)'],
            ['rgba(255, 17, 94, .3)']
        ]
    ];
    public data: ICasesData;
    public index = 0;
    public currentSeries = this.dataSets[this.index];

    constructor() { }

    public ngOnInit(): void {
        this.changeMap();
        this.setInitialMapZoom();
    }

    public setInitialMapZoom() {
        const geoBounds = {
            height: 0,
            left: -0,
            top: 40,
            width: 260
        };
        this.map.zoomToGeographic(geoBounds);
    }

 
    public changeMap() {
        const tileSource = new ArcGISOnlineMapImagery();
        (tileSource as any).i = tileSource;
        if (this.darkTheme) {
            tileSource.mapServerUri = EsriUtility.getUri(EsriStyle.WorldDarkGrayMap);
        } else {
            tileSource.mapServerUri = EsriUtility.getUri(EsriStyle.WorldLightGrayMap);
        }
        (this.map as any).backgroundContent = tileSource;
    }

   
    public changeMapSeriesBrushScale() {
        const brushScale = this.createBrushScale();
        const series = this.map.series.item(0) as IgxGeographicProportionalSymbolSeriesComponent;
        series.fillScale = brushScale;
        series.markerOutline = brushScale.brushes[0];
    }

 
    public onDataSetSelected(event: any) {
        const rect = this.map.windowRect;
        if (event.index == 0) {

            this.index = event.index;
            this.currentSeries = this.dataSets[this.index];
            if (this.data) {
                this.addMapSeries(event.index);
                this.map.windowRect = rect;
            }
        } else {
            console.log(event.currentTarget.outerText)
            let set = event.currentTarget.outerText
            let index
            switch (set) {
                case "Recovered":
                    index = 1
                    this.index = index
                    this.currentSeries = "totalRecovered"
                    if (this.data) {
                        this.addMapSeries(index);
                        this.map.windowRect = rect;
                    }
                    break
                case "Deaths":
                    index = 2
                    this.index = index
                    this.currentSeries = "totalDeaths"
                    if (this.data) {
                        this.addMapSeries(index);
                        this.map.windowRect = rect;
                    }
                    break
                default:
                    index = 0
                    this.index = index
                    this.currentSeries = "totalConfirmed"
                    if (this.data) {
                        this.addMapSeries(index);
                        this.map.windowRect = rect;
                    }
            }
        }
    }

  
    public addMapSeries(index: number) {
        let jsonData = JSON.parse(this.data[this.currentSeries])
        const locations = jsonData;

        const symbolSeries = this.series[index];
        const sizeScale = this.createSizeScale();
        const brushScale = this.createBrushScale();
        symbolSeries.dataSource = locations;
        symbolSeries.radiusScale = sizeScale;
        symbolSeries.fillScale = brushScale;
        symbolSeries.markerOutline = brushScale.brushes[0];
        symbolSeries.tooltipTemplate = this.tooltip;

        this.map.series.clear();
        this.map.series.add(symbolSeries);
    }

    public showRegion(item) {
        return item.region.length !== 0 && item.region !== item.country;
    }

   
    public createSeries(): IgxGeographicProportionalSymbolSeriesComponent[] {
        const series: IgxGeographicProportionalSymbolSeriesComponent[] = [];
        for (let i = 0; i < 3; i++) {
            const symbolSeries = new IgxGeographicProportionalSymbolSeriesComponent();
            symbolSeries.markerType = MarkerType.Circle;
            switch (i) {
                case 0:
                    symbolSeries.fillMemberPath = 'totalInfected';
                    symbolSeries.radiusMemberPath = 'totalInfected';
                    break;
                case 1:
                    symbolSeries.fillMemberPath = 'totalTests';
                    symbolSeries.radiusMemberPath = 'totalTests';
                    break;
                case 2:
                    symbolSeries.fillMemberPath = 'totalDeath';
                    symbolSeries.radiusMemberPath = 'totalDeath';
                    break;
                default:
                    symbolSeries.fillMemberPath = 'totalInfected';
                    symbolSeries.radiusMemberPath = 'totalInfected';
                    break;
            }


            symbolSeries.latitudeMemberPath = 'lat';
            symbolSeries.longitudeMemberPath = 'lon';
            series.push(symbolSeries);
        }
        return series;
    }


    public onSeriesClicked(event: any) {
        const lat = event.args.item.lat;
        const lon = event.args.item.lon;
        this.selectedCountry.emit(event.args.item.country)
        this.zoomMapToLoc(lat, lon);
    }

    public zoomMapToLoc(lat: number, lon: number) {
        const geoRect = new Rect(0, lon - 5, lat - 8, 10, 15);
        this.map.zoomToGeographic(geoRect);
    }

    private createBrushScale(): IgxValueBrushScaleComponent {
        const brushScale = new IgxValueBrushScaleComponent();
        const maxValue = this.data[this.currentSeries].peakValue;
        if (this.darkTheme) {
            brushScale.brushes = this.brushes[0][this.index];
        } else {
            brushScale.brushes = this.brushes[1][this.index];
        }
        brushScale.minimumValue = 1;
        brushScale.maximumValue = maxValue;
        return brushScale;
    }

    private createSizeScale(): IgxSizeScaleComponent {
        const sizeScale = new IgxSizeScaleComponent();
        sizeScale.minimumValue = 1;
        sizeScale.maximumValue = 60;
        sizeScale.isLogarithmic = true;
        return sizeScale;
    }

    public getTotalInfectedForCountry(item) {
     
        let jsonData = JSON.parse(this.data[this.currentSeries])
        const dataRec = jsonData.find(rec => (rec.country === item.country));
        return dataRec ? dataRec.cases.total : 0;
    }

    public getTotalTestedForCountry(item): number {
     
        let jsonData = JSON.parse(this.data[this.currentSeries])
        const dataRec = jsonData.find(rec => (rec.country === item.country));
        return dataRec ? dataRec.tests.total : 0;
    }

    public getTotalDeathsForCountry(item) {
     
        let jsonData = JSON.parse(this.data[this.currentSeries])
        const dataRec = jsonData.find(rec => (rec.country === item.country));
        return dataRec ? dataRec.deaths.total : 0;
    }
}

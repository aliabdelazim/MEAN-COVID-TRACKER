import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';



export enum DATA_SET {
  CONFIRMED = 'confirmed_global',
  RECOVERED = 'recovered_global',
  DEATHS = 'deaths_global'
}

const FILE_NAME = 'covid_19_by_time';

export interface IRegionData {
  continent: string,
  country: string;
  population: number;
  cases: {
    new: number;
    active: number;
    critical: number;
    recovered: number;
    total: number
  };
  deaths: {
    new: number;
    total: number
  };
  tests: {
    total: number
  };
  lat: number;
  lon: number;
  region: string;
}

export interface IWorldData {
  data: IRegionData[];
}

export interface ICasesData {
  totalConfirmed: any;
  totalRecovered: any;
  totalDeaths: any;
}

@Injectable({
  providedIn: 'root'
})
export class CovidService {

  public dataSets = [DATA_SET.CONFIRMED, DATA_SET.RECOVERED, DATA_SET.DEATHS];

  constructor(private http: HttpClient) { }

  countries(query?: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.get("http://localhost:3000/covid/countries", { headers: headers });
  }

  statistics(index: number, query?: string): Observable<any> {
    const dataSet = this.dataSets[index];
    let statisticalData: Observable<any>;
    statisticalData = Observable.create(observer => {
      fetch("http://localhost:3000/covid/statistics")
        .then(response => {
          return response.text();
        })
        .then(data => {
          observer.next(data);
          observer.complete();
        })
        .catch(err => {
          console.log(err);
        });
    });

    return statisticalData;
  }


  history(query?: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    if (query) {
      return this.http.get(`http://localhost:3000/covid/history`, { headers: headers, params: { query: query } });
    } else {
      return this.http.get("http://localhost:3000/covid/history", { headers: headers });
    }
  }

}

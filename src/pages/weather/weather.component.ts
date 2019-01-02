import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {
  title;
  data;
  startDate;
  endDate;
  errorMsg;
  location;
  metric;
  chart = [];
  chartData;
  yAxisChartData;
  xAxischartData;

  constructor(public http: HttpClient) {
    this.title = 'Weather';
  }

  ngOnInit() {
  }

  /*
  * Function to get weather data as per metric and location
  */
  makeRequest(): void {
    let url = 'https://s3.eu-west-2.amazonaws.com/interview-question-data/metoffice/' + this.metric + '-' + this.location + '.json';
    this.http.get(url)
      .subscribe((res: Response) => {
        this.data = res;
        if (this.startDate && this.endDate && !this.errorMsg) {
          this.drawChart();
        }
      });
  }

  /*
  * Function to get 'FROM' Date and Compare the date
  */
  getStartDate(event: MatDatepickerInputEvent<Date>) {
    this.startDate = new Date(event.value);
    if (this.endDate) {
      if (this.startDate >= this.endDate) {
        this.errorMsg = 'From date should be less than To date';
      } else {
        this.errorMsg = '';
        this.drawChart();
      }
    }
  }

  /*
  * Function to get 'TO' Date and Compare the date
  */
  getEndDate(event: MatDatepickerInputEvent<Date>) {
    this.endDate = new Date(event.value);
    if (this.startDate) {
      if (this.startDate >= this.endDate) {
        this.errorMsg = 'From date should be less than To date';
      } else {
        this.errorMsg = '';
        this.drawChart();
      }
    }
  }

  /*
  * Function will weather data web service
  */
  getWeatherData() {
    if (this.location && this.metric) {
      this.makeRequest();
    }
  }
  /*
  * Function draw chart as per selection
  */
  drawChart() {
    let startYear = this.startDate.getFullYear(),
        startMonth = this.startDate.getMonth() + 1,
        endYear = this.endDate.getFullYear(),
        endMonth = this.endDate.getMonth() + 1,
        result = this.data.filter(function (item) {
      if (item.year == startYear) {
        if (item.month >= startMonth) {
          return true;
        }
      } else if (item.year == endYear) {
        if (item.month <= endMonth) {
          return true;
        }
      } else if (item.year > startYear && item.year < endYear) {
        return true;
      }
    });
    this.yAxisChartData = result.map(y => y.value);
    this.xAxischartData = result.map(x => x.month + '-' + x.year);
    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: this.xAxischartData,
        datasets: [
          {
            data: this.yAxisChartData,
            borderColor: '#3cba9f',
            fill: false
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Month & Year'
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Values'
            }
          }],
        }
      }
    });
  }
}


import { Component, OnInit, AfterContentInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit {
  data: any;
  clickNumber: number;

  constructor(private http: HttpClient) {
    this.data = [{ 1: [], 2: [], 3: [], 4: [] }];
    this.clickNumber = 0;
  }

  ngOnInit(): void {}

  recombination = (data: any) => {
    // for (let i = 0; i < data.length; i++) {
    //   if (data[i].dp !== undefined) {
    //     console.log(data[i].dp.F1)  
    //   } else if(data[i].dp === undefined) {
    //     console.log(data[i]);
    //   }
    // }
    const ecgArray:any[] = [];
    const respiration:any[] = [];
    let tsArray: any = [];
    let startTs = data[0].ts;

    for(let i=0; i < data.length-1; i++) {
      if(data[i].index+1 === data[i+1].index && data[i+1].ts-data[i].ts < 100) {
        if(data[i].dp !== undefined) {
          ecgArray.push(...data[i].dp.ecg);
          for(let count=0; count<5; count++) {
            respiration.push(data[i].dp.F1);
          }
        } else if(data[i].dp === undefined) {
          for(let i=0; i<5; i++) {
            ecgArray.push(undefined);
            respiration.push(undefined);
          }
        }
        
      } else if(data[i].index+1 > data[i+1].index || data[i+1].ts-data[i].ts > 100) {
        const loseEcgData = ((data[i+1].ts - data[i].ts)/40);
        const loseArray = Number(loseEcgData.toFixed(0))*5;
        for(let count=0; count<loseArray; count++) {
          ecgArray.push(undefined);
          if(data[i].dp.F1 === undefined || data[i].dp === undefined) respiration.push(undefined);
          else if(data[i].dp.F1 !== undefined || data[i].dp !== undefined) respiration.push(undefined);
        }
      }
    }
    tsArray = [...ecgArray].map((v, i) => {
      return (v = startTs + i * 8);
    });

    let dataArray = [...ecgArray].map((v:any, i) => {
      return (v = { ts: tsArray[i], ecg: v });
    });

    let respirationArray = [...respiration].map((v:any,i) => {
      return v = { ts: tsArray[i], res: v };
    })


    return {
      data: dataArray,
      respirationData: respirationArray,
      start:  tsArray[0],
      end: tsArray[tsArray.length-1],
    };
  };

  ngAfterContentInit() {
    this.http.get(`../../../assets/json/1.json`).subscribe((array) => {
      this.data[1] = this.recombination(array);
    });
    this.http.get(`../../../assets/json/2.json`).subscribe((array) => {
      this.data[2] = this.recombination(array);
    });
    this.http.get(`../../../assets/json/3.json`).subscribe((array) => {
      this.data[3] = this.recombination(array);
    });
    this.http.get(`../../../assets/json/4.json`).subscribe((array) => {
      this.data[4] = this.recombination(array);
    });
    // this.http.get(`../../../assets/json/5.json`).subscribe((array) => {
    //   this.data[5] = this.recombination(array);
    // });
  }

  clickNumberRegister(value: number) {
    return (this.clickNumber = value);
  }
}

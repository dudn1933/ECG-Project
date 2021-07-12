import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { HeaderComponent } from './project/header/header.component';
import { DataListComponent } from './project/data-list/data-list.component';
import { DataViewComponent } from './project/data-view/data-view.component';
import { ProjectComponent } from './project/project.component';
import { PersonInformationComponent } from './project/header/person-information/person-information.component';
import { TimeComponent } from './project/header/time/time.component';
import { SectionComponent } from './project/data-view/section/section.component';
import { EcgComponent } from './project/data-view/ecg/ecg.component';
import { RespirationComponent } from './project/data-view/respiration/respiration.component';
import { ViewControllerComponent } from './project/data-view/view-controller/view-controller.component';


import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    HeaderComponent,
    DataListComponent,
    DataViewComponent,
    ProjectComponent,
    PersonInformationComponent,
    TimeComponent,
    SectionComponent,
    EcgComponent,
    RespirationComponent,
    ViewControllerComponent,
  ],
  providers: [],
  imports: [CommonModule, HttpClientModule, MatButtonModule, MatIconModule],
  exports: [ProjectComponent],
})
export class EcgChartModule {}

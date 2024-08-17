import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ColorTableComponent } from './components/color-table/color-table.component';
import { IntervalFormComponent } from './components/interval-form/interval-form.component';
@NgModule({
  declarations: [AppComponent, ColorTableComponent, IntervalFormComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TableModule,
    BrowserAnimationsModule,
    ButtonModule,
    DynamicDialogModule,
    ReactiveFormsModule,
    ColorPickerModule,
    InputNumberModule,
    ConfirmDialogModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

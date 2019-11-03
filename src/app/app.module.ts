import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {CodemirrorComponent} from './codemirror/codemirror.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatSelectModule, MatTreeModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { TreesComponent } from './trees/trees.component';
import { GifComponent } from './gif/gif.component';

@NgModule({
  declarations: [
    AppComponent,
    CodemirrorComponent,
    TreesComponent,
    GifComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatTreeModule,
    MatDialogModule,
    MatIconModule,
  ],
  providers: [],
  entryComponents: [
    GifComponent,
    TreesComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {CodemirrorComponent} from './codemirror/codemirror.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule, MatCardModule,
  MatDialogModule,
  MatFormFieldModule, MatGridListModule,
  MatIconModule, MatListModule,
  MatSelectModule, MatTabsModule,
  MatToolbarModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { TreesComponent } from './trees/trees.component';
import { GifComponent } from './gif/gif.component';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    CodemirrorComponent,
    TreesComponent,
    GifComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatToolbarModule,
    MatTabsModule,
    MatCardModule,
    MatGridListModule,
    MatListModule
  ],
  providers: [],
  entryComponents: [
    GifComponent,
    TreesComponent,
    AboutComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

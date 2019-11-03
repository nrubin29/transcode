import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-gif',
  templateUrl: './gif.component.html',
  styleUrls: ['./gif.component.scss']
})
export class GifComponent implements OnInit {
  from: string;
  to: string;

  constructor(@Inject(MAT_DIALOG_DATA) private data) { }

  ngOnInit() {
    this.from = this.data.from[0];
    this.to = this.data.to[0];
  }

}

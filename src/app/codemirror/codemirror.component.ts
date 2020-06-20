import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import * as CodeMirror from 'codemirror';
import { EditorConfiguration, EditorFromTextArea } from 'codemirror';
import 'codemirror/mode/python/python';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/javascript/javascript';

@Component({
  selector: 'app-codemirror',
  templateUrl: './codemirror.component.html',
  styleUrls: ['./codemirror.component.scss'],
})
export class CodemirrorComponent implements AfterViewInit {
  @ViewChild('host') host: ElementRef;
  @Input() config: EditorConfiguration;
  @Output() instance: EditorFromTextArea;
  @Output() textChange = new EventEmitter<string>();

  private _value = '';

  get value() {
    return this._value;
  }

  @Input() set value(v) {
    if (v !== this._value) {
      this._value = v;
    }
  }

  ngAfterViewInit() {
    this.config = this.config || {};
    this.instance = CodeMirror.fromTextArea(this.host.nativeElement, {
      lineNumbers: true,
      lineWrapping: true,
      ...this.config,
    });
    this.instance.setValue(this._value);

    this.instance.on('change', () => {
      const value = this.instance.getValue();
      this.value = value;
      this.textChange.emit(value);
    });
  }

  writeValue(value: string) {
    this._value = value || '';
    if (this.instance) {
      this.instance.setValue(this._value);
    }
  }
}

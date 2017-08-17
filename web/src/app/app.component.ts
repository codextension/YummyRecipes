import { Component } from '@angular/core';
import * as mjs from "mathjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  randomNumber = mjs.round(mjs.e, 3);
}

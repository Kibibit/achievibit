import { Component } from '@angular/core';
import { webConsolelogo } from '@kibibit/consologo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'kibibit client';

  constructor() {
    webConsolelogo('kibibit client template', [
      'kibibit server-client template',
      'change this up in app.component.ts'
    ]);
  }
}

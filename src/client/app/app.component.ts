import {Component, OnInit} from '@angular/core';
import {NavigationStart, Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      //console.log('---', event);
      if (event instanceof NavigationStart) {
        // если в урле якоря нет
        if(event.url.indexOf('#') === -1) {
          //console.log('----onTop----');
          document.body.scrollTop = document.documentElement.scrollTop = 0
        }

      }
    });
  }

}

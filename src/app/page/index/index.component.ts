import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-index',
	templateUrl: './index.component.html',
	styleUrls: []
})
export class IndexComponent {
	title: string = 'index.html';

	constructor(
		public router: Router
	) { }
}
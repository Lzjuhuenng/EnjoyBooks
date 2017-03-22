import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'rowStart'
})

export class RowStartPipe implements PipeTransform { 
	constructor() {}
	
	transform(flag: number): string{ 
		return (flag%6==0) ? "<div class='row'>":"";
	}
}
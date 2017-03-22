import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'rowEnd'
})

export class RowEndPipe implements PipeTransform { 
	constructor() {}
	
	transform(flag: number): string{ 
		return (flag%6==0) ? "</div>":"";
	}
}
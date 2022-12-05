import { Component, OnInit, Input, Renderer2 } from "@angular/core";

export type FGOTable = {
  title: string,
  items: string[]
}

@Component({
  selector: 'hp-fare-guide-option-table2',
  templateUrl: './fare-guide-option-table2.component.html',
  styleUrls: ['./fare-guide-option-table2.component.scss']
})
export class FareGuideOptionTable2Component implements OnInit {

  @Input() data:FGOTable
  
  @Input() bgColor: string = 'var(--white)'
  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
  }
  
}

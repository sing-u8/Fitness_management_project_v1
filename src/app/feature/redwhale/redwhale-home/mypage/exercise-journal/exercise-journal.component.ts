import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'

import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Component({
    selector: 'rw-exercise-journal',
    templateUrl: './exercise-journal.component.html',
    styleUrls: ['./exercise-journal.component.scss'],
})
export class ExerciseJournalComponent implements OnInit {
    constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

    ngOnInit(): void {}
}

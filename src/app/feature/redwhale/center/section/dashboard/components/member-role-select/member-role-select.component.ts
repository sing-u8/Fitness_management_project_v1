import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core'

// !! 직원 직급 변경 부분 수정 필요
@Component({
    selector: 'rw-member-role-select',
    templateUrl: './member-role-select.component.html',
    styleUrls: ['./member-role-select.component.scss'],
})
export class MemberRoleSelectComponent implements OnInit, OnChanges {
    @Input() staffId: string
    @Input() userId: string

    @Input() visible: boolean
    @Input() userRoleText: string
    @Input() userRole: { administrator: boolean; manager: boolean; staff: boolean; member: boolean }
    @Input() employeeRole: 'member' | 'staff' | 'manager' | 'administrator'

    @Output() onClose = new EventEmitter()
    @Output() onSetUserRole = new EventEmitter<string>()
    @Output() onToggleSelect = new EventEmitter()
    @Output() onSaveRole = new EventEmitter()

    public role_limit: 'staff' | 'manager' | 'administrator'
    public showArrow = true

    constructor() {}

    ngOnInit(): void {}
    ngOnChanges(changes: SimpleChanges) {
        this.showArrow = this.blockEmitToggleSelect()
    }

    emitClose() {
        this.onClose.emit({})
    }
    emitSetUserRole(role: 'administrator' | 'manager' | 'staff' | 'member') {
        this.onSetUserRole.emit(role)
    }
    emitToggleSelect() {
        if (this.blockEmitToggleSelect()) this.onToggleSelect.emit({})
    }
    emitSaveRole() {
        this.onSaveRole.emit({})
    }

    blockEmitToggleSelect(): boolean {
        if (
            this.employeeRole == 'administrator' &&
            this.userRole.administrator == true &&
            this.staffId == this.userId
        ) {
            return false
        } else if (
            this.employeeRole == 'manager' &&
            (this.userRole.administrator == true || this.userRole.manager == true)
        ) {
            return false
        } else if (this.employeeRole == 'staff') {
            return false
        }
        return true
    }
}

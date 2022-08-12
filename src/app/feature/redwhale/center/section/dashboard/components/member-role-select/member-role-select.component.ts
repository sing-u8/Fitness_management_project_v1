import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core'
import { CenterUser } from '@schemas/center-user'
import { MemberRole as Role } from '@schemas/center/dashboard/member-role'

// ! 추후에 수정 필요

@Component({
    selector: 'rw-member-role-select',
    templateUrl: './member-role-select.component.html',
    styleUrls: ['./member-role-select.component.scss'],
})
export class MemberRoleSelectComponent implements OnInit, OnChanges {
    @Input() staffId: string
    @Input() member: CenterUser

    @Input() visible: boolean
    @Input() userRole: Record<Role, boolean>
    @Input() employeeRole: Role

    @Output() onClose = new EventEmitter()
    @Output() onSetUserRole = new EventEmitter<Role>()
    @Output() onToggleSelect = new EventEmitter()
    @Output() onSaveRole = new EventEmitter()

    public role_limit: Omit<Role, 'member'> // 'employee' | 'administrator' | 'owner'
    public showArrow = true
    // ! 추후에 센터별 권한을 API에서 불러오기
    public roleNameObj = {
        owner: '운영자',
        instructor: '강사',
        member: '회원',
    }

    constructor() {}

    ngOnInit(): void {}
    ngOnChanges(changes: SimpleChanges) {
        this.showArrow = this.blockEmitToggleSelect()
    }

    emitClose() {
        this.onClose.emit({})
    }
    emitSetUserRole(role: Role) {
        this.onSetUserRole.emit(role)
    }
    emitToggleSelect() {
        if (this.blockEmitToggleSelect()) this.onToggleSelect.emit({})
    }
    emitSaveRole() {
        this.onSaveRole.emit({})
    }

    blockEmitToggleSelect(): boolean {
        if (this.employeeRole == 'owner' && this.userRole.owner == true && this.staffId == this.member.id) {
            return false
        } else if (
            this.employeeRole == 'instructor' &&
            (this.userRole.owner == true || this.userRole.instructor == true)
        ) {
            return false
        }
        return true
    }
}

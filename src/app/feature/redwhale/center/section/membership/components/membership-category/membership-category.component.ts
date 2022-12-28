import { Component, OnInit, Input, AfterViewInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core'
import { FormBuilder, FormControl } from '@angular/forms'
import _ from 'lodash'

import { DragulaMembership, MembershipItem } from '@schemas/membership-item'

// rxjs
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

// ngrx
import { Store, select } from '@ngrx/store'
// - // state
import { showToast } from '@appStore/actions/toast.action'
import * as FromMembership from '@centerStore/reducers/sec.membership.reducer'
import * as MembershipSelector from '@centerStore/selectors/sec.membership.selector'
import * as MembershipActions from '@centerStore/actions/sec.membership.actions'

import * as LessonActions from '@centerStore/actions/sec.lesson.actions'

@Component({
    selector: 'gm-center-membership-category',
    templateUrl: './membership-category.component.html',
    styleUrls: ['./membership-category.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class MembershipCategoryComponent implements OnInit, AfterViewInit {
    @Input() id: string
    @Input() categ: FromMembership.MembershipCategoryState
    @Input() centerId: string

    @Input() isLast: boolean = false

    public items: Array<MembershipItem> = []
    public name: string

    public isDropdownOpen: boolean
    public isChangeNameOn: boolean
    public isCategDelOpen: boolean
    public isAddMembershipInputOn: boolean

    public categNameForm: FormControl
    public newMembershipForm: FormControl

    public selectedMembership: FromMembership.SelectedMembership = undefined
    public unSubscriber$ = new Subject<void>()

    public delModalData = {
        text: '카테고리를 삭제하시겠습니까?',
        subText: `잠깐! 카테고리를 삭제하시면
                    포함된 회원권이 모두 삭제되며, 복구하실 수 없어요.`,
        confirmButtonText: '삭제',
    }

    // dragula vars
    public DragulaMembership = undefined

    constructor(private fb: FormBuilder, private nxStore: Store) {
        this.isDropdownOpen = false

        this.isChangeNameOn = false
        this.isCategDelOpen = false
        this.isAddMembershipInputOn = false

        this.categNameForm = this.fb.control('')
        this.newMembershipForm = this.fb.control('')

        this.nxStore
            .pipe(select(MembershipSelector.selectedMembership), takeUntil(this.unSubscriber$))
            .subscribe((selectedMembership) => {
                this.selectedMembership = selectedMembership
            })
    }

    ngOnInit(): void {
        this.DragulaMembership = DragulaMembership
        this.categNameForm.setValue(this.categ.name)

        // init input variable
        this.items = _.sortBy(this.categ.items, (item) => item.sequence_number)
        this.isAddMembershipInputOn = this.categ.initialInputOn
    }
    ngAfterViewInit(): void {}
    ngOnDestroy(): void {
        this.unSubscriber$.next()
        this.unSubscriber$.complete()
    }

    // flag methods
    setDropdonwOpen(event?: Event) {
        this.isDropdownOpen = !this.isDropdownOpen
        event ? event.stopPropagation() : null
    }
    setDropdonwClose() {
        this.isDropdownOpen = false
    }

    toggleCategOpen() {
        if (this.isChangeNameOn) return
        this.nxStore.dispatch(MembershipActions.startSetCategIsOpen({ id: this.id, isOpen: !this.categ.isCategOpen }))
    }

    setCategInputOpen() {
        this.isChangeNameOn = true
    }
    setCategInputClose() {
        this.isChangeNameOn = false
    }

    setCategDelModalOepn() {
        this.setDropdonwClose()
        this.isCategDelOpen = true
    }
    setCategDelModalClose() {
        this.isCategDelOpen = false
    }

    setAddMembershipItemOn(event: Event) {
        this.isAddMembershipInputOn = true
        // event.stopPropagation()
    }
    setAddMembershipItemOff() {
        this.isAddMembershipInputOn = false
    }

    //  dropdown
    onChangeName(event: Event) {
        this.setDropdonwClose()
        this.setCategInputOpen()
        // event.stopPropagation()
    }

    // categ name change method
    changeCategName() {
        if (this.categ.name != this.categNameForm.value && String(this.categNameForm.value) != '') {
            this.nxStore.dispatch(
                MembershipActions.changeMembershipCategName({
                    centerId: this.centerId,
                    id: this.id,
                    categName: this.categNameForm.value,
                })
            )
        }
        this.setCategInputClose()
    }

    // delete category method
    onDeleteCategoryConfirm() {
        this.nxStore.dispatch(MembershipActions.removeMembershipCateg({ centerId: this.centerId, id: this.id }))

        if (
            this.selectedMembership.membershipData &&
            this.categ.items.some((v) => v.id == this.selectedMembership.membershipData.id)
        ) {
            this.nxStore.dispatch(MembershipActions.resetSelectedMembership())
        }
        this.nxStore.dispatch(LessonActions.refreshSelectedLesson())

        this.setCategDelModalClose()
        this.nxStore.dispatch(showToast({ text: '카테고리가 삭제되었습니다.' }))
    }

    onDeleteCategoryCancel() {
        this.setCategDelModalClose()
    }

    // add categ item
    addCategItem(itemName: string) {
        if (this.categ.initialInputOn == true) {
            this.nxStore.dispatch(MembershipActions.disableInitInput({ categId: this.categ.id }))
        }
        if (_.trim(itemName) == '') {
            this.setAddMembershipItemOff()
            return
        }
        this.nxStore.dispatch(
            MembershipActions.startAddMembershipToCateg({
                centerId: this.centerId,
                categId: this.id,
                categName: this.categ.name,
                reqBody: {
                    name: itemName,
                    sequence_number: this.categ.items.length + 1,
                },
            })
        )

        this.setAddMembershipItemOff()
    }
}

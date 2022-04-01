import { Directive, ElementRef, Renderer2, OnInit, OnDestroy, Input } from '@angular/core'
import { FormControl, NgControl, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms'
import * as _ from 'lodash'
import { Subscription } from 'rxjs'
import { distinctUntilChanged, filter } from 'rxjs/operators'

/**
 *  validator status - empty, required
 */

@Directive({
    selector: '[rwCreateCenterInput]',
})
export class CreateCenterDirective implements OnInit, OnDestroy {
    @Input() errorMessageObj: Record<string, string>
    @Input() inputType: 'name' | 'url'

    public inputControl: AbstractControl = undefined
    public isFocused = false

    private focusListener: () => void
    private focusoutListener: () => void
    private inputChangeSubscription: Subscription

    constructor(private el: ElementRef, private control: NgControl, private renderer: Renderer2) {}

    ngOnInit(): void {
        this.inputControl = this.control.control
        // this.inputControl && this.inputControl.addValidators([Validators.required])
        if (this.inputType == 'name') {
            this.inputControl && this.inputControl.addValidators([this.nameValidator()])
            this.inputChangeSubscription = this.inputControl.valueChanges
                .pipe(
                    filter((value) => value != _.replace(value, /[^a-zA-Z0-9ㄱ-ㅎ가-힣-_]/g, '')),
                    distinctUntilChanged()
                )
                .subscribe((value) => {
                    this.inputControl.setValue(_.replace(value, /[^a-zA-Z0-9ㄱ-ㅎ가-힣-_]/g, ''))
                })
        } else if (this.inputType == 'url') {
            this.inputChangeSubscription = this.inputControl.valueChanges
                .pipe(
                    filter((value) => value != _.replace(value, /[^a-zA-Z0-9-_]/gi, '')),
                    distinctUntilChanged()
                )
                .subscribe((value) => {
                    this.inputControl.setValue(_.replace(value, /[^a-zA-Z0-9-_]/gi, ''))
                })
            this.inputControl && this.inputControl.addValidators([this.urlValidator()])
        }

        this.createWaningParagraph()

        this.focusListener = this.renderer.listen(this.el.nativeElement, 'focus', (event: FocusEvent) => {
            this.isFocused = true
            this.renderer.removeStyle(this.el.nativeElement, 'border')
            this.hideWarningParagraph()
        })
        this.focusoutListener = this.renderer.listen(this.el.nativeElement, 'focusout', (event: FocusEvent) => {
            this.isFocused = false
            if (this.inputControl.errors == null && this.inputControl.value == '' && this.inputControl.touched) {
                this.renderer.setStyle(this.el.nativeElement, 'border', '1px solid var(--red)')
                this.showWarningParagraph(this.errorMessageObj['empty'])
            } else if (this.inputControl.errors != null) {
                this.renderer.setStyle(this.el.nativeElement, 'border', '1px solid var(--red)')
                this.showWarningParagraph(this.errorMessageObj[Object.keys(this.inputControl.errors)[0]])
            }
        })
    }
    ngOnDestroy(): void {
        this.focusListener()
        this.focusoutListener()
        this.inputChangeSubscription && this.inputChangeSubscription.unsubscribe()
    }

    urlValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (this.inputControl.value == '') {
                return { empty: true }
            }
            return null
        }
    }

    nameValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (this.inputControl.value == '') {
                return { empty: true }
            }
            return null
        }
    }
    // ----------------------------------------------------------------------------------------//
    public warningPara: HTMLParagraphElement
    public warningIcon: HTMLImageElement
    public warningStr: HTMLSpanElement

    createWaningParagraph() {
        this.warningPara = this.renderer.createElement('p')
        this.warningStr = this.renderer.createElement('span')
        this.warningIcon = this.renderer.createElement('img')
        this.renderer.appendChild(this.warningPara, this.warningIcon)
        this.renderer.appendChild(this.warningPara, this.warningStr)
        this.renderer.insertBefore(
            this.renderer.parentNode(this.el.nativeElement),
            this.warningPara,
            this.el.nativeElement
        )

        this.warningPara.style.color = 'var(--red)'
        this.warningPara.style.fontSize = '1.2rem'
        this.warningPara.style.fontWeight = '400'
        this.warningPara.style.letterSpacing = '-0.14px'
        this.warningPara.style.position = 'absolute'
        this.warningPara.style.right = '5px'
        this.warningPara.style.top = '80px'
        this.warningPara.style.display = 'none'
        this.warningPara.style.justifyContent = 'center'
        this.warningPara.style.alignItems = 'center'

        this.warningIcon.src = 'assets/icons/etc/warning-red.svg'
        this.warningIcon.style.width = '12px'
        this.warningIcon.style.height = '12px'
        this.warningIcon.style.marginTop = '2px'
    }

    showWarningParagraph(errMsg: string) {
        this.warningPara.style.display = 'flex'
        this.warningStr.innerHTML = errMsg
    }
    hideWarningParagraph() {
        this.warningPara.style.display = 'none'
    }
}

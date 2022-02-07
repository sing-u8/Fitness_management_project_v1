import {
    Component,
    Input,
    ElementRef,
    Renderer2,
    OnChanges,
    AfterViewInit,
    ViewChild,
    SimpleChanges,
} from '@angular/core'

@Component({
    selector: 'rw-avatar',
    templateUrl: './avatar.component.html',
    styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnChanges, AfterViewInit {
    @Input() image: string
    @Input() text: string
    @Input() size: string
    @Input() fontSize: string
    @Input() backgroundColor: string

    @ViewChild('imgElement') imgElement
    @ViewChild('textElement') textElement

    changed: boolean

    constructor(private el: ElementRef, private renderer: Renderer2) {}

    ngOnChanges(changes: SimpleChanges) {
        if (
            (changes.hasOwnProperty('image') && !changes['image']['firstChange']) ||
            (changes.hasOwnProperty('backgroundColor') && !changes['backgroundColor']['firstChange'])
        ) {
            this.changed = true
        }
        this.getNameInitial()
    }
    ngAfterViewInit() {
        this.apply()
    }

    ngAfterViewChecked() {
        if (this.changed) {
            this.changed = false
            this.apply()
        }
    }

    apply() {
        if (this.image) {
            if (this.size) {
                this.renderer.setStyle(this.imgElement.nativeElement, 'width', `${this.size}px`)
                this.renderer.setStyle(this.imgElement.nativeElement, 'height', `${this.size}px`)
            }
        } else {
            if (this.size) {
                this.renderer.setStyle(this.textElement.nativeElement, 'width', `${this.size}px`)
                this.renderer.setStyle(this.textElement.nativeElement, 'height', `${this.size}px`)
            }
            if (this.fontSize) {
                this.renderer.setStyle(this.textElement.nativeElement, 'font-size', `${this.fontSize}px`)
            }
            if (this.backgroundColor) {
                this.renderer.setStyle(this.textElement.nativeElement, 'background-color', `${this.backgroundColor}`)
            }
        }
    }

    public nameInitial = ''
    getNameInitial() {
        if (this.text) {
            this.nameInitial = this.text[0]
        } else {
            this.nameInitial = 'U'
        }
    }
}

import {HostListener, Directive, Output, EventEmitter, Input} from "@angular/core";

@Directive ({
    selector: '[confirmButton]',
})
export class ConfirmButtonDirective {
    @Output() callback = new EventEmitter();
    @Input() confirmButton: string;

    @HostListener('click', ['$event'])
    confirmFirst(event: Event) {
        const confirmed = window.confirm(this.confirmButton || 'Удалить?');
        if(confirmed) {
            this.delete()
        }
    }

    @HostListener('dblclick')
    dblclick() {
        this.delete()
    }

    delete() {
        this.callback.emit()
    }

}
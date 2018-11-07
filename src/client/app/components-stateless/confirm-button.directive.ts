import {HostListener, Directive , Output, EventEmitter} from "@angular/core";

@Directive ({
    selector: '[confirmButton]',
})
export class ConfirmButtonDirective {
    @Output() callback = new EventEmitter();

    @HostListener('click', ['$event'])
    confirmFirst(event: Event) {
        const confirmed = window.confirm('Удалить?');
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
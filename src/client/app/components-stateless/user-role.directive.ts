import {Directive, ElementRef, Input, Renderer2} from '@angular/core';

function __disableInputs(el) {
  el.find('input').addClass('pointer-none')/*.attr('disabled', 'disabled')*/;
  setTimeout(() => el.find('.ui-select-container').addClass('pointer-none'), 1e3);
}

function __deleteElementsWithTimeout(el, selector: string, intervals: number[]) {
  intervals.forEach(interval => setTimeout(() => el.find(selector).remove(), interval));
}

function __deleteButtonsWithTimeout(el) {
  ['button', '[type="button"]'].forEach(sel=> __deleteElementsWithTimeout(el, sel, [300, 1e3]));
}

function __deleteAllButtons(el, intervals: number[]) {
  __deleteButtonsWithTimeout(el);
  __deleteElementsWithTimeout(el, 'i.icon-20', intervals);
  __deleteElementsWithTimeout(el, 'i.tool-20', intervals);
}

@Directive({
  selector: '[userRole]',
})
export class UserRoleDirective {
  @Input() userRole: string;
  @Input() rights: string;
  constructor( private renderer: Renderer2, private el: ElementRef ) {}

  ngOnInit() {
    // не пускаю без логина никуда поэтому rights всегда есть
    const lsRights = localStorage.getItem('rights');
    const elRights = this.rights;
    const intervals = [500, 1e3, 2e3];
    const el = this.el.nativeElement;

    // удаляет элемент
    if (!this.userRole /*=== 'hide'*/) {
      if (elRights < lsRights) {
        console.log('*********');
        el.remove()
      }

      // делает элемент не достопным для нажатия
    } /*else if (this.userRole === 'disable') {
      el.addClass('pointer-none')
      // во все инпуты внутри тега ничего не ввести
    } else if (this.userRole === 'disable-inputs') {
      __disableInputs(el)
      // внутри тега во все инпуты ничего не ввести и удаляет все кнопки
    } else if (this.userRole === 'disable-inputs-hide-buttons') {
      __deleteAllButtons(el, intervals);
      __disableInputs(el)
      // удаляет все кнопки
    } else if (this.userRole === 'hide-buttons') {
      __deleteAllButtons(el, intervals);
      // удаляет перечисленные ниже кнопки внутри тулбара
    } else if (this.userRole === 'toolbar') {

    }*/
  }
}

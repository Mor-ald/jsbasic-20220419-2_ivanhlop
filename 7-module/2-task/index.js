import createElement from '../../assets/lib/create-element.js';

export default class Modal {
  constructor() {
    this.elem = this.createModal();
    this.createEvents();
  }

  createModal() {
    return createElement(
      `
      <div class="modal">
        <div class="modal__overlay"></div>
        <div class="modal__inner">
          <div class="modal__header">
            <button type="button" class="modal__close">
              <img src="/assets/images/icons/cross-icon.svg" alt="close-icon" />
            </button>
            <h3 class="modal__title">
            </h3>
          </div>
          <div class="modal__body">
          </div>
        </div>
      </div>
      `
    );
  }

  open() {
    let body = document.querySelector('body');
    body.className = 'is-modal-open';

    body.append(this.elem);
  }
  setTitle(title) {
    let h3ModalTitle = this.elem.querySelector('.modal__title');
    h3ModalTitle.innerHTML = title;
  }
  setBody(node) {
    let divModalBody = this.elem.querySelector('.modal__body');
    divModalBody.append(node);
  }
  close() {
    let body = document.querySelector('body');
    body.className = '';
    body.innerHTML = '';

    document.onkeydown = null;
  }

  createEvents() {
    let button = this.elem.querySelector('.modal__close');

    button.addEventListener('click', () => {
      this.close();
    });

    document.onkeydown = function (event) {
      if (event.code === 'Escape') {
        let body = document.querySelector('body');
        body.className = '';
        body.innerHTML = '';

        document.onkeydown = null;
      }
    };
  }
}
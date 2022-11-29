// task: to implement accordeon

const URL = 'https://picsum.photos/v2/list';

const fetchImg = (() => {
  let page = 1;
  return async function (url, limit = 10) {
    const req = await fetch(`${url}?page=${page}&limit=${limit}`);
    page = page + 1;
    return await req.json();
  }
})()

function createCard(imgUrl, text) {
  const cardTemplate = document.querySelector('#card-template');
  const clone = cardTemplate.content.cloneNode(true)
  const card = clone.querySelector('.card');

  const image = card.querySelector('img');
  image.width = '200';
  image.height = '150';
  image.src = imgUrl;
  const caption = card.querySelector('.card__text');
  caption.textContent = text;

  return card;
}

window.onload = async () => {
  const imgs = await fetchImg(URL);
  const rootEl = document.querySelector('#root');

  const accordeon = new Accordeon({
    autoCollapse: true,
  });
  
  for (let index = 0; index < imgs.length; index++) {
    const card = createCard(imgs[index].download_url, imgs[index].author);

    accordeon.createAccordeonItemEl(card)
  }

  rootEl.appendChild(accordeon.root);
}


// Accordeon

class Accordeon {
  constructor({ autoCollapse = false } = {}) {
    this.root = this._createAccordeonEl();
    // only one item could be visible at a moment if true
    this.autoCollapse = autoCollapse;
    this._handleAccordeonButtonClickBind = this._handleAccordeonButtonClick.bind(this);

    this.root.addEventListener('click', this._handleAccordeonButtonClickBind);
  }

    createAccordeonItemEl(content) {
    const accordeonItemTemplate = document.querySelector('#accordeon-item-template');
    const accordeonItemEl = accordeonItemTemplate.content.cloneNode(true);

    const contentEl = accordeonItemEl.querySelector('.accordeon-item__content');
    contentEl.appendChild(content);

    this._appendAccordeonItemEl(accordeonItemEl)
  }

  _createAccordeonEl() {
    const accordeonContainer = document.createElement('ul');
    accordeonContainer.classList.add('accordeon');

    return accordeonContainer;
  }

  _appendAccordeonItemEl(item) {
    this.root.appendChild(item)
  }

  _handleAccordeonButtonClick(e) {
    if (e.target.type !== 'button') return;

    const clickedItem = e.target.parentElement;
    clickedItem.classList.toggle('visible');
    
    // toggle visibility with animation on content
    const contentEl = e.target.nextElementSibling;
    if (contentEl.style.maxHeight) {
      contentEl.style.maxHeight = null
    } else {
      contentEl.style.maxHeight = contentEl.scrollHeight + "px";
    }

    // if we need autocollapse, hide prev opened items
    if (this.autoCollapse) {
      const allItems = this.root.querySelectorAll('.accordeon-item');

      for (let item of allItems) {
        if (item === clickedItem) continue;
        if (!item.classList.contains('visible')) continue;

        item.classList.remove('visible');
        const contentEl = item.querySelector('.accordeon-item__content');
        contentEl.style.maxHeight = null;
      }
    }
  }
}

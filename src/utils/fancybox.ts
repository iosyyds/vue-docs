import { nextTick } from 'vue';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

const findNearestHeading = (imgElement) => {
  let currentElement = imgElement;
  while (currentElement && currentElement !== document.body) {
    let previousSibling = currentElement.previousElementSibling;
    while (previousSibling) {
      if (previousSibling.tagName.match(/^H[1-6]$/)) return previousSibling.textContent.replace(/\u200B/g, '').trim();
      previousSibling = previousSibling.previousElementSibling;
    }
    currentElement = currentElement.parentElement;
  }
  return '';
};

export const bindFancybox = () => {
  nextTick(async () => {
    const { Fancybox, PanzoomAction } = await import('@fancyapps/ui');
    const imgs = document.querySelectorAll('.vp-doc img');
    imgs.forEach((img) => {
      const image = img as HTMLImageElement;
      if (!image.hasAttribute('data-fancybox')) image.setAttribute('data-fancybox', 'gallery');
      if (!image.hasAttribute('alt') || image.getAttribute('alt') === '') {
        image.setAttribute('alt', findNearestHeading(image));
      }
      image.setAttribute('data-caption', image.getAttribute('alt') || '');
    });
    Fancybox.bind('[data-fancybox="gallery"]', {
      Hash: false, caption: false,
      Carousel: {
        Zoomable: { Panzoom: { clickAction: false, dblClickAction: PanzoomAction.IterateZoom, maxScale: 2, on: { singleClick: () => Fancybox.close() } } },
        Toolbar: { absolute: false, display: { left: ['counter'], middle: ['zoomIn','zoomOut','toggle1to1','rotateCCW','rotateCW','flipX','flipY','reset'], right: ['thumbs','close'] } },
        Thumbs: { type: 'classic', showOnStart: false }
      }
    });
  });
};

export const destroyFancybox = async () => {
  const { Fancybox } = await import('@fancyapps/ui');
  Fancybox.destroy();
};

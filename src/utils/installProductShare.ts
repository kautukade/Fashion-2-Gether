function copyToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  return Promise.resolve();
}

function setShareFeedback(button: HTMLButtonElement, message: string) {
  const originalLabel = button.getAttribute('aria-label') || 'Share product';
  button.setAttribute('aria-label', message);
  button.setAttribute('title', message);
  button.dataset.shareStatus = message.toLowerCase().replace(/\s+/g, '-');

  window.setTimeout(() => {
    button.setAttribute('aria-label', originalLabel);
    button.setAttribute('title', originalLabel);
    delete button.dataset.shareStatus;
  }, 1800);
}

async function shareCurrentProduct(button: HTMLButtonElement) {
  const productName = document.querySelector('main h1')?.textContent?.trim() || 'Fashion 2 Gether product';
  const url = window.location.href;
  const shareData = {
    title: `${productName} | Fashion 2 Gether`,
    text: `Check out ${productName} on Fashion 2 Gether`,
    url,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      setShareFeedback(button, 'Shared');
      return;
    }

    await copyToClipboard(url);
    setShareFeedback(button, 'Link copied');
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') return;

    try {
      await copyToClipboard(url);
      setShareFeedback(button, 'Link copied');
    } catch {
      setShareFeedback(button, 'Copy failed');
    }
  }
}

export function installProductShareHandler() {
  const handler = (event: MouseEvent) => {
    const target = event.target as HTMLElement | null;
    const button = target?.closest('button');
    if (!(button instanceof HTMLButtonElement)) return;

    const hasShareIcon = Boolean(button.querySelector('.lucide-share-2'));
    if (!hasShareIcon) return;

    event.preventDefault();
    void shareCurrentProduct(button);
  };

  document.addEventListener('click', handler);
  return () => document.removeEventListener('click', handler);
}

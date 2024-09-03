export function logImage(url: string, size = 100) {
  const image = new Image();
  image.src = url;
  image.onload = function () {
    const style = [
      'font-size: 1px;',
      'padding: ' + (this as any).height / 100 * size + 'px ' + (this as any).width / 100 * size + 'px;',
      'background: url(' + url + ') no-repeat;',
      'background-size: contain;'
    ].join(' ');
    console.log('%c ', style);
  };
}
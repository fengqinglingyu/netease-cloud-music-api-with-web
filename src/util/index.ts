export enum HttpMethod {
  get = 'GET',
  post = 'post',
}

export const req = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, options);
  return res.json();
};

export const debounce = function(fn: Function, delay: number = 300) {
  let timer: number | undefined;
  return (...args: any[]) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = window.setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

export const throttle = function(fn: Function, delay: number = 300) {
  let timer: number | undefined;
  return (...args: any[]) => {
    if (!timer) {
      timer = window.setTimeout(() => {
        fn(...args);
        timer = void 0;
      }, delay);
    }
  };
};

export const highlight = (
  content: string,
  keyword: string,
  tagName: string = 'span',
  className: string = 'highlight'
): string => {
  if (!content || !keyword) {
    return '';
  }
  const c = content.toLowerCase();
  const k = keyword.toLowerCase();
  if (c.includes(k)) {
    const idx = c.indexOf(k);
    const replaceStr = content.substr(idx, keyword.length);
    const replaceHtml = `<${tagName} class="${className}">${replaceStr}</${tagName}>`;
    const regExp = new RegExp(keyword, 'gi');
    return content.replace(regExp, replaceHtml);
  }
  return content;
};

export const parseHashParam = (prop: string): string => {
  const { hash } = window.location;
  const params = hash.split('?');
  const urlParams = params[1] ? new URLSearchParams(params[1]) : null;
  if (urlParams) {
    return urlParams.get(prop) || '';
  }
  return '';
};

/**
 * 解析matrix矩阵，0°-360°，返回旋转角度
 * 当a=b||-a=b,0<=deg<=180
 * 当-a+b=180,180<=deg<=270
 * 当a+b=180,270<=deg<=360
 *
 * 当0<=deg<=180,deg=d;
 * 当180<deg<=270,deg=180+c;
 * 当270<deg<=360,deg=360-(c||d);
 */
export const matrix2Deg = (a: number, b: number, c: number, d: number) => {
  var aa = Math.round((180 * Math.asin(a)) / Math.PI);
  var bb = Math.round((180 * Math.acos(b)) / Math.PI);
  var cc = Math.round((180 * Math.asin(c)) / Math.PI);
  var dd = Math.round((180 * Math.acos(d)) / Math.PI);
  var deg = 0;
  if (aa === bb || -aa === bb) {
    deg = dd;
  } else if (-aa + bb === 180) {
    deg = 180 + cc;
  } else if (aa + bb === 180) {
    deg = 360 - cc || 360 - dd;
  }
  return deg >= 360 ? 0 : deg;
};

export const parsePath = (path: string): string | string[] => {
  const pathList = path.split('.');
  return pathList.length === 1 ? pathList[0] : pathList;
};

export const parsePoiter = (obj: any, poiter: string | string[]) => {
  if (Array.isArray(poiter)) {
    let res = obj;
    for (let prop of poiter) {
      res = res[prop];
      if (!res) {
        break;
      }
    }
    return res;
  }
  return obj[poiter];
};

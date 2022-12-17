export function setStorage(key: string, value: any) {
  if (value) {
    let jsonStr = JSON.stringify(value);
    localStorage.setItem(key, jsonStr);
  }
}

export function getStorage(key: string):any {
  let value = localStorage.getItem(key);
  if (value) {
    value = JSON.parse(value);
    return value;
  }
}

export function removeStorage(key: string) {
  localStorage.removeItem(key);
}

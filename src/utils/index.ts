export function getLocalStorageSize() {
  let total = 0;
  for (const key in localStorage) {
    if (
      localStorage.hasOwnProperty(key) &&
      localStorage.getItem(key)?.length
    ) {
      // Calculate size: key length + value length (assuming 2 bytes per character for Unicode)
      const item = localStorage.getItem(key);
      if (item) {
        total += (key.length + item.length) * 2;
      }
    }
  }
  return total;
}
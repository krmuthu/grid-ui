export function debounceValidator(
  validator: (value: any, values: any) => Promise<string | null>,
  delay = 400
) {
  let timeout: NodeJS.Timeout | null = null;
  let lastPromise: Promise<string | null> | null = null;
  return (value: any, values: any) => {
    if (timeout) clearTimeout(timeout);
    return new Promise<string | null>((resolve) => {
      timeout = setTimeout(() => {
        lastPromise = validator(value, values);
        lastPromise.then(resolve);
      }, delay);
    });
  };
}

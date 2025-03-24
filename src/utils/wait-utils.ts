export const waitForMilliseconds = (waitTime: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, waitTime);
  });
}
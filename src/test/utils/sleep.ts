export const sleep = (ms: number) => {
  return new Promise(x => setTimeout(x, ms));
};

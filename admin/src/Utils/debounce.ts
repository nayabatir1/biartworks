export default (time: number) => {
  let timer: number;

  return (cb: () => void) => {
    timer = setTimeout(() => {
      clearTimeout(timer);
      cb();
    }, time);
  };
};


/**
 * 线程等待
 * @param {Number} duration(ms)
 */
export  async function wait(duration) {
  return new Promise((resolve, reject) => {
      setTimeout(resolve, duration);
  });
}

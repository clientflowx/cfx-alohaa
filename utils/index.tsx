function convertStoMs(seconds: number) {
  let minutes: number | string = Math.floor(seconds / 60);
  let extraSeconds: number | string = Math.floor(seconds % 60);
  minutes = minutes < 10 ? "0" + minutes : minutes;
  extraSeconds = extraSeconds < 10 ? "0" + extraSeconds : extraSeconds;
  return { minutes, seconds: extraSeconds };
}

export { convertStoMs };

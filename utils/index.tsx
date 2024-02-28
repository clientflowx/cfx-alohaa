function convertStoMs(secs: number) {
  let hours: number | string = Math.floor(secs / (60 * 60));

  let divisor_for_minutes = secs % (60 * 60);
  let minutes: number | string = Math.floor(divisor_for_minutes / 60);

  let divisor_for_seconds = divisor_for_minutes % 60;
  let seconds: number | string = Math.ceil(divisor_for_seconds);
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  return {
    hours,
    minutes,
    seconds,
  };
}

function parseTimeStringInS(timeString: string) {
  let regExTime = /([0-9]?[0-9]):([0-9][0-9]):([0-9][0-9])/;
  let parsedTime = regExTime.exec(timeString) || [];
  let timeHr = parseInt(parsedTime[1]) * 3600;
  let timeMin = parseInt(parsedTime[2]) * 60;
  let timeSec = parseInt(parsedTime[3]);
  return timeHr + timeMin + timeSec;
}

export { convertStoMs, parseTimeStringInS };

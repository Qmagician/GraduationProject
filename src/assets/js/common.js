//获取格式为yy-MM-dd HH:mm:ss格式的日期
export function getFullFormatDate(dateTime) {
  let nowYear = dateTime.getFullYear();
  let nowMonth = dateTime.getMonth() + 1;
  let nowDay = dateTime.getDate();
  let hour = dateTime.getHours();
  let minute = dateTime.getMinutes();
  let second = dateTime.getSeconds();

  if (nowMonth <= 9 && nowMonth > 0) {
    nowMonth = '0' + nowMonth;
  }
  if (nowDay <= 9 && nowDay > 0) {
    nowDay = '0' + nowDay;
  }
  if (hour <= 9 && hour >= 0) {
    hour = '0' + hour;
  }
  if (minute <= 9 && minute >= 0) {
    minute = '0' + minute;
  }
  if (second <= 9 && second >= 0) {
    second = '0' + second;
  }
  //return (nowYear.toString() + nowMonth.toString() + nowDay.toString() + hour.toString() + minute.toString() + second.toString());
  return (nowYear.toString() + "-" + nowMonth.toString() + "-" + nowDay.toString() + " " + hour.toString() + ":" + minute.toString() + ":" + second.toString());
}
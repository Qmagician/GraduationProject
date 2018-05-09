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

//获取格式为yyMMdd格式的当前日期
export function getyyyyMMddNowDate() {
  let nowDate = new Date();
  let nowYear = nowDate.getFullYear();
  let nowMonth = nowDate.getMonth() + 1;
  let nowDay = nowDate.getDate();

  if (nowMonth <= 9 && nowMonth > 0) {
    nowMonth = '0' + nowMonth;
  }
  if (nowDay <= 9 && nowDay > 0) {
    nowDay = '0' + nowDay;
  }
  return (nowYear.toString() + nowMonth.toString() + nowDay.toString());
}

// 产生编号
export function generateID(){

  let arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  let rnd = '';
  for(let i=0;i<5;i++){
    let pos = Math.round(Math.random() * (arr.length-1));
    rnd+=arr[pos];
  }
  let id = "NO" + getyyyyMMddNowDate() + rnd;
  return id;
}
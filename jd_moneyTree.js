// 测试版
// 1、收金果
// 2、每日签到
// 3、分享
// 其他功能待测试
// cron */6 * * * *   # 表示每6分钟收取一次，自行设定运行间隔

const $hammer = (() => {
  const isRequest = "undefined" != typeof $request,
      isSurge = "undefined" != typeof $httpClient,
      isQuanX = "undefined" != typeof $task;

  const log = (...n) => { for (let i in n) console.log(n[i]) };
  const alert = (title, body = "", subtitle = "", link = "") => {
    if (isSurge) return $notification.post(title, subtitle, body, link);
    if (isQuanX) return $notify(title, subtitle, (link && !body ? link : body));
    log("==============📣系统通知📣==============");
    log("title:", title, "subtitle:", subtitle, "body:", body, "link:", link);
  };
  const read = key => {
    if (isSurge) return $persistentStore.read(key);
    if (isQuanX) return $prefs.valueForKey(key);
  };
  const write = (val, key) => {
    if (isSurge) return $persistentStore.write(val, key);
    if (isQuanX) return $prefs.setValueForKey(val, key);
  };
  const request = (method, params, callback) => {
    /**
     *
     * params(<object>): {url: <string>, headers: <object>, body: <string>} | <url string>
     *
     * callback(
     *      error,
     *      <response-body string>?,
     *      {status: <int>, headers: <object>, body: <string>}?
     * )
     *
     */
    let options = {};
    if (typeof params == "string") {
      options.url = params;
    } else {
      options.url = params.url;
      if (typeof params == "object") {
        params.headers && (options.headers = params.headers);
        params.body && (options.body = params.body);
      }
    }
    method = method.toUpperCase();

    const writeRequestErrorLog = function (m, u) {
      return err => {
        log("=== request error -s--");
        log(`${m} ${u}`, err);
        log("=== request error -e--");
      };
    }(method, options.url);

    if (isSurge) {
      const _runner = method == "GET" ? $httpClient.get : $httpClient.post;
      return _runner(options, (error, response, body) => {
        if (error == null || error == "") {
          response.body = body;
          callback("", body, response);
        } else {
          writeRequestErrorLog(error);
          callback(error);
        }
      });
    }
    if (isQuanX) {
      options.method = method;
      $task.fetch(options).then(
          response => {
            response.status = response.statusCode;
            delete response.statusCode;
            callback("", response.body, response);
          },
          reason => {
            writeRequestErrorLog(reason.error);
            callback(reason.error);
          }
      );
    }
  };
  const done = (value = {}) => {
    if (isQuanX) return isRequest ? $done(value) : null;
    if (isSurge) return isRequest ? $done(value) : $done();
  };
  return { isRequest, isSurge, isQuanX, log, alert, read, write, request, done };
})();

//直接用NobyDa的jd cookie
const cookie = $hammer.read('CookieJD')
const name = '京东摇钱树'
const JD_API_HOST = 'https://ms.jr.jd.com/gw/generic/uc/h5/m';
let Task = step();
Task.next();

function* step() {
  let userInfo = yield user_info();
  console.log('用户信息', userInfo);
  console.log('用户信息', JSON.stringify(userInfo));
  console.log('用户信息', userInfo.resultMsg);
}
function user_info() {
  const data = 'reqData=%7B%22sharePin%22%3A%22%22%2C%22shareType%22%3A1%2C%22channelLV%22%3A%22%22%2C%22source%22%3A0%2C%22riskDeviceParam%22%3A%22%7B%5C%22eid%5C%22%3A%5C%22SCTUHAO57J4VK5VZZK347KLZKWSJJVQY3B4SHL24I7XNJDOYEW6XX2GBIKS3F3SPESTOACPMRTAVBQZVERPVWLSMVE%5C%22%2C%5C%22dt%5C%22%3A%5C%22iPhone11%2C8%5C%22%2C%5C%22ma%5C%22%3A%5C%22%5C%22%2C%5C%22im%5C%22%3A%5C%22%5C%22%2C%5C%22os%5C%22%3A%5C%22iOS%5C%22%2C%5C%22osv%5C%22%3A%5C%2213.4.1%5C%22%2C%5C%22ip%5C%22%3A%5C%22112.96.195.152%5C%22%2C%5C%22apid%5C%22%3A%5C%22jdapp%5C%22%2C%5C%22ia%5C%22%3A%5C%22F75E8AED-CB48-4EAC-A213-E8CE4018F214%5C%22%2C%5C%22uu%5C%22%3A%5C%22%5C%22%2C%5C%22cv%5C%22%3A%5C%229.0.0%5C%22%2C%5C%22nt%5C%22%3A%5C%224G%5C%22%2C%5C%22at%5C%22%3A%5C%221%5C%22%2C%5C%22fp%5C%22%3A%5C%226ac83e85e8bad60325c9256c79d9dc0e%5C%22%2C%5C%22token%5C%22%3A%5C%22WP3SV4JYWPIYTZXFLXOZ3GDOWIDJAIRIJUOMFBUCDYHBEJNVTKBHASOUPH3CIVUUZFONQB2T57XU2%5C%22%7D%22%7D'
  // const data = {
  //   'reqData={   "sharePin": "",   "shareType": 1,   "channelLV": "",   "source": 0,   "riskDeviceParam": "{\"eid\":\"\",\"dt\":\"\",\"ma\":\"\",\"im\":\"\",\"os\":\"\",\"osv\":\"\",\"ip\":\"\",\"apid\":\"\",\"ia\":\"\",\"uu\":\"\",\"cv\":\"\",\"nt\":\"\",\"at\":\"1\",\"fp\":\"\",\"token\":\"\"}" }'
  // }
  request('login', data);
}


function sleep(response) {
  console.log('休息一下');
  setTimeout(() => {
    $hammer.log('休息结束');
    $hammer.log(response)
    Task.next(response)
  }, 2000);
}
// function request(function_id, body = {}) {
//   $hammer.request('GET', taskurl(function_id, body), (error, response) => {
//     error ? $hammer.log("Error:", error) : sleep(JSON.parse(response.body));
//   })
// }
// function taskurl(function_id, body = {}) {
//   return {
//     url: `${JD_API_HOST}/${function_id}?_=${new Date().getTime()*1000}&reqData=${escape(JSON.stringify(body))}`,
//     headers: {
//       'Cookie': cookie,
//       'Host': 'ms.jr.jd.com',
//       'Accept': 'application/json',
//       'Origin': 'https://uuj.jr.jd.com',
//       'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
//       'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
//       'Referer': 'https://uuj.jr.jd.com/wxgrowing/moneytree7/index.html?channellv=sy',
//       'Accept-Language': 'zh-CN,en-US;q=0.8',
//       'X-Requested-With': 'com.jd.jrapp',
//     }
//   }
// }


function request(function_id, body = {}) {
  $hammer.request('POST', taskurl(function_id, body), (error, response) => {
    error ? $hammer.log("Error:", error) : sleep(JSON.parse(response));
  })
}

function taskurl(function_id, body) {
  // console.log(`${JD_API_HOST}?functionId=${function_id}&body=${escape(JSON.stringify(body))}&appid=ld&client=apple&clientVersion=&networkType=&osVersion=&uuid=`)
  return {
    // url: `${JD_API_HOST}?functionId=${function_id}&body=${escape(JSON.stringify(body))}&appid=ld&client=apple&clientVersion=&networkType=&osVersion=&uuid=`,
    url: JD_API_HOST + '/' + function_id + '?_=' + new Date().getTime()*1000,
    // body: `${escape(JSON.stringify(body))}`,
    // body: `${encodeURIComponent(body)}`,
    body: `${body}`,
    headers: {
      "Host": "ms.jr.jd.com",
      "Accept": "application/json",
      "Origin": "https://uuj.jr.jd.com",
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1",
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      "Referer": "https://uuj.jr.jd.com/wxgrowing/moneytree7/index.html?channellv=sy",
      "Accept-Language": "zh-CN,en-US;q=0.8",
      "X-Requested-With": "com.jd.jrapp",
      "Cookie": cookie
    }
  }
}
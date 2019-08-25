import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
    vus: 100,
    duration: "30s"
};

export default function () {
    let res = http.get("http://localhost:3002/");
    check(res, {
        "status was 200": (r) => r.status == 200,
        "transaction time OK": (r) => r.timings.duration < 200
    });


    //sleep(1);
};

// export default function () {
//     let res = http.get("http://localhost:3002/user/999990");
//     check(res, {
//         "status was 200": (r) => r.status == 200,
//         "transaction time OK": (r) => r.timings.duration < 200
//     });
//     //sleep(1);
// };


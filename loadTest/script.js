import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
    stages: [
        { duration: "30s", target: 100 },
        { duration: "30s", target: 400 },
        { duration: "30s", target: 900 },
        { duration: "1m", target: 1000 },
        { duration: "10s", target: 3000 }
        // { duration: "2m", target: 5000 },
        // { duration: "2m", target: 8000 },
        // { duration: "2m", target: 10000 },
        // { duration: "60s", target: 8000 },
        // { duration: "60s", target: 5000 },
        // { duration: "30s", target: 1000 },
        // { duration: "60s", target: 500 },
        // { duration: "60s", target: 100 },
    ]
};

export default function () {
    let res = http.get("http://localhost:3002/");
    check(res, {
        "status was 200": (r) => r.status == 200,
        "transaction time OK": (r) => r.timings.duration < 1000
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


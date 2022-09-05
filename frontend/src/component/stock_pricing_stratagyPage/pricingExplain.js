export const priceInit = {
    "NewPrice" : "0",
    "cheap1" : "0",
    "reasonable1" : "0",
    "expensive1" : "0",
    "cheap2" : "0",
    "reasonable2" : "0",
    "expensive2" : "0",
    "cheap3" : "0",
    "reasonable3" : "0",
    "expensive3" : "0",
    "cheap4" : "0",
    "reasonable4" : "0",
    "expensive4" : "0"
}

export function pricing1(year){

    return(
        {
            "explain1" : "透過當期股利或歷史平均股利乘上合理的回本時間估算股價",
            "explain2" : `股價 ＝ 平均${year}年股利 × 你所希望的回本期間（以年為單位）`,
            "explain3" : `便宜價 = 平均${year}年股利 × 15年 = `,
            "explain4" : `合理價 = 平均${year}年股利 × 20年 = `,
            "explain5" : `昂貴價 = 平均${year}年股利 × 30年 = `,
        }
    );
}

export function pricing2(year){

    return({
        "explain1" : "透過歷史股價的平均估算股價",
        "explain2" : `股價 ＝ 平均${year}年股價`,
        "explain3" : `便宜價 = 近${year}年最低股價平均 = `,
        "explain4" : `合理價 = 近${year}年平均股價平均 = `,
        "explain5" : `昂貴價 = 近${year}年最高股價平均 = `,
    });
}

export function pricing3(year){

    return({
        "explain1" : "透過近一年EPS和歷史平均EPS的平均乘上歷史平均PER估算股價",
        "explain2" : `股價 ＝ ((近一年EPS+近${year}年平均EPS) / 2) * 近${year}年PER平均`,
        "explain3" : `便宜價 = ((近一年EPS+近${year}年平均EPS) / 2) * 近${year}年最低PER平均 = `,
        "explain4" : `合理價 = ((近一年EPS+近${year}年平均EPS) / 2) * 近${year}年平均PER平均 = `,
        "explain5" : `昂貴價 = ((近一年EPS+近${year}年平均EPS) / 2) * 近${year}年最高PER平均 = `,
    });
}

export function pricing4(year){

    return({
        "explain1" : "透過歷史平均PBR乘上最新BPS估算股價",
        "explain2" : `股價 ＝ 近${year}年PBR平均 * 最新淨值`,
        "explain3" : `便宜價 = 近${year}年最低PBR平均 * 最新淨值 = `,
        "explain4" : `合理價 = 近${year}年平均PBR平均 * 最新淨值 = `,
        "explain5" : `昂貴價 = 近${year}年最高PBR平均 * 最新淨值 = `,
    });
}

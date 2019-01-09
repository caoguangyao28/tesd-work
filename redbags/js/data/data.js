var file = "images/";
//页面所用到的素材
var bgMaterial = [{src: "loading_img.png", id: "loading"}, {src: "star.png", id: "star"}];
var material = [
    {src: "bg.png", id: "bg"}, {src: "bg.jpg?r=1", id: "bg1"},
    {src: "money.png", id: "money"}, {src: "smallbag.png", id: "smallbag"},
    {src: "static.png?r=2", id: "static"},
    {src: "button.png?r=1", id: "button"},
    {
        src: "ticket.png?r=2",
        id: "ticket"
    },
    {src: "ticketNot.png", id: "ticketNot"},
    {src: "bag.png", id: "bag"},
    {src: "bagOpen.png?r=1", id: "bagOpen"},
    {src: "shaker.mp3", id: "shakerSound"}
];
//红包

//初始化静态素材数据
var staticData = {
    id: "static",
    point: [{x: 32, y: 24, oY: -100, delayIn: 0}, {x: 90, y: 660, oY: -300, delayIn: 1050, delayOut: 0}, {
        x: 230,
        y: 340,
        oY: 300,
        delayIn: 850,
        delayOut: 0
    }, {x: 150, y: 690, oY: 650, delayIn: 900, delayOut: 0}, {x: 430, y: 182, oY: 850, delayIn: 900, delayOut: 0}],
    frames: [
        [22, 26, 246, 105], [30, 140, 618, 340], [30, 530, 280, 280], [320, 585, 408, 130], [116, 825, 516, 782]
    ],
    animations: {logo: 0, slogan: 1, tel: 2, gameText1: 3, hand: 4}
};

//初始化按钮素材数据
var buttonData = {
    id: "button",
    point: [{x: 146, y: 980, oY: 940, delayIn: 1300}],
    frames: [
        [5, 88, 420, 120]
    ],
    animations: {btnStart: 0}
};
//初始化红包打开
var bagOPenData = {
    x: -4, y: -359,
    id: "bagOpen", delayIn: 500, delayOut: 300,
    frames: {width: 810, height: 705, count: 5, regX: 0, regY: 0, spacing: 0, margin: 0},
    animations: {
        stand: 0,
        openEnd: 4,
        open: [1, 4, "openEnd", .4, .3],
        close: {frames: [4, 3, 2, 1], next: "stand", speed: .5}
    }
};
//初始化优惠券
var ticketData = {
    x: 0, y: 0,
    id: "ticket",
    home: [{x: 0, y: -150, scale: .6, rota: 90, oY: 150, delayIn: 1400}],
    frames: {width: 694, height: 566, count: 1, regX: 0, regY: 0, spacing: 0, margin: 0},
    animations: {stand: 0, lottery: 0}
};
//初始化无中奖优惠券
var ticketNotData = {
    x: 0, y: 0,
    id: "ticketNot",
    home: [{x: 0, y: -150, scale: .6, rota: 90, oY: 150, delayIn: 1400}],
    frames: {width: 443, height: 550, count: 1, regX: 0, regY: 0, spacing: 0, margin: 0},
    animations: {stand: 0, notLottery: 0}
};
//初始文案数据
var textData = {
    lottery: {
        des1: "今天还可以抽奖",
        des2: "次",
        data: {x: 230, y: 830, oY: 790, width: 280, height: 50, background: "#cb1c2f", delayIn: 800}
    },
    result: {des: ["迪亚网上超市", "迪亚线下超市"], unit: "元现金券!"},
    resultText: {des1: "恭喜获得", des2: "元红包！", x: 0, y: 0},
    resultNotText: {des: "这次没中奖，下次有大奖，别灰心~\r\n\r\n祝您猴年大吉，财源广进！"}
};
//查看红包链接
var rebbagLink = "http://www.baidu.com";

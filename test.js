/*

// 使われる関数の定義
const createGcalLink = function(startDate, endDate){

}
module.exports = createGcalLink

// 読み込む
var create = require('./createEvent')
console.log(create('20180914', '20180915'))

*/
let reqMessage = "testtest12月17日"

if(reqMessage.match(/(\d+)月(\d+)日/) == null){
    //result = s.match( /\D+(\d+)年(\d+)月(\d+)日/ )
    console.log('null')
}else{
    let result = reqMessage.match(/(\d+)月(\d+)日/)
    console.log(result[1])
    let month = result[1]
    let day = result[2]
    console.log(typeof day)
    let nextDay = String(Number(day) + 1)
    console.log(nextDay)
    console.log(typeof nextDay)
    // dayNum = Number(day)
    // console.log(typeof dayNum)
    // var num = 1
    // console.log(typeof num)
    // dayNum += 1
    // console.log('2018' + month + day);
    // console.log('2018' + month + String(dayNum))
}
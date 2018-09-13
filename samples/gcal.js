function createGcalLink(){
    let title = 'test'
    let description = ''
    let place = ''
    let startDate = '20180914'    //'20180707T180000Z'
    let endDate = '20180915'     //'20130710T090000Z' //終日指定20130707/20130708
    let url = `https://www.google.com/calendar/event?action=TEMPLATE&text=${title}&details=${description}&location=${place}&dates=${startDate}/${endDate}`
    // &text=title, details=description, location=place, dates=
    console.log(url)
}

createGcalLink();
const data = [
    { "1LBoxes": 10, "20LCans": 10, "2LBoxes": null, address: "Near Retro, Ayyappa Society, Madhapur", price1L: 10, price2L: 10, price20L: 10, "300MLBoxes": 10, "500MLBoxes": 10, price300ML: 10, price500ML: 10 },
    { "1LBoxes": 10, "20LCans": 10, "2LBoxes": null, address: "Near Retro, Ayyappa Society, Madhapur", price1L: 100, price2L: 100, price20L: 100, "300MLBoxes": 100, "500MLBoxes": 0, price300ML: 1000, price500ML: 0 }
]

const newData = data[0]

data.map((item, index) => {
    if (index > 0) {
        newData["1LBoxes"] += item["1LBoxes"]
        newData["20LCans"] += item["20LCans"]
        newData["2LBoxes"] += item["2LBoxes"]
        newData["300MLBoxes"] += item["300MLBoxes"]
        newData["500MLBoxes"] += item["500MLBoxes"]
        newData["price1L"] += item["price1L"]
        newData["price2L"] += item["price2L"]
        newData["price20L"] += item["price20L"]
        newData["price300ML"] += item["price300ML"]
        newData["price500ML"] += item["price500ML"]
        newData["address"] = item["address"]
    }
})
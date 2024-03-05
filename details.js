const id = new URL(location).searchParams.get('id')
document.title=id
const buttons = document.querySelectorAll('button')
const about = document.querySelector('.sec-about')
const title = document.querySelector('.info')
const price = document.querySelector('.coin-price')
const container= document.getElementsByClassName('load')[0]

let days = 1;
let grow =0;
const apikey ="CG-KfVwh2DmF1mTTwLVJPxGUXmD"
let chartUrl =`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}&x_cg_demo_api_key=${apikey}`
const historyUrl =`https://api.coingecko.com/api/v3/coins/${id}?vs_currency=usd&x_cg_demo_api_key=${apikey}`
const marketUrl =`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${id}&x_cg_demo_api_key=${apikey}`
function chart(data) {
    const start = {
        current_price:data[0][1]
    }
    const end = {
        current_price:data[data.length-1][1]
    }
    const startFormat = priceFormat(start)
    const startLength = String(startFormat).slice(String(startFormat).indexOf(".")+1).length
    const endFormat = priceFormat(end)
    const endLength = String(endFormat).slice(String(endFormat).indexOf(".")+1).length
    const len = startLength>=endLength ? startLength :endLength
    let startPrice=startFormat*10**len
    let currentPrice=endFormat*10**len
    grow = (currentPrice-startPrice)/(startPrice)*100
let x=[]
let y =[]
data.forEach(e=>{
    const ex = new Date(e[0]).toUTCString()
x.push(ex.slice(3,ex.lastIndexOf(" ")))
y.push(e[1])
})
new Chart("chart", {
  type: "line",
  data: {
    labels: x,
    datasets: [{
    pointRadius:0,
      fill: false,
      backgroundColor: "rgba(0,0,255,1.0)",
      borderColor: "rgba(0,250,5,1)",
      data: y
    }]
  },
  options: {
    legend: {display: false},
    scales: {
      yAxes: [{ticks: {display:false},gridLines:{display :false }}],
      xAxes:[{ticks:{display:false },gridLines:{display :false }}]
    }
  }
});
}  
fetchMarket(marketUrl)
fetchData(chartUrl)
buttons[0].style.backgroundColor='grey'
fetchDetails(historyUrl)
async function fetchData(url) {
    try{
        const res = await fetch(url)
    const data = await res.json()
    displayChart(data)
    container.style.display="none"
    } catch(e) {
    container.style.display="flex"
    container.innerHTML=`<p>Unexpected error occurred.</p>`
    }
    
}
async function fetchDetails(url) {
    try{
    const res = await fetch(url)
    const data = await res.json()
    displayData(data)
        container.style.display="none"
    } catch(e) {
    container.style.display="flex"
    container.innerHTML=`<p>Unexpected error occurred.</p>`
    }
}
async function fetchMarket(url) {
    try{
    const res = await fetch(url)
    const data = await res.json()
        
        displayMarket(data)
        container.style.display="none"
    } catch(e) {
    container.style.display="flex"
    container.innerHTML=`<p> Unexpected error occurred.  </p>`
    }
}
function displayChart(data) {
   chart(data.prices)
   const pec= document.querySelector('.pa')
    grow = grow ? grow : 0
    if(grow>=0) {
        pec.innerText= '+'+grow.toFixed(2)+"%"
        pec.style.color="rgb(0, 255, 34)"
    } else {
        pec.innerText= grow.toFixed(2)+"%"
        pec.style.color='red'
    }
}
function displayMarket(data) {
    
    const coin = data.find(c=>c.id===id)
    let coinPrice = priceFormat(coin)
   price.innerHTML= "$"+stringFormat(coinPrice)
    title.innerText=`Info (${coin.name})`
    document.querySelector('.stat-section')
      .innerHTML =`
      <h2 class="suctitle">Stat</h2>
            <div class="stat">
                <div>
                    <span>Market Cap</span>
                    <span class="decs">$${stringFormat(coin.market_cap.toFixed())}</span>
                </div>
                <div>
                    <span>Total Volume</span>
                    <span class="decs">$${stringFormat(coin.total_volume.toFixed())}</span>
                </div>
                <div>
                    <span>Circulating Supply</span>
                    <span class="decs">${stringFormat(coin.circulating_supply.toFixed())} ${coin.symbol.toUpperCase()}</span>
                </div>
                <div>
                    <span>Total Supply</span>
                    <span class="decs">${stringFormat(coin.total_supply.toFixed())} ${coin.symbol.toUpperCase()}</span>
                </div>
            </div>
`
}
function displayData(data) {
    let d= data.description.en.split("") //.replaceAll(new RegExp("^[\\u003ca]+\\w*[\\u003e]$","g"), "")
    let unicodeUrl = ""
    for(let i=0;i<d.length;i++) {
        if(d[i]==="\u003c" || d.indexOf("\u003c")!==-1 && d.indexOf("\u003c")<=i ) {
            if(d[i] !== "\u003e") {
                unicodeUrl+=d[i]
            } else {
                unicodeUrl+=d[i]
                break
            }
            
        }
    }
    
    if(unicodeUrl) {
        d= data.description.en.replaceAll(unicodeUrl,"")
    } else {
        d= data.description.en
    }
    
    
    let description = d ? d.slice(0,d.indexOf('.')+1): "There is no description. Do your own research to learn about the coin."
   about.innerHTML=`<h2 class="suctitle">About ${data.symbol.toUpperCase()}</h2>
            <p class="para">${description}</p>
        `
}
buttons[0].style.backgroundColor='grey'
buttons.forEach(button=>{
    button.addEventListener('click', e=>{
        buttons.forEach(btn=>{
            btn.style.backgroundColor=''
        })
        button.style.backgroundColor='grey'
        const text = button.innerText
        if(text==='1D') {
            days =1
        } else if(text==='1W') {
            days =7
        }else if(text==='1M') {
            days =30
        }else if(text==='2M') {
            days =60
        } else {
            days =90
        }
        chartUrl =`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}&x_cg_demo_api_key=${apikey}`
        fetchData(chartUrl)
    })
})

function stringFormat(str,size=3) {
    str = String(str)
	let format;
    let ending;
    if(str.indexOf('.')===-1) {
        format =str;
        ending='';
    }else{
        format = String(str.slice(0,str.indexOf('.')))
        ending=String(str.slice(str.indexOf('.')))
}
    let str2 = String(format).split('');
				
    let result=[];
    let copy;
    let str3 =[];
    let result2 ='';
    let formatedNumber='';
    
    for(let i=str2.length-1;i>=0;i--) {
        str3.push(str[i])
    }
    for(let i=0;i<str3.length;i+=size) {
        copy = str3.slice(i,i+size);
        result.push(copy.join(''));
    }
    result2 = result.join(',');
				
    for(let i=result2.length-1;i>=0;i--) {
        formatedNumber+=result2[i];
    }
    return formatedNumber+ending;
}
function priceFormat(coin) {
    
    const e = String(coin.current_price).indexOf("e")
    const sign =String(coin.current_price).indexOf("-")
    const pce = Number(String(coin.current_price).slice(0,e))
    const power = Number(String(coin.current_price).slice(e+2))
    const fixed = String(coin.current_price).slice(0,String(coin.current_price).indexOf(".")+1).length
    if(e!==-1) {
        
        if(sign!==-1) {
           return  coin.current_price.toFixed(String(pce).length+power-fixed)
        } else {
           return coin.current_price.toFixed(2)
        }
    } else {
        return coin.current_price

    }
    
}

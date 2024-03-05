const coins = document.getElementsByClassName('coins')[0]
const coinsMoving = document.getElementsByClassName('moving')[0]
const container= document.getElementsByClassName('load')[0]
const search = document.getElementById("search")
const btn = document.querySelector(".search-btn")
const apikey ="CG-KfVwh2DmF1mTTwLVJPxGUXmD"
async function fetchData(ids="") {
    
    try{
        let res
        if(ids) {
             res = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=["bitcoin",${ids},"bitcoin"]&x_cg_demo_api_key=${apikey}`)
   
        } else {
            res = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&x_cg_demo_api_key=${apikey}`)
   
        }
    const data = await res.json()
    displayData(data,ids)
        container.style.display="none"
    } catch(e) {
        container.style.display="flex"
        container.innerHTML=`<p> Unexpected error occurred.  </p>`
    }
}
async function fetchSearch(searchTerm) {
    container.style.display="flex"
    try{
    const res = await fetch(`https://api.coingecko.com/api/v3/search?query=${searchTerm}&x_cg_demo_api_key=${apikey}`)
    const data = await res.json()
    displayDataSearch(data.coins)
        container.style.display="none"
    } catch(e) {
        container.style.display="flex"
        container.innerHTML=`<p> Unexpected error occurred. </p>`
    }
}
fetchData()

function displayData(data,ids) {
    const assets = data.sort((a,b)=>{
        return b.current_price-a.current_price
    }).slice(0,100)
    if(ids.length>0) {
        coins.innerHTML=data && data.length>0 ?generateCionsHTML(data) : "Coin not found"
        return
    }
    const gainers = data.sort((a,b)=>{
        return b.price_change_percentage_24h-a.price_change_percentage_24h
    })
   coins.innerHTML=data && data.length>0 ?generateCionsHTML(assets) : "No Coins yet"
   coinsMoving.innerHTML=generateMovingHTML(gainers.slice(0,6))
    document.querySelector('.movin').innerHTML=generateMovingHTML(gainers.slice(0,6))

}
function displayDataSearch(data) {
    const ids = []
    data.forEach(coin=>{
        ids.push(coin.id)
    })
    
    fetchData(ids.join(","))
    
}
btn.addEventListener('click',()=>{
    const searchValue = search.value.trim()
    fetchSearch(searchValue)
    search.value =""
})

search.addEventListener('keydown',(e)=>{
    
    if(e.key==="Enter") {
        const searchValue = search.value.trim()
    fetchSearch(searchValue)
    search.value =""
    }
    
})
function generateCionsHTML(coins) {
    let coinHTML =''
    coins.forEach(coin => {
        coinHTML += `<a href="details.html?id=${coin.id}">
        <div class="coin_wrap">
        
        <div class="pic_coin">
            <img style="background-color:#fff" width="30px" src="${coin.image}" alt="">
            <div>
                <h4>${(coin.symbol).toUpperCase()}</h4>
                <p>
                    <span class="price">$${coin.current_price?stringFormat(coin.current_price?.toFixed(2)):"0.00"}</span>
                    <span class=" ${coin.price_change_percentage_24h>=0?'pec pecentage-green':'pec pecentage-red'}">${coin.price_change_percentage_24h>=0? coin.price_change_percentage_24h?'+'+coin.price_change_percentage_24h?.toFixed(2):"0.00":coin.price_change_percentage_24h?.toFixed(2)}%</span>
                </p>
            </div>
        </div>
        <div class="cap">
            <h4>Market cap</h4>
            <p>$${coin.market_cap?(capFormatter(coin.market_cap)):"0.00"}</p>
        </div>
        
    </div>
    </a>
        `
    });
    return coinHTML;
}
function capFormatter(cap) {
    if (cap>=1000000000000) {
        return (cap/1000000000000)?.toFixed(2)+ ' T'
    } else if(cap>=1000000000 && cap < 1000000000000){
        return (cap/1000000000)?.toFixed(2)+' B'
    } else if (cap >=1000000 && cap < 1000000000) {
        return (cap/1000000)?.toFixed(2)+' M'
    } else if (cap >=1000 && cap<1000000) {
        return (cap/1000)?.toFixed(2)+' K'
    } else {
        return cap?.toFixed(2)
    }
}
function generateMovingHTML(data) {
    let html =''
    data.forEach(coin=>{
        html+=`
        <div class="coinsMoving">
        <div class="coin">
            <img src="${coin.image}" alt="">
            <span>${coin.symbol.toUpperCase()}/USD</span>  
        </div>
        <p >${stringFormat(coin.current_price.toFixed(2))}</p>
        <p class="${coin.price_change_percentage_24h>=0?'pecentage-green':'pecentage-red'}">${coin.price_change_24h.toFixed(2)} <span class="span ${coin.price_change_percentage_24h>=0?'pecentage-green':'pecentage-red'}">(${coin.price_change_percentage_24h>=0?'+'+coin.price_change_percentage_24h.toFixed(2):coin.price_change_percentage_24h.toFixed(2)}%)</span></p>
        </div>
        
        `
    })
    return html
}
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

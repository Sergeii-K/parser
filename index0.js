const puppeteer = require('puppeteer');
const fs = require ('fs');

let link = 'https://www.karpaty.info/ua/recreation/residence/?res_type=house';


(async () => {
    let flag = true
    let res = []

    try {
        let browser = await puppeteer.launch ({
            headless: false,
            slowMo: 500,
            devtools: true
        })
        let page = await browser.newPage()
        await page.setViewport({
            width: 1920, height: 1080
        })
        while(flag){
            await page.goto(`${link}`)
            console.log(link);

            let html = await page.evaluate(async () => {
                let page = []

                try {
                    let divs = document.querySelectorAll('li.objlist-li')

                    divs.forEach(div => {
                       
                        let obj = {
                            homename: div.querySelector('div.objinfolink').innerText,
                            homelink: div.querySelector('a').href,
                            location: div.querySelector('div.objinfoloc').innerText,
                            foto: div.querySelector('img').src

                        }

                        page.push(obj)

                    })

                    console.log(divs);
                    

                } catch (e) {
                    console.log(e);
                }

                return page

            });

            await res.push(html)

            if (res) flag = false;
            

            console.log(res)

        }

            await browser.close()

            res = res.flat()

            fs.writeFile('home.json', JSON.stringify({'data': res}), err => {
                if(err) throw err
                console.log('home.json saved');
                console.log('home.json length -', res.length);
            });

    } catch (e) {
        console.log(e);
      
    }
})();
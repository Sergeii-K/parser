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
                let pages = []

                try {
                    let divs = document.querySelectorAll('li.objlist-li')

                    divs.forEach(div => {
                       
                        let obj = {gg: div.querySelector('a').href,}
                        
                        for (let link of obj) {
                             page.goto(link);
                        
                             page.waitForSelector('div.uheader-head');

                             let ht =  page.evaluate( () => {
                                let pag = []
                        
                                try {
                                    let divs = document.querySelectorAll('div.ki-tested ')
                        console.log('divs' , divs);
                                    divs.forEach(div => {
                                       
                                        let obj = {
                                            homename: div.querySelector('h2').innerText,
                                            city: div.querySelector('div.uheader-content a').innerText
                        
                                        }
                                        console.log('obj',obj);
                                        pag.push(obj)
                           browser.stop()
                                    })
                                    console.log('page',pag);
                                  
                                    
                        
                                } catch (e) {
                                    console.log(e);
                                }
                        
                                return pag
                        
                            });
                            
                        pages.push(ht);
                            
                           
                          }



                       
                    console.log(obj);
                    })

                    
                    

                } catch (e) {
                    console.log(e);
                }

               return pages;

                
 
            });

                
   
              
            await res.push(html)

            if (res) flag = false;
            

            console.log(html)

        }

            await browser.stop()

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
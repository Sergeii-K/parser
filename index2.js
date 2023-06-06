const puppeteer = require('puppeteer');

async function scrapeData() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 500,
    devtools: true
});
  const page = await browser.newPage()
  await page.setViewport({
    width: 1920, height: 1080
});
  
  await page.goto('https://www.karpaty.info/ua/recreation/residence/?res_type=house');
  
  // Ожидаем загрузки данных на странице
  await page.waitForSelector('li.active.bld');
  
  // Получаем ссылки на детальные страницы каждого коттеджа
  const links = await page.$$eval('div.objinfolink a', (elements) => {
    return elements.map((el) => el.href);
  });

  // Переходим на каждую детальную страницу и получаем необходимые данные
  const cottagesData = [];
  for (let link of links) {
    await page.goto(link);
    
    // Ожидаем загрузки данных на странице детальной информации о коттедже
    await page.waitForSelector('div.uheader-head');
    
    // Извлекаем необходимые данные
    let html = await page.evaluate(async () => {
        let page = []

        try {
            let divs = document.querySelectorAll('div.ki-tested ')
console.log('divs' , divs);
            divs.forEach(div => {
               
                let obj = {
                    homename: div.querySelector('h2').innerText,
                    city: div.querySelector('div.uheader-content a').innerText

                }
                console.log('obj',obj);
                page.push(obj)
   browser.stop()
            })
            console.log('page',page);
          
            

        } catch (e) {
            console.log(e);
        }

        return page

    });
    
    await cottagesData.push(html);
    
    console.log('cottagesData',cottagesData)
  }
  
  // Закрываем браузер
  await browser.close();
  
  return cottagesData;
}

// Запускаем функцию для получения данных
scrapeData()
  .then((data) => console.log(data))
  .catch((error) => console.error(error));

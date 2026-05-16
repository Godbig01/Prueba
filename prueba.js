
const { chromium } = require('playwright');
const fs = require('fs');

(async () => {

    
    const URL_CAPITULO = 'https://www.wattpad.com/1629229026-encuestas-parte-1-sin-título';

    

    const browser = await chromium.launch({
        headless: true, // false = mostrar
        slowMo: 100
    });

    const page = await browser.newPage();

    

    console.log('Entrando a Wattpad...');

    await page.goto(URL_CAPITULO, {
        waitUntil: 'networkidle'
    });

    
    await page.waitForTimeout(5000);



    const POLL_CONTAINER = '.reader-poll-container';

    
    const POLL_TITLE = '.poll-question';


    const POLL_OPTION = '.poll-option-text';

    

    // console.log('Buscando encuestas...');

    const polls = await page.locator(POLL_CONTAINER).all();

    // console.log(`Encuestas encontradas: ${polls.length}`);

    const respuestas = await page.locator('.info-text').textContent();

    // console.log('Respuestas:', respuestas);

    const resultadoFinal = [];

   

    for (let i = 0; i < polls.length; i++) {

        const poll = polls[i];

        // console.log(`\nEncuesta ${i + 1}`);


        let titulo = 'Sin título';


        try {

            titulo = await poll.locator(POLL_TITLE).textContent();

        } catch (error) {

            // console.log('No se encontró título');

        }

        // console.log('Título:', titulo);


        const opciones = [];

        try {

            const optionElements = await poll.locator(POLL_OPTION).all();

            for (const option of optionElements) {

                const textoCompleto = await option.textContent();
                const limpio=textoCompleto.trim();

                const porcentaje = limpio.match(/\d+%/)?.[0] || '0%';

                const texto = limpio.replace(/\d+%/, '').trim();

                opciones.push({
                    porcentaje,
                    texto
                });

                // console.log(`- ${texto} (${porcentaje})`);

            }

        } catch (error) {

            // console.log('No se encontraron opciones');

        }

        resultadoFinal.push({
            titulo,
            respuestas,
            opciones
        });

    }

    // ==========================================
    // GUARDAR JSON
    // ==========================================

    fs.writeFileSync(
        'encuestas.json',
        JSON.stringify(resultadoFinal, null, 2)
    );

    console.log('\nJSON guardado correctamente');

    // // ==========================================
    // // OPCIONAL:
    // // GUARDAR HTML COMPLETO
    // // ==========================================

    // const html = await page.content();

    // fs.writeFileSync('pagina.html', html);

    // console.log('HTML guardado en pagina.html');

    // ==========================================
    // CERRAR
    // ==========================================

    await browser.close();

})();
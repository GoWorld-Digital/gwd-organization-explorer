import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {scenes} from '../lib/experience.ts';

const base=process.argv[2]||process.env.EXPLORER_URL||'http://127.0.0.1:3000';
const localChrome='C:/Program Files/Google/Chrome/Application/chrome.exe';
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||(existsSync(localChrome)?localChrome:undefined),args:['--enable-unsafe-swiftshader','--use-angle=swiftshader']});
const out='docs/screenshots/cinematic';
await mkdir(out,{recursive:true});
const errors=[];
async function ready(page,id){
  await page.locator('.scene-art[src="/scenes/'+id+'.webp"]').waitFor();
  await page.waitForFunction(id=>{const image=document.querySelector('.scene-art[src="/scenes/'+id+'.webp"]');return image?.complete&&image.naturalWidth===1672;},id);
  await page.locator('.scene-loading').waitFor({state:'hidden'});
  await page.waitForTimeout(100);
}
const fidelity=[];
try{
  const page=await browser.newPage({viewport:{width:1672,height:995},reducedMotion:'reduce',deviceScaleFactor:1});
    page.on('pageerror',error=>{errors.push(error.message);console.error('Browser error:',error.message);});
  for(const scene of scenes){
    await page.goto(base+'/#'+scene.id);
    await ready(page,scene.id);
    await page.mouse.move(1660,980);
    const capture=await page.locator('.art-frame').screenshot({path:out+'/'+scene.id+'.png'});
    const actual=await sharp(capture).removeAlpha().raw().toBuffer({resolveWithObject:true});
    const expected=await sharp(await readFile('public/scenes/'+scene.id+'.webp')).removeAlpha().raw().toBuffer({resolveWithObject:true});
    assert.equal(actual.info.width,1672);
    assert.equal(actual.info.height,941);
    let total=0,max=0,changed=0;
    for(let i=0;i<actual.data.length;i++){const delta=Math.abs(actual.data[i]-expected.data[i]);total+=delta;max=Math.max(max,delta);if(delta>0)changed++;}
    const meanError=total/actual.data.length;
    fidelity.push({scene:scene.id,meanAbsoluteChannelError:meanError,maxChannelError:max,changedChannels:changed,totalChannels:actual.data.length});
    assert.ok(meanError<0.15,scene.id+' must preserve the original composition, mean pixel error '+meanError);
  }
  await page.goto(base+'/#arrival');await ready(page,'arrival');
  await page.getByRole('button',{name:'Enter the Genesis',exact:true}).click();await ready(page,'genesis');
  await page.getByRole('button',{name:'Watch the Genesis',exact:true}).click();
  await page.getByRole('dialog',{name:'The Genesis story'}).waitFor();
  await page.getByRole('button',{name:'Start the guided journey'}).click();
  await page.getByRole('region',{name:'Guided tour'}).waitFor();
  await page.getByRole('button',{name:'Continue',exact:false}).click();await ready(page,'universe');
  await page.getByRole('button',{name:'Leave tour'}).click();
  await page.getByRole('button',{name:'Enter Governance',exact:true}).click();await ready(page,'governance');
  await page.getByRole('button',{name:'Explore the council',exact:true}).click();
  await page.getByRole('dialog',{name:'Governance',exact:true}).waitFor();
  await page.locator('summary').filter({hasText:'Board of Administration'}).click();
  assert.ok(await page.getByRole('heading',{name:'Connected capabilities'}).first().isVisible());
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('dialog').count(),0);
  await page.waitForFunction(()=>document.activeElement?.getAttribute('aria-label')==='Explore the council');
  assert.equal(await page.evaluate(()=>document.activeElement?.getAttribute('aria-label')),'Explore the council');
  await page.getByRole('button',{name:'Search the experience',exact:true}).click();
  await page.getByRole('searchbox').fill('finance');
  await page.getByRole('button',{name:/Finance & Administration/}).click();await ready(page,'shared-services');
  await page.getByRole('dialog',{name:'Shared Services'}).waitFor();
  assert.equal((await page.locator('details[open] summary').innerText()).toLowerCase(),'finance & administration\nproposed');
  await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'Back to universe',exact:true}).click();await ready(page,'universe');
  await page.goBack();await ready(page,'shared-services');

  const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
  mobile.on('pageerror',error=>errors.push(error.message));
  await mobile.goto(base);await ready(mobile,'arrival');
  assert.equal(await mobile.locator('canvas').count(),0);
  await mobile.getByRole('button',{name:'Enter the Genesis',exact:true}).tap();await ready(mobile,'genesis');
  await mobile.getByRole('button',{name:'Explore the organization',exact:true}).tap();await ready(mobile,'universe');
  await mobile.getByRole('button',{name:'Governance',exact:true}).tap();await ready(mobile,'governance');
  await mobile.getByRole('button',{name:'Explore the council',exact:true}).tap();
  await mobile.getByRole('dialog',{name:'Governance',exact:true}).waitFor();
  await mobile.getByRole('button',{name:'Close panel'}).tap();
  assert.ok(await mobile.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  assert.equal(await mobile.getByRole('button',{name:'Motion off'}).getAttribute('aria-pressed'),'true');
  await mobile.screenshot({path:out+'/mobile.png',fullPage:true});

  const tablet=await browser.newPage({viewport:{width:768,height:1024},reducedMotion:'reduce'});
  await tablet.goto(base+'/#knowledge');await ready(tablet,'knowledge');
  assert.ok(await tablet.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await tablet.screenshot({path:out+'/tablet.png',fullPage:true});

  const blocked=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
  await blocked.addInitScript(()=>{HTMLCanvasElement.prototype.getContext=()=>null;});
  await blocked.goto(base+'/#labs');await ready(blocked,'labs');
  await blocked.getByRole('button',{name:'Explore the labs',exact:true}).click();
  await blocked.getByRole('dialog',{name:'Labs & Innovation'}).waitFor();
  assert.equal(await blocked.locator('canvas').count(),0);
  await blocked.screenshot({path:out+'/no-webgl.png'});

  const missing=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
  await missing.route('**/scenes/**',route=>route.abort());
  await missing.goto(base+'/#governance');
  await missing.locator('.art-error').waitFor();
  await missing.getByRole('button',{name:'Explore the council',exact:true}).click();
  await missing.getByRole('dialog',{name:'Governance',exact:true}).waitFor();

  assert.deepEqual(errors,[]);
  await writeFile(out+'/fidelity.json',JSON.stringify(fidelity,null,2)+'\n');
  console.log('PASS nine original compositions, pixel fidelity, navigation, guided tour, dossiers, search, focus restoration, history, mobile touch, tablet, reduced motion, no-WebGL and missing-image fallback');
}finally{await browser.close();}

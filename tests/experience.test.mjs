import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {scenes,sceneIds,layerScenes,parseScene} from '../lib/experience.ts';
import model from '../content/organization/organization-model.json' with {type:'json'};
import manifest from '../design/scene-assets.json' with {type:'json'};

test('Nine visual environments cover all canonical layers without changing the organization',()=>{
  assert.equal(sceneIds.size,9);
  assert.equal(scenes.length,9);
  assert.deepEqual(layerScenes.map(s=>s.layerIndex),[0,1,2,3,4]);
  assert.deepEqual(layerScenes.map(s=>s.id),model.layers.map(l=>l.id==='labs-innovation'?'labs':l.id));
  for(const scene of scenes){
    assert.ok(scene.hotspots.some(h=>h.kind==='primary'));
    for(const h of scene.hotspots){
      const [x,y,w,height]=h.rect;
      assert.ok(x>=0&&y>=0&&w>0&&height>0&&x+w<=100&&y+height<=100,`${scene.id}: ${h.label} must stay in the artboard`);
      if('scene' in h.action)assert.ok(sceneIds.has(h.action.scene));
    }
  }
  assert.equal(parseScene('#governance'),'governance');
  assert.equal(parseScene('#not-a-scene'),'arrival');
});

test('Every shipped scene matches its recorded lossless asset hash and dimensions',async()=>{
  assert.equal(manifest.length,9);
  for(const scene of scenes){
    const asset=manifest.find(a=>a.id===scene.id);
    assert.ok(asset);
    assert.equal(asset.pixelMatch,true);
    assert.equal(asset.encoding,'lossless-webp');
    assert.equal(asset.width,1672);
    assert.equal(asset.height,941);
    const bytes=await readFile(new URL('../public/scenes/'+scene.id+'.webp',import.meta.url));
    assert.equal(bytes.length,asset.bytes);
    assert.equal(createHash('sha256').update(bytes).digest('hex'),asset.assetSha256);
  }
});

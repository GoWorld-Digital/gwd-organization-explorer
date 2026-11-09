import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const sources = [
  ['arrival','libfile_90c6c58e3aec81919bf3e7caef9c3c33'],
  ['genesis','libfile_9743406c0b0c81919d55b8c568bdda60'],
  ['universe','libfile_2a3c3e537ce48191939f2998803ed325'],
  ['knowledge','libfile_1362392801d48191909c3d375685fdc0'],
  ['governance','libfile_dafc62a4bcd8819197b1d8449d117b77'],
  ['executive','libfile_fc1283b158b081918ce14cd38f31ed14'],
  ['shared-services','libfile_5262602f0e8081918bb36e17580e49d0'],
  ['business-units','libfile_1f07898890588191aa322abc1e363c94'],
  ['labs','libfile_5d342c75473481919fb23560cfdfd634'],
];
await mkdir(path.join(root,'public/scenes'),{recursive:true});
const manifest = [];
for (const [id, libraryId] of sources) {
  const input = await readFile(path.join(root,'design/reference',id+'.png'));
  const output = await sharp(input).webp({lossless:true,effort:6}).toBuffer();
  const original = await sharp(input).removeAlpha().raw().toBuffer({resolveWithObject:true});
  const decoded = await sharp(output).removeAlpha().raw().toBuffer({resolveWithObject:true});
  if (!original.data.equals(decoded.data)) throw Error('Pixel integrity failed: '+id);
  await writeFile(path.join(root,'public/scenes',id+'.webp'),output);
  manifest.push({id,sourceLibraryId:libraryId,sourceSha256:createHash('sha256').update(input).digest('hex'),assetSha256:createHash('sha256').update(output).digest('hex'),width:original.info.width,height:original.info.height,bytes:output.length,encoding:'lossless-webp',pixelMatch:true,origin:'User-directed GWD visual proposal generated in this conversation, 2026-11-09',status:'proposed-visual-environment'});
}
await writeFile(path.join(root,'design/scene-assets.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(manifest.map(({id,bytes,width,height,pixelMatch})=>({id,bytes,width,height,pixelMatch})));

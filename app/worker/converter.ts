import pako from 'pako';
import { NBTWriter, TAG } from '../lib/nbt-writer';

self.onmessage = async (e) => {
  const { file, tolerance = 20 } = e.data;
  
  try {
    const bitmap = await createImageBitmap(file);
    const width = bitmap.width;
    const length = bitmap.height;
    const height = 1;

    const canvas = new OffscreenCanvas(width, length);
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('Could not get 2D context');
    ctx.drawImage(bitmap, 0, 0);

    // Initial NBT setup
    const nbt = new NBTWriter(width * length * 2); // Pre-allocate some space
    
    // Root Schematic Compound (empty name)
    nbt.writeTagType(TAG.COMPOUND);
    nbt.writeString(''); 

    // Inside Schematic Compound
    nbt.writeTagType(TAG.INT);
    nbt.writeString('Version');
    nbt.writeInt(2);

    nbt.writeTagType(TAG.INT);
    nbt.writeString('DataVersion');
    nbt.writeInt(2584); // 1.16+

    nbt.writeTagType(TAG.SHORT);
    nbt.writeString('Width');
    nbt.writeShort(width);

    nbt.writeTagType(TAG.SHORT);
    nbt.writeString('Height');
    nbt.writeShort(height);

    nbt.writeTagType(TAG.SHORT);
    nbt.writeString('Length');
    nbt.writeShort(length);

    // Palette Compound
    nbt.writeTagType(TAG.COMPOUND);
    nbt.writeString('Palette');
    
    nbt.writeTagType(TAG.INT);
    nbt.writeString('minecraft:air');
    nbt.writeInt(0);
    
    nbt.writeTagType(TAG.INT);
    nbt.writeString('minecraft:obsidian');
    nbt.writeInt(1);

    nbt.writeTagType(TAG.INT);
    nbt.writeString('minecraft:crying_obsidian');
    nbt.writeInt(2);

    nbt.writeTagType(TAG.END); // End Palette

    nbt.writeTagType(TAG.INT);
    nbt.writeString('PaletteMax');
    nbt.writeInt(3);

    // BLOCK PROCESSING
    // In Sponge Schematic, the index is: (y * length + z) * width + x
    // Our logo is flat on Y=0, so index is: z * width + x
    const blockDataArray = new Uint8Array(width * length * 2); // Rough max size for VarInts
    let blockPtr = 0;

    const CHUNK_SIZE = 512;
    for (let z = 0; z < length; z += CHUNK_SIZE) {
      const currentChunkHeight = Math.min(CHUNK_SIZE, length - z);
      const imageData = ctx.getImageData(0, z, width, currentChunkHeight);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        let blockId = 0; // Default Air

        if (a > 50) { // Not transparent
          // Check Obsidian (Black: 0, 0, 0)
          if (r <= tolerance && g <= tolerance && b <= tolerance) {
            blockId = 1;
          } 
          // Check Crying Obsidian (Purple: 159, 129, 214)
          else if (
            Math.abs(r - 159) <= tolerance &&
            Math.abs(g - 129) <= tolerance &&
            Math.abs(b - 214) <= tolerance
          ) {
            blockId = 2;
          }
        }

        // Add to blockDataArray as VarInt
        let v = blockId;
        while ((v & -128) !== 0) {
          blockDataArray[blockPtr++] = (v & 127) | 128;
          v >>>= 7;
        }
        blockDataArray[blockPtr++] = v;
      }

      self.postMessage({ type: 'progress', progress: Math.round(((z + currentChunkHeight) / length) * 100) });
    }

    // Write BlockData ByteArray
    nbt.writeTagType(TAG.BYTE_ARRAY);
    nbt.writeString('BlockData');
    nbt.writeByteArray(blockDataArray.slice(0, blockPtr));

    nbt.writeTagType(TAG.END); // End Root Compound

    // COMPRESS AND RETURN
    const finalBuffer = nbt.getBuffer();
    const compressed = pako.gzip(finalBuffer);
    const blob = new Blob([compressed], { type: 'application/octet-stream' });
    
    self.postMessage({ type: 'result', blob });

  } catch (err: any) {
    self.postMessage({ type: 'error', error: err.message });
  }
};

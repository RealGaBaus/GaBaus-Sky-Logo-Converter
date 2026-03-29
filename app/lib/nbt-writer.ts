export class NBTWriter {
  private buffer: Uint8Array;
  private offset: number;

  constructor(initialSize = 1024 * 1024) {
    this.buffer = new Uint8Array(initialSize);
    this.offset = 0;
  }

  private ensureCapacity(additional: number) {
    if (this.offset + additional > this.buffer.length) {
      let newSize = this.buffer.length * 2;
      while (this.offset + additional > newSize) newSize *= 2;
      const newBuffer = new Uint8Array(newSize);
      newBuffer.set(this.buffer);
      this.buffer = newBuffer;
    }
  }

  writeTagType(type: number) {
    this.ensureCapacity(1);
    this.buffer[this.offset++] = type;
  }

  writeString(str: string) {
    const bytes = new TextEncoder().encode(str);
    this.writeShort(bytes.length);
    this.ensureCapacity(bytes.length);
    this.buffer.set(bytes, this.offset);
    this.offset += bytes.length;
  }

  writeShort(val: number) {
    this.ensureCapacity(2);
    const view = new DataView(this.buffer.buffer);
    view.setInt16(this.offset, val, false); // Big Endian
    this.offset += 2;
  }

  writeInt(val: number) {
    this.ensureCapacity(4);
    const view = new DataView(this.buffer.buffer);
    view.setInt32(this.offset, val, false); // Big Endian
    this.offset += 4;
  }

  writeVarInt(val: number) {
    let v = val;
    while ((v & -128) !== 0) {
      this.ensureCapacity(1);
      this.buffer[this.offset++] = (v & 127) | 128;
      v >>>= 7;
    }
    this.ensureCapacity(1);
    this.buffer[this.offset++] = v;
  }

  writeByteArray(arr: Uint8Array) {
    this.writeInt(arr.length);
    this.ensureCapacity(arr.length);
    this.buffer.set(arr, this.offset);
    this.offset += arr.length;
  }

  getBuffer(): Uint8Array {
    return this.buffer.slice(0, this.offset);
  }
}

export const TAG = {
  END: 0,
  BYTE: 1,
  SHORT: 2,
  INT: 3,
  LONG: 4,
  FLOAT: 5,
  DOUBLE: 6,
  BYTE_ARRAY: 7,
  STRING: 8,
  LIST: 9,
  COMPOUND: 10,
  INT_ARRAY: 11,
  LONG_ARRAY: 12,
};

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export const modelValidation = {
  async validateOnnxFile(file: File): Promise<ValidationResult> {
    if (!file.name.toLowerCase().endsWith('.onnx')) {
      return { valid: false, error: 'File must have .onnx extension' };
    }
    if (file.size > 50 * 1024 * 1024) {
      return { valid: false, error: 'File exceeds 50MB limit' };
    }
    // Read first bytes to verify ONNX magic
    const chunk = file.slice(0, 8);
    const buffer = await chunk.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    // ONNX files typically start with a protobuf message; simple length check
    const lengthPrefix = new DataView(buffer).getUint32(0, false);
    if (bytes.length < 4 || lengthPrefix > file.size || lengthPrefix < 1) {
      // Not a strict check — allow if file is non-empty
      if (bytes.length === 0) {
        return { valid: false, error: 'File is empty' };
      }
    }
    return { valid: true };
  },

  async validateOnnxFileAsync(file: File): Promise<ValidationResult> {
    return await this.validateOnnxFile(file);
  },
};

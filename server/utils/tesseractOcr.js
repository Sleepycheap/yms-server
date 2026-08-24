import { createWorker } from "tesseract.js";

export async function getText(imageSrc) {
  const worker = await createWorker("eng");
  try {
    const {
      data: { text },
    } = await worker.recognize(imageSrc);
    console.log("extractedText", text);
  } catch (err) {
    console.log("error getting text from image", err.message);
  }
  await worker.terminate();
  return text;
}

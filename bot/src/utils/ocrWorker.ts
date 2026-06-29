/*
// src/utils/ocrWorker.ts
// utils/ocrWorker.ts
import { createWorker, type Worker as TesseractWorker } from 'tesseract.js';

let worker: TesseractWorker | null = null;

export async function getOcrWorker(): Promise<TesseractWorker> {
  if (worker) return worker;

  worker = await createWorker({
    logger: (m: any) => console.log('[Tesseract]', m), // optional: progress logging
  }as any);

  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  return worker;
}

export async function extractTextFromImage(image: string): Promise<string> {
  const wrk = await getOcrWorker();
  const { data } = await wrk.recognize(image);
  return data.text;
}

export async function terminateOcrWorker(): Promise<void> {
  if (worker) {
    await worker.terminate();
    worker = null;
  }
}
*/
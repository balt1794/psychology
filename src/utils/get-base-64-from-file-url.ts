import { readFile } from "fs/promises";
import path from "path";

export async function getBase64FromFileUrl(fileUrl: string): Promise<string> {
  if (fileUrl.startsWith("/") && !fileUrl.startsWith("//")) {
    let projectRoot = process.cwd();
    if (projectRoot.includes(".mastra")) {
      const mastraIndex = projectRoot.indexOf(".mastra");
      projectRoot = projectRoot.substring(0, mastraIndex).replace(/\/$/, "");
    }
    const filePath = path.join(projectRoot, "public", fileUrl);
    const fileBuffer = await readFile(filePath);
    return fileBuffer.toString("base64");
  }

  const response = await fetch(fileUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer).toString("base64");
}

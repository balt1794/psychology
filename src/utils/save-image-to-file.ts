import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export async function saveImageToFile(
  image: string | Buffer,
  extension: string = "jpeg",
): Promise<string> {
  const imageBuffer =
    typeof image === "string"
      ? Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), "base64")
      : image;

  const fileName = `${randomUUID()}.${extension}`;
  let projectRoot = process.cwd();
  if (projectRoot.includes(".mastra")) {
    const mastraIndex = projectRoot.indexOf(".mastra");
    projectRoot = projectRoot.substring(0, mastraIndex).replace(/\/$/, "");
  }

  const uploadsDir = path.join(projectRoot, "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  const filePath = path.join(uploadsDir, fileName);
  await writeFile(filePath, imageBuffer);

  return `/uploads/${fileName}`;
}

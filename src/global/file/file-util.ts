import * as fs from "fs";

export const createDir = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log("created dirPath", dirPath);
  }
};

export const writeFile = (path: string, data: Buffer) => {
  fs.writeFileSync(path, data);
};

export const deleteDir = async (dirPath: string): Promise<void> => {
  await fs.promises.rm(dirPath, { recursive: true });
};

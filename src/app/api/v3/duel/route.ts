import { StartDuelData } from "@/templates/myApi";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic"; //shouldnt be necessary after properly implementing the database

export async function GET(request: Request) {
  let dbDir = path.join(process.cwd(), "src/mockDatabase/");

  let person1Id: number;
  let person2Id: number;

  while (true) {
    let files = fs.readdirSync(dbDir).filter((item) => item.includes(".jpg"));

    let file1 = files[Math.floor(Math.random() * files.length)];
    let file2 = files[Math.floor(Math.random() * files.length)];

    file1 = file1.replace(".jpg", "");
    file2 = file2.replace(".jpg", "");

    if (file1 !== file2) {
      person1Id = parseInt(file1);
      person2Id = parseInt(file2);
      break;
    }
  }

  const file1Content = fs.readFileSync(dbDir + person1Id + ".jpg", "base64");
  const file2Content = fs.readFileSync(dbDir + person2Id + ".jpg", "base64");

  const responseObject: StartDuelData = {
    duelId: 0,
    theme: "mais bonito",
    person1Id: person1Id,
    person2Id: person2Id,
    image1b64: file1Content,
    image2b64: file2Content,
  };

  return new Response(JSON.stringify(responseObject), {
    headers: {
      "content-type": "application/json",
    },
  });
}

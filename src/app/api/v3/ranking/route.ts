import { GetRankingData } from "@/templates/myApi";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic"; //shouldnt be necessary after properly implementing the database

export async function GET(request: Request) {
  let dbDir = path.join(process.cwd(), "src/mockDatabase/");

  let files = fs.readdirSync(dbDir).filter((item) => item.includes(".jpg"));

  let responseJson: GetRankingData = [];

  files.forEach((item, index) => {
    let itemJpegAlias = item;
    let itemJsonAlias = item.replace(".jpg", ".json");
    let itemId = item.replace(".jpg", "");

    let itemJpegRawData = fs.readFileSync(dbDir + itemJpegAlias, "base64");
    let itemJsonRawData = fs.readFileSync(dbDir + itemJsonAlias, "utf-8");

    let itemJsonParsed = JSON.parse(itemJsonRawData);

    let objectUnit = {
      name: itemJsonParsed["name"],
      id: parseInt(itemId),
      image: itemJpegRawData,
      points: itemJsonParsed["points"],
    };

    responseJson.push(objectUnit);
  });

  return new Response(JSON.stringify(responseJson), {
    headers: {
      "content-type": "application/json",
    },
  });
}

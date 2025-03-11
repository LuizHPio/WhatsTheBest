import fs from "fs";
import path from "path";
import { PickWinnerPayload } from "@/templates/myApi";

interface IDataModel {
  points: number;
}

async function handleMatch(winner: number, loser: number) {
  const winnerData = await retrieveData(winner);
  const loserData = await retrieveData(loser);

  const expectedProbability = (A: number, B: number) => {
    return 1 / (1 + 10 ** ((B - A) / 400));
  };

  const Ea = expectedProbability(winnerData.points, loserData.points);
  const Eb = expectedProbability(loserData.points, winnerData.points);
  const Ra = winnerData.points;
  const Rb = loserData.points;
  const K = 32;

  let RaP = Ra + K * (1 - Ea);
  let RbP = Rb + K * (0 - Eb);

  RaP = Math.round(RaP);
  RbP = Math.round(RbP);

  writePoints(winner, RaP);
  writePoints(loser, RbP);
}

async function writePoints(target: number, points: number) {
  const dbDir = path.join(process.cwd(), "src/mockDatabase/");

  let rawData = fs.readFileSync(dbDir + target + ".json", "utf-8");
  const Data = (await JSON.parse(rawData)) as IDataModel;

  Data.points = points;

  let writeData = JSON.stringify(Data);

  fs.writeFileSync(dbDir + target + ".json", writeData);
}

async function retrieveData(target: number) {
  const dbDir = path.join(process.cwd(), "src/mockDatabase/");

  let rawData = fs.readFileSync(dbDir + target + ".json", "utf-8");
  return (await JSON.parse(rawData)) as IDataModel;
}

export async function POST(request: Request) {
  const requestData = (await request.json()) as PickWinnerPayload;

  try {
    const winner = requestData.winnerId;
    const loser = requestData.loserId;

    handleMatch(winner, loser);
  } catch (error) {
    console.error(error);
    throw error;
  }
  return new Response();
}

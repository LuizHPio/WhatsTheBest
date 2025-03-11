import internalApi from "@/app/api/apiContract";

interface fetchDuelResponse {
  person1id: number;
  person2id: number;
  image1b64: string;
  image2b64: string;
}

class Person {
  id: number;
  image: Blob;

  constructor(id: number, image: Blob) {
    this.id = id;
    this.image = image;
  }

  static async fetchDuel(): Promise<{ person1: Person; person2: Person }> {
    try {
      const apiResponse = await internalApi.duel.startDuel();

      const person1 = new Person(
        apiResponse.data.person1Id,
        this.convertRawImageToBlob(apiResponse.data.image1b64)
      );

      const person2 = new Person(
        apiResponse.data.person2Id,
        this.convertRawImageToBlob(apiResponse.data.image2b64)
      );

      return { person1, person2 };
    } catch (error) {
      console.error("Error fetching duel:", error);
      throw error;
    }
  }

  static convertRawImageToBlob(rawImage: string) {
    const uint8Array = new Uint8Array(
      atob(rawImage)
        .split("")
        .map((char) => char.charCodeAt(0))
    );
    return new Blob([uint8Array], { type: "image/jpeg" });
  }
}

export default Person;

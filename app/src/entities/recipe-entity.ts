export class RecipeEntity {
  constructor(
    public reference: string,
    public name: string,
    public duration: number,
    public description: string,
    public favourite: boolean,
    public tags: string[],
    public instructions: Instruction[],
    public ingredients: Ingredients[],
    public imageUrl: string,
    public servings: number
  ) {}

  public toString(): string {
    let output: string = "";
    output +=
      "Duration :" +
      this.duration +
      "min, servings: " +
      this.servings +
      "ppl\n";
    output += "Ingredients\n";
    output += "Instructions\n";

    return output;
  }
}

export class Instruction {
  constructor(public orderNb: number, public description: string) {}
}

export class Ingredients {
  constructor(
    public name: string,
    public quantity: number,
    public unit: string
  ) {}
}

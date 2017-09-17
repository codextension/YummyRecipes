export class RecipeEntity {
  constructor(
    public id: number,
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
  constructor(
    public id: number,
    public orderNb: number,
    public description: string
  ) {}
}

export class Ingredients {
  constructor(
    public id: number,
    public name: string,
    public quantity: number,
    public unit: string
  ) {}

  public toString(): string {
    let output: string = "";
    if (this.quantity != null && this.quantity > 0) {
      output += this.quantity;
      if (this.unit != null) {
        output += " " + this.unit;
      }
    }
    output += "  " + this.name;

    return output;
  }
}

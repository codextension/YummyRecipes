export class RecipeEntity {
  constructor(
    public id: string,
    public name: string,
    public duration: number,
    public notes: string,
    public favourite: boolean,
    public tags: string[],
    public instructions: string[],
    public ingredients: Ingredient[],
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

export class Ingredient {
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

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
    let allIngredients: string = "";

    for (let ingredient of this.ingredients) {
      allIngredients += ingredient + "\n";
    }

    let output: string = `${this.name}\n\nDuration: ${this
      .duration}min\tServings: ${this
      .servings}\n\nIngredients:\n${allIngredients}\n\nInstructions:\n${this.instructions.join(
      "\n"
    )}\n\nNotes:\n${this.notes}`;
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

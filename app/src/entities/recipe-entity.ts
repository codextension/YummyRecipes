import { Instruction } from "./instruction";

export class RecipeEntity {
  constructor(
    public reference: string,
    public name: string,
    public description: string,
    public favourite: boolean,
    public tags: string[],
    public instructions: Instruction[],
    public imageUrl: string
  ) {}
}

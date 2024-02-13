import { Dice } from "./Dice";

export class Player {
    readonly OutsideShooting: number;
    readonly InsideShooting: number;
    readonly Defense: number;
    readonly ShootingTendancy: number; 
    constructor() {
        this.OutsideShooting = Dice.RollD20();
        this.InsideShooting = Dice.RollD20();
        this.Defense = Dice.RollD20();
        this.ShootingTendancy = Dice.RollD100();
    }
}
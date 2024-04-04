import { Dice } from "./Dice";

// Change to be more like DND
export interface Player {
    // OutsideShooting: number; // Goes up with level
    // InsideShooting: number;
    // Defense: number;
    // ShootingTendancy: number;  // Goes away if playing manually but would need for NPCs
    Name: string;
    Agility: number;
    Speed: number;
    BallHandling: number;
    Stamina: number;
    Defense: number;
}
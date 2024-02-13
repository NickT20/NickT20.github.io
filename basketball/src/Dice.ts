export class Dice {
    private static randomNumberInRange = (max: number) => {
      return Math.floor(Math.random()
          * (max - 1 + 1)) + 1;
    };

    static RollD20 = () => this.randomNumberInRange(20);
    static RollD100 = () => this.randomNumberInRange(100);
}
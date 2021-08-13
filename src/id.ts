export class Id {
  private id: number;
  private hasCalled: boolean;

  constructor() {
    this.id = 0;
    this.hasCalled = false;
  }

  public next() {
    if (this.id === 0 && !this.hasCalled) {
      this.hasCalled = true;
      return this.id;
    }
    this.id++;
    return this.id;
  }
}

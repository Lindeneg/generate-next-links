export class Id {
  private static CURRENT = 0;
  private static hasCalled = false;

  public static next() {
    if (Id.CURRENT === 0 && !Id.hasCalled) {
      Id.hasCalled = true;
      return Id.CURRENT;
    }
    Id.CURRENT = Id.CURRENT + 1;
    return Id.CURRENT;
  }
}

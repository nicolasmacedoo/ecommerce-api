import { randomUUID } from 'node:crypto'

export class UniqueEntityID {
  private value: string

  toString(): string {
    return this.value
  }

  toValue(): string {
    return this.value
  }

  constructor(id?: string) {
    this.value = id ?? randomUUID()
  }

  public equals(id: UniqueEntityID): boolean {
    if (id === null || id === undefined) {
      return false
    }

    if (!(id instanceof UniqueEntityID)) {
      return false
    }

    return id.toValue() === this.value
  }
}

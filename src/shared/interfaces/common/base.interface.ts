export interface IBase {
  id: string
  handlerAfterInsert(): void
  handlerAfterUpdate(): void
  handlerAfterRemove(): void
  logInsert(): void
  logUpdate(): void
  logRemove(): void
  createdAt: Date | string
  updatedAt: Date | string
}

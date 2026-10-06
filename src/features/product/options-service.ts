import * as optionsRepo from "./options-repository";

export type RawProductOption = Awaited<ReturnType<typeof optionsRepo.findOptions>>[number];

export function listProductOptions(): ReturnType<typeof optionsRepo.findOptions> {
  return optionsRepo.findOptions();
}

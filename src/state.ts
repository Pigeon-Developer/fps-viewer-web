import { atom } from 'nanostores';
import { Problem } from './codec/type';

export const $problems = atom<Problem[]>([]);

export function resetList(list: Problem[]) {
  $problems.set([...list]);
}

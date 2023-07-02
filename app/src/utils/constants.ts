import { IDefect } from '@entities/entities';

export const statusList: IDefect['status'][] = ['OPEN', 'CONTAINED', 'CLOSED'];

export const defects = ['Side  wrinkles', 'Split Metal', 'Imprints'];

export const statusColors: { [key in IDefect['status']]: string } = {
  'CLOSED': '#0EA642',
  'OPEN': '#F53E16',
  'CONTAINED': '#F58116',
};

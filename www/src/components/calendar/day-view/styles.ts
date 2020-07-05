import { Theme } from '@material-ui/core/styles';

export const SINGLE_LINE_MINUTE = 15;

export function getCellHeightCalc(theme: Theme): string {
  return `${theme.typography.body2.lineHeight}em * ${60 / SINGLE_LINE_MINUTE}`;
}

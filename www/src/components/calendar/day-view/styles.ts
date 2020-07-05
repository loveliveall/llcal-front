import { Theme } from '@material-ui/core/styles';

export function getCellHeightCalc(theme: Theme): string {
  return `${theme.typography.body2.lineHeight}em * 2`;
}

import { TOOLTIPS } from '../tooltips.constants';
import { CommonObject } from '../../models';
import { OverlayOption, ActionTableRow } from '../../modules/table/models';

export const getCommonOptions = (actionRow: ActionTableRow): OverlayOption[] => {
  const array = [];
  if (actionRow.detail) {
    array.push({
      icon: TOOLTIPS.DETAIL,
      text: 'TABLE.ACTIONS.DETAIL',
      fn: (row: CommonObject) => actionRow.detail(row),
    });
  }
  if (actionRow.remove) {
    array.push({
      icon: TOOLTIPS.REMOVE,
      text: 'TABLE.ACTIONS.REMOVE',
      fn: (row: CommonObject) => actionRow.detail(row),
    });
  }
  return array;
};

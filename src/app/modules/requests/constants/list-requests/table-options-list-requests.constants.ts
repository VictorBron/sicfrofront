import { TranslateService } from '@ngx-translate/core';
import { ActionTableRowRequestRead, ActionTableRowRequestEdit } from '..';
import { TOOLTIPS } from '../../../../shared/constants';
import { CommonObject, TableItem } from '../../../../shared/models';
import { OverlayOption } from '../../../../shared/modules/table/models';
import { dateEarlierThanNow } from '../../../../shared/utils';
import { RequestTable } from '../../models';

export const getCommonOptionsRequestEdit = (
  translate: TranslateService,
  actionRow: ActionTableRowRequestEdit,
): OverlayOption[] => {
  return [
    {
      icon: TOOLTIPS.DETAIL,
      text: 'TABLE.ACTIONS.DETAIL',
      fn: (row: CommonObject) => actionRow.detail(row),
    },
    {
      icon: TOOLTIPS.EDIT,
      text: 'TABLE.ACTIONS.EDIT',
      fn: (row: CommonObject) => actionRow.edit(row),
      disable: (row: CommonObject) => ((row as TableItem).disabled || !(row as RequestTable).Active) as boolean,
    },
    {
      icon: TOOLTIPS.DONUT,
      text: 'TABLE.ACTIONS.SET_INACTIVE',
      fn: (row: CommonObject) => actionRow.changeStatus(row),
      color: 'red',
      disable: (row: CommonObject) => {
        if (
          dateEarlierThanNow(
            (row as TableItem).ValidityStartDate as Date,
            (row as TableItem).ValidityStartHour as string,
          )
        )
          return true;
        else return !(row as TableItem).Active;
      },
    },
  ];
};

export const getCommonOptionsRequestRead = (
  translate: TranslateService,
  actionRow: ActionTableRowRequestRead,
): OverlayOption[] => {
  return [
    {
      icon: TOOLTIPS.DETAIL,
      text: 'TABLE.ACTIONS.DETAIL',
      fn: (row: CommonObject) => actionRow.detail(row),
    },
  ];
};

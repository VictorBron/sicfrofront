import { SNACK_CLASS } from '.';
import { SnackModelEmitter } from '../../models';
import { NotificationService } from './../../services/notification-service/notification.service';

export const openErrorSnack = (notificationService: NotificationService) => {
  notificationService.snack$.next({
    message: 'SNACK.ERROR',
    action: 'SNACK.ACTIONS.OK',
    class: SNACK_CLASS.ERROR,
  } as SnackModelEmitter);
};

import { Router } from '@angular/router';
import { SNACK_CLASS } from '../../../shared/constants';
import { SnackModelEmitter } from '../../../shared/models';
import { NotificationService } from '../../../shared/services/notification-service/notification.service';

export const itemNotInDb = (notificationService: NotificationService, router: Router, path: any[]): void => {
  notificationService.snack$.next({
    message: 'SNACK.NOT_IN_DB',
    action: 'SNACK.ACTIONS.OK',
    class: SNACK_CLASS.ERROR,
  } as SnackModelEmitter);
  router.navigate(path);
};

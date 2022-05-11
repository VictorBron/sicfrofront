import { ModalActionType } from './modal-action-type';

export interface ModalModelEmitter {
  type: ModalActionType;
  textTitle?: string;
  textMessage?: string;
  textInformative?: string;
  showQueryResult?: number;
  iconMessage1?: string;
  iconMessage2?: string;
  confirmText?: string;
}

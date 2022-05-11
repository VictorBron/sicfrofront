import { CommonObject } from '../../../models';

export interface OverlayOption {
  text: string;
  fn: (row: CommonObject) => void;
  icon: string;
  color?: string;
  disable?: (row: CommonObject) => boolean | boolean;
}

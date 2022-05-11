export interface ErrorResponse {
  Error?: string;
  Code?: number;
  Data?: any;
  HResult?: number;
  HelpLink?: string;
  Message?: string;
  Source?: string;
  StackTrace?: string;
  TargetSite?: string;
}

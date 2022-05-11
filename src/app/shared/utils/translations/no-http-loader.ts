import { TranslateService } from '@ngx-translate/core';

export const translateGetNoHTTPLoader = (data: string[], translateService: TranslateService): string[] => {
  let translatedData: string[] = [];
  translateService.get(data).subscribe((translated: string[]) => {
    Object.keys(translated).forEach(key => translatedData.push(translated[key as keyof typeof translated] as string));
  });
  return translatedData;
};

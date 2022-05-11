import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { WorkBook, WorkSheet, read, utils } from 'xlsx';
import { TEMPLATE_PATH } from '../../constants';
import { ApiService } from '../api-service';

@Injectable({
  providedIn: 'root',
})
export class FileService implements OnDestroy {
  public resetFileUpdated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public obs: Subject<unknown[]> = new Subject<unknown[]>();

  constructor(private apiService: ApiService) {}

  public ngOnDestroy(): void {
    this.resetFileUpdated$.unsubscribe();
    this.obs.unsubscribe();
  }

  public downloadRequestTemplate(): void {
    window.location.assign(`${window.location.origin}/${TEMPLATE_PATH}`);
  }

  public loadFile(event: any): void {
    const target: DataTransfer = <DataTransfer>event.target;
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    let dataReaded: unknown[] = [];
    reader.onload = (e: any) => {
      const binarystr: string = e.target.result;
      const wb: WorkBook = read(binarystr, { type: 'binary', cellDates: true, dateNF: 'yyyy/mm/dd;@' });
      const ws: WorkSheet = wb.Sheets[wb.SheetNames[0]];

      dataReaded = utils
        .sheet_to_json(ws, { raw: true, header: 1 })
        .slice(1)
        .filter(row => {
          if ((row as Array<any>).length > 0) return true;
          return false;
        });

      this.obs.next(dataReaded);
    };
  }

  public downloadFileCSV(rows: object[], headers?: string[], fileName?: string): void {
    if (!rows || !rows.length) {
      return;
    }
    const objectDelimitator = ';';
    const rowDelimitator = '\n';
    const keys = Object.keys(rows[0]);
    let csvContent = headers
      ? headers.filter(header => header !== '').join(objectDelimitator) + rowDelimitator
      : keys.join(objectDelimitator) + rowDelimitator;

    let contentRow: string[] = [];
    let contentTable: string[] = [];

    rows.forEach(row => {
      contentRow = [];
      keys.forEach((key: string) => {
        let cell: any = row[key as keyof typeof row] ?? '';
        if (cell instanceof Date) cell = cell.toLocaleString();
        contentRow.push(cell);
      });
      contentTable.push(contentRow.join(objectDelimitator));
    });
    csvContent += contentTable.join(rowDelimitator);

    this.fakeDownloadDocument(new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }), fileName);
    // const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    // const link = document.createElement('a');
    // if (link.download !== undefined) {
    //   // Browsers that support HTML5 download attribute
    //   const url = URL.createObjectURL(blob);
    //   link.setAttribute('href', url);
    //   link.setAttribute('download', fileName);
    //   link.style.visibility = 'hidden';
    //   document.body.appendChild(link);
    //   link.click();
    //   document.body.removeChild(link);
    // }
  }

  private fakeDownloadDocument(contentBlob: Blob, fileName: string): void {
    const blob = contentBlob;
    const link = document.createElement('a');
    if (link.download !== undefined) {
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

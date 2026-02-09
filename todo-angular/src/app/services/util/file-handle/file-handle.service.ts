import { Injectable, signal } from '@angular/core';
import { FileHandler } from '../../../util/FileHandler';

@Injectable({ providedIn: 'root' })
export class FileHandleService {
  isOpening = signal(false);

  async openFolder() {
    this.isOpening.set(true);

    try {
      const res: FileHandleResult = await FileHandler.getHandle();
      return res;
    } finally {
      this.isOpening.set(false);
    }
  }
}

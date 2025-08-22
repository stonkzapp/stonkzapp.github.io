import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private requestCount = signal(0);
  private isLoading = signal(false);

  getLoadingState() {
    return this.isLoading.asReadonly();
  }

  startLoading() {
    this.requestCount.update(count => count + 1);
    this.isLoading.set(true);
  }

  stopLoading() {
    this.requestCount.update(count => {
      const newCount = Math.max(0, count - 1);
      if (newCount === 0) {
        this.isLoading.set(false);
      }
      return newCount;
    });
  }

  resetLoading() {
    this.requestCount.set(0);
    this.isLoading.set(false);
  }
}

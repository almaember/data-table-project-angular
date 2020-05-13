import { TestBed } from '@angular/core/testing';

import { WebhooksService } from './webhooks.service';

describe('WebhooksService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebhooksService = TestBed.get(WebhooksService);
    expect(service).toBeTruthy();
  });
});

import { TestBed, inject } from '@angular/core/testing';

import { RecipesExchangeService } from './recipes-exchange.service';

describe('RecipesExchangeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecipesExchangeService]
    });
  });

  it('should be created', inject([RecipesExchangeService], (service:RecipesExchangeService) => {
    expect(service).toBeTruthy();
  }));
});

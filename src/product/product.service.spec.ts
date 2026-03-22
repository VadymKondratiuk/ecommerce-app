import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';

describe('ProductService', () => {
  let service: ProductService;

  const mockProductRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((product) => Promise.resolve({ id: '123e4567-e89b-12d3-a456-426614174000', ...product })),
    find: jest.fn().mockResolvedValue([]),
    findOneBy: jest.fn().mockResolvedValue(null),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a product', async () => {
    const dto = { name: 'Test Product', price: 100.50, isActive: true };
    const result = await service.create(dto);
    
    expect(result).toEqual({
      id: expect.any(String),
      name: 'Test Product',
      price: 100.50,
      isActive: true,
    });
    expect(mockProductRepository.create).toHaveBeenCalledWith(dto);
    expect(mockProductRepository.save).toHaveBeenCalled();
  });
});
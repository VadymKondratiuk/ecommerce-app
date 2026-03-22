import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller'; 
import { ProductService } from './product.service';

describe('ProductsController', () => {
  let controller: ProductController;

  const mockProductService = {
    create: jest.fn((dto) => {
      return {
        id: '123e4567-e89b-12d3-a456-426614174000', 
        ...dto,
        isActive: true,
        createdAt: new Date(),
      };
    }),
    findAll: jest.fn().mockResolvedValue([]),
    findOne: jest.fn((id: string) => ({ id, name: 'Test Product', price: 100, isActive: true })),
    update: jest.fn((id: string, dto) => ({ id, ...dto })),
    remove: jest.fn((id: string) => ({ affected: 1 })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a product', async () => {
    const dto = { name: 'Controller Test Product', price: 200.00 };
    const result = await controller.create(dto);
    
    expect(result).toEqual({
      id: expect.any(String),
      name: 'Controller Test Product',
      price: 200.00,
      isActive: true,
      createdAt: expect.any(Date),
    });
    expect(mockProductService.create).toHaveBeenCalledWith(dto);
  });
});
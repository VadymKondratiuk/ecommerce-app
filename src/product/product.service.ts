import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Logger } from 'nestjs-pino';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private readonly logger: Logger 
  ) {}

  async create(createProductDto: CreateProductDto) {
    this.logger.log({ createProductDto }, 'Attempting to create product');
    try {
      const newProduct = this.productRepository.create(createProductDto);
      const savedProduct = await this.productRepository.save(newProduct);
      this.logger.log({ productId: savedProduct.id }, 'Product created successfully');
      return savedProduct;
    } catch (error) {
      this.logger.error({ error: error.message, stack: error.stack }, 'Failed to create product');
      throw new InternalServerErrorException('Error while creating product');
    }
  }

  async findOne(id: string): Promise<Product | null> {
    try {
      const product = await this.productRepository.findOneBy({ id });
      if (!product) {
        this.logger.warn({ productId: id }, 'Product not found');
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      return product;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      
      this.logger.error({ productId: id, error: error.message }, 'Error finding product');
      throw new InternalServerErrorException('Database error during product search');
    }
  }

  async findAll(): Promise<Product[]> {
    this.logger.log('Attempting to fetch all products');
    try {
      const products = await this.productRepository.find();
      this.logger.log({ count: products.length }, 'Successfully fetched all products');
      return products;
    } catch (error) {
      this.logger.error({ error: error.message, stack: error.stack }, 'Failed to fetch products');
      throw new InternalServerErrorException('Database error while retrieving products');
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    this.logger.log({ productId: id, updateProductDto }, 'Updating product');
    try {
      const result = await this.productRepository.update(id, updateProductDto);
      if (result.affected === 0) {
        this.logger.warn({ productId: id }, 'Update failed: Product not found');
        throw new NotFoundException(`Product ${id} not found`);
      }
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error({ productId: id, error: error.message }, 'Failed to update product');
      throw new InternalServerErrorException('Database error during update');
    }
  }

  async remove(id: string) {
    this.logger.log({ productId: id }, 'Request to remove product');
    try {
      const result = await this.productRepository.delete(id);
      if (result.affected === 0) {
        this.logger.warn({ productId: id }, 'Delete failed: Product not found');
        throw new NotFoundException(`Product ${id} not found`);
      }
      this.logger.log({ productId: id }, 'Product removed successfully');
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error({ productId: id, error: error.message }, 'Error during product deletion');
      throw new InternalServerErrorException('Failed to delete product from database');
    }
  }
}
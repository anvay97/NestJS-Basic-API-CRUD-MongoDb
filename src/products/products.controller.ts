import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(private readonly prodService: ProductsService) { }

    @Post()
    async addProduct(@Body('title') prodTitle: string, @Body('description') prodDesc: string, @Body('price') prodPrice: number) {
        const generatedId = await this.prodService.insertProduct(prodTitle, prodDesc, prodPrice);
        return {
            id: generatedId
        };
    }

    @Get()
    async getAllProducts() {
        const products =  await this.prodService.fetchProducts();
        return products;
    }

    @Get(':id')
    async getProduct(@Param('id') prodId: string) {
        const product = await this.prodService.getSingleProduct(prodId);
        return product;
    }

    @Patch(':id')
    async updateProduct(@Param('id') prodId: string, @Body('title') prodTitle: string, @Body('description') prodDes: string, @Body('price') prodPrice: number) {
        await this.prodService.modifyProduct(prodId, prodTitle, prodDes, prodPrice);
        return null;
    }   

    @Delete(':id')
    async removeProduct(@Param('id') prodId: string){
        await this.prodService.deleteProduct(prodId);
        return null;
    }


}
import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './product.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {

    constructor(@InjectModel('Product') private readonly productModel: Model<Product>) { }

    private async findProduct(id: string): Promise<Product> {
        let product;

        try {
            product = await this.productModel.findById(id).exec();
        } catch (error) {
            throw new NotFoundException("Product Not Found");
        }

        if (!product) {
            throw new NotFoundException('Could Not Find Product !!!!');
        }

        return product;
    }

    async insertProduct(title: string, desc: string, price: number) {
        const newProduct = new this.productModel({
            title,
            description: desc,
            price
        });
        const result = await newProduct.save();
        console.log(result);
        return result._id as string;

    }

    async fetchProducts() {
        const products = await this.productModel.find().exec();
        return products.map((prod) => ({
            id: prod.id,
            title: prod.title,
            description: prod.description,
            price: prod.price
        })
        )
    }

    async getSingleProduct(productId: string) {
        let product;
        try {
            product = await this.findProduct(productId);
        } catch (error) {
            throw new NotFoundException("Product Not Found !!!!");
        }

        if (!product) {
            throw new NotFoundException("Product Not Found !!!!");
        }
        return {
            id: product.id,
            title: product.title,
            description: product.description,
            price: product.price
        }
    }

    async modifyProduct(productId: string, title: string, des: string, price: number) {
        const updatedProduct = await this.findProduct(productId);
        if (title) {
            updatedProduct.title = title
        }

        if (des) {
            updatedProduct.description = des;
        }

        if (price) {
            updatedProduct.price = price;
        }

        updatedProduct.save();
    }

    async deleteProduct(prodId: string) {
        const result = await this.productModel.deleteOne({_id: prodId}).exec();
        if(result.n === 0){
            throw new NotFoundException("Product Not Found !!!!");
        }
        
    }


}
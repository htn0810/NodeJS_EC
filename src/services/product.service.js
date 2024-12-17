'use strict';

const { BadRequestError } = require("../core/error.response");
const { product, clothing } = require("../models/product.model");

// Define Factory class to create product
class ProductFactory {
  static async createProduct(type, payload) {
    switch(type) {
      case 'Electronics': 
        return new Electronic(payload);
      case 'Clothing':
        return new Clothing(payload).createProduct();
      default:
        throw new BadRequestError(`Invalid Product Types: ${type}`)
    }
  }
}


// define base product class
class Product {
  constructor({
    product_name, product_thumb, product_description, product_price,
    product_type, product_shop, product_attributes, product_quantity
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
    this.product_quantity = product_quantity;
  }

  // create new product
  async createProduct(product_id) {
    return await product.create({...this, _id: product_id});
  }
}

// Define sub-class for different product types Clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create(this.product_attributes);
    if (!newClothing) throw new BadRequestError('Create new Clothing error!');
    
    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError('Create new Product error!');
  }
}

// Define sub-class for different product types Electronic
class Electronic extends Product {
  async createProduct() {
    const newElectronic = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    });
    if (!newElectronic) throw new BadRequestError('Create new Electronic error!');
    
    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError('Create new Product error!');
  }
}

module.exports = ProductFactory
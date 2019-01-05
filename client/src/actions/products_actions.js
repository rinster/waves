import axios from 'axios';
import { 
    GET_PRODUCTS_BY_SELL,
    GET_PRODUCTS_BY_ARRIVAL,
    GET_BRANDS,
    ADD_BRAND,
    GET_WOODS,
    ADD_WOOD,
    GET_PRODUCTS_TO_SHOP,
    ADD_PRODUCT,
    CLEAR_PRODUCT,
    GET_PRODUCT_DETAIL,
    CLEAR_PRODUCT_DETAIL
} from './types';


import { PRODUCT_SERVER } from '../components/utils/misc'; 



//GET Product info by ID-----
export function getProductDetail(id) {
    const request = axios.get(`${PRODUCT_SERVER}/articles_by_id?id=${id}&type=single`)
    .then(response => {
        return response.data[0]
    });

    return {
        type: GET_PRODUCT_DETAIL,
        payload: request
    }
}

//Clear Product Detail-----
export function clearProductDetail(){
    return {
        type: CLEAR_PRODUCT_DETAIL,
        payload:''
    }
}


//GET Best sellers-----
export function getProductsBySell() {
    //?sortBy=sold&order=desc&limit=100
    const request = axios.get(`${PRODUCT_SERVER}/articles?sortBy=sold&order=desc&limit=4`)
                    .then(response => response.data);

    return {
        type: GET_PRODUCTS_BY_SELL,
        payload: request
    }
}

//GET Recently added-----
export function getProductsByArrival() {
    const request = axios.get(`${PRODUCT_SERVER}/articles?sortBy=createdAt&order=desc&limit=4`)
                    .then(response => response.data);

    return {
        type: GET_PRODUCTS_BY_ARRIVAL,
        payload: request
    }
}

//Based on the filters choosen by the user in /shop-----
//grab to the filtered products from the database------
export function getProductsToShop(skip, limit, filters =[], previousState = []) {
    const data = {
        limit,
        skip,
        filters
    }

    const request = axios.post(`${PRODUCT_SERVER}/shop`, data)
                    .then(response => {
                        //newState allow to merge the previous and
                        //new state whrn the load more button is 
                        //clicked
                        let newState = [
                            ...previousState,
                            ...response.data.articles
                        ]

                        return { 
                            size: response.data.size, 
                            articles: newState
                        }
                    });
    
    return {
        type: GET_PRODUCTS_TO_SHOP,
        payload: request
    }

}

//Admin - Add product to DB-----
export function addProduct(datatoSubmit){
    
    const request = axios.post(`${PRODUCT_SERVER}/article`, datatoSubmit)
                    .then(response => response.data);

    return {
        type: ADD_PRODUCT,
        payload: request
    }
}

//Clear products from reducer when reset field is triggered - add_product.js
export function clearProduct() {
    return {
        type: CLEAR_PRODUCT,
        payload: ''
    }
}



///////////////////////////////////
///////     Categories
///////////////////////////////////

//GET Brands-----
export function getBrands() {
    
    const request = axios.get(`${PRODUCT_SERVER}/get_brands`) 
                    .then(response => response.data);

    return {
        type: GET_BRANDS,
        payload: request
    }
}

//POST Add brand-----
export function addBrand(datatoSubmit,existingBrands){
    const request = axios.post(`${PRODUCT_SERVER}/brand`, datatoSubmit)
    .then(response=>{
        let brands = [
            ...existingBrands,
            response.data.brand
        ];
        return {
            success: response.data.success,
            brands
        }
    });

    return {
        type: ADD_BRAND,
        payload: request
    }
}

//GET Woods-----
export function getWoods() {

    const request = axios.get(`${PRODUCT_SERVER}/get_woods`) 
                    .then(response => response.data);

    return {
        type: GET_WOODS,
        payload: request
    }
}

//POST Add Wood-----
export function addWood(datatoSubmit,existingWoods){
    const request = axios.post(`${PRODUCT_SERVER}/wood`, datatoSubmit)
    .then(response=>{
        let woods = [
            ...existingWoods,
            response.data.wood
        ];
        return {
            success: response.data.success,
            woods
        }
    });

    return {
        type: ADD_WOOD,
        payload: request
    }
}
import React, { Component } from 'react';
import PageTop from '../utils/page_top';

import {frets, price} from '../utils/Form/fixed_categories';

import {connect} from 'react-redux';
import { getProductsToShop, getBrands, getWoods} from '../../actions/products_actions';

import CollapseCheckbox from '../utils/collapseCheckbox';
import CollapseRadio from '../utils/collapseRadio';

import LoadmoreCards from './loadmoreCards';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faBars from '@fortawesome/fontawesome-free-solid/faBars';
import faTh from '@fortawesome/fontawesome-free-solid/faTh';


class Shop extends Component {

    state = {
        grid: '',
        limit: 6,
        skip: 0,
        filters:{
            brand: [],
            frets: [],
            wood: [],
            price: []
        }
    }

    componentDidMount(){
        this.props.dispatch(getBrands());
        this.props.dispatch(getWoods());

        this.props.dispatch(getProductsToShop(
            this.state.skip,
            this.state.limit,
            this.state.filters
        ))
    }

    handlePrice = (value) => {
        //This function grabs the array data that matches
        //the value of the price
        const data = price;
        let array = [];

        for(let key in data) {
            if(data[key]._id === parseInt(value, 10)){
                array = data[key].array
            }
        }
        return array;
    }

    handleFilters = (filters,category) => {
        const newFilters = {...this.state.filters}
        newFilters[category] = filters;

        // Handle Prices
        if(category === "price") {
            let priceValues = this.handlePrice(filters);
            newFilters[category] = priceValues;
        } else {

        }
        this.showFilteredResults(newFilters)
        this.setState({
            filters: newFilters
        })
    }

    //This function updates the state 
    //as the filters are toggled with
    showFilteredResults = (filters) => {
        this.props.dispatch(getProductsToShop(
            0,
            this.state.limit,
            filters
        )).then(()=> {
            this.setState({
                skip:0
            })
        })
    }

    LoadmoreCards = () => {
        //Skip over cards that are already rendered
        let skip = this.state.skip + this.state.limit;

        this.props.dispatch(getProductsToShop(
            skip,
            this.state.limit,
            this.state.filters,
            this.props.products.toShop  //Passing the previous state(already rendered nfo)
        )).then(()=>{
            this.setState({
                skip
            })
        })
    }

    handleGrid = () => {
        this.setState({
            grid: !this.state.grid ? 'grid_bars':''
        })
    }


    render() {
        const products = this.props.products;

        return (
            <div>
                <PageTop
                    title="Browse Products"
                />
                <div className="container">
                    <div className="shop_wrapper">

                        {/* --------LEFT Filter Bar-------- */}
                        <div className="left">
                            
                            {/* --------Brands-------- */}
                            <CollapseCheckbox
                                initState={true}//this will be open when page first loads
                                title="Brands"
                                list={products.brands}
                                handleFilters={(filters)=> this.handleFilters(filters, 'brand')}//2nd argument handles value
                            />

                            {/* --------Frets-------- */}
                            <CollapseCheckbox
                                initState={false}//this will be open when page first loads
                                title="Frets"
                                list={frets}
                                handleFilters={(filters)=> this.handleFilters(filters, 'frets')}//2nd argument handles value
                            />

                            {/* --------Woods-------- */}
                            <CollapseCheckbox
                                initState={false}//this will be open when page first loads
                                title="Woods"
                                list={products.woods}
                                handleFilters={(filters)=> this.handleFilters(filters, 'wood')}//2nd argument handles value
                            />

                            {/* --------Prices-------- */}
                            <CollapseRadio
                                initState={true}//this will be open when page first loads
                                title="Prices"
                                list={price}
                                handleFilters={(filters)=> this.handleFilters(filters, 'price')}//2nd argument handles value
                            />

                        </div>

                        {/* --------RIGHT Shop Cards-------- */}
                        <div className="right">

                            {/* --------Grids-------- */}
                            <div className="shop_options">
                                <div className="shop_grids clear">
                                    <div
                                        className={`grid_btn ${this.state.grid?'':'active'}`}
                                        onClick={()=> this.handleGrid()}
                                    >
                                        <FontAwesomeIcon icon={faTh}/>
                                    </div>
                                    <div
                                        className={`grid_btn ${this.state.grid?'':'active'}`}
                                        onClick={()=> this.handleGrid()}
                                    >
                                        <FontAwesomeIcon icon={faBars}/>
                                    </div>
                                </div>
                            </div>

                            {/*------Cards & Load More-----*/}
                            <div style={{clear:'both'}}>
                                <LoadmoreCards
                                    grid={this.state.grid}
                                    limit={this.state.limit}
                                    size={products.toShopSize}
                                    products={products.toShop}
                                    loadMore={()=> this.LoadmoreCards()}
                                />
                            </div>
                        </div>



                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps =(state) => {
    return {
        products: state.products
    }
}

export default connect(mapStateToProps)(Shop);

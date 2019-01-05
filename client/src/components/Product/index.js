import React, { Component } from 'react';

import PageTop from '../utils/page_top';
import ProdNfo from './prodNfo';
import ProgImg from './prodImg';

import { connect } from 'react-redux';
import { addToCart } from '../../actions/user_actions';
import { getProductDetail, clearProductDetail } from '../../actions/products_actions';

class ProductPage extends Component {

    componentDidMount(){
        //Grab id from param
        const id = this.props.match.params.id;
        //console.log(id)
        this.props.dispatch(getProductDetail(id)).then(response => {
            if (!this.props.products.prodDetail){
                console.log("No Article found")
                this.props.history.push('/');
            }
        })
    }

    componentWillUnmount(){
        this.props.dispatch(clearProductDetail())
    }

    addToCartHandler(id){
        this.props.dispatch(addToCart(id))
    }

    render() {
        return (
            <div>
                <PageTop
                    title="Product Detail"
                />
                <div className="container">
                    {this.props.products.prodDetail ?
                        <div className="product_detail_wrapper">
                            <div className="left">
                                <div style={{width: '500px'}}>
                                    <ProgImg
                                        detail={this.props.products.prodDetail}
                                    />
                                </div>
                            </div>
                            <div className="right">
                                <ProdNfo
                                    addToCart={(id)=>this.addToCartHandler(id)}
                                    detail={this.props.products.prodDetail}
                                />
                            </div>
                        </div>
                    
                    :'Loading'
                    }

                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) =>{
    return {
        products: state.products
    }
}

export default connect(mapStateToProps)(ProductPage);

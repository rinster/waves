import React from 'react';
import Card from './card';


const CardBlock = (props) => {

    const  renderCards = () => (
        props.list ? 
            props.list.map((card,i)=> (

                    <Card
                        key={i}
                        {...card}
                    />

            ))
        :null
    )


    return (
        <div className="card_block">
            <div className="container">

                {/* -----Render Title------ */}
                {
                    props.title ?
                        <div className="title">
                            {props.title}
                        </div>
                    :null
                }
                
                {/* -----Render Cards ------ */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                }}>
                    { renderCards(props.list) }
                </div>
            
            </div>
        </div>
    );
}

export default CardBlock;

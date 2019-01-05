import React, { Component } from 'react';
import PaypalExpressBtn from 'react-paypal-express-checkout';

class Paypal extends Component {

    render() {

        const onSuccess = (payment) => {
        //    console.log(JSON.stringify(payment))

        this.props.onSuccess(payment);
        
        // {"paid":true,"cancelled":false,
        // "payerID":"VFBJ2ZDF2FWN8",
        // "paymentID":"PAY-8WG63630D8681794WLQXQJFA",
        // "paymentToken":"EC-7KG91195M4522825R",
        // "returnUrl":"https://www.sandbox.paypal.com/?paymentId=PAY-8WG63630D8681794WLQXQJFA&token=EC-7KG91195M4522825R&PayerID=VFBJ2ZDF2FWN8",
        // "address":
            // {"recipient_name":"test buyer",
            // "line1":"1 Main St",
            // "city":"San Jose",
            // "state":"CA",
            // "postal_code":"95131",
            // "country_code":"US"},
        // "email":"Enatnat.08-buyer@gmail.com"}
        }

        //When payee cancels transaction
        const onCancel = (data) => {
            console.log(JSON.stringify(data))

        }

        const onError = (err) => {
            console.log(JSON.stringify(err))
        }

        let env = 'sandbox';
        let currency = 'USD';
        let total = this.props.toPay;

        const client = {
            sandbox:'AeS9OyfVTMdycUYyRTXV8JlX95Ja0fYwOkyPHiTFOOo8udi_e8OaOCIn2rYu3DhMg9JYC2IHz-smzECD',
            production: ''
        }



        return (
            <div>
                <PaypalExpressBtn
                    env={env}
                    client={client}
                    currency={currency}
                    total={total}
                    onError={onError}
                    onSuccess={onSuccess}
                    onCancel={onCancel}
                    style={{
                        size:'large',
                        color:'blue',
                        shape:'rect',
                        label: 'checkout'
                    }}
                />
            </div>
        );
    }
}

export default Paypal;

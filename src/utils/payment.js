const axios = require('axios');
module.exports = {
    generateAccessToken: async () => {
        try {
            const authString  = `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`;
            const auth = 'Basic ' + Buffer.from(authString).toString('base64');
            const response = await axios.post(
                `https://api-m.sandbox.paypal.com/v1/oauth2/token`,
                "grant_type=client_credentials",
                {
                    headers: {
                        Authorization: `${auth}`,
                    },
                }
            );
            return response.data.access_token;
        } catch (error) {
            console.log(`generateAccessToken : ${error}`);
        }
    },
    createOrder: async (accessToken, body,orderCode) => {
        try {
            const url = `${process.env.PAYPAL_URL_API}/v2/checkout/orders`;
            const response = await axios.post(
                url,
                body,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                        "PayPal-Request-Id": `${orderCode}`
                    },
                }

            );
            return response.data;
        } catch (error) {
            console.log(`createOrder : ${error}`);
        }
    },
    captureOrder:async(orderId,accessToken)=>{
            const response = await axios.post(
                `https://api.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data;
    }
}
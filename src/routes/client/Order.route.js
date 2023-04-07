const express = require("express");
const orderController = require('../../controllers/client/Order.controller');
const productController = require('../../controllers/client/Product.controller');
const detailOrderController = require('../../controllers/client/DetailOrder.controller');
const { checkValidityOfInputData, isEmpty } = require("../../utils/checkValidity");
var router = express.Router();
// 
const createOrderCode = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
};

const checkCodeIsUnique = async () => {
    let codeOrder;
    do {
        codeOrder = createOrderCode(8);
        //Check code đã tồn tại hay chưa
        var orderFind = await orderController.getOrderByCode(codeOrder);
        check = orderFind === null ? false : true;
        if (check) { } else {
            break;
        }
    } while (true)
    return codeOrder;
};

const checkCodeDetailIsUnique = async () => {
    let code;
    do {
        code = createOrderCode(12);
        //Check code đã tồn tại hay chưa
        var orderFind = await detailOrderController.getDetailOrderByCode(code);
        check = orderFind === null ? false : true;
        if (check) { } else {
            break;
        }
    } while (true)
    return code;
};

const sumPriceOfOrder = async (orders) => {
    let total = 0;
    for (const order of orders) {
        let product = await productController.getPriceOfProductByColorIDAndProductId({ productId: order.id, colorId: order.Colors[0].id });
        let price = 0;
        // Check Product has Discount
        if (Object.keys(product.Discount).length) {
            let lengthDiscount = parseInt(product.Discount.discount.toString().trim().length);
            if (product.Discount.discount.toString().trim().substr(lengthDiscount - 1, 1) === "%") {
                price = parseFloat(product.Colors[0].price - product.Colors[0].price * parseFloat(product.Discount.discount.toString().trim().replace("%", "")) / 100).toFixed(0);
            } else {
                price = parseFloat(product.Colors[0].price - parseFloat(product.Discount.discount)).toFixed(0);
            }
        } else {
            price = parseFloat(product.Colors[0].price)
        }
        total = parseFloat(price) * parseInt(order.qty) + total;
    }
    return parseFloat(total);
};

const calPrice = (product) => {
    let price = 0;
    if (Object.keys(product.Discount).length) {
        let lengthDiscount = parseInt(product.Discount.discount.toString().trim().length);
        if (product.Discount.discount.toString().trim().substr(lengthDiscount - 1, 1) === "%") {
            price = parseFloat(product.Colors[0].price - product.Colors[0].price * parseFloat(product.Discount.discount.toString().trim().replace("%", "")) / 100).toFixed(0);
        } else {
            price = parseFloat(product.Colors[0].price - parseFloat(product.Discount.discount)).toFixed(0);
        }
    } else {
        price = parseFloat(product.Colors[0].price)
    }
    return price;
};

router.get(`/`, async (req, res, next) => {
    try {
        let { code,userId } = req.query;
        if (isEmpty("code", req.query) && isEmpty("userId", req.query)) { throw Error("Request Query is invalid"); }
        let result = await orderController.getOrderByCodeAndUserId({code,userId});
        res.status(200).json({
            Data: result,
            ErrorCode: 0,
            Message: "Success",
        });
    } catch (error) {
        next(error);
    }

});

router.get(`/search/:email`, async (req, res, next) => {
    try {
        let { email } = req.params;
        if (isEmpty("email", req.params)) { throw Error("Request Params is invalid"); }
        let result = await orderController.getAllOrderByEmail({ email });
        res.status(200).json({
            Data: result,
            ErrorCode: 0,
            Message: "Success",
        });
    } catch (error) {
        next(error);
    }

});

router.get("/search", async (req, res, next) => {
    try {
        let { email, code } = req.query;
        if (isEmpty("email", req.query) && isEmpty("code", req.query)) { throw Error("Request Query is invalid"); }
        let result = await orderController.getOrderByCodeAndEmail({ email, code });
        res.status(200).json({
            Data: result,
            ErrorCode: 0,
            Message: "Success",
        });
    } catch (error) {
        next(error);
    }
});

router.post("/", async (req, res, next) => {
    try {
        let { fullname, address, phoneNumber, city, county, orders, userId, method } = req.body;
        if (!checkValidityOfInputData(["fullname", "address", "city", "phoneNumber", "county", "orders", "userId", "method"], req.body)) { throw Error("Request Body is invalid"); }

        let orderCodeProcess = checkCodeIsUnique();
        let totalPriceProcess = sumPriceOfOrder(orders);

        let orderCode = await orderCodeProcess;
        let totalPrice = await totalPriceProcess;

        const result = await orderController.createOrder({
            code: orderCode,
            total: totalPrice,
            status: "Chờ xác thực",
            fullname: fullname,
            address: `${address}, ${county}, ${city}`,
            phoneNumber: phoneNumber,
            method: method,
            userId: userId
        });

        for (const order of orders) {
            let productProcess = productController.getPriceOfProductByColorIDAndProductId({ productId: order.id, colorId: order.Colors[0].id });
            let detailCodeProcess = checkCodeDetailIsUnique();
            let product = await productProcess;
            let detailCode = await detailCodeProcess;
            let price = calPrice(product);
            detailOrderController.createDetailOrder({
                price: price,
                colorId: order?.Colors[0].id,
                size: order?.size,
                quanlity: order?.qty,
                status: "Chờ xác thực",
                orderId: result?.id,
                code: detailCode,
                productId: product?.id
            });
        };

        res.status(200).json({
            Data: result,
            ErrorCode: 0,
            Message: "Success",
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.put("/confirm", async (req, res, next) => {
    try {

    } catch (error) {
        next(error);
    }
    let { code } = req.body;
    let order = await orderController.getOrderByCode(code);
    if (order) {
        orderController.updateOrderByCode({
            code: code,
            status: "Xác nhận",
        })
        if (order.status === "Chờ xác thực") {
            for (const detailOrder of order.DetailOrders) {
                let data = await productController.getandUpdateProductById(detailOrder.productId, detailOrder.quanlity);
                if (data.stock < 0) {
                    detailOrderController.upadteStatusDetailOrder({ code: detailOrder.code, status: "Tạm dừng" })
                } else {
                    detailOrderController.upadteStatusDetailOrder({ code: detailOrder.code, status: "Sẵn sàng" })
                }
            }
        }
    }
    res.status(200).json({
        Data: null,
        ErrorCode: 0,
        Message: "Success",
    });
});

module.exports = router;
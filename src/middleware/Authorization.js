const isAdministrator = (req, res, next) => {
    let account = req.Authentication;
    if (account.position === "Administrator") {
        next();
    } else {
        return res.status(403).send({
            Data: null,
            ErrorCode: 8,
            Message: 'Require Admin Role'
        });
    }
};

const isManager = (req, res, next) => {
    let account = req.Authentication;
    if (account.position === "Manager" || account.position === "Administrator") {
        next();
    } else {
        return res.status(403).send({
            Data: null,
            ErrorCode: 9,
            Message: 'Require Manager or Admin Role'
        });
    }
};

const isCustomer = (req, res, next) => {
    let account = req.Authentication;
    if (account.position === "Customer" || account.position === "Manager" || account.position === "Administrator") {
        next();
    } else {
        return res.status(403).send({
            Data: null,
            ErrorCode: 10,
            Message: 'Require Customer or Manager or Admin Role'
        });
    }
};

const isCreate = (req, res, next) => {
    let account = req.Authentication;
    if (account.role.create) {
        next();
    } else {
        return res.status(403).send({
            Data: null,
            ErrorCode: 5,
            Message: 'Access Denied'
        });
    }
};
const isUpdate = (req, res, next) => {
    let account = req.Authentication;
    if (account.role.update) {
        next();
    } else {
        return res.status(403).send({
            Data: null,
            ErrorCode: 5,
            Message: 'Access Denied'
        });
    }
};
const isDelete = (req, res, next) => {
    let account = req.Authentication;
    if (account.role.delete) {
        next();
    } else {
        return res.status(403).send({
            Data: null,
            ErrorCode: 5,
            Message: 'Access Denied'
        });
    }
};
const isAddDiscount = (req, res, next) => {
    let account = req.Authentication;
    if (account.role.addDiscount) {
        next();
    } else {
        return res.status(403).send({
            Data: null,
            ErrorCode: 5,
            Message: 'Access Denied'
        });
    }
};
module.exports = {
    isAdministrator,
    isManager,
    isCustomer,
    isCreate,
    isUpdate,
    isDelete,
    isAddDiscount
};
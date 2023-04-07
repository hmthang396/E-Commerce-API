const db = require('../../models/index');
module.exports = {
    createComment: async (para) => {
        let result = await db.Comment.create(para)
        return result;
    },
    getAllCommentByProductId: async (para) => {
        para.page = (para.page <= 0) ? 1 : para.page;
        para.limit = (para.limit <= 0) ? 12 : para.limit;
        let offset = 0 + (para.page - 1) * para.limit;
        let comments = await db.Comment.findAll({
            where: {
                productId: para.productId
            },
            include: [{
                model: db.User,
                attributes: ['fullname', 'pic', 'createdAt']
            }, {
                model: db.Like,
            }],
            offset: parseInt(offset),
            limit: parseInt(para.limit),
        })
        let result = comments.map((comment) => {
            return {
                ...comment.dataValues,
                Likes: comment?.dataValues?.Likes.filter((e) => e.userId == para.userId),
                total: {
                    like: comment.Likes.filter((e) => e.like === true).length,
                    dislike: comment.Likes.filter((e) => e.dislike === true).length,
                }
            }
        });
        return result;
    },
};
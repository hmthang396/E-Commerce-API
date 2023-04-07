const db = require('../../models/index');
module.exports = {
    createLike: async (para) => {
        let checkLike = await db.Like.findOne({
            where: {
                userId: para.userId,
                commentId: para.commentId,
            }
        });
        if (checkLike) {
            db.Like.update({
                like: para.like,
                dislike: para.dislike,
            }, {
                where: { id: checkLike.id }
            })
        } else {
            db.Like.create({
                like: para.like,
                dislike: para.dislike,
                userId: para.userId,
                commentId: para.commentId,
            })
        }
        return 1;
    },
};
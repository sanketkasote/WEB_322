var mongoose = require('mongoose');
var Comment;

var commentSchema = mongoose.Schema({
    subject: String,
    commentText: String,
    authorName: String,
    authorEmail: String,
    postedDate: Date,
    replies: [
        {
            comment_id: String,
            authorName: String,
            authorEmail: String,
            commentText: String,
            repliedDate: Date
        }
    ]
});

class CommentManager {
    static initialize(dbUrl) {
        var db = mongoose.createConnection(dbUrl);
        return new Promise((resolve, reject) => {
            db.on('error', (err) => {
                reject(err);
            });
            db.once('open', () => {
                Comment = db.model("comments", commentSchema);
                resolve();
            });
        });
    }
    static addComment(data) {
        data.postedDate = Date.now();
        console.log("comment: "+JSON.stringify(data));
        let newComment = new Comment(data);
        return new Promise((resolve, reject) => {
            newComment.save((err) => {
                if(err) {
                    reject(err);
                }
                else {
                    resolve(newComment);
                }
            });
        });
    }
    static getAllComments() {
        return Comment.find({}, null, { sort: { postedDate: -1 } }).exec();
    }
    static addReply(data) {
        data.repliedDate = Date.now();
        return Comment.update({ _id: data.comment_id }, { $addToSet: { replies: data } }).exec();
    }
}

module.exports = CommentManager;

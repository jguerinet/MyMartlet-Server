//Has all the role strings that can be set in the Auth field of a user

//Lowest authorization. Cant view or edit content
exports.pending = "pending";

//Can edit content
exports.editor = "editor";

//Can view content
exports.viewer = "viewer";

//Can edit content, view content and also edit user authorizations
exports.admin = "admin";
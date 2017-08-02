'use strict';
Parse.Cloud.define('users', function(req, res) {
    new Parse.Query('user').find({
        success: function (results) {
            res.success(results);
        },
        error: function () {
            res.error('error: failed to load users');
        }
    });
});
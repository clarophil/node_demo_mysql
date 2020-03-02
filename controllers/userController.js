let User = require('../models/userModel');
let connection = require('../db');
let userList = [];

// List of users
exports.userList = function (request, response) {    
    connection.query("Select * from user", function (error, resultSQL) {
        if (error)  {
            response.status(400).send(error);        
        }
        else {
            response.status(200);
            userList =  resultSQL;
            console.log( userList);
            response.render('userList.ejs', {users:userList});
        }
    });
}

// Add or update one user in the list
exports.userNew =  function(request, response) {
    let iduser = request.body.iduser
    let lastname =  request.body.lastname;
    let firstname = request.body.firstname;
    if ( iduser == -1)
    {
        let user = new User(lastname,firstname);
        console.log(user);
        connection.query("INSERT INTO user set ?", user, function (error, resultSQL) {
            if(error) {
                response.status(400).send(error);
            }
            else{
                response.status(201).redirect('/user');
            }
        });
    }
    else if( iduser >=0 )
    {
        let user = new User(lastname,firstname);
        console.log(user);
        connection.query("UPDATE user SET ? WHERE iduser = ?", [user, request.body.iduser], function (error, resultSQL) {
            if(error) {
            response.status(400).send(error);
            }
            else{
                response.status(202).redirect('/user');
            }
        });
    }
    console.log(userList);
}

// Send form to update user
exports.userFormAdd = function(request, response) {
    response.render('userAdd.ejs', {iduser:'-1', lastname:"", firstname:""});
}

// Send user form update
exports.userFormUpdate =function (request, response) {
    let iduser = request.params.iduser;
    connection.query("Select * from user WHERE iduser = ?", iduser ,function (error, resultSQL) {
        if (error)  {
            response.status(400).send(error);
        }
        else {
            response.status(200);
            users = resultSQL;
            response.render('userAdd.ejs', {iduser:iduser, lastname:users[0].lastname, firstname:users[0].firstname});
        }
    });
}

exports.userRemove = function (request, response) {
    let sql = "DELETE FROM `user` WHERE `user`.`iduser` = ?";
    connection.query( sql , [request.params.iduser], (error, resultSQL) => {
        if(error) {
            response.status(400).send(error);
        }
        else{
            response.redirect('/user');
        }
    }); 
    
 };
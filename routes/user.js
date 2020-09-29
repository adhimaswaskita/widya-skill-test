const express = require('express');
const router_user = express.Router();
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const users = require('../schema/user');

router_user.post('/register', (req, res, next)=>{
    const {name, email, password, konfirmasi, gender} = req.body;

    if (password == konfirmasi) {
        bcrypt.hash(password, 10, (err, hash)=>{
            try {
                if(err) {
                    throw err;
                }
                else {
                    users.create({
                        name,
                        email,
                        password: hash,
                        gender
                    }).then(() => {
                        res.status(200).json({
                            status : 200,
                            message : `Berhasil register`,
                        })
                    })
                }
            } catch (error) {
                throw (error)
            }
        })
    } else {
        res.status(400).json({
            code : 400,
            message : "Konfirmasi password salah"
        })
    }
})

router_user.post('/login', (req, res,next)=>{
    const {email} = req.body;

    users.findOne({email})
    .then((data)=>{
        console.log(data)
        const {password} = req.body;
        
        if(!data) {
            res.status(401).send({
                code : 401,
                message : "email atau password salah"
            })
        }

        else {
            const userPassword = data.password;
            
            bcrypt.compare(password, userPassword, (errorCompare, hasil)=>{

                if (errorCompare) {
                    throw (errorCompare);
                }

                if (hasil){
                        try{
                        const user_login = data.name;

                        var token = JWT.sign({data}, 's3cr3tphr4s3', {
                            expiresIn: '10h'
                        })

                        res.status(200).json({
                            code : 200,
                            message : `Berhasil login ke ${user_login}`,
                            auth: true,
                            token : token,
                            data : data
                        })

                        } catch(errorCatch){
                            next(errorCatch)
                        }
                }
                else if (hasil == false){
                    res.status(401).json({
                        code : 401,
                        message : "Unauthorized"
                    })
                }
            })
        }
    })
})

router_user.get('/jwtverif', (req,res,next)=>{
    try {
        var token = req.headers['x-acces-token'];

        if(!token) {
            res.status(401).json({
                code : 401,
                message : 'No token provided'
            })
        }
        else {
            JWT.verify(token, 's3cr3tphr4s3',(err, decoded)=>{
                if(err){
                    res.status(500).json({
                        code : 500,
                        message : 'Failed to authenticate token'
                    })
                }
                else {
                    res.status(200).json({
                        code : 200,
                        message : 'Succes authenticate token',
                        data : decoded
                    })
                }
            })
        }
    } catch (error) {
        next(error)
    }
})

router_user.get('/logout', (req,res,next)=>{
    req.logout();
    try {
        if (req.isAuthenticated == false) {
            res.status(200).json({
                code : 200,
                message : "Berhasil keluar",
                auth: true,
                token : null
            })
        }
    } catch (error) {
        next(error)
    }
})

module.exports = router_user;
import { Router } from "express";
import UserController from "../controller/user";
import auth from "../middleware/auth"
import authLogout from "../middleware/authLogout"
import {Request,Response} from 'express'
import upload from "../db/utils/s3";
const express = require('express');

const userController = new UserController();
const router = Router();


router.get("/user",userController.getUser)
router.post("/login",userController.login)
router.post("/signup", userController.createUser);
router.post("/verfyotp", userController.verifyOtp);
router.post("/get-token", userController.getToken);
router.post("/logout",authLogout,userController.logout)
router.post("/logoutAll",authLogout,userController.logoutAll)
router.post("/edit-user",userController.editUserProfile)
router.post("/getall-doctors",userController.getDocorList)
router.post("/add-appointment",userController.confirmOfflineAppointment)
router.post("/create-checkout-session",userController.paymentConfirm)
router.post("/webhook", express.raw({type: 'application/json'}),userController.webhookControl)
router.get("/get-alldepartments",userController.getAllDepartment)






export default router;
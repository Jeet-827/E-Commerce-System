import { Signin, adminupdate, AdminLogout } from "../controller/admin.controller.js";
import { Protected } from "../controller/admintoken.controller.js";
import express from "express";

const AdminRoutes = express.Router();

AdminRoutes.post("/adminsignin", Signin);
AdminRoutes.get("/protected", Protected);
AdminRoutes.post("/protected", Protected);
AdminRoutes.post("/updatepass", adminupdate);
AdminRoutes.post("/adminlogout", AdminLogout);
AdminRoutes.get("/adminlogout", AdminLogout);

export default AdminRoutes;

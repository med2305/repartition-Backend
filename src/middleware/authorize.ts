import { Request, NextFunction, Response } from "express";

module.exports = function authorize(roles: []) {
  return function (req: Request, res: Response, next: NextFunction) {
    let verifyRole: boolean = false;
    roles.forEach((role) => {
      if (role === res.locals.decoded.role) {
        verifyRole = true;
      }
    });
    if (!verifyRole) return res.status(401).json({ message: "unauthorized" });
    next();
  };
};
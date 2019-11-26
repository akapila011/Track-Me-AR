import {makeSaveUser, makeVerifyUser} from "./userController";
import {userService} from "../usecases"

const saveUserController = makeSaveUser({ userService });
const verifyUserController = makeVerifyUser({ userService });

export const userController = Object.freeze({
    saveUserController,
    verifyUserController
});
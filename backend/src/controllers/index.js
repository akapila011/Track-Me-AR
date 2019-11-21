import {makeSaveUser} from "./userController";
import {userService} from "../usecases"

const saveUserController = makeSaveUser({ userService });

export const userController = Object.freeze({
    saveUserController
});
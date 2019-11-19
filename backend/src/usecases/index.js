import {makeSaveUser} from "./save-user";


const saveUser = makeSaveUser({usersDb});

export const userService = Object.freeze({
  saveUser: saveUser,
});
import {buildCreateUser} from "./User";
import {idValidator, nameValidator, emailValidator, dateValidator} from "../../util/validators";


const createUser = buildCreateUser({ idValidator, nameValidator, emailValidator, dateValidator});

export default createUser;
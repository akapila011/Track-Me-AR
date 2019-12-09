import {dateValidator} from "../../util/validators";
import createUser from "../User/index";
import {buildCreateTempUser} from "./TempUser";

const createTempUser = buildCreateTempUser({ makeUser: createUser , dateValidator});

export default createTempUser;
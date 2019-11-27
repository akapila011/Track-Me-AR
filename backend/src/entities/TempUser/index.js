import {dateValidator} from "../../util/validators";
import {buildCreateTempUser} from "TempUser";
import createUser from "../User";

const createTempUser = buildCreateTempUser({ createUser , dateValidator});

export default createTempUser;
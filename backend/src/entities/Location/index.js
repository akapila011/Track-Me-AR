import {buildCreateLocation} from "./Location";
import {idValidator} from "../../util/validators";

const createLocation = buildCreateLocation({trackingIdValidator: idValidator});

export default createLocation;
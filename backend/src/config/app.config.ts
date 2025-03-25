import { getEnv } from "../utils/get-env"

const appConfig = () => {
    NODE_ENV : getEnv("NODE_ENV", "development");
}
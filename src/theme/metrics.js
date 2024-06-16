import { Dimensions } from "react-native";

const {width, height} = Dimensions.get("window");
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

let horizontalScale = (size) => {
    return (width / guidelineBaseWidth) * size
};

let verticalScale = (size) => {
    return (height / guidelineBaseHeight) * size
};

export { horizontalScale, verticalScale }
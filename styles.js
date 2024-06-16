import {StyleSheet} from "react-native";
import {horizontalScale, verticalScale} from "./src/theme/metrics";
import colors from "./src/theme/colors";

const styles = StyleSheet.create({
    activityIndicator:{
        backgroundColor: colors.backgroundTertiary,
        position: "absolute",
        paddingHorizontal: horizontalScale(10),
        paddingVertical: verticalScale(10),
        borderRadius: 15,
        top: "45%",
        left: "43%"
    }
});

export default styles;
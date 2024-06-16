import {StyleSheet} from "react-native";
import {horizontalScale, verticalScale} from "../../theme/metrics";
import colors from "../../theme/colors";

const styles = StyleSheet.create({
    button: {
        alignItems: "center",
        backgroundColor: colors.backgroundTertiary,
        paddingVertical: verticalScale(10),
        paddingHorizontal: horizontalScale(10),
        borderRadius: 10
    }
});

export default styles;
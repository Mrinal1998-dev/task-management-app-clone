import {StyleSheet} from "react-native";
import {horizontalScale, verticalScale} from "../../theme/metrics";
import colors from "../../theme/colors";

const styles = StyleSheet.create({
    searchHeader:{
        width: "100%",
        height: verticalScale(35),
        paddingLeft: horizontalScale(10),
        borderRadius: 15,
        backgroundColor: colors.backgroundSecondary,
        color: colors.textPrimary,
    }
});

export default styles;
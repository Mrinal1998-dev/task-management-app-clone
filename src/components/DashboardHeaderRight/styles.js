import {StyleSheet} from "react-native";
import {horizontalScale, verticalScale} from "../../theme/metrics";
import colors from "../../theme/colors";

const styles = StyleSheet.create({
    cancelIcon:{
        width: horizontalScale(25),
        height: verticalScale(25),
        tintColor: colors.textPrimary,
        objectFit: "contain"
    },
    searchIcon:{
        width: horizontalScale(25),
        height: verticalScale(25),
        tintColor: colors.textPrimary,
        objectFit: "contain"
    }
});

export default styles;
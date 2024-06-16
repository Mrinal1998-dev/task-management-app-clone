import {StyleSheet} from "react-native";
import {horizontalScale, verticalScale} from "../../theme/metrics";
import colors from "../../theme/colors";

const styles = StyleSheet.create({
    goBackBtnImage:{
        width: horizontalScale(21),
        height: verticalScale(21),
        objectFit: "contain"
    },
});

export default styles;
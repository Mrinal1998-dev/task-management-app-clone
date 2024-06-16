import {StyleSheet} from "react-native";
import {horizontalScale, verticalScale} from "../../theme/metrics";
import colors from "../../theme/colors";

const styles = StyleSheet.create({
    headerTitleText:{
        color: colors.textPrimary,
        letterSpacing: 3,
        fontWeight: 'bold',
        fontSize: 18
    }
});

export default styles;
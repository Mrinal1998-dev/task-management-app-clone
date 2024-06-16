import {StyleSheet} from "react-native";
import {horizontalScale, verticalScale} from "../../../theme/metrics";
import colors from "../../../theme/colors";

const styles = StyleSheet.create({
    headerContainer:{
        marginLeft: horizontalScale(40),
        marginTop: verticalScale(20),
        marginBottom: verticalScale(20)
    },
    headerText:{
        fontWeight: 'bold',
        color: colors.textPrimary,
        fontSize: 24
    },
    flatList:{
        marginLeft: horizontalScale(40),
        paddingRight: horizontalScale(14),
    }
});

export default styles;
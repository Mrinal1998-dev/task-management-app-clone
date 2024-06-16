import {StyleSheet} from "react-native";
import {horizontalScale, verticalScale} from "../../theme/metrics";
import colors from "../../theme/colors";

const styles = StyleSheet.create({
    itemContainer:{
        flex:1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:'center',
        marginTop: verticalScale(5),
        paddingRight: horizontalScale(14)
    },
    settingText:{
        fontSize: 16,
        color: colors.textPrimary,
        width: "75%"
    },
    settingSwitch:{
        paddingHorizontal:horizontalScale(10),
        justifyContent: 'center',
        alignItems: 'center',
    },
    switchImage:{
        width: horizontalScale(50),
        height: verticalScale(50),
        objectFit: "contain"
    }
});

export default styles;
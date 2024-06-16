import {StyleSheet} from "react-native";
import {horizontalScale, verticalScale} from "../../theme/metrics";
import colors from "../../theme/colors";

const styles = StyleSheet.create({
    tabBar:{
        backgroundColor: colors.backgroundPrimary,
        width: '100%',
        position: 'relative',
        borderTopWidth: 0,
    },
    tabBarBtn:{
        width: "20%",
        alignItems: 'center',
        justifyContent: "center",
    },
    newTaskTabBarBtn:{
        paddingHorizontal: 35,
        paddingVertical: 35,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.backgroundTertiary,
        borderRadius: 100,
        bottom: verticalScale(25),
        elevation: 10,
        shadowColor: colors.backgroundTertiary,
        shadowOpacity: 0.4,
        shadowOffset:{
            width:0,
            height:5
        }
    }
});

export default styles;
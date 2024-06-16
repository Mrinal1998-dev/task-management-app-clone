import {StyleSheet} from "react-native";
import {horizontalScale, verticalScale} from "../../theme/metrics";
import colors from "../../theme/colors";

const styles = StyleSheet.create({
   drawerUserInfo:{
       flexDirection:'row',
       borderBottomWidth: 0.5,
       borderColor: colors.backgroundTertiary,
       paddingLeft: horizontalScale(20),
       paddingTop: verticalScale(12),
       paddingBottom: verticalScale(20),
       alignItems: "center",
   },
    drawerUserAvatar:{
        width: horizontalScale(60),
        height: verticalScale(60),
        tintColor: colors.textPrimary,
        objectFit: "contain"
    },
    loggedInFirstName:{
        color: colors.textPrimary,
        fontSize: 26,
        fontWeight: 'bold',
        marginLeft: horizontalScale(5)
    },
    drawerItemLabelStyle:{
        marginLeft: horizontalScale(10)
    },
    bottomContainer:{
        paddingLeft: horizontalScale(25),
        paddingBottom: verticalScale(20)
    },
    bottomText:{
        color: '#cbd1dc',
        fontSize: 14
    }
});

export default styles;
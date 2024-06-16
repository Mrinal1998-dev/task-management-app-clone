import {StyleSheet} from "react-native";
import {horizontalScale, verticalScale} from "../../../theme/metrics";
import colors from "../../../theme/colors";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundPrimary,
        alignItems: 'center',
    },
    loginHeader:{
        color: colors.textPrimary,
        fontSize: 18,
        marginTop: verticalScale(20),
        fontWeight: 'bold',
        letterSpacing: 3
    },
    label:{
        color: colors.textPrimary,
        marginBottom: verticalScale(5)
    },
    input:{
        height: verticalScale(40),
        marginBottom: verticalScale(15),
        paddingVertical: verticalScale(10),
        paddingHorizontal: horizontalScale(10),
        borderRadius: 10,
        backgroundColor: colors.backgroundSecondary
    },
    emailInputValidationMsg:{
        color: colors.textPrimary,
        marginBottom: verticalScale(15),
        marginTop: verticalScale(-15)
    },
    passwordInputValidationMsg:{
        color: colors.textPrimary,
        marginBottom: verticalScale(30),
        marginTop: verticalScale(-30)
    },
    link:{
        alignSelf:'center',
        alignItems:'center',
        marginTop: verticalScale(20),
        paddingBottom: verticalScale(10)
    },
    linkText:{
        color: colors.textPrimary,
        textDecorationLine:'underline',
        fontWeight: '700'
    }
});

export default styles;
import {StyleSheet} from "react-native";
import {horizontalScale, verticalScale} from "../../../theme/metrics";
import colors from "../../../theme/colors";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundPrimary,
        alignItems: 'center',
    },
    registerHeader:{
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
        paddingHorizontal: horizontalScale(10),
        paddingVertical: verticalScale(10),
        borderRadius: 10,
        backgroundColor: colors.backgroundSecondary,
    },
    validationmsg:{
        color: colors.textPrimary,
        marginBottom: verticalScale(15),
        marginTop: verticalScale(-15)
    },
    termsAndConditionsText:{
        textAlign: 'center',
        width: "90%",
        color: colors.textPrimary,
        alignSelf: 'center',
        marginTop: verticalScale(25)
    },
    linkText:{
        color: colors.textPrimary,
        textDecorationLine:'underline',
        fontWeight: '600'
    },
    link1:{
        paddingHorizontal: horizontalScale(5),
        height: verticalScale(20)
    },
    link2:{
        alignSelf:'center',
        alignItems:'center',
        marginTop: verticalScale(25),
        paddingBottom: verticalScale(10)
    }
});

export default styles;
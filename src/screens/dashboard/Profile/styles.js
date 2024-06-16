import {StyleSheet} from "react-native";
import {horizontalScale, verticalScale} from "../../../theme/metrics";
import colors from "../../../theme/colors";

const styles = StyleSheet.create({
    loggedInUserContainer:{
        marginLeft: horizontalScale(40),
        marginTop: verticalScale(20),
        marginBottom: verticalScale(10),
        flexDirection:'row',
        alignItems: "center"
    },
    userAvatar:{
        width: horizontalScale(75),
        height: verticalScale(75),
        tintColor: colors.textPrimary,
        objectFit: "contain"
    },
    loggedInName:{
        fontWeight: 'bold',
        color: colors.textPrimary,
        fontSize: 24
    },
    loggedInEmail:{
        color: colors.textPrimary,
        fontSize: 14,
        marginTop: verticalScale(5)
    },
    sectionListContainer:{
        flex:1.2 ,
        backgroundColor: colors.backgroundSecondary,
    },
    sectionHeader:{
        fontSize: 16,
        color: colors.sectionHeader,
    },
    changeLangContainer:{
        marginLeft:horizontalScale(40),
        paddingRight:horizontalScale(14),
        flexDirection:'row',
        justifyContent:'space-between',
        marginTop: verticalScale(20)
    },
    changeLangText:{
        color: colors.textPrimary,
        fontSize:16,
    },
    langBtn:{
        paddingHorizontal:horizontalScale(10),
        borderRadius: 10,
        flexDirection: 'row'
    },
    radioImg:{
        width: horizontalScale(25),
        height: verticalScale(25),
        objectFit: "contain"
    },
    langText:{
        fontSize: 14,
        color: colors.textPrimary,
        textAlignVertical: 'center',
        marginLeft: horizontalScale(10)
    }
});

export default styles;
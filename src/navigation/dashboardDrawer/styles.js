import {StyleSheet} from "react-native";
import colors from "../../theme/colors";
import {verticalScale} from "../../theme/metrics";

const styles = StyleSheet.create({
    header:{
        backgroundColor: colors.backgroundPrimary,
        elevation: 20,
        shadowColor: colors.headerShadow,
        shadowOpacity: 1,
    },
    headerTitle:{
        fontWeight: 'bold',
        letterSpacing: 3,
        fontSize: 18,
        marginLeft: "auto",
        marginRight: "auto",
        textAlign: "center"
    }
});

export default styles;
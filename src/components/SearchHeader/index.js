import { TextInput } from 'react-native';
import {AuthContext, SearchContext} from '../../context';

import React, {useCallback, useContext, useEffect, useState} from 'react';
import styles from "./styles";
function SearchHeader(props) {
    
    const [text, onChangeText] = React.useState(null);
    const { setSearchText } = useContext(SearchContext);

    return <TextInput onChange={({ nativeEvent: { eventCount, target, text} }) => {
        setSearchText(text);
    }} onChangeText={onChangeText}
                      placeholder="Search..."
                      value={text}
                      style={styles.searchHeader} />
}

export default SearchHeader;
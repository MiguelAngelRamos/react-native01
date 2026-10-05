import {StyleSheet, Text, View } from 'react-native';
import {colors, fontSizes, fontWeights, radii, sizes, spacing} from '../theme';
import type { CharacterStatus } from '../types/characters';


export const StatusIndicator = ({status, variant ='inline'}: StatusIndicatorProps) => {
    return (
        <View style={[styles.container]}>
            <View style={[styles.statusDot]}>

            </View>

            <Text style={[styles.label]}>

            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs
    },
    chipContainer: {

    }, 
    statusDot: {

    }, 
    label: {

    },
    chipLabel: {

    }
})
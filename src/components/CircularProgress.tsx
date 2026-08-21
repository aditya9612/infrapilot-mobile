import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface CircularProgressProps {
    percentage: number;
    radius?: number;
    strokeWidth?: number;
    color?: string;
    unfilledColor?: string;
}

export default function CircularProgress({
    percentage,
    radius = 50,
    strokeWidth = 10,
    color = '#3b82f6',
    unfilledColor = '#e5e7eb'
}: CircularProgressProps) {
    const halfCircle = radius + strokeWidth;
    const circleCircumference = 2 * Math.PI * radius;
    const strokeDashoffset = circleCircumference - (circleCircumference * percentage) / 100;

    return (
        <View style={{ width: radius * 2, height: radius * 2, justifyContent: 'center', alignItems: 'center' }}>
            <Svg width={radius * 2} height={radius * 2} viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}>
                <Circle
                    cx="50%"
                    cy="50%"
                    r={radius}
                    stroke={unfilledColor}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
                <Circle
                    cx="50%"
                    cy="50%"
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circleCircumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    rotation="-90"
                    originX={halfCircle}
                    originY={halfCircle}
                />
            </Svg>
            <View style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ fontSize: radius * 0.4, fontWeight: 'bold', color: '#1f2937' }}>
                    {percentage}%
                </Text>
                <Text style={{ fontSize: radius * 0.15, color: '#6b7280' }}>Completed</Text>
            </View>
        </View>
    );
}

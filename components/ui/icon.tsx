
import React from "react";
import { Text } from "react-native";

interface IconProps {
  name: string;
}

export const Icon = ({ name }: IconProps) => <Text>{name}</Text>;

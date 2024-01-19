import { Box, Text, Image } from "grommet"
import { FormNext } from "grommet-icons"

export const StepHeader  = ({
    isFirst,
    messages,
    icons,
}:{
    isFirst: boolean,
    messages: string[],
    icons: string[],
}) => {
    return (
        <Box direction="row" align="center" gap="medium" justify="center">
            <Box
                background={isFirst ? "#6C94EC" : "white"}
                round="large"
                border={isFirst && { color: 'black', size: 'small' }}
                pad={{ horizontal: 'medium', vertical: 'xsmall' }}
                direction="row"
                align="center"
                gap="small"
                elevation={isFirst ? "none" : "small"}
            >
                <Image src={isFirst ? icons[0] : icons[1]} alt="preview" />
                <Text weight="bold" color={isFirst ? "white" : "brand"}>
                    {messages[0]}
                </Text>
            </Box>
            <FormNext />
            <Box
                background={!isFirst ? "#6C94EC" : "white"}
                round="large"
                border={!isFirst && { color: 'black', size: 'small' }}
                pad={{ horizontal: 'medium', vertical: 'xsmall' }}
                direction="row"
                align="center"
                gap="small"
                elevation={isFirst ? "small" : "none"}
            >
                <Image src={isFirst ? icons[2] : icons[3]} alt="preview" />
                <Text weight="bold" color={isFirst ? "#879095" : "white"}>
                    {messages[1]}
                </Text>
            </Box>
      </Box>
    )
}
import * as React from "react";
import { Box, SxProps } from "@mui/material";
import { styled } from "@mui/material/styles";

const BigImage = styled("img")(() => ({
	height: "100%",
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translateX(-50%) translateY(-50%)",
}));

const SmallImage = styled("img")(() => ({
	height: "180%",
	position: "absolute",
	left: "50%",
	transform: "translateX(-50%)",
}));

const size = {
	base: {
		height: "600px",
		width: "300px",
		clipPath: "polygon(40% 0%, 100% 0%, 60% 100%, 0% 100%);",
	},
	small: {
		height: "284px",
		width: "260px",
		clipPath: "polygon(20% 0%, 100% 0%, 80% 100%, 0% 100%);",
	},
};

interface PanelProps {
	image: string;
	sx?: SxProps;
	small?: boolean;
}

const Panel = ({ image, sx, small }: PanelProps) => {
	const sizing = small ? size.small : size.base;
	return (
		<Box
			sx={{
				position: "relative",
				height: sizing.height,
				width: sizing.width,
				clipPath: sizing.clipPath,
				...sx,
			}}
		>
			{small ? (
				<SmallImage alt="" src={image} />
			) : (
				<BigImage alt="" src={image} />
			)}
		</Box>
	);
};

export default Panel;

import { createTheme } from '@mui/material/styles';
import MontserratRegular from '../fonts/Montserrat-Regular.ttf';
import MontserratThin from '../fonts/Montserrat-Thin.ttf';
import MontserratThinItalic from '../fonts/Montserrat-ThinItalic.ttf';
import MontserratLight from '../fonts/Montserrat-Light.ttf';
import MontserratLightItalic from '../fonts/Montserrat-LightItalic.ttf';
import MontserratMedium from '../fonts/Montserrat-Medium.ttf';
import MontserratMediumItalic from '../fonts/Montserrat-MediumItalic.ttf';
import MontserratSemiBold from '../fonts/Montserrat-SemiBold.ttf';
import MontserratSemiBoldItalic from '../fonts/Montserrat-SemiBoldItalic.ttf';
import MontserratBold from '../fonts/Montserrat-Bold.ttf';
import MontserratBoldItalic from '../fonts/Montserrat-BoldItalic.ttf';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#1E90FF', // dodger blue
            light: '#c1ddee',
        },
        secondary: {
            main: '#87cefa', // light sky blue
            light: '#9370DB', // medium purple
        },
        tertiary: {
            main: '#B0C4DE', // light steel blue
            light: '#DA70D6', // orchid
        },
        accent: {
            main: '#00FFFF', // aqua
            light: '#FF7F50', // coral
        },
        successful: {
            main: '#12ce5d',
            light: '#e7faef',
        },
        failure: {
            main: '#DC143C', // crimson
            dark: '#9C0D22',
        },
        light: {
            main: '#ffffff',
        },
        dark: {
            main: '#0F4C81',
        },
    },
    typography: {
        fontFamily: 'Montserrat',
        h1: {
            fontSize: '2em',
        },
        thin: {
            fontWeight: 100,
            fontStyle: 'normal',
        },
        light: {
            fontWeight: 300,
            fontStyle: 'normal',
        },
        regular: {
            fontWeight: 400,
            fontStyle: 'normal',
        },
        medium: {
            fontWeight: 500,
            fontStyle: 'normal',
        },
        semiBold: {
            fontWeight: 600,
            fontStyle: 'normal',
        },
        bold: {
            fontWeight: 700,
            fontStyle: 'normal',
        },
        fontWeightThin: 100,
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
        fontWeightSemiBold: 600,
        fontWeightBold: 700,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    fontSize: '16px',
                    fontWeight: 600,
                    fontStyle: 'normal',
                    padding: '4px 2rem',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.06)',
                    border: '1px solid #f2f2f2',
                    transition: 'all .2s ease-in-out',
                    '&:hover': {
                        boxShadow: '0px 10px 15px #f8ecff',
                    },
                },
            },
        },
        MuiCssBaseline: {
            styleOverrides: {
                '@font-face': [
                    {
                        fontFamily: 'Montserrat',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        src: `local('Montserrat-Regular'), url(${MontserratRegular}) format('truetype')`,
                    },
                    {
                        fontFamily: 'Montserrat',
                        fontStyle: 'normal',
                        fontWeight: 100,
                        src: `local('Montserrat-Thin'), url(${MontserratThin}) format('truetype')`,
                    },
                    {
                        fontFamily: 'Montserrat',
                        fontStyle: 'italic',
                        fontWeight: 100,
                        src: `local('Montserrat-ThinItalic'), url(${MontserratThinItalic}) format('truetype')`,
                    },
                    {
                        fontFamily: 'Montserrat',
                        fontStyle: 'normal',
                        fontWeight: 300,
                        src: `local('Montserrat-Light'), url(${MontserratLight}) format('truetype')`,
                    },
                    {
                        fontFamily: 'Montserrat',
                        fontStyle: 'italic',
                        fontWeight: 300,
                        src: `local('Montserrat-LightItalic'), url(${MontserratLightItalic}) format('truetype')`,
                    },
                    {
                        fontFamily: 'Montserrat',
                        fontStyle: 'normal',
                        fontWeight: 600,
                        src: `local('Montserrat-Semi'), url(${MontserratSemiBold}) format('truetype')`,
                    },
                    {
                        fontFamily: 'Montserrat',
                        fontStyle: 'italic',
                        fontWeight: 600,
                        src: `local('Montserrat-SemiItalic'), url(${MontserratSemiBoldItalic}) format('truetype')`,
                    },
                    {
                        fontFamily: 'Montserrat',
                        fontStyle: 'normal',
                        fontWeight: 500,
                        src: `local('Montserrat-Medium'), url(${MontserratMedium}) format('truetype')`,
                    },
                    {
                        fontFamily: 'Montserrat',
                        fontStyle: 'italic',
                        fontWeight: 500,
                        src: `local('Montserrat-MediumItalic'), url(${MontserratMediumItalic}) format('truetype')`,
                    },
                    {
                        fontFamily: 'Montserrat',
                        fontStyle: 'normal',
                        fontWeight: 700,
                        src: `local('Montserrat-Bold'), url(${MontserratBold}) format('truetype')`,
                    },
                    {
                        fontFamily: 'Montserrat',
                        fontStyle: 'italic',
                        fontWeight: 700,
                        src: `local('Montserrat-BoldItalic'), url(${MontserratBoldItalic}) format('truetype')`,
                    },
                    {
                        fontFamily: 'Montserrat',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        src: `local('Montserrat-Regular'), url(${MontserratRegular}) format('truetype')`,
                    },
                ],
                fallBacks: [
                    {
                        '@font-face': {
                            fontFamily: 'Century Gothic',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            src: `url(src/fonts/CenturyGothic.ttf) format('ttf')`,
                        },
                    },
                ],
            },
        },
    },
});

declare module '@mui/material/styles' {
    interface Theme {
        status: {
            danger: React.CSSProperties['color'];
        };
    }

    interface Palette {
        tertiary: Palette['primary'];
        successful: Palette['primary'];
        failure: Palette['primary'];
        accent: Palette['primary'];
        light: Palette['primary'];
        dark: Palette['primary'];
    }

    interface PaletteOptions {
        tertiary: PaletteOptions['primary'];
        successful: PaletteOptions['primary'];
        failure: PaletteOptions['primary'];
        accent: PaletteOptions['primary'];
        light: PaletteOptions['primary'];
        dark: PaletteOptions['primary'];
    }

    interface TypographyVariants {
        h1bold: React.CSSProperties;
        thin: React.CSSProperties;
        light: React.CSSProperties;
        regular: React.CSSProperties;
        medium: React.CSSProperties;
        semiBold: React.CSSProperties;
        bold: React.CSSProperties;
        fontWeightRegular: number;
        fontWeightThin: number;
        fontWeightLight: number;
        fontWeightMedium: number;
        fontWeightSemiBold: number;
        fontWeightBold: number;
    }
    interface TypographyVariantsOptions {
        h1bold?: React.CSSProperties;
        thin?: React.CSSProperties;
        light?: React.CSSProperties;
        regular?: React.CSSProperties;
        medium?: React.CSSProperties;
        semiBold?: React.CSSProperties;
        bold?: React.CSSProperties;
        fontWeightRegular: number;
        fontWeightThin: number;
        fontWeightLight: number;
        fontWeightMedium: number;
        fontWeightSemiBold: number;
        fontWeightBold: number;
    }
}

declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
        h1bold: true;
        thin: true;
        light: true;
        regular: true;
        medium: true;
        semiBold: true;
        bold: true;
        fontWeightRegular: true;
        fontWeightThin: true;
        fontWeightLight: true;
        fontWeightMedium: true;
        fontWeightSemiBold: true;
        fontWeightBold: true;
    }
}

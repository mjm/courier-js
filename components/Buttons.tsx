import { Interpolation, ObjectInterpolation } from "@emotion/core"
import React from "react"

type Color = "primary" | "neutral" | "disabled"
type ButtonConfig<T> = T & { hover: T }

interface PrimaryConfig {
  background: string
  text: string
}

interface SecondaryConfig {
  border: string
  text: string
}

interface TertiaryConfig {
  text: string
}

interface ColorConfig {
  primary?: ButtonConfig<PrimaryConfig>
  secondary?: ButtonConfig<SecondaryConfig>
  tertiary?: ButtonConfig<TertiaryConfig>
}

const colors: Record<Color, ColorConfig> = {
  primary: {
    primary: {
      background: "primary6",
      text: "primary1",
      hover: {
        background: "primary7",
        text: "white",
      },
    },
  },
  neutral: {
    primary: {
      background: "neutral6",
      text: "neutral1",
      hover: {
        background: "neutral7",
        text: "white",
      },
    },
    secondary: {
      border: "neutral4",
      text: "neutral8",
      hover: {
        border: "neutral5",
        text: "neutral9",
      },
    },
    tertiary: {
      text: "neutral7",
      hover: {
        text: "neutral9",
      },
    },
  },
  disabled: {
    primary: {
      background: "neutral3",
      text: "neutral6",
      hover: {
        background: "neutral3",
        text: "neutral6",
      },
    },
  },
}

type Variant = keyof ColorConfig

function baseButtonStyle(theme: any): Interpolation {
  return {
    fontSize: theme.fontSizes[1],
    fontWeight: theme.fontWeights.bold,
    padding: `${theme.space[1]} 0.75rem`,
  }
}

function variantStyle(theme: any, variant: Variant): Interpolation {
  if (variant === "tertiary") {
    return {
      backgroundColor: "transparent",
      border: 0,
    }
  } else {
    return {
      borderRadius: 4,
      borderWidth: 2,
      borderStyle: "solid",
      "&:hover": {
        boxShadow: theme.shadow.sm,
      },
    }
  }
}

function primaryCss(
  theme: any,
  config: PrimaryConfig
): ObjectInterpolation<undefined> {
  const color = theme.colors[config.text]
  const backgroundColor = theme.colors[config.background]

  return { color, backgroundColor, borderColor: backgroundColor }
}

function secondaryCss(
  theme: any,
  config: SecondaryConfig
): ObjectInterpolation<undefined> {
  const color = theme.colors[config.text]
  const borderColor = theme.colors[config.border]

  return { color, borderColor }
}

function tertiaryCss(
  theme: any,
  config: TertiaryConfig
): ObjectInterpolation<undefined> {
  const color = theme.colors[config.text]
  return { color }
}

function buttonStyle(
  theme: any,
  color: Color,
  variant: Variant
): Interpolation {
  const variantConfig = colors[color][variant]
  if (!variantConfig) {
    throw new TypeError(
      `No button configuration for color '${color}' and variant '${variant}'`
    )
  }

  if (variant === "primary") {
    const primaryConfig = variantConfig as ButtonConfig<PrimaryConfig>
    return {
      ...primaryCss(theme, primaryConfig),
      "&:hover": primaryCss(theme, primaryConfig.hover),
    }
  } else if (variant === "secondary") {
    const secondaryConfig = variantConfig as ButtonConfig<SecondaryConfig>
    return {
      backgroundColor: "transparent",
      ...secondaryCss(theme, secondaryConfig),
      "&:hover": secondaryCss(theme, secondaryConfig.hover),
    }
  } else if (variant === "tertiary") {
    const tertiaryConfig = variantConfig as ButtonConfig<TertiaryConfig>
    return {
      ...tertiaryCss(theme, tertiaryConfig),
      "&:hover": tertiaryCss(theme, tertiaryConfig.hover),
    }
  }
}

type ButtonElementProps = React.ButtonHTMLAttributes<HTMLButtonElement>

type OnClickAsync = (
  event: React.MouseEvent<HTMLButtonElement>
) => Promise<void>

type Props = ButtonElementProps & {
  color: Color
  variant?: Variant
  onClickAsync?: OnClickAsync
}

export const Button: React.FC<Props> = ({
  color,
  variant = "primary",
  disabled,
  onClick,
  onClickAsync,
  ...props
}) => {
  const [asyncSpin, setAsyncSpin] = React.useState(false)
  // const useOnClickAsync = !!onClickAsync
  if (onClickAsync) {
    onClick = async e => {
      setAsyncSpin(true)
      try {
        await onClickAsync(e)
      } finally {
        setAsyncSpin(false)
      }
    }
  }

  const isDisabled = disabled || asyncSpin

  return (
    <button
      css={theme => [
        baseButtonStyle(theme),
        variantStyle(theme, variant),
        buttonStyle(theme, isDisabled ? "disabled" : color, variant),
      ]}
      type="button"
      disabled={isDisabled}
      onClick={onClick}
      {...props}
    />
  )
}

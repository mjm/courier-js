import { Text, Flex } from "@rebass/emotion"

type Props = React.PropsWithoutRef<JSX.IntrinsicElements["div"]> & {
  label: string
}

const InfoField: React.FC<Props> = ({ label, children, ...props }) => (
  <Text lineHeight="relaxed">
    <Flex {...props}>
      <Text
        width={[120, 180]}
        color="primary.800"
        fontWeight={500}
        css={{ flexShrink: 0 }}
      >
        {label}
      </Text>
      <Text color="gray.900">{children}</Text>
    </Flex>
  </Text>
)

export default InfoField

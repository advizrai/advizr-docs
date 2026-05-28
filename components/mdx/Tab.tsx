interface TabProps {
  label: string
  children: React.ReactNode
}

export function Tab({ children }: TabProps) {
  return <>{children}</>
}

Tab.displayName = 'Tab'
